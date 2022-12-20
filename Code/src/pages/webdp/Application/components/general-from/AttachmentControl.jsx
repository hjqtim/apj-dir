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
import useTitleProps from '../../../../../models/webdp/PropsModels/useTitleProps';
import FormControlProps from '../../../../../models/webdp/PropsModels/FormControlProps';
import {
  removeAttachment,
  updateAttachments,
  setFiles
} from '../../../../../redux/webDP/webDP-actions';
import useWebDPColor from '../../../../../hooks/webDP/useWebDPColor';
import fileAPI from '../../../../../api/file/file';
import WarningDialog from '../../../../../components/WarningDialog';
import CommonTip from '../../../../../components/CommonTip';
import { uploadFileCheck } from '../../../../../utils/auth';
import downBySharedDisk from '../../../../../utils/downBySharedDisk';

const AttachmentControl = () => {
  const files = useSelector((state) => state.webDP.fileAttachment);
  const viewOnly = useSelector((state) => state.webDP.viewOnly);
  const error = useSelector((state) => state.webDP.error.fileAttachment);
  const color = useWebDPColor();
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false); // open delete dialog
  const [deleteObj, setDeleteObj] = useState({}); // delete object

  const addFile = (e) => {
    if (e.currentTarget.files.length !== 0) {
      if (uploadFileCheck(e.target.files[0])) dispatch(updateAttachments(e.target.files[0]));
    }
  };

  const TitleProps = useTitleProps();
  const TableHeadStyle = {
    style: { color, fontWeight: 'bold' }
  };
  const removeAttachmentHandler = (e, fileItem) => {
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

  const handleConfirm = () => {
    fileAPI.deleteFile(deleteObj.id).then((res) => {
      if (res?.data?.code === 200) {
        CommonTip.success('The file has been remotely deleted');
        const newFiles = files?.filter((fileItem) => fileItem.id !== deleteObj.id);
        dispatch(setFiles(newFiles));
        handleClose();
      }
    });
  };

  return (
    <>
      <Grid {...TitleProps}>
        <Typography variant="h6">
          <strong>File Attachment (Optional)</strong>
        </Typography>
      </Grid>
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
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {files.map((row, index) => (
                <TableRow
                  key={row.name}
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
                      <IconButton onClick={() => downBySharedDisk(row.fileUrl)}>
                        <GetAppIcon fontSize="small" color="primary" />
                      </IconButton>
                    )}

                    <IconButton
                      id={`${index}-removeAttactment`}
                      color="primary"
                      size="small"
                      aria-label="upload picture"
                      component="span"
                      disabled={viewOnly}
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
          disabled={viewOnly}
        >
          {files.length > 0 ? 'Add More' : 'Upload File'}
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
    </>
  );
};

export default AttachmentControl;
