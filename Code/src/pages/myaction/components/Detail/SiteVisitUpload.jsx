import React, { useState, useCallback, useEffect, memo } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  Grid,
  Typography,
  Paper,
  IconButton,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  FormHelperText,
  Button
} from '@material-ui/core';
import { useDropzone } from 'react-dropzone';
import _ from 'lodash';
import GetAppIcon from '@material-ui/icons/GetApp';
import CloseIcon from '@material-ui/icons/Close';
import DescriptionIcon from '@material-ui/icons/Description';
import useTitleProps from '../../../../models/webdp/PropsModels/useTitleProps';
import useWebdpColor from '../../../../hooks/webDP/useWebDPColor';
// import SubmitButton from '../../../../components/Webdp/SubmitButton';
import fileAPI from '../../../../api/file/file';
import API from '../../../../api/myAction';
import downBySharedDisk from '../../../../utils/downBySharedDisk';
import { CommonTip, Loading } from '../../../../components';
import WebdpTextField from '../../../../components/Webdp/WebdpTextField';

const SiteVisitUpload = () => {
  const [files, setFiles] = useState([]);
  // const formType = useSelector((state) => state.webDP.formType);
  const currentUser = useSelector((state) => state.userReducer.currentUser);
  // const readOnly = useSelector((state) => state.myAction.readOnly);
  const readOnly = useSelector((state) => state.myAction.requestForm?.readOnly) || false;
  const isCancel = useSelector((state) => state.myAction.requestForm?.isCancel) || false;
  const isPending = useSelector((state) => state.myAction.requestForm?.isPending) || false;
  const dprequeststatusno = useSelector(
    (state) => state.myAction.requestForm?.dpRequest?.dprequeststatusno
  );
  const requestForm = useSelector((state) => state.myAction.requestForm);
  const { isN3, isN4, isN5 } = requestForm || {};
  const { requestId } = useParams();
  const TitleProps = useTitleProps();
  const TableHeadStyle = {
    style: { fontWeight: 'bold' }
  };

  // get the uploaded file from file service
  const getFiles = async () => {
    const getFileResult = await fileAPI.getRequestFileList(requestId);
    if (getFileResult.data.code === 200) {
      const { siteVisitReportList } = getFileResult?.data.data;
      const tempFiles = siteVisitReportList.map((item) => ({
        name: item.fileName,
        size: item.fileSize,
        fileUrl: item.fileUrl,
        id: item.id
      }));
      if (tempFiles.length > 0) setFiles(tempFiles);
    }
  };

  useEffect(() => {
    // page onload call get files show the uploaded file
    getFiles();
  }, []);

  const onDrop = useCallback(
    (acceptedFiles, rejectFiles) => {
      if (acceptedFiles) {
        // pending to add file renmae logic
        const notInFiles = acceptedFiles.filter((af) => !files.find((f) => f.name === af.name));
        if (notInFiles.length > 0) {
          setFiles([...files, ...notInFiles]);
        }
      }
      // have files had rejected
      if (rejectFiles.length > 0) {
        // declare empty for append file names
        let rejectFilesName = '';

        // for each file, add the name to rejectFilesName
        rejectFiles.forEach((item, idx) => {
          if (idx === 0) {
            rejectFilesName += `"${item.file.name}"`;
          } else {
            rejectFilesName += `, "${item.file.name}"`;
          }
        });
        // show Error Tips with files name
        const isExitTooLarge = rejectFiles?.find(
          (item) => !_.isUndefined(item?.errors?.find((i) => i?.code === 'file-too-large'))
        );
        const invalidType = rejectFiles?.find(
          (item) => !_.isUndefined(item?.errors?.find((i) => i?.code === 'file-invalid-type'))
        );
        if (isExitTooLarge) CommonTip.error(`Do not upload files larger than 10 MB.`);
        if (invalidType) CommonTip.error(`File type for [${rejectFilesName}] is invalid`);
      }
    },
    [files]
  );

  const { getRootProps, getInputProps } = useDropzone({
    maxSize: 1024 * 1024 * 10,
    onDrop,
    accept:
      'image/jpeg, image/jpg, application/pdf, application/msword, application/vnd.openxmlformats-officedocument.wordprocessingml.document, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel, application/vnd.ms-powerpoint, application/vnd.openxmlformats-officedocument.presentationml.presentation,application/zip,application/x-7z-compressed'
  });

  const removeAttachmentHandler = async (index) => {
    // find the target file from the file array
    const currentFile = files.find((_, idx) => idx === index);
    // only remove the file in server which has the id field
    if (currentFile?.id) {
      // delete the file from server
      const deleteResult = await fileAPI.deleteFile(currentFile.id);
      // if successful
      if (deleteResult.data.code === 200) {
        await CommonTip.success(`${currentFile.name} has been deleted`);
        // remove file from state
        const filteredFiles = files.filter((item, idx) => index !== idx);
        setFiles(filteredFiles);
      }
    } else {
      // if file is not on the server, remove it from the state directly
      const filteredFiles = files.filter((item, idx) => index !== idx);
      setFiles(filteredFiles);
    }
  };

  const submitHandler = async () => {
    // declare form data for my action API
    try {
      Loading.show();
      // declare files form data
      const formData = new FormData();

      // add file to formData
      files.forEach((file) => {
        if (file && !file.id) {
          // if have id, has been uploaded
          formData.append('file', file);
        }
      });

      // add params to formData
      formData.append(
        'resumeFile',
        new Blob(
          [
            JSON.stringify({
              groupType: 'siteVisitReport',
              requestNo: requestId,
              requesterId: currentUser.id,
              projectName: 'webDP'
            })
          ],
          {
            type: 'application/json'
          }
        )
      );

      const uploadResult = await fileAPI.webDPuploadFile(formData);

      // 如果流程节点为31时，上传文件后要推进流程，否则只上传文件不推进流程
      if (uploadResult.data.code === 200 && dprequeststatusno === 31) {
        const result = await API.siteVisitReport(requestId);
        if (result.data.code === 200) {
          CommonTip.success(
            `${
              files.length < 2
                ? `${files.length} file has been uploaded`
                : `${files.length} files have been uploaded`
            }`
          );
          setTimeout(() => {
            window.location.reload();
          }, 2000);
        }
      } else if (uploadResult.data.code === 200 && dprequeststatusno > 31) {
        CommonTip.success(
          `${
            files.length < 2
              ? `${files.length} file has been uploaded`
              : `${files.length} files have been uploaded`
          }`
        );

        setTimeout(() => {
          window.location.reload();
        }, 2000);
      }
    } catch (error) {
      console.log(error);
    }
    Loading.hide();
  };

  const getFormDisabled = () => {
    if (readOnly || isCancel || isPending) {
      return true;
    }

    if (dprequeststatusno === 102 || dprequeststatusno === 160) {
      return true;
    }

    if (dprequeststatusno >= 31) {
      if (isN3 || isN4 || isN5) {
        return false;
      }
    }

    return true;
  };

  const getButtonDisabled = () => {
    const hasFileUpload = files.find((item) => !item.id); // 是否有文件需要上传，有id的不需要再次上传
    if (!hasFileUpload) {
      return true;
    }

    return getFormDisabled();
  };

  return (
    <>
      <Grid {...TitleProps}>
        <Typography variant="h6">
          <strong style={{ color: useWebdpColor().title }}>Upload Site Visit Report</strong>
        </Typography>
      </Grid>
      <div
        {...getRootProps()}
        style={{
          width: '100%',
          border: '4px dashed #AAAAAA',
          padding: '2rem 1rem',
          borderRadius: '5px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          marginTop: '0.5rem'
        }}
      >
        <input {...getInputProps()} disabled={getFormDisabled()} />
        <Grid container>
          <Grid item xs={12}>
            <Typography variant="h5" align="center" color="textSecondary">
              Drag and drop file here, or click to select files
            </Typography>
          </Grid>
          <Grid item xs={12} style={{ textAlign: 'center' }}>
            <Typography variant="h5" align="center" color="textSecondary">
              <DescriptionIcon fontSize="large" />
            </Typography>
            <FormHelperText style={{ textAlign: 'center', fontSize: '0.8rem' }}>
              File types: pdf / jpg / doc docx / xls / xlsx / ppt pptx / 7zip
            </FormHelperText>
          </Grid>
        </Grid>
      </div>

      {files.length > 0 && (
        <TableContainer component={Paper} style={{ marginBottom: '0.5rem' }}>
          <Table size="small" aria-label="a dense table">
            <TableHead>
              <TableRow>
                <TableCell {...TableHeadStyle}>File Name</TableCell>
                <TableCell align="right" {...TableHeadStyle}>
                  File Size (KB)
                </TableCell>
                <TableCell align="right" {...TableHeadStyle}>
                  Remove
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {files.map((row, index) => (
                <TableRow key={row.name} hover>
                  <TableCell component="th" scope="row" width="60%">
                    <WebdpTextField label="File name" value={row.name} disabled />
                  </TableCell>
                  <TableCell align="right" width="20%">
                    {Math.round(row.size / 1024)} KB
                  </TableCell>
                  <TableCell align="right" width="20%">
                    {row.id && (
                      <IconButton onClick={() => downBySharedDisk(row.fileUrl)}>
                        <GetAppIcon fontSize="small" color="primary" />
                      </IconButton>
                    )}

                    <IconButton
                      id={`${index}-removeAttactment`}
                      color="primary"
                      size="small"
                      aria-label="upload"
                      component="span"
                      disabled={getFormDisabled()}
                      onClick={() => removeAttachmentHandler(index)}
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

      <Grid item style={{ marginTop: '0.5rem' }} lg={12}>
        <Button
          variant="contained"
          color="primary"
          size="small"
          onClick={submitHandler}
          disabled={getButtonDisabled()}
        >
          Upload
        </Button>
      </Grid>
    </>
  );
};

export default memo(SiteVisitUpload);
