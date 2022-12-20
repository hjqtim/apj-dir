import React, { useState, forwardRef } from 'react';
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Slide
} from '@material-ui/core';
import CheckIcon from '@material-ui/icons/Check';
import CancelIcon from '@material-ui/icons/Cancel';
import SaveIcon from '@material-ui/icons/Save';
import useWebDPColor from '../../../../hooks/webDP/useWebDPColor';

const Transition = forwardRef((props, ref) => <Slide direction="up" ref={ref} {...props} />);

const N3Button = (props) => {
  const { handleCompleteRequest, handleCancelRequest, handleSaveRequest } = props.toProps;
  const [open, setOpen] = useState(false);
  const [dialogTitle, setDialogTitle] = useState();
  const [dialogContent, setDialogContent] = useState();
  const [dialogSureBtnName, setDialogSureBtnName] = useState();
  const [sureDoBtnValue, setSureDoBtnValue] = useState();
  console.log('sureDoBtnValue: ', sureDoBtnValue);

  // const handleClickOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const webDPColor = useWebDPColor();

  const handleDialogSure = (e) => {
    e.preventDefault();
    setOpen(false);
    if (dialogSureBtnName === 'Complete') {
      handleCompleteRequest();
    }
    if (dialogSureBtnName === 'Reject') {
      handleCancelRequest();
    }
  };

  const setDialog = (v) => {
    console.log('setDialog', v);
    setSureDoBtnValue(v);
    if (v === '1') {
      setDialogTitle('Complete this request');
      setDialogContent('The request will be completed, are you sure to continue ?');
      setDialogSureBtnName('Complete');
    }
    if (v === '2') {
      setDialogTitle('Reject this request');
      setDialogContent('The request will be rejected, are you sure to continue ?');
      setDialogSureBtnName('Reject');
    }
    setOpen(true);
  };

  return (
    <>
      <Button
        variant="contained"
        color="primary"
        startIcon={<CheckIcon />}
        style={{ fontWeight: 'bold', backgroundColor: webDPColor, color: 'white' }}
        onClick={() => setDialog('1')}
      >
        Process/Complete This Request
      </Button>
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle
          style={{
            backgroundColor: webDPColor.title,
            color: 'white'
          }}
        >
          {dialogTitle}
        </DialogTitle>
        <DialogContent>
          <DialogContentText
            sid="alert-dialog-slide-description"
            style={{ color: webDPColor.typography }}
          >
            {dialogContent}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            type="submit"
            variant="contained"
            size="small"
            style={{ backgroundColor: webDPColor.title, color: 'white', fontWeight: 'bold' }}
            onClick={handleDialogSure}
          >
            {dialogSureBtnName}
          </Button>
          <Button variant="outlined" size="small" onClick={handleClose}>
            <strong>Cancel</strong>
          </Button>
        </DialogActions>
      </Dialog>

      <Button
        variant="contained"
        color="primary"
        startIcon={<CancelIcon />}
        style={{
          marginLeft: '1rem',
          fontWeight: 'bold',
          backgroundColor: webDPColor,
          color: 'white'
        }}
        onClick={() => setDialog('2')}
      >
        Reject This Request
      </Button>

      <Button
        variant="contained"
        color="primary"
        startIcon={<SaveIcon />}
        style={{
          marginLeft: '1rem',
          fontWeight: 'bold',
          backgroundColor: webDPColor,
          color: 'white'
        }}
        onClick={handleSaveRequest}
      >
        Save This Request
      </Button>
    </>
  );
};

export default N3Button;
