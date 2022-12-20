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
  // 上传附件的最大限制
  const fileSize = 10 * 1024 * 1024;
  const globalClaess = useGlobalStyles();
  const [isDetail, setIsDetail] = useState(false);
  // 控制会话框的显示隐藏
  const [openDeleteDialog, setpenDeleteDialog] = useState(false);
  // 要删除的文件
  const [deleteObj, setdeleteObj] = useState({});
  const classes = useStyles({ isDetail });
  // 刚刚上传的文件
  const [upfile, setUpfile] = useState([]);
  // 服务器已经存在的文件
  const [files, setFiles] = useState([]);
  const [containtName, setContaintName] = useState(true);
  const [richTextTip, setRichTextTip] = useState(richTip);
  const defValue = `<p>Dear $[name]$,ladies and gentlemen：</p><p>&nbsp; &nbsp;&nbsp;Invite you to participate XX<br/></p><p>&nbsp; &nbsp; Time：$[time]$<br/></p><p>&nbsp; &nbsp; location：$[location]$<br/></p><p><br/></p><p>&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;&nbsp;XXXXXX<br/></p><p>&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;XXXXXX<br/></p><p>&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; Tel.：123456<br/></p>`;
  const [defaultValue, setDefaultValue] = React.useState('');
  const [templateHtml, setTemplateHtml] = React.useState('');
  const [currentSubjectName, setCurrentSubjectName] = React.useState('');
  const user = useSelector((state) => state.userReducer?.currentUser) || {};

  useEffect(() => {
    // 详情页还是编辑
    if (!_.isUndefined(id)) {
      // 详情页
      searchTemplate();
      if (url?.pathname.indexOf('detail') !== -1) {
        setIsDetail(true);
        // 禁用富文本编辑器
        myRef.current.editor.disable();
      } else {
        //
      }
    } else {
      // 新增页
      setDefaultValue(defValue);
    }
  }, []);

  // 收集搜索的字段
  const formik = useFormik({
    initialValues: { mouldName: '', remark: '', urgent: false },
    // 表单验证
    validationSchema: Yup.object({
      mouldName: Yup.string().required(L('subjectPlease')).max(100),
      remark: Yup.string().max(255)
    }),
    // 提交
    onSubmit: (value) => {
      handleClickSubmit(value);
    }
  });

  const handleTemplate = (emailTemp) => {
    // 将<span th:text="$[xxx]$"></span>改为$[xxx]$
    const str = emailTemp.replace(/<span.*?th:text="(.*?)".*?><\/span>/g, (match, p1) => p1);

    // 将th:href="@{https://url/($[xxx]$)}"改为href="https://url/($[xxx]$)"
    const value = str.replace(/th:href="@{(.*?)}"/g, (match, p1) => `href="${p1}"`);
    setDefaultValue(value || '');
    setTemplateHtml(value || '');
  };

  // 根据模板ID查询模板
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

  // 提交保存
  const handleClickSubmit = (value) => {
    const { mouldName, remark, urgent } = value;
    // 验证富文本框的内容
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
    // 请求参数
    const params = {
      mouldName,
      remark,
      urgent: urgent ? 1 : 0,
      templateHtml: handleSubmitRichText()
    };

    // 修改邮件模板;
    if (!_.isUndefined(id)) {
      // console.log(params);
      handleUpdateTemplate(params);
    } else {
      // 添加邮件模板
      handleAddTemplate(params);
    }
  };

  // 修改邮件模板;
  const handleUpdateTemplate = async (params) => {
    params.templateId = id;
    const res = await API.updateTemplate(params);
    if (res?.data?.code === 200) {
      if (upfile.length) {
        // 如果有文件就继续上传文件
        handleUpload(id);
      } else {
        CommonTip.success(L('modifyTheSuccess'));
        history.goBack();
      }
    } else {
      CommonTip.error(L('modifyTheFail'));
    }
  };

  // 添加邮件模板
  const handleAddTemplate = async (params) => {
    const res = await API.addTemplate(params);
    if (res?.data?.code === 200) {
      // 如果有文件就继续上传文件
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

  // 文件上传
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

  // 处理富文本数据
  const handleSubmitRichText = () => {
    // 先将所有$[xxx]$改为<span th:text="$[xxx]$"></span>，包括a标签
    const str = templateHtml.replace(/\$\[.*?]\$/g, (match) => `<span th:text="${match}"></span>`);

    const str2 = str.replace(/<a.*?><\/a>/g, (m) => {
      // 将a标签中的<span th:text="$[xxx]$"></span>改"$[xxx]$"
      const noSpan = m.replace(/<span th:text="(\$\[.*?]\$)"><\/span>/g, '$1');

      // 将href改为th:href，URL前面加@{，URL后面加}
      return noSpan.replace(/href="(.*?)"/, (match, url) => `th:href="@{${url}}"`);
    });

    // 将a结束标签前的$[xxx]$改为<span th:text="$[xxx]$"></span>
    const result = str2.replace(/<a.*?>(\$\[.*?]\$)<\/a>/g, (mat, p1) =>
      mat.replace(`${p1}</a>`, `<span th:text="${p1}"></span></a>`)
    );

    console.log(result);
    return result;
  };

  // 添加文件的函数
  const onDrop = useCallback(
    (acceptedFiles) => {
      // 文件数量不能超出10个
      if (acceptedFiles.length + upfile.length + files.length > 10) {
        CommonTip.error(L('MaximumCanBe10'));
        return;
      }
      // 隐射服务器上的文件
      const copyeFiles = files.map((item) => ({ ...item, name: item.fileName }));
      const filesName = _.map([...upfile, ...copyeFiles], 'name');
      // 上传的文件是否存在.bat .sh
      let exitBat = false;
      // 上传的文件是否存在
      let exitSame = false;
      // 上传的文件是否有超过10M
      let overSize = false;
      // 是否存在不支持的文件
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
      // 文件不能超出10M
      if (overSize) {
        CommonTip.error(L('DoNotUuploadLargerThan10MB'));
        return;
      }
      // 文件只支持的类型
      if (hasNoAcceptFile) {
        CommonTip.error(L('supportsFiles'));
        return;
      }
      // 不能上传相同的文件
      if (!exitSame) {
        setUpfile([...upfile, ...acceptedFiles]);
      } else {
        CommonTip.error(L('DoNotSameFile'));
      }
    },
    [upfile, fileSize, files]
  );
  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  // 移除本地上传的文件
  const removeFile = (e, index) => {
    e.stopPropagation();
    upfile.splice(index, 1);
    setUpfile([...upfile]);
  };

  // 点击返回按钮
  const handleClickCancel = () => {
    history.goBack();
  };
  // 验证模板名是存在
  const checkedMoudleExit = async (e) => {
    // 未输入直接返回
    if (formik.values.mouldName === '') return;
    // 编辑时的名字可以跟原来的一样
    if (formik.values.mouldName === currentSubjectName) return;
    formik.handleBlur(e);
    const res = await API.templateIsExit(formik.values.mouldName);
    if (res?.data?.code === 204) {
      formik.setFieldError('mouldName', L('subjectAlreadyExists'));
    }
  };

  // 提交前再走一次校验，否则网很慢时候会有问题
  const checkedMoudleExitSubmit = async () => {
    // 编辑时俩个文件相同就直接允许提交
    if (formik.values.mouldName === currentSubjectName || formik.values.mouldName === '') {
      formik.handleSubmit();
      return;
    }
    // 否则发请求校验
    const res = await API.templateIsExit(formik.values.mouldName);
    if (res?.data?.code !== 204) {
      formik.handleSubmit();
    } else if (res?.data?.code === 204) {
      formik.setFieldError('mouldName', L('subjectAlreadyExists'));
    }
  };

  // s点击删除图标的点击事假
  const deleteServerFile = (e, item) => {
    e.stopPropagation();
    setpenDeleteDialog(true);
    setdeleteObj(item);
  };
  // 删除服务器上的文件对话框确认事件
  const handleConfirm = async () => {
    const res = await API.deleteFile(deleteObj?.id || '');
    handleClose();
    if (res?.data?.code === 200) {
      CommonTip.success(L('SuccessfullyDeleted'));
      // 删除成功后重新获取数据;
      const res = await API.searchTemplateById(id);
      if (res?.data?.data) {
        const { files = [] } = res.data.data;
        setFiles(files);
      }
    } else {
      CommonTip.error(L('FailedDeleted'));
    }
  };

  // 删除文件对话框取消事件
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
              {/* 附件上传 */}
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
                    {/* 已存服务器的文件列表 */}
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
                    {/* 刚刚上传的文件 */}
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
                {/* 是否加急checkbox */}
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
                {/* 保存返回按钮 */}
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
            {/* 富文本编辑器 */}
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
      {/* 删除对话框 */}
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
