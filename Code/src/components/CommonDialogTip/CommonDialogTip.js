import React from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@material-ui/core';
import { L } from '../../utils/lang';

const CommonDialogTip = (props) => {
  const {
    content,
    open,
    handleClose,
    handleConfirm,
    title = L('tip'),
    maxWidth = 'sm',
    confirmText = L('confirm'),
    cancelText = L('Cancel')
  } = props;
  const fullwidth = true;

  return (
    <Dialog fullWidth={fullwidth} maxWidth={maxWidth} open={open} onClose={handleClose}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>{content || L('whetherOperation')}</DialogContent>
      <DialogActions>
        <Button onClick={handleConfirm} color="secondary" variant="contained">
          {confirmText}
        </Button>
        <Button onClick={handleClose} color="secondary" variant="outlined" autoFocus>
          {cancelText}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CommonDialogTip;
