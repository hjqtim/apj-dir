import React, { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
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
import _ from 'lodash';
import GetAppIcon from '@material-ui/icons/GetApp';
import { useParams } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import CloseIcon from '@material-ui/icons/Close';
import DescriptionIcon from '@material-ui/icons/Description';
import useTitleProps from '../../../../models/webdp/PropsModels/useTitleProps';
// import SubmitButton from '../../../../components/Webdp/SubmitButton';
import useWebdpColor from '../../../../hooks/webDP/useWebDPColor';
import API from '../../../../api/file/file';
import { CommonTip, Loading } from '../../../../components';
import downBySharedDisk from '../../../../utils/downBySharedDisk';
import { setNetworkDesignFiles } from '../../../../redux/myAction/my-action-actions';

const NetworkDesignUpload = () => {
  const dispatch = useDispatch();
  const requestForm = useSelector((state) => state.myAction.requestForm);
  const { isN3, isN4, isN5 } = requestForm || {};
  const currentUser = useSelector((state) => state.userReducer.currentUser);
  const files = useSelector((state) => state.myAction.networkDesignFiles);
  const { requestId } = useParams();
  const readOnly = useSelector((state) => state.myAction.requestForm?.readOnly) || false;
  const isCancel = useSelector((state) => state.myAction.requestForm?.isCancel) || false;
  const isPending = useSelector((state) => state.myAction.requestForm?.isPending) || false;
  const dprequeststatusno = useSelector(
    (state) => state.myAction.requestForm?.dpRequest?.dprequeststatusno
  );

  const setFiles = (fileArray) => {
    dispatch(setNetworkDesignFiles(fileArray || []));
  };

  // drag & drop files function
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
      'image/jpeg, image/jpg, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel, application/vnd.ms-powerpoint, application/vnd.openxmlformats-officedocument.presentationml.presentation	'
  });

  const TitleProps = useTitleProps();
  const TableHeadStyle = {
    style: { fontWeight: 'bold' }
  };

  const removeAttachmentHandler = async (index) => {
    // find the target file from the file array
    const currentFile = files.find((_, idx) => idx === index);
    // only remove the file in server which has the id field
    if (currentFile?.id) {
      // delete the file from server
      const deleteResult = await API.deleteFile(currentFile.id);
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
    try {
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
              groupType: 'netWorkDesign',
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
      Loading.show();
      const uploadResult = await API.webDPuploadFile(formData);
      if (uploadResult.data.code === 200) {
        CommonTip.success(
          `${
            files.length < 2
              ? `${files.length}file has been uploaded`
              : `${files.length}files have been uploaded`
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

    if (dprequeststatusno === 160 || dprequeststatusno === 112) {
      return true;
    }

    if ((isN3 || isN4 || isN5) && dprequeststatusno >= 41 && dprequeststatusno !== 102) {
      return false;
    }

    return true;
  };

  const getButtonDisabled = () => {
    if (readOnly || dprequeststatusno === 102 || isCancel || isPending) {
      return true;
    }

    if (dprequeststatusno === 160 || dprequeststatusno === 112) {
      return true;
    }

    const hasFile = files?.find((item) => !item.id); // 没有上传到服务器的文件
    if (!hasFile) {
      return true;
    }

    if ((isN3 || isN4 || isN5) && dprequeststatusno >= 41) {
      return false;
    }

    return true;
  };

  return (
    <>
      <Grid {...TitleProps}>
        <Typography variant="h6">
          <strong style={{ color: useWebdpColor().title }}>Upload Network Design</strong>
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
          alignItems: 'center'
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
              File types: jpg / xls / ppt
            </FormHelperText>
          </Grid>
        </Grid>
      </div>
      {/* <Grid container>
          <Grid item xs={12}>
            {isDragAccept && (
              <p style={{ backgroundColor: 'green', color: '#fff', padding: '5px 10px' }}>
                All files will be accepted
              </p>
            )}
            {isDragReject && (
              <p style={{ backgroundColor: '#ccc', padding: '5px 10px' }}>
                Some files will be rejected
              </p>
            )}
          </Grid>
        </Grid> */}
      {files?.length > 0 && (
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
                    {row.name}
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
      {/* <Grid item lg={12}>
        <Button
          variant="contained"
          component="label"
          size="small"
          style={{ marginRight: '1rem', marginBottom: '0.5rem', fontWeight: 'bold' }}
        >
          {files.length > 0 ? 'Add More' : 'Select File'}
          <input type="file" hidden onChange={addFile} />
        </Button>
        <Typography variant="body2" color={error ? 'secondary' : 'primary'}>
          The total file size of one request should not be larger than 10MB.
        </Typography>
      </Grid> */}
      <Grid item style={{ marginTop: '0.5rem' }} lg={12}>
        {/* <SubmitButton
          label="Upload"
          submitLabel="Confirm"
          title="Upload Network Design"
          message="The selected files will be uploaded, are you sure to continue?"
          submitAction={submitHandler}
          disabled={getButtonDisabled()}
        /> */}

        <Button
          variant="contained"
          color="primary"
          size="small"
          onClick={submitHandler}
          disabled={getButtonDisabled()}
        >
          Confirm
        </Button>
      </Grid>
    </>
  );
};

export default NetworkDesignUpload;
