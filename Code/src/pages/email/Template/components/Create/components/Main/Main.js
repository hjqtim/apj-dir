import * as Yup from 'yup';
import _ from 'lodash';
import { useFormik } from 'formik';
import * as EditIcon from 'react-feather';
import { useDropzone } from 'react-dropzone';
import { extend } from 'wangeditor-for-react';
import i18next from 'i18next';

import { useParams, useHistory } from 'react-router-dom';
import React, { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import {
  Box,
  Grid,
  Button,
  Tooltip,
  Checkbox,
  makeStyles,
  InputLabel,
  FormControlLabel
} from '@material-ui/core';

import { L } from '../../../../../../../utils/lang';
import getIcons from '../../../../../../../utils/getIcons';
import { useGlobalStyles } from '../../../../../../../style';
import API from '../../../../../../../api/email/templateManage';
import Loading from '../../../../../../../components/Loading';
import { HAPaper, CommonInput, CommonTip, WarningDialog } from '../../../../../../../components';

const ReactWEditor = extend({ i18next });
// const ReactWEditor = extend();
const useStyles = makeStyles((theme) => ({
  root: {
    margin: 20,
    background: '#fff',
    borderRadius: '15px 15px 0px 0px'
  },

  title: (props) => ({
    color: props.isDetail ? '#909090' : 'rgba(0,0,0,.85)',
    fontSize: '1.2em',
    margin: theme.spacing(4, 0)
  }),
  starts: (props) => ({
    color: props.isDetail ? '#909090' : 'red'
  }),
  accessory: {
    margin: theme.spacing(4, 0)
  },
  btnFlex: {
    margin: theme.spacing(4, 0),
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    '& button': {
      width: '5vw',
      marginLeft: '1vw',
      marginRight: '1vw',
      color: '#fff'
    },
    '& button:nth-child(2)': {
      color: '#5c5c5c',
      background: '#E0E0E0'
    }
  },
  tips: {
    marginTop: theme.spacing(3)
  },
  accessoryBox: {
    width: '100%',
    height: '200px ',
    overflowY: 'auto',
    paddingTop: '10px',
    borderRadius: '5px',
    textAlign: 'center',
    border: '1px dashed #ccc'
  },
  reactWEditor: {
    flex: 1,
    display: 'flex',
    height: '370px',
    flexDirection: 'column',
    '& .w-e-text-container': {
      flex: 1,
      '& .w-e-text': { minHeight: '100% !important' }
    }
  },
  fileStyle: {
    flex: 1,
    textAlign: 'right',
    padding: '5px',
    whiteSpace: 'nowrap',
    // width: '150px',
    overflow: 'hidden',
    textOverflow: 'ellipsis'
  },
  btnPoiter: {
    cursor: 'pointer'
  },
  checkBoxLabel: (props) => ({
    width: '40px',
    color: props.isDetail ? '#909090' : 'rgba(0,0,0,.85)',
    '& .MuiFormControlLabel-label.Mui-disabled': {
      color: props.isDetail ? '#909090' : 'rgba(0,0,0,.85)'
    }
  })
}));

const richTip = `Note: Please use placeholders in the message content such as $[name]$, and the name is required.`;
export default function Main() {
  const { id } = useParams();
  const history = useHistory();
  const url = history.location;
  const myRef = React.createRef();
  // ???????????????????????????
  const fileSize = 10 * 1024 * 1024;
  const globalClaess = useGlobalStyles();
  const [isDetail, setIsDetail] = useState(false);
  // ??????????????????????????????
  const [openDeleteDialog, setpenDeleteDialog] = useState(false);
  // ??????????????????
  const [deleteObj, setdeleteObj] = useState({});
  const classes = useStyles({ isDetail });
  // ?????????????????????
  const [upfile, setUpfile] = useState([]);
  // ??????????????????????????????
  const [files, setFiles] = useState([]);
  const [containtName, setContaintName] = useState(true);
  const [richTextTip, setRichTextTip] = useState(richTip);
  const defValue = `<p>Dear $[name]$,ladies and gentlemen???</p><p>&nbsp; &nbsp;&nbsp;Invite you to participate XX<br/></p><p>&nbsp; &nbsp; Time???$[time]$<br/></p><p>&nbsp; &nbsp; location???$[location]$<br/></p><p><br/></p><p>&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;&nbsp;XXXXXX<br/></p><p>&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;XXXXXX<br/></p><p>&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; Tel.???123456<br/></p>`;
  const [defaultValue, setDefaultValue] = React.useState('');
  const [templateHtml, setTemplateHtml] = React.useState('');
  const [currentSubjectName, setCurrentSubjectName] = React.useState('');
  const user = useSelector((state) => state.userReducer?.currentUser) || {};

  useEffect(() => {
    // ?????????????????????
    if (!_.isUndefined(id)) {
      // ?????????
      searchTemplate();
      if (url?.pathname.indexOf('detail') !== -1) {
        setIsDetail(true);
        // ????????????????????????
        myRef.current.editor.disable();
      } else {
        //
      }
    } else {
      // ?????????
      setDefaultValue(defValue);
    }
  }, []);

  // ?????????????????????
  const formik = useFormik({
    initialValues: { mouldName: '', remark: '', urgent: false },
    // ????????????
    validationSchema: Yup.object({
      mouldName: Yup.string().required(L('subjectPlease')).max(100),
      remark: Yup.string().max(255)
    }),
    // ??????
    onSubmit: (value) => {
      handleClickSubmit(value);
    }
  });

  const handleTemplate = (emailTemp) => {
    // ???<span th:text="$[xxx]$"></span>??????$[xxx]$
    const str = emailTemp.replace(/<span.*?th:text="(.*?)".*?><\/span>/g, (match, p1) => p1);

    // ???th:href="@{https://url/($[xxx]$)}"??????href="https://url/($[xxx]$)"
    const value = str.replace(/th:href="@{(.*?)}"/g, (match, p1) => `href="${p1}"`);
    setDefaultValue(value || '');
    setTemplateHtml(value || '');
  };

  // ????????????ID????????????
  const searchTemplate = () => {
    Loading.show();
    API.searchTemplateById(id)
      .then((res) => {
        if (res?.data?.data) {
          const { mouldName, remark, urgent, templateHtml, files = [] } = res?.data?.data;
          formik.setValues({ mouldName, remark: remark || '', urgent: !!urgent });
          setFiles(files);
          handleTemplate(templateHtml);
          if (url?.pathname.indexOf('update') !== -1) {
            setCurrentSubjectName(mouldName);
          }
        }
      })
      .finally(() => {
        Loading.hide();
      });
  };

  // ????????????
  const handleClickSubmit = (value) => {
    const { mouldName, remark, urgent } = value;
    // ???????????????????????????
    if (templateHtml !== '') {
      const temp = templateHtml?.indexOf('$[name]$');
      if (temp < 0) {
        setContaintName(false);
        return;
      }
    } else {
      setContaintName(false);
      setRichTextTip(L('pleaseEnterAContent'));
    }
    // ????????????
    const params = {
      mouldName,
      remark,
      urgent: urgent ? 1 : 0,
      templateHtml: handleSubmitRichText()
    };

    // ??????????????????;
    if (!_.isUndefined(id)) {
      // console.log(params);
      handleUpdateTemplate(params);
    } else {
      // ??????????????????
      handleAddTemplate(params);
    }
  };

  // ??????????????????;
  const handleUpdateTemplate = async (params) => {
    params.templateId = id;
    const res = await API.updateTemplate(params);
    if (res?.data?.code === 200) {
      if (upfile.length) {
        // ????????????????????????????????????
        handleUpload(id);
      } else {
        CommonTip.success(L('modifyTheSuccess'));
        history.goBack();
      }
    } else {
      CommonTip.error(L('modifyTheFail'));
    }
  };

  // ??????????????????
  const handleAddTemplate = async (params) => {
    const res = await API.addTemplate(params);
    if (res?.data?.code === 200) {
      // ????????????????????????????????????
      if (upfile.length) {
        handleUpload(res.data.data);
      } else {
        CommonTip.success(L('successfullyAdded'));
        history.goBack();
      }
    } else {
      CommonTip.error(L('AddFailure'));
    }
  };

  // ????????????
  const handleUpload = async (sysTemplateId) => {
    const formData = new FormData();
    upfile.forEach((fileItem) => {
      formData.append('file', fileItem);
    });
    formData.append(
      'resumeFile',
      new Blob([JSON.stringify({ projectName: 'email', requesterId: user?.id, sysTemplateId })], {
        type: 'application/json'
      })
    );
    const res = await API.uploadFile(formData);
    if (res?.data?.code === 200) {
      CommonTip.success(L('successfullyAdded'));
      history.goBack();
    } else {
      CommonTip.error(L('failedAndChecked'));
    }
  };

  // ?????????????????????
  const handleSubmitRichText = () => {
    // ????????????$[xxx]$??????<span th:text="$[xxx]$"></span>?????????a??????
    const str = templateHtml.replace(/\$\[.*?]\$/g, (match) => `<span th:text="${match}"></span>`);

    const str2 = str.replace(/<a.*?><\/a>/g, (m) => {
      // ???a????????????<span th:text="$[xxx]$"></span>???"$[xxx]$"
      const noSpan = m.replace(/<span th:text="(\$\[.*?]\$)"><\/span>/g, '$1');

      // ???href??????th:href???URL?????????@{???URL?????????}
      return noSpan.replace(/href="(.*?)"/, (match, url) => `th:href="@{${url}}"`);
    });

    // ???a??????????????????$[xxx]$??????<span th:text="$[xxx]$"></span>
    const result = str2.replace(/<a.*?>(\$\[.*?]\$)<\/a>/g, (mat, p1) =>
      mat.replace(`${p1}</a>`, `<span th:text="${p1}"></span></a>`)
    );

    console.log(result);
    return result;
  };

  // ?????????????????????
  const onDrop = useCallback(
    (acceptedFiles) => {
      // ????????????????????????10???
      if (acceptedFiles.length + upfile.length + files.length > 10) {
        CommonTip.error(L('MaximumCanBe10'));
        return;
      }
      // ???????????????????????????
      const copyeFiles = files.map((item) => ({ ...item, name: item.fileName }));
      const filesName = _.map([...upfile, ...copyeFiles], 'name');
      // ???????????????????????????.bat .sh
      let exitBat = false;
      // ???????????????????????????
      let exitSame = false;
      // ??????????????????????????????10M
      let overSize = false;
      // ??????????????????????????????
      let hasNoAcceptFile = false;
      const acceptFiles = ['doc', 'docx', 'xls', 'xlsx', 'pdf', 'png', 'jpg'];
      acceptedFiles.forEach((item) => {
        if (item.name.indexOf('.bat') !== -1 || item.name.indexOf('.sh') !== -1) {
          exitBat = true;
        } else if (filesName.indexOf(item.name) !== -1) {
          exitSame = true;
        } else if (acceptFiles.indexOf(item.name.split('.').pop().toLowerCase()) === -1) {
          hasNoAcceptFile = true;
        } else if (item.size > fileSize) {
          overSize = true;
        }
      });
      if (exitBat) {
        CommonTip.error(L('batShCannotUpload'));
        return;
      }
      // ??????????????????10M
      if (overSize) {
        CommonTip.error(L('DoNotUuploadLargerThan10MB'));
        return;
      }
      // ????????????????????????
      if (hasNoAcceptFile) {
        CommonTip.error(L('supportsFiles'));
        return;
      }
      // ???????????????????????????
      if (!exitSame) {
        setUpfile([...upfile, ...acceptedFiles]);
      } else {
        CommonTip.error(L('DoNotSameFile'));
      }
    },
    [upfile, fileSize, files]
  );
  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  // ???????????????????????????
  const removeFile = (e, index) => {
    e.stopPropagation();
    upfile.splice(index, 1);
    setUpfile([...upfile]);
  };

  // ??????????????????
  const handleClickCancel = () => {
    history.goBack();
  };
  // ????????????????????????
  const checkedMoudleExit = async (e) => {
    // ?????????????????????
    if (formik.values.mouldName === '') return;
    // ??????????????????????????????????????????
    if (formik.values.mouldName === currentSubjectName) return;
    formik.handleBlur(e);
    const res = await API.templateIsExit(formik.values.mouldName);
    if (res?.data?.code === 204) {
      formik.setFieldError('mouldName', L('subjectAlreadyExists'));
    }
  };

  // ???????????????????????????????????????????????????????????????
  const checkedMoudleExitSubmit = async () => {
    // ????????????????????????????????????????????????
    if (formik.values.mouldName === currentSubjectName || formik.values.mouldName === '') {
      formik.handleSubmit();
      return;
    }
    // ?????????????????????
    const res = await API.templateIsExit(formik.values.mouldName);
    if (res?.data?.code !== 204) {
      formik.handleSubmit();
    } else if (res?.data?.code === 204) {
      formik.setFieldError('mouldName', L('subjectAlreadyExists'));
    }
  };

  // s?????????????????????????????????
  const deleteServerFile = (e, item) => {
    e.stopPropagation();
    setpenDeleteDialog(true);
    setdeleteObj(item);
  };
  // ????????????????????????????????????????????????
  const handleConfirm = async () => {
    const res = await API.deleteFile(deleteObj?.id || '');
    handleClose();
    if (res?.data?.code === 200) {
      CommonTip.success(L('SuccessfullyDeleted'));
      // ?????????????????????????????????;
      const res = await API.searchTemplateById(id);
      if (res?.data?.data) {
        const { files = [] } = res.data.data;
        setFiles(files);
      }
    } else {
      CommonTip.error(L('FailedDeleted'));
    }
  };

  // ?????????????????????????????????
  const handleClose = () => {
    setpenDeleteDialog(false);
    setTimeout(() => {
      setdeleteObj({});
    }, 200);
  };
  return (
    <HAPaper
      className={globalClaess.haPaper}
      style={{ height: '100%', color: isDetail ? '#909090' : 'rgba(0,0,0,.85)' }}
    >
      <div className={classes.root}>
        <form onSubmit={formik.handleSubmit}>
          <Grid container spacing={10}>
            <Grid item xs={5}>
              <CommonInput
                fullWidth
                require
                name="mouldName"
                disabled={isDetail}
                labels={L('subject')}
                onBlur={checkedMoudleExit}
                onChange={formik.handleChange}
                value={formik.values.mouldName || ''}
                helperText={formik.touched.mouldName && formik.errors.mouldName}
                error={formik.errors.mouldName && formik.touched.mouldName}
              />
              <CommonInput
                fullWidth
                name="remark"
                labels={L('describe')}
                disabled={isDetail}
                onChange={formik.handleChange}
                value={formik.values.remark || ''}
                helperText={formik.touched.remark && formik.errors.remark}
                error={formik.errors.remark && formik.touched.remark}
              />
              {/* ???????????? */}
              <Box>
                <InputLabel className={`${classes.title} ${classes.accessory}`}>
                  {L('accessory')}:
                </InputLabel>
                <div
                  {...getRootProps(isDetail ? { onClick: (event) => event.stopPropagation() } : {})}
                  className={classes.accessoryBox}
                >
                  <input {...getInputProps()} />
                  <div id="upfilezone">
                    {/* ?????????????????????????????? */}
                    {files.map((item) => (
                      <div
                        key={item.id}
                        style={{
                          display: 'flex'
                        }}
                      >
                        <Tooltip title={item.fileName} placement="top">
                          <div className={classes.fileStyle}>{item.fileName}</div>
                        </Tooltip>
                        <div style={{ flex: 1, textAlign: 'left', padding: '5px' }}>
                          <span
                            className={classes.btnPoiter}
                            onClick={(e) => (isDetail ? null : deleteServerFile(e, item))}
                          >
                            {getIcons('delete', isDetail ? '#909090' : '#FD5841')}
                          </span>
                          <Tooltip title={L('fileExists')} placement="top">
                            <span> {getIcons('success', isDetail ? '#909090' : '#04DE69')} </span>
                          </Tooltip>
                        </div>
                      </div>
                    ))}
                    {/* ????????????????????? */}
                    {upfile.map((item, index) => (
                      <div key={item.name} style={{ display: 'flex' }}>
                        <Tooltip title={item?.fileName || ''} placement="top">
                          <div className={classes?.fileStyle}>{item?.name}</div>
                        </Tooltip>
                        <div style={{ flex: 1, textAlign: 'left', padding: '5px' }}>
                          <span className={classes.btnPoiter} onClick={(e) => removeFile(e, index)}>
                            {getIcons('delete', isDetail ? '#909090' : '#FD5841')}
                          </span>
                        </div>
                      </div>
                    ))}
                    {!upfile.length && !files.length && (
                      <div>
                        <p> {L('clickAddAttachment')}</p>
                        <p>or</p>
                        <p> {L('DragAndDdropToAAddBbitch')}</p>
                      </div>
                    )}
                    <br />
                    <EditIcon.FilePlus style={{ width: 35, height: 35 }} />
                  </div>
                </div>
                {/* ????????????checkbox */}
                <FormControlLabel
                  className={classes.checkBoxLabel}
                  control={
                    <Checkbox
                      name="urgent"
                      disabled={isDetail}
                      onChange={formik.handleChange}
                      checked={formik.values.urgent || false}
                      color="secondary"
                    />
                  }
                  label={L('urgent')}
                />
                {/* ?????????????????? */}
                <div className={classes.btnFlex}>
                  <Button
                    color="secondary"
                    variant="contained"
                    onClick={checkedMoudleExitSubmit}
                    disabled={url?.pathname.indexOf('detail') !== -1}
                    style={{
                      background: url?.pathname.indexOf('detail') !== -1 ? '#E0E0E0' : '#229FFA'
                    }}
                  >
                    {L('Submit')}
                  </Button>
                  <Button variant="contained" onClick={handleClickCancel}>
                    {isDetail ? L('Close') : L('Cancel')}
                  </Button>
                </div>
              </Box>
            </Grid>
            {/* ?????????????????? */}
            <Grid item xs={7}>
              <div>
                <InputLabel className={classes.title}>
                  <span className={classes.starts}>*</span>
                  {L('content')}:
                </InputLabel>
              </div>
              <ReactWEditor
                config={{ lang: 'en' }}
                ref={myRef}
                defaultValue={defaultValue}
                value={defaultValue}
                className={classes.reactWEditor}
                onChange={(html) => {
                  setContaintName(true);
                  setRichTextTip(richTip);
                  setTemplateHtml(html);
                }}
              />
              <div
                className={classes.tips}
                style={{
                  color: containtName ? (isDetail ? '#909090' : '#FFB649') : '#FD5841'
                }}
              >
                {richTextTip}
              </div>
            </Grid>
          </Grid>
        </form>
      </div>
      {/* ??????????????? */}
      <WarningDialog
        open={openDeleteDialog}
        handleConfirm={handleConfirm}
        handleClose={handleClose}
        content={
          <div>
            Do you want to delete the
            <span style={{ color: '#229FFA' }}> {deleteObj?.fileName} </span> file ?
          </div>
        }
      />
    </HAPaper>
  );
}
