import React, { memo, useEffect, createRef } from 'react';
import {
  Grid,
  TextField,
  InputLabel,
  Select,
  FormControl,
  MenuItem,
  makeStyles
} from '@material-ui/core';
import _ from 'lodash';

import dayjs from 'dayjs';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { extend } from 'wangeditor-for-react';
import i18next from 'i18next';

import { CommonDialog, HAKeyboardDatePicker, Loading, CommonTip } from '../../../../components';
import FormControlInputProps from '../../../../models/webdp/PropsModels/FormControlInputProps';
import messageAPI from '../../../../api/message';
import { handleValidation } from '../../../../utils/tools';
import fileAPI from '../../../../api/file/file';
import envUrl from '../../../../utils/baseUrl';
import { getDayNumber } from '../../../../utils/date';

const useStyles = makeStyles(() => ({
  reactWEditor: {
    flex: 1,
    display: 'flex',
    height: '368px',
    flexDirection: 'column',
    '& .w-e-text-container': {
      flex: 1,
      '& .w-e-text': { minHeight: '100% !important' }
    }
  }
}));
const ReactWEditor = extend({ i18next });

const ListDialog = ({ open, isDetail, cruentRow, closeAddDialog, getMessagesList }) => {
  const classes = useStyles();
  const myRef = createRef();

  useEffect(() => {
    if (cruentRow?.id) {
      formik.setValues({ ...cruentRow });
    } else {
      formik.handleReset();
    }
  }, [cruentRow]);

  useEffect(() => {
    if (isDetail) {
      myRef.current?.editor?.disable();
    }
  }, [myRef]);

  const formik = useFormik({
    initialValues: {
      title: '',
      content: '',
      forSystem: '',
      userGroupType: '',
      moduleName: '',
      startTime: '',
      endTime: '',
      switchStatus: 0,
      ifCancel: 0,
      remark: ''
    },
    validationSchema: Yup.object({
      title: Yup.string().required('Error'),
      content: Yup.string().required('Error'),
      forSystem: Yup.string().required('Error'),
      startTime: Yup.string().required('Error'),
      endTime: Yup.string().required('Error')
    }),
    onSubmit: (values) => {
      const queryData = {
        ...values,
        startTime: dayjs(startTime).format('YYYY-MM-DD HH:mm:ss'),
        endTime: dayjs(endTime).format('YYYY-MM-DD HH:mm:ss')
      };

      if (!_.isUndefined(cruentRow?.id)) {
        updateMessage(queryData);
      } else {
        addMessage(queryData);
      }
    }
  });

  const addMessage = (data) => {
    Loading.show();
    messageAPI
      .saveMessage(data)
      .then((res) => {
        if (res?.data.code === 200) {
          CommonTip.success('Success');
          handleClose();
          getMessagesList();
        }
      })
      .finally(() => {
        Loading.hide();
      });
  };

  const updateMessage = (data) => {
    Loading.show();
    messageAPI
      .updateMessage(data)
      .then((res) => {
        if (res?.data.code === 200) {
          CommonTip.success('Success');
          handleClose();
          getMessagesList();
        }
      })
      .finally(() => {
        Loading.hide();
      });
  };

  const handleClose = () => {
    formik.handleReset();
    closeAddDialog();
  };

  const handleConfirm = () => {
    if (!formik.isValid) handleValidation();
    formik.handleSubmit();
  };

  const customUploadImg = (files, insertImgFn) => {
    const formData = new FormData();
    formData.append('file', files?.[0]);
    formData.append(
      'resumeFile',
      new Blob(
        [
          JSON.stringify({
            requestNo: getDayNumber(),
            projectName: 'Message'
          })
        ],
        {
          type: 'application/json'
        }
      )
    );
    fileAPI.webDPuploadFile(formData).then((res) => {
      const resData = res?.data?.data || [];
      const count = _.countBy(resData?.[0]?.fileUrl)['/'];
      let arr = resData?.[0]?.fileUrl.split('/');
      const fileName = arr?.[arr.length - 1];
      arr = arr?.splice(0, count);
      const dir = arr?.join('/');
      const isProd = envUrl?.file?.indexOf('inbound') !== -1;
      let path = '';
      if (isProd) {
        path = `${envUrl.file}/file/resumeFile/previewFile?remoteDir=${dir}/&remoteFile=${fileName}`;
      } else {
        path = `${envUrl.file}/resumeFile/previewFile?remoteDir=${dir}/&remoteFile=${fileName}`;
      }
      insertImgFn(path);
    });
  };

  const {
    values: {
      title,
      ifCancel,
      switchStatus,
      content,
      startTime,
      endTime,
      forSystem,
      remark,
      userGroupType,
      moduleName
    },
    setFieldValue,
    handleChange,
    handleBlur
  } = formik;
  return (
    <>
      <CommonDialog
        open={open}
        title={
          isDetail
            ? 'Detail'
            : _.isUndefined(cruentRow?.id)
            ? 'Add Notification'
            : 'Edit Notification'
        }
        handleClose={handleClose}
        handleConfirm={handleConfirm}
        isHideFooter={isDetail}
        maxWidth="md"
        content={
          <div style={{ padding: 30 }}>
            <Grid container spacing={3}>
              <Grid item xs={5}>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <TextField
                      label="Title *"
                      name="title"
                      value={title || ''}
                      disabled={isDetail}
                      onBlur={handleBlur}
                      onChange={handleChange}
                      {...FormControlInputProps}
                      error={Boolean(formik.errors.title && formik.touched.title)}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      label="System *"
                      name="forSystem"
                      value={forSystem || ''}
                      onBlur={handleBlur}
                      disabled={isDetail}
                      onChange={handleChange}
                      {...FormControlInputProps}
                      error={Boolean(formik.errors.forSystem && formik.touched.forSystem)}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      label="Group"
                      name="userGroupType"
                      value={userGroupType || ''}
                      onBlur={handleBlur}
                      disabled={isDetail}
                      onChange={handleChange}
                      {...FormControlInputProps}
                      error={Boolean(formik.errors.userGroupType && formik.touched.userGroupType)}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      label="Module Name"
                      name="moduleName"
                      value={moduleName || ''}
                      onBlur={handleBlur}
                      disabled={isDetail}
                      onChange={handleChange}
                      {...FormControlInputProps}
                      error={Boolean(formik.errors.moduleName && formik.touched.moduleName)}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <HAKeyboardDatePicker
                      label="Start Time *"
                      name="startTime"
                      onBlur={handleBlur}
                      disabled={isDetail}
                      onChange={(val) => {
                        setFieldValue('startTime', val);
                      }}
                      value={startTime || null}
                      maxDate={endTime || undefined}
                      minDate={new Date()}
                      error={Boolean(formik.errors.startTime && formik.touched.startTime)}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <HAKeyboardDatePicker
                      label="End Time *"
                      name="endTime"
                      value={endTime}
                      onBlur={handleBlur}
                      disabled={isDetail}
                      onChange={(val) => {
                        setFieldValue('endTime', val);
                      }}
                      minDate={startTime || new Date()}
                      error={Boolean(formik.errors.endTime && formik.touched.endTime)}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <FormControl fullWidth size="small" variant="outlined">
                      <InputLabel>Perm/Temp</InputLabel>
                      <Select
                        label="Perm/Temp "
                        disabled={isDetail}
                        value={Number(switchStatus)}
                        name="switchStatus"
                        onChange={(e, value) => {
                          setFieldValue('switchStatus', Number(value.props.value));
                        }}
                      >
                        <MenuItem value={1}>Yes</MenuItem>
                        <MenuItem value={0}>No</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={6}>
                    <FormControl fullWidth size="small" variant="outlined">
                      <InputLabel>Pause</InputLabel>
                      <Select
                        label="Pause"
                        disabled={isDetail}
                        value={Number(ifCancel)}
                        name="ifCancel"
                        onChange={(e, value) => {
                          setFieldValue('ifCancel', Number(value.props.value));
                        }}
                      >
                        <MenuItem value={1}>Yes</MenuItem>
                        <MenuItem value={0}>No</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      multiline
                      minRows={3}
                      label="Remarks"
                      name="remark"
                      value={remark || ''}
                      disabled={isDetail}
                      onChange={handleChange}
                      {...FormControlInputProps}
                    />
                  </Grid>
                </Grid>
              </Grid>

              <Grid item xs={7}>
                <ReactWEditor
                  config={{
                    lang: 'en',
                    uploadImgAccept: ['jpg', 'jpeg', 'png', 'gif'],
                    menus: [
                      'head', // 标题
                      'bold', // 粗体
                      'fontSize', // 字号
                      'fontName', // 字体
                      'italic', // 斜体
                      'underline', // 下划线
                      'strikeThrough', // 删除线
                      'foreColor', // 文字颜色
                      'backColor', // 背景颜色
                      'list', // 列表
                      'justify', // 对齐方式
                      'quote', // 引用
                      'emoticon', // 表情
                      'table', // 表格
                      'image', // 插入图片
                      'undo', // 撤销
                      'redo', // 重复
                      'fullscreen' // 全屏
                    ],
                    customUploadImg
                  }}
                  className={classes.reactWEditor}
                  ref={myRef}
                  defaultValue={content}
                  onChange={(html) => {
                    setFieldValue('content', html);
                  }}
                />
              </Grid>
            </Grid>
          </div>
        }
      />
    </>
  );
};

export default memo(ListDialog);
