import React, { memo, createRef, useEffect, useState } from 'react';
import {
  Grid,
  TextField,
  InputLabel,
  Select,
  FormControl,
  MenuItem,
  makeStyles
} from '@material-ui/core';
import { useFormik } from 'formik';
import { extend } from 'wangeditor-for-react';

import { CommonDialog, HAKeyboardDatePicker } from '../../../../components';
import FormControlInputProps from '../../../../models/webdp/PropsModels/FormControlInputProps';

import API from '../../../../api/file/file';

const useStyles = makeStyles(() => ({
  reactWEditor: {
    flex: 1,
    display: 'flex',
    height: '285px',
    flexDirection: 'column',
    '& .w-e-text-container': {
      flex: 1,
      '& .w-e-text': { minHeight: '100% !important' }
    }
  }
}));

const ReactWEditor = extend();
const Editor = ({ open, setOpen }) => {
  const classes = useStyles();
  const myRef = createRef();
  const formik = useFormik({
    initialValues: {
      title: '',
      content: '<P>1233</P>',
      forSystem: '',
      startTime: '',
      endTime: '',
      switchStatus: 0,
      ifCancel: 0
    },
    onSubmit: (values) => {
      console.log('values: ', values);
    }
  });

  const [imagesArr, setImagesArr] = useState([]);

  const handleClose = () => {
    setOpen(false);
  };

  const handleConfirm = () => {
    formik.handleSubmit();
    handleClose();
  };

  const {
    values: { title, ifCancel, switchStatus, content, startTime, endTime, forSystem },
    setFieldValue,
    handleChange
  } = formik;
  console.log('content: ', content);

  useEffect(() => {
    // getImages();
  }, []);

  const getImages = (a, b) => {
    const { content } = formik.values;
    // const a = '/SENSE/fileService/upload/webDP/0/2022-08-09';
    // const b = 'test-20220809091133055.jpg';

    let temp = '';
    API.previewImage(a, b)
      .then((res) => {
        // console.log('previewImage', res, window.URL.createObjectURL(res.data));

        if (res?.data) {
          blob2base64(res?.data, (result) => {
            temp = result.replace('data:application/vnd.ms-excel;', 'data:image/png;');
            console.log('blob2base64 2', temp);

            // setFieldValue(
            //   'content',
            //   `${content}<img src="${temp}" remoteDir="SENSE/TestFile" remoteFile="test.jpg" />`
            // );
          });
        }
        console.log('blob2base64 3', temp);
      })
      .finally(() => temp);
  };

  const blob2base64 = (data, callback) => {
    console.log('blob2base64 1', window.URL.createObjectURL(data));
    const reader = new FileReader();
    reader.readAsDataURL(data);
    reader.onload = (e) => {
      callback(e.target.result);
    };
  };

  return (
    <>
      <CommonDialog
        open={open}
        title="Add Notification"
        handleClose={handleClose}
        handleConfirm={handleConfirm}
        isHideFooter={false}
        maxWidth="xl"
        content={
          <div style={{ padding: 30, height: '70vh', width: '100%' }}>
            <Grid container spacing={3}>
              <Grid item xs={5}>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <TextField
                      label="Title"
                      name="title"
                      value={title}
                      onChange={handleChange}
                      {...FormControlInputProps}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      label="System"
                      name="forSystem"
                      value={forSystem}
                      onChange={handleChange}
                      {...FormControlInputProps}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <HAKeyboardDatePicker
                      label="Start Time"
                      name="startTime"
                      value={startTime}
                      onChange={(val) => {
                        setFieldValue('startTime', val);
                      }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <HAKeyboardDatePicker
                      label="End Time"
                      name="endTime"
                      value={endTime}
                      onChange={(val) => {
                        setFieldValue('endTime', val);
                      }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <FormControl fullWidth size="small" variant="outlined">
                      <InputLabel>Perm/Temp</InputLabel>
                      <Select
                        label="Perm/Temp "
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

                  <Grid item xs={12}>
                    <FormControl fullWidth size="small" variant="outlined">
                      <InputLabel>Pause</InputLabel>
                      <Select
                        label="Pause"
                        value={Number(ifCancel)}
                        name="ifCancel"
                        onChange={(e, value) => {
                          setFieldValue('ifCancel', Number(value.props.value));
                        }}
                      >
                        <MenuItem value={1}>Yes </MenuItem>
                        <MenuItem value={0}>No</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>
              </Grid>

              <Grid item xs={7}>
                <ReactWEditor
                  style={{ height: '60vh' }}
                  config={{
                    lang: 'en',
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
                      'image',
                      'uploadImage',
                      'undo', // 撤销
                      'redo', // 重复
                      'fullscreen' // 全屏
                    ],
                    uploadImgServer:
                      'https://file-service-dev-sense-dev.cldpaast71.server.ha.org.hk/resumeFile/upload_file',
                    uploadFileName: 'file',
                    customUploadImg: (files, insertImgFn) => {
                      // console.log('customUploadImg', files);
                      const formData = new FormData();
                      formData.append('file', files[0]);
                      formData.append('fileName', files[0].name);
                      formData.append('innerDir', '/SENSE/fileservice/upload/test');
                      formData.append(
                        'resumeFile',
                        new Blob(
                          [
                            JSON.stringify({
                              groupType: 'netWorkDesign',
                              requestNo: 0,
                              requesterId: 0,
                              projectName: 'webDP'
                            })
                          ],
                          {
                            type: 'application/json'
                          }
                        )
                      );
                      API.webDPuploadFile(formData).then((res) => {
                        // console.log('webDPuploadFile', res);
                        const fileUrl = res?.data?.data[0].fileUrl;
                        const tempArr = fileUrl.split('/');
                        const fileName = tempArr[tempArr.length - 1];
                        let path = '';
                        for (let i = 1; i < tempArr.length - 1; i += 1) {
                          // console.log('for', tempArr[i]);
                          path = `${path}/${tempArr[i]}`;
                        }
                        // const temp = getImages(path, fileName);
                        // console.log('path', path, fileName, temp);

                        API.previewImage(path, fileName).then((res) => {
                          // console.log('previewImage', res, window.URL.createObjectURL(res.data));
                          let temp = '';
                          if (res?.data) {
                            blob2base64(res?.data, (result) => {
                              temp = result.replace(
                                'data:application/vnd.ms-excel;',
                                'data:image/png;'
                              );
                              // console.log('blob2base64 2', temp);
                              insertImgFn(temp);
                            });
                          }
                        });
                      });
                    }
                    // uploadImgHooks: {
                    //   customInsert: (insertImgFn, result) => {
                    //     console.log('customInsert', insertImgFn, result);
                    //   }
                    // }
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

export default memo(Editor);
