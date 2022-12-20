import React from 'react';
import {
  Dialog,
  Button,
  DialogTitle,
  DialogContent,
  DialogActions
  // IconButton,
} from '@material-ui/core';
// import { Close } from '@material-ui/icons';

const CustomDialog = (props) => {
  const {
    fullWidth = true,
    maxWidth = 'sm',
    title,
    handleClose = () => {},
    handleConfirm = () => {},
    content,
    open = false
  } = props;

  return (
    <div>
      <Dialog onClose={handleClose} open={open} fullWidth={fullWidth} maxWidth={maxWidth}>
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
          <Button
            variant="contained"
            autoFocus
            onClick={handleConfirm}
            style={{ backgroundColor: '#155151', color: 'white', fontWeight: 'bold' }}
          >
            Confirm
          </Button>

          <Button variant="outlined" autoFocus onClick={handleClose} style={{ fontWeight: 'bold' }}>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default CustomDialog;
