import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Grid, Typography, Button, IconButton } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import GetAppIcon from '@material-ui/icons/GetApp';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import _ from 'lodash';

import { useParams } from 'react-router';
import useTitleProps from '../../../../../models/webdp/PropsModels/useTitleProps';
import useWebDPColor from '../../../../../hooks/webDP/useWebDPColor';
import FormControlProps from '../../../../../models/webdp/PropsModels/FormControlProps';

import envUrl from '../../../../../utils/baseUrl';
import envPrefix from '../../../../../utils/prefix';
// import { getDayNumber } from '../../../../../utils/date';

import {
  setFiles,
  removeAttachment,
  updateAttachments
} from '../../../../../redux/NetworkMeeting/Action';
import fileAPI from '../../../../../api/file/file';
import WarningDialog from '../../../../../components/WarningDialog';
import CommonTip from '../../../../../components/CommonTip';
import { uploadFileCheck } from '../../../../../utils/auth';
// import downBySharedDisk from '../../../../../utils/downBySharedDisk';

const AttachmentControl = (props) => {
  const { toSave } = props;
  const TitleProps = useTitleProps();
  const webdpColor = useWebDPColor();

  const dispatch = useDispatch();
  const filesList = useSelector((state) => state.networkMeeting?.fileAttachment);
  console.log('filesList', filesList);
  const resourceStatus = useSelector((state) => state.networkMeeting.resourceStatus); // state 来判断 流程的进度
  const error = useSelector((state) => state.networkMeeting?.error?.fileAttachment);

  const { requestNo } = useParams();
  const orderStatus = useParams().status;

  const [open, setOpen] = useState(false); // open delete dialog
  const [deleteObj, setDeleteObj] = useState({}); // delete object

  const addFile = (e) => {
    // if (e.currentTarget.files.length !== 0) {
    //   if (uploadFileCheck(e.target.files[0])) {
    //     uploadFile(e.target.files);
    //   }
    // }

    if (e.currentTarget.files.length !== 0) {
      if (uploadFileCheck(e.target.files[0])) dispatch(updateAttachments(e.target.files[0]));
    }
  };

  // 上传文件
  // const uploadFile = (files) => {
  //   const formData = new FormData();
  //   const name = files?.[0].name;
  //   const size = files?.[0].size;
  //   formData.append('file', files?.[0]);
  //   formData.append(
  //     'resumeFile',
  //     new Blob(
  //       [
  //         JSON.stringify({
  //           requestNo: getDayNumber(),
  //           projectName: 'ResourceMX'
  //         })
  //       ],
  //       {
  //         type: 'application/json'
  //       }
  //     )
  //   );
  //   fileAPI
  //     .webDPuploadFile(formData)
  //     .then((res) => {
  //       const resData = res?.data?.data || [];
  //       const count = _.countBy(resData?.[0]?.fileUrl)['/'];
  //       let arr = resData?.[0]?.fileUrl.split('/');
  //       const id = resData?.[0]?.id;
  //       const fileName = arr?.[arr.length - 1];
  //       arr = arr?.splice(0, count);
  //       const dir = arr?.join('/');
  //       // const isProd = envUrl?.file?.indexOf('inbound') !== -1;
  //       // let path = '';
  //       // if (isProd) {
  //       //   path = `${envUrl.file}/file/resumeFile/previewFile?remoteDir=${dir}/&remoteFile=${fileName}`;
  //       // } else {
  //       //   path = `${envUrl.file}/resumeFile/previewFile?remoteDir=${dir}/&remoteFile=${fileName}`;
  //       // }
  //       const downLoadPath = `${envUrl.file}${envPrefix.file}/resumeFile/downloadFile?remoteDir=${dir}/&remoteFile=${fileName}`;
  //       console.log('webDPuploadFile', name, size, downLoadPath);
  //       const obj = {};
  //       obj.id = id;
  //       obj.name = name;
  //       obj.size = size;
  //       obj.fileUrl = downLoadPath;
  //       const status = dispatch(updateAttachments(obj));
  //       console.log('status', status);
  //       if (resourceStatus) {
  //         setTimeout(() => {
  //           let temp = _.cloneDeep(filesList);
  //           temp = [...temp, obj];
  //           console.log('files', filesList);

  //           let temp2 = [];
  //           temp.forEach((element) => {
  //             const string = JSON.stringify(element);
  //             temp2 = [...temp2, string];
  //           });
  //           toSave(_, 'files', temp2);
  //         }, 200);
  //       }
  //     })
  //     .finally(() => {});
  // };

  const TableHeadStyle = {
    style: { webdpColor, fontWeight: 'bold' }
  };

  // 移除文件
  const removeAttachmentHandler = (e, fileItem) => {
    console.log(e, fileItem);
    if (fileItem?.id) {
      setDeleteObj(fileItem);
      setOpen(true);
    } else {
      dispatch(removeAttachment(e));
    }
  };

  const handleClose = () => {
    setOpen(false);
    setTimeout(() => {
      setDeleteObj({});
    }, 200);
  };

  // 问询删除
  const handleConfirm = () => {
    handleClose();
    fileAPI.deleteFile(deleteObj.id).then((res) => {
      if (res?.data?.code === 200) {
        CommonTip.success('The file has been remotely deleted');
        const newFiles = filesList?.filter((fileItem) => fileItem.id !== deleteObj.id);
        dispatch(setFiles(newFiles));
        if (resourceStatus) {
          setTimeout(() => {
            toSave(_, 'files', newFiles);
          }, 200);
        }
      }
      if (res?.data?.code === 400) {
        const newFiles = filesList?.filter((fileItem) => fileItem.id !== deleteObj.id);
        dispatch(setFiles(newFiles));
        if (resourceStatus) {
          setTimeout(() => {
            if (newFiles.length > 0) {
              let tempArr = [];
              newFiles.forEach((el) => {
                const string = JSON.stringify(el);
                tempArr = [...tempArr, string];
              });
              toSave(_, 'files', tempArr);
            } else {
              toSave(_, 'files', []);
            }
          }, 200);
        }
      }
    });
  };

  return (
    <>
      <Grid container>
        <Grid {...TitleProps}>
          <Typography variant="h6" style={{ color: webdpColor.title }}>
            <strong>File Attachment (Optional)</strong>
          </Typography>
        </Grid>
        {filesList.length > 0 && (
          <TableContainer component={Paper} style={{ marginBottom: '0.5rem' }}>
            <Table size="small" aria-label="a dense table">
              <TableHead>
                <TableRow>
                  <TableCell {...TableHeadStyle}>File Name</TableCell>
                  <TableCell align="right" {...TableHeadStyle}>
                    File Size (KB)
                  </TableCell>
                  <TableCell align="right" {...TableHeadStyle}>
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {filesList.map((row, index) => (
                  <TableRow
                    key={index}
                    hover
                    // style={{ backgroundColor: row.id && !viewOnly ? 'rgba(82,196,26,0.2)' : '' }}
                  >
                    <TableCell component="th" scope="row" width="60%">
                      {row.name}
                    </TableCell>
                    <TableCell align="right" width="20%">
                      {Math.round(row.size / 1024)} KB
                    </TableCell>
                    <TableCell align="right" width="20%">
                      {row.id && (
                        <IconButton
                          onClick={() => {
                            const path = row.fileUrl;
                            const dir = path.substring(1, path.lastIndexOf?.('/'));
                            const downLoadPath = `${envUrl.file}${envPrefix.file}/resumeFile/downloadFile?remoteDir=${dir}/&remoteFile=${row.name}`;

                            console.log('downLoadPath', dir, downLoadPath);
                            fetch(downLoadPath)
                              .then((res) => res.blob())
                              .then((blob) => {
                                // 将链接地址字符内容转变成blob地址
                                const a = document.createElement('a');
                                a.href = URL.createObjectURL(blob);
                                // 测试链接console.log(a.href)
                                a.download = `${row.name}`; // 下载文件的名字
                                document.body.appendChild(a);
                                a.click();
                              });
                          }}
                        >
                          <GetAppIcon fontSize="small" color="primary" />
                        </IconButton>
                      )}

                      <IconButton
                        id={`${index}-removeAttactment`}
                        color="primary"
                        size="small"
                        aria-label="upload picture"
                        component="span"
                        disabled={
                          (resourceStatus === 'detailSubmited' && !requestNo) ||
                          orderStatus === 'detail' ||
                          resourceStatus === 'detailApproved' ||
                          resourceStatus === 'detailDone'
                        }
                        onClick={(e) => removeAttachmentHandler(e, row)}
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
        <Grid {...FormControlProps} lg={12}>
          <Button
            variant="contained"
            color="primary"
            component="label"
            size="small"
            style={{ marginRight: '1rem', marginBottom: '0.5rem', fontWeight: 'bold' }}
            disabled={
              (resourceStatus === 'detailSubmited' && !requestNo) ||
              orderStatus === 'detail' ||
              resourceStatus === 'detailApproved' ||
              resourceStatus === 'detailDone'
            }
          >
            {filesList.length > 0 ? 'Add More' : 'Upload File'}
            <input type="file" hidden onChange={addFile} />
          </Button>
          <Typography variant="body2" color={error ? 'secondary' : 'primary'}>
            The total file size of one request should not be larger than 10MB.
          </Typography>
        </Grid>

        <WarningDialog
          open={open}
          handleConfirm={handleConfirm}
          handleClose={handleClose}
          content={`Are you sure you want to delete file ${deleteObj.name} on the remote`}
        />
      </Grid>
    </>
  );
};

export default AttachmentControl;
