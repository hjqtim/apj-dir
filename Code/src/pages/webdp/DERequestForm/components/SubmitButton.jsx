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
import useWebDPColor from '../../../../hooks/webDP/useWebDPColor';

const Transition = forwardRef((props, ref) => <Slide direction="up" ref={ref} {...props} />);

const SubmitButton = (props) => {
  const { handleSubmit, handleCancel } = props.toProps;
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
    if (dialogSureBtnName === 'Submit') {
      handleSubmit();
    }
    if (dialogSureBtnName === 'Sure') {
      handleCancel();
    }
  };

  const setDialog = (v) => {
    // console.log('setDialog', v);
    setSureDoBtnValue(v);
    if (v === '1') {
      setDialogTitle('Submit this application');
      setDialogContent('The form will be submitted, are you sure to continue?');
      setDialogSureBtnName('Submit');
    }
    if (v === '2') {
      setDialogTitle('Clear this form');
      setDialogContent('The form will be Clear, are you sure to continue?');
      setDialogSureBtnName('Sure');
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
        Submit
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
        startIcon={<CancelIcon />}
        style={{ marginLeft: '1rem', fontWeight: 'bold' }}
        onClick={() => setDialog('2')}
      >
        Clear
      </Button>
    </>
  );
};

export default SubmitButton;
