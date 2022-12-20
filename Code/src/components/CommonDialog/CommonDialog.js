import React from 'react';
import {
  Dialog,
  Button,
  DialogContent,
  DialogActions,
  AppBar,
  Toolbar,
  IconButton,
  makeStyles,
  Typography
} from '@material-ui/core';
import { Close } from '@material-ui/icons';

const useStyles = makeStyles((theme) => ({
  root: (props) => ({
    '& .MuiAppBar-positionFixed': {
      position: 'relative'
    },
    '& .MuiDialogContent-root.MuiDialogContent-dividers': {
      // display: 'flex',
      // justifyContent: 'center',
      padding: props.fullWidth ? 0 : theme.spacing(2),
      borderTop: 0
    }
  }),
  toolbar: {
    display: 'flex',
    justifyContent: 'space-between'
  }
}));

const CommonDialog = (props) => {
  const {
    title = 'Tip', //  title
    ConfirmText = 'Save', //  confirmText
    content, // content
    open = false, // show and hidden dialog
    fullWidth = true,
    fullScreen = false,
    maxWidth = 'sm',
    handleClose = null, // event
    handleConfirm = null, //  Save event
    isHideSubmit = false, // whether hidden submit btn
    isHideFooter = true, // whether hidden footer
    isHideClose = false,
    isHideCloseIcon = false,
    customerBtn,
    themeColor = '#0F3E5B',
    isClickClose = false, // click background close
    TransitionComponent
  } = props;
  const classes = useStyles({ fullWidth });
  return (
    <Dialog
      open={open}
      onClose={isClickClose ? handleClose : undefined}
      TransitionComponent={TransitionComponent}
      fullScreen={fullScreen}
      fullWidth={fullWidth}
      maxWidth={maxWidth}
      className={classes.root}
    >
      <div style={{ filter: 'blur(5px)', zIndex: 1 }} />
      <AppBar sx={{ position: 'relative' }} style={{ backgroundColor: themeColor }}>
        <Toolbar className={classes.toolbar}>
          <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
            {title}
          </Typography>
          {!isHideCloseIcon && (
            <IconButton color="inherit" onClick={handleClose}>
              <Close />
            </IconButton>
          )}
        </Toolbar>
      </AppBar>
      <DialogContent dividers>{content}</DialogContent>
      {!isHideFooter && (
        <DialogActions>
          {!isHideSubmit && (
            <Button
              style={{ backgroundColor: themeColor, color: '#FFF', fontWeight: 'bold' }}
              variant="contained"
              autoFocus
              onClick={handleConfirm}
            >
              {ConfirmText}
            </Button>
          )}
          {customerBtn}
          {!isHideClose && (
            <Button
              style={{
                backgroundColor: isHideSubmit ? themeColor : '#FFF',
                color: isHideSubmit ? '#FFF' : '#000',
                fontWeight: 'bold'
              }}
              variant="outlined"
              autoFocus
              onClick={handleClose}
            >
              Cancel
            </Button>
          )}
        </DialogActions>
      )}
    </Dialog>
  );
};

export default CommonDialog;
