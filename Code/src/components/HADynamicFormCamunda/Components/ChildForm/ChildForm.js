import React, { useCallback, useContext } from 'react';
import {
  Slide,
  Dialog as HADialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@material-ui/core';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import { DynamicContext } from '../../HADynamicFormCamunda';
import { switchComponent } from '../../utils';

export default function ChildForm(props) {
  const { onClose, open, currentIndex } = props;

  const { logic, style } = useContext(DynamicContext);

  const getComponent = useCallback(
    (el, i) => switchComponent(el, i, logic, style, false),
    [logic, style]
  );

  const Transition = React.forwardRef((props, ref) => (
    <Slide direction="up" ref={ref} {...props} />
  ));

  const Dialog = withStyles(() => ({
    paper: {
      ...(style && style.childForm ? style.childForm.dialog : {})
    }
  }))(HADialog);

  const Title = withStyles(() => ({
    root: {
      height: '3.5em',
      display: 'flex',
      alignItems: 'center',
      maxHeight: '60px',
      ...(style ? style.childFormTitle : {})
    }
  }))(DialogTitle);

  const useStyles = makeStyles(() => ({
    content: {
      ...(style && style.childForm ? style.childForm.content : {})
    },
    formElementContainer: {
      ...(style && style.childForm ? style.childForm.formElementContainer : {})
    },
    actions: {
      ...(style && style.childForm ? style.childForm.actions : {})
    }
  }));

  const classes = useStyles();

  const handleClose = () => {
    onClose();
  };

  return (
    <>
      <Dialog
        open={open}
        keepMounted
        onClose={handleClose}
        disableBackdropClick
        disableEscapeKeyDown
        TransitionComponent={Transition}
      >
        <Title style={{ borderBottom: '1px solid rgba(0, 0, 0, 0.12)' }}>
          {logic && logic.getChildFormTitle(currentIndex)}
        </Title>
        <DialogContent className={classes.content}>
          {logic &&
            logic.getChildInitDetail &&
            logic.getChildInitDetail(currentIndex).map((el, i) => (
              <div key={`${el.id}_${i}`} className={classes.formElementContainer}>
                {getComponent(el, i)}
              </div>
            ))}
        </DialogContent>
        <DialogActions disableSpacing className={classes.actions}>
          {logic && logic.getChildFormActions({ ...props })}
        </DialogActions>
      </Dialog>
    </>
  );
}
