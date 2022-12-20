import React, { forwardRef } from 'react';
import {
  Dialog,
  Button,
  DialogTitle,
  DialogContent,
  DialogActions,
  Slide
} from '@material-ui/core';

const Transition = forwardRef((props, ref) => <Slide direction="up" ref={ref} {...props} />);

const WarningDialog = (props) => {
  const {
    fullWidth = true,
    maxWidth = 'sm',
    title = 'Warning',
    handleClose = () => {},
    handleConfirm = () => {},
    content,
    ConfirmText = 'Confirm',
    CancelText = 'Cancel',
    isHideConfirm = false,
    open = false
  } = props;

  return (
    <div>
      <Dialog
        onClose={handleClose}
        open={open}
        fullWidth={fullWidth}
        maxWidth={maxWidth}
        TransitionComponent={Transition}
      >
        <DialogTitle
          style={{
            backgroundColor: '#155151',
            color: 'white'
          }}
        >
          {title}
        </DialogTitle>
        <DialogContent>
          <div style={{ color: '#078080' }}>{content}</div>
        </DialogContent>
        <DialogActions>
          {!isHideConfirm && (
            <Button
              variant="contained"
              autoFocus
              onClick={handleConfirm}
              style={{ backgroundColor: '#155151', color: '#FFF', fontWeight: 'bold' }}
            >
              {ConfirmText}
            </Button>
          )}

          <Button
            variant="outlined"
            autoFocus
            onClick={handleClose}
            style={{
              backgroundColor: isHideConfirm ? '#155151' : '#FFF',
              color: isHideConfirm ? '#FFF' : '#000',
              fontWeight: 'bold'
            }}
          >
            {CancelText}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default WarningDialog;
