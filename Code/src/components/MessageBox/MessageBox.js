import React, { useEffect, createRef } from 'react';
import {
  Dialog,
  Button,
  // DialogContent,
  DialogActions,
  AppBar,
  Toolbar,
  IconButton,
  makeStyles,
  Typography
} from '@material-ui/core';
import { Close } from '@material-ui/icons';
import ReactWEditor from 'wangeditor-for-react';

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
    ConfirmText = 'Previous', //  confirmText
    content, // content
    open = false, // show and hidden dialog
    fullWidth = true,
    fullScreen = false,
    maxWidth = 'sm',

    isHideSubmit = false, // whether hidden submit btn
    isHideFooter = true, // whether hidden footer
    isHideClose = false,
    isHideCloseIcon = false,
    themeColor = '#0F3E5B',
    isClickClose = false, // click background close,
    customerBtn,
    handleClose = null, // event
    handlePrevious = null, //  Save event
    handleNext = null, // event
    previousDE,
    nextDE
  } = props;
  const classes = useStyles({ fullWidth });
  const editorRef = createRef();

  // console.log('Message Box:', content);

  useEffect(() => {
    // console.log('???', editorRef);
    setTimeout(() => {
      editorRef?.current?.editor?.disable();
    }, 500);
  }, [editorRef, content]);

  // const setMyRef = () => {
  //   console.log('???', editorRef);
  // };

  return (
    <Dialog
      open={open}
      onClose={isClickClose ? handleClose : undefined}
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

      <ReactWEditor
        ref={editorRef}
        config={{
          // lang: 'en',
          menus: [],
          showFullScreen: false
        }}
        value={content}
        defaultValue={content}
        disabled
      />
      {!isHideFooter && (
        <DialogActions>
          {!isHideSubmit && (
            <Button
              style={
                previousDE
                  ? { backgroundColor: themeColor, color: '#555', fontWeight: 'bold' }
                  : { backgroundColor: themeColor, color: '#FFF', fontWeight: 'bold' }
              }
              variant="contained"
              autoFocus
              onClick={handlePrevious}
              disabled={previousDE}
            >
              {ConfirmText}
            </Button>
          )}
          {customerBtn}
          {!isHideClose && (
            <Button
              style={
                nextDE
                  ? {
                      backgroundColor: isHideSubmit ? themeColor : '#555',
                      color: isHideSubmit ? '#FFF' : '#000',
                      fontWeight: 'bold'
                    }
                  : {
                      backgroundColor: isHideSubmit ? themeColor : '#FFF',
                      color: isHideSubmit ? '#FFF' : '#000',
                      fontWeight: 'bold'
                    }
              }
              variant="outlined"
              autoFocus
              onClick={handleNext}
              disabled={nextDE}
            >
              Next
            </Button>
          )}
        </DialogActions>
      )}
    </Dialog>
  );
};

export default CommonDialog;
