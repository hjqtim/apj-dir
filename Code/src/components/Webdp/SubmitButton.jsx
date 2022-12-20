import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';
import useWebdpColor from '../../hooks/webDP/useWebDPColor';

const Transition = React.forwardRef((props, ref) => <Slide direction="up" ref={ref} {...props} />);

const SubmitButton = ({
  title,
  label,
  submitLabel,
  submitAction,
  message,
  rejectLabel,
  rejectAction,
  cancelLabel = 'Cancel',
  ...rest
}) => {
  const color = useWebdpColor();
  const [open, setOpen] = React.useState(false);
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <Button
        variant="contained"
        color={label === 'Reject' ? 'secondary' : 'primary'}
        onClick={handleClickOpen}
        size="small"
        {...rest}
      >
        {label}
      </Button>
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-labelledby={label}
        aria-describedby={`${label}-description`}
      >
        <DialogTitle
          id={`${label}-title`}
          style={{
            backgroundColor: color.title,
            color: 'white'
          }}
        >
          {title}
        </DialogTitle>
        <DialogContent>
          <div style={{ color: '#078080' }}>{message}</div>
        </DialogContent>
        <DialogActions>
          {submitAction && (
            <Button
              onClick={(e) => {
                submitAction(e);
                handleClose();
              }}
              style={{ backgroundColor: color.title, color: 'white' }}
              variant="contained"
            >
              {submitLabel || 'OK'}
            </Button>
          )}
          {rejectAction && (
            <Button
              type="submit"
              style={{ backgroundColor: color.title, color: 'white', fontWeight: 'bold' }}
              variant="contained"
              onClick={(e) => {
                rejectAction(e);
                handleClose();
              }}
            >
              {rejectLabel || 'Confirm'}
            </Button>
          )}
          <Button onClick={handleClose} variant="outlined" style={{ fontWeight: 'bold' }}>
            {cancelLabel}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default SubmitButton;
