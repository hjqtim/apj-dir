import React, { useState, useCallback } from 'react';
import * as Yup from 'yup';
import _ from 'lodash';
import { useFormik } from 'formik';
import { useDropzone } from 'react-dropzone';
import CloseIcon from '@material-ui/icons/Close';
import DescriptionIcon from '@material-ui/icons/Description';
import {
  Grid,
  TextField,
  makeStyles,
  Typography,
  TableContainer,
  Table,
  Paper,
  IconButton,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  CircularProgress,
  Tooltip
} from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';

import { CommonTip, CommonDialog } from '../../../../../components';
import Loading from '../../../../../components/Loading';
import API from '../../../../../api/email/templateManage';
import WebdpAPI from '../../../../../api/webdp/webdp';
import { L } from '../../../../../utils/lang';
import { validEmail } from '../../../../../utils/tools';

const useStyles = makeStyles((theme) => ({
  root: {
    padding: '20px',
    '& .accessoryBox:hover': {
      background: 'red'
    }
  },

  recipientStyle: {
    maxHeight: '96px',
    overflowY: 'auto',
    '& .MuiFormControl-root.MuiTextField-root.MuiFormControl-fullWidth': {
      marginTop: theme.spacing(2)
    }
  },
  accessoryBox: (props) => ({
    width: '100%',
    height: '100px ',
    overflowY: 'auto',
    borderRadius: '5px',
    textAlign: 'center',
    border: `3px dashed ${!props?.error ? '#ccc' : '#f44336'}`,
    '&:hover': {
      border: `3px dashed ${!props?.error ? theme.palette.primary.main : '#f44336'} `
    }
  }),
  uploadTip: {
    fontWeight: 700,
    padding: theme.spacing(0, 2),
    fontSize: '0.8rem',
    color: '#FFB649'
  },
  dragDropContent: () => ({
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    // justifyContent: props?.files?.length === 0 ? 'center' : 'start',
    padding: theme.spacing(2)
  })
}));

export default function SendEmailDialog({ setOpenEmail, openEmail, txCodes, params, setParams }) {
  const [supfileMemo, setMemoUpfile] = useState([]);
  const [upfileSummary, setSummaryUpfile] = useState([]);
  const [upfileRelated, setRelatedUpfile] = useState([]);
  const [RecipientOptions, setRecipientOptions] = useState([]);
  const [cCOptions, setCCOptions] = useState([]);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingCC, setLoadingCC] = useState(false);
  const classes = useStyles({ error });

  // Maximum limitation of upload file
  const fileSize = 10 * 1024 * 1024;

  // Add file function
  const onDrop = useCallback(
    (...args) => {
      // flag标志哪种文件
      // 1:Signed Funding Transfer Memo
      // 2:Summary
      // 3：Related AP/DP REQ PDF
      const flag = args?.[3];
      const acceptedFiles = args?.[0];
      const filesName = _.map([...supfileMemo, ...upfileSummary, ...upfileRelated], 'name');
      //
      let exitSame = false;

      let overSize = false;

      acceptedFiles.forEach((item) => {
        if (filesName.indexOf(item.name) !== -1) {
          exitSame = true;
        } else if (item.size > fileSize) {
          overSize = true;
        }
      });
      // can't upload the same file
      if (exitSame) {
        CommonTip.error(L('DoNotSameFile'));
        return;
      }
      // The file cannot exceed 10m
      if (overSize) {
        CommonTip.error(L('DoNotUuploadLargerThan10MB'));
        return;
      }

      if (acceptedFiles.length > 0) setError(false);

      if (flag === 1) {
        if (supfileMemo.length) {
          CommonTip.error('Only one file of each type is accepted.');
          return;
        }
        setMemoUpfile(acceptedFiles);
      } else if (flag === 2) {
        if (upfileSummary.length) {
          CommonTip.error('Only one file of each type is accepted.');
          return;
        }
        setSummaryUpfile(acceptedFiles);
      } else if (flag === 3) {
        if (upfileRelated.length) {
          CommonTip.error('Only one file of each type is accepted.');
          return;
        }
        setRelatedUpfile(acceptedFiles);
      }
    },
    [supfileMemo, upfileSummary, upfileRelated, fileSize]
  );

  const onDropRejected = (errorsArr) => {
    let errMsg = [];
    errorsArr.forEach((item) => {
      errMsg = [...errMsg, item?.errors?.[0]?.code];
    });
    if (errMsg.includes('too-many-files'))
      CommonTip.error('Only one file of each type is accepted.');
  };
  const { getRootProps, getInputProps } = useDropzone({
    onDrop: (a, b, c) => onDrop(a, b, c, 1),
    maxFiles: 1,
    onDropRejected,
    accept: '.jpeg,.jpg,png,.xls,.xlsx,.pdf,.doc,.ppt'
  });
  const { getRootProps: getRootProps2, getInputProps: getInputProps2 } = useDropzone({
    onDrop: (a, b, c) => onDrop(a, b, c, 2),
    maxFiles: 1,
    onDropRejected,
    accept: '.jpeg,.jpg,png,.xls,.xlsx,.pdf,.doc,.ppt'
  });
  const { getRootProps: getRootProps3, getInputProps: getInputProps3 } = useDropzone({
    onDrop: (a, b, c) => onDrop(a, b, c, 3),
    maxFiles: 1,
    onDropRejected,
    accept: '.jpeg,.jpg,png,.xls,.xlsx,.pdf,.doc,.ppt'
  });

  const formik = useFormik({
    initialValues: {
      txCode: '',
      recipient: [],
      cc: []
    },
    // Form validation
    validationSchema: Yup.object({
      txCode: Yup.string().required(),
      recipient: Yup.array().required().min(1)
    }),
    onSubmit: (values) => {
      if (supfileMemo.length === 0 && upfileSummary.length === 0 && upfileRelated.length === 0)
        return;
      handleUpload(values);
    }
  });

  // files upload
  const handleUpload = async (params) => {
    Loading.show();
    const formData = new FormData();
    const upfiles = [...supfileMemo, ...upfileSummary, ...upfileRelated];
    upfiles.forEach((fileItem) => {
      formData.append('file', fileItem);
    });
    formData.append(
      'resumeFile',
      new Blob([JSON.stringify({ projectName: 'rms', requestNo: params.txCode })], {
        type: 'application/json'
      })
    );
    API.uploadFile(formData)
      .then((res) => {
        const resData = res?.data?.data || [];
        if (res?.data?.code === 200) {
          const fileUrls = resData?.map((item) => `V:${item.fileUrl}`);
          const fileNameStr = resData?.map((item) => item.fileName).join(';');
          const fileUrlStr = fileUrls.join(';');
          handleSendEmail({
            ...params,
            fileUrlStr,
            fileNameStr,
            memoStatus: supfileMemo.length,
            summaryStatus: upfileSummary.length,
            relatedPDFStatus: upfileRelated.length
          });
        } else {
          CommonTip.error(`Failed to upload file.`);
        }
      })
      .finally(() => {
        Loading.hide();
      });
  };

  const handleSendEmail = (data) => {
    const ccMailArr = _.map(data.cc, 'mail');
    const queryData = {
      txCode: data.txCode,
      subject: 'Funding Transfer',
      attachFilePath: data.fileUrlStr,
      fileName: data.fileNameStr,
      memoStatus: data.memoStatus,
      summaryStatus: data.summaryStatus,
      relatedPDFStatus: data.relatedPDFStatus,
      toEmails: _.map(data.recipient, 'mail'),
      copyTo: ccMailArr?.join(';') || undefined
    };
    WebdpAPI.fundingTransferSendEmail(queryData)
      .then((res) => {
        if (res?.data?.code === 200) {
          CommonTip.success(L('Success.'));
          setOpenEmail(false);
          setParams({ ...params, sendEmailFlag: !params?.sendEmailFlag });
        }
      })
      .finally(() => {
        Loading.hide();
      });
  };

  // Remove the files
  const removeFile = (e, index, files, setFiles) => {
    e.stopPropagation();
    files.splice(index, 1);
    setFiles([...files]);
  };

  const checkAD = useCallback(
    _.debounce((inputValue) => {
      if (inputValue?.length >= 3 && !loading) {
        setLoading(true);
        setRecipientOptions([]);
        WebdpAPI.findUserList({ username: inputValue })
          .then((res) => {
            let newOptions = res?.data?.data || [];
            newOptions = newOptions.map((item) => ({
              id: item.mail,
              display: item.display,
              mail: item.mail
            }));
            newOptions = newOptions.filter((item) => validEmail(item?.mail));
            setRecipientOptions(newOptions);
          })
          .finally(() => {
            setLoading(false);
          }, []);
      }
    }, 800),
    [loading]
  );

  const checkADCC = useCallback(
    _.debounce((inputValue) => {
      if (inputValue?.length >= 3 && !loading) {
        setLoadingCC(true);
        setCCOptions([]);
        WebdpAPI.findUserList({ username: inputValue })
          .then((res) => {
            let newOptions = res?.data?.data || [];
            newOptions = newOptions.map((item) => ({
              id: item.mail,
              display: item.display,
              mail: item.mail
            }));
            newOptions = newOptions.filter((item) => validEmail(item?.mail));
            setCCOptions(newOptions);
          })
          .finally(() => {
            setLoadingCC(false);
          }, []);
      }
    }, 800),
    [loading]
  );

  const handleEmailChange = (e, data, filed) => {
    // Delete event
    if (data.length < formik.values?.[filed]?.length) {
      formik.setFieldValue(filed, data);
      return;
    }
    const newArr = data;
    let newValue = '';
    if (typeof newArr[newArr.length - 1] === 'string') {
      CommonTip.warning(`Please select one.`);
      return;
    }
    newValue = newArr[newArr.length - 1]?.mail;
    // If  have the same term, return
    const isExit = formik.values?.[filed].some((item) => item.mail === newValue);
    if (isExit) return;

    formik.setFieldValue(filed, newArr);
  };
  return (
    <>
      <CommonDialog
        // open
        open={openEmail}
        maxWidth="md"
        title="Send Email"
        ConfirmText="Send"
        content={
          <div className={classes.root}>
            <Grid container spacing={4}>
              {/* txCode */}
              <Grid item xs={12}>
                <Autocomplete
                  autoSelect
                  name="txCode"
                  value={formik.values.txCode}
                  options={txCodes || []}
                  onChange={(e, value) => {
                    formik.setFieldValue('txCode', value);
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      size="small"
                      variant="outlined"
                      error={Boolean(formik.errors.txCode && formik.touched.txCode)}
                      label="TX Code *"
                    />
                  )}
                />
              </Grid>

              {/* mailbox */}
              <Grid item xs={12}>
                <Autocomplete
                  multiple
                  freeSolo
                  forcePopupIcon
                  autoSelect
                  limitTags={2}
                  value={formik.values.recipient || []}
                  onChange={(e, data) => {
                    handleEmailChange(e, data, 'recipient');
                  }}
                  options={RecipientOptions || []}
                  getOptionLabel={(option) => `${option.display}`}
                  renderOption={(option) => `${option.display}---${option.mail}`}
                  renderInput={(inputParams) => (
                    <TextField
                      {...inputParams}
                      label="Recipient *"
                      variant="outlined"
                      size="small"
                      name="recipient"
                      fullWidth
                      error={Boolean(formik.errors.recipient && formik.touched.recipient)}
                      InputProps={{
                        ...inputParams.InputProps,
                        endAdornment: (
                          <>
                            {loading ? <CircularProgress size={20} color="inherit" /> : null}
                            {inputParams.InputProps.endAdornment}
                          </>
                        )
                      }}
                      onChange={(e) => {
                        checkAD(e?.target?.value || '');
                      }}
                    />
                  )}
                />
              </Grid>

              {/* copy to */}
              <Grid item xs={12}>
                <Autocomplete
                  multiple
                  freeSolo
                  forcePopupIcon
                  autoSelect
                  limitTags={2}
                  value={formik.values.cc || []}
                  onChange={(e, data) => {
                    handleEmailChange(e, data, 'cc');
                  }}
                  options={cCOptions || []}
                  getOptionLabel={(option) => `${option.display}`}
                  renderOption={(option) => `${option.display}---${option.mail}`}
                  renderInput={(inputParams) => (
                    <TextField
                      {...inputParams}
                      label="CC"
                      variant="outlined"
                      size="small"
                      name="cc"
                      fullWidth
                      error={Boolean(formik.errors.cc && formik.touched.cc)}
                      InputProps={{
                        ...inputParams.InputProps,
                        endAdornment: (
                          <>
                            {loadingCC ? <CircularProgress size={20} color="inherit" /> : null}
                            {inputParams.InputProps.endAdornment}
                          </>
                        )
                      }}
                      onChange={(e) => {
                        checkADCC(e?.target?.value || '');
                      }}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12}>
                <div {...getRootProps()} className={classes.accessoryBox}>
                  <input {...getInputProps()} />
                  <div className={classes.dragDropContent}>
                    {/* The files that have just been uploaded */}
                    {supfileMemo.length > 0 && (
                      <TableContainer component={Paper}>
                        <Table size="small">
                          <TableHead>
                            <TableRow>
                              <TableCell>File Name</TableCell>
                              <TableCell align="right">Remove</TableCell>
                            </TableRow>
                          </TableHead>

                          <TableBody>
                            {supfileMemo.map((row, index) => (
                              <TableRow key={row.name} hover>
                                <TableCell component="th" scope="row" width="850%">
                                  {row.name}
                                </TableCell>
                                <TableCell align="right" width="15%">
                                  <IconButton
                                    color="primary"
                                    size="small"
                                    component="span"
                                    onClick={(e) =>
                                      removeFile(e, index, supfileMemo, setMemoUpfile)
                                    }
                                  >
                                    <CloseIcon fontSize="small" />
                                  </IconButton>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    )}

                    {!supfileMemo.length && (
                      <>
                        <Typography variant="h5" align="center" color="textSecondary">
                          Signed Funding Transfer Memo
                        </Typography>
                        <br />
                        <Typography variant="h5" align="center" color="textSecondary">
                          <Tooltip
                            title="Drag and drop file here, or click to select files"
                            placement="left"
                          >
                            <DescriptionIcon fontSize="large" />
                          </Tooltip>
                        </Typography>
                      </>
                    )}
                  </div>
                </div>
              </Grid>
              {/* Summary */}
              <Grid item xs={12}>
                <div {...getRootProps2()} className={classes.accessoryBox}>
                  <input {...getInputProps2()} />
                  <div className={classes.dragDropContent}>
                    {/* The files that have just been uploaded */}
                    {upfileSummary.length > 0 && (
                      <TableContainer component={Paper}>
                        <Table size="small">
                          <TableHead>
                            <TableRow>
                              <TableCell>File Name</TableCell>
                              <TableCell align="right">Remove</TableCell>
                            </TableRow>
                          </TableHead>

                          <TableBody>
                            {upfileSummary.map((row, index) => (
                              <TableRow key={row.name} hover>
                                <TableCell component="th" scope="row" width="850%">
                                  {row.name}
                                </TableCell>
                                <TableCell align="right" width="15%">
                                  <IconButton
                                    color="primary"
                                    size="small"
                                    component="span"
                                    onClick={(e) =>
                                      removeFile(e, index, upfileSummary, setSummaryUpfile)
                                    }
                                  >
                                    <CloseIcon fontSize="small" />
                                  </IconButton>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    )}

                    {!upfileSummary.length && (
                      <>
                        <Typography variant="h5" align="center" color="textSecondary">
                          Summary
                        </Typography>
                        <br />
                        <Typography variant="h5" align="center" color="textSecondary">
                          <Tooltip
                            title="Drag and drop file here, or click to select files"
                            placement="left"
                          >
                            <DescriptionIcon fontSize="large" />
                          </Tooltip>
                        </Typography>
                      </>
                    )}
                  </div>
                </div>
              </Grid>
              {/*  Related AP/DP REQ PDF */}
              <Grid item xs={12}>
                <div {...getRootProps3()} className={classes.accessoryBox}>
                  <input {...getInputProps3()} />
                  <div className={classes.dragDropContent}>
                    {/* The files that have just been uploaded */}
                    {upfileRelated.length > 0 && (
                      <TableContainer component={Paper}>
                        <Table size="small">
                          <TableHead>
                            <TableRow>
                              <TableCell>File Name</TableCell>
                              <TableCell align="right">Remove</TableCell>
                            </TableRow>
                          </TableHead>

                          <TableBody>
                            {upfileRelated.map((row, index) => (
                              <TableRow key={row.name} hover>
                                <TableCell component="th" scope="row" width="850%">
                                  {row.name}
                                </TableCell>
                                <TableCell align="right" width="15%">
                                  <IconButton
                                    color="primary"
                                    size="small"
                                    component="span"
                                    onClick={(e) =>
                                      removeFile(e, index, upfileRelated, setRelatedUpfile)
                                    }
                                  >
                                    <CloseIcon fontSize="small" />
                                  </IconButton>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    )}

                    {!upfileRelated.length && (
                      <>
                        <Typography variant="h5" align="center" color="textSecondary">
                          Related AP/DP REQ PDF
                        </Typography>
                        <br />
                        <Typography variant="h5" align="center" color="textSecondary">
                          <Tooltip
                            title="Drag and drop file here, or click to select files"
                            placement="left"
                          >
                            <DescriptionIcon fontSize="large" />
                          </Tooltip>
                        </Typography>
                      </>
                    )}
                  </div>
                </div>
              </Grid>

              <Grid container justifyContent="space-between">
                <Typography className={classes.uploadTip}>
                  Note: File types: jpeg / jpg / png / xls / xlsx / pdf / doc / docx / ppt
                </Typography>
                {/* <Typography className={classes.uploadTip}>At least three files</Typography> */}
              </Grid>
            </Grid>
          </div>
        }
        handleClose={() => setOpenEmail(false)}
        handleConfirm={() => {
          if (
            supfileMemo.length === 0 &&
            upfileSummary.length === 0 &&
            upfileRelated.length === 0
          ) {
            setError(true);
          }
          formik.handleSubmit();
        }}
        isHideFooter={false}
      />
    </>
  );
}
