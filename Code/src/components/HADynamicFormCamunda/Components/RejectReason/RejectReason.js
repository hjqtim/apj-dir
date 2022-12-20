import React from 'react';
import {
  Button,
  Dialog as HADialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Slide
} from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import { useHistory } from 'react-router-dom';
import { Textarea } from '../controless';
import { L } from '../../../../utils/lang';
import CommonTip from '../../../CommonTip';
import workflowApi from '../../../../api/workFlow';
import Loading from '../../../Loading';

export default function RejectReason(props) {
  const { open, onClose, taskId } = props;

  const history = useHistory();

  const handleClose = () => {
    onClose && onClose();
  };

  const checkReason = (value) => {
    let error = false;
    let message = '';
    if (!value || !value.trim()) {
      error = true;
      message = 'Reject reason is required.';
    }
    return {
      error,
      message
    };
  };

  const handleReject = () => {
    const textareaEl = document.getElementById('rejectReasonTextArea');
    if (!textareaEl) return;
    const res = checkReason(textareaEl.value);
    if (res.error) {
      CommonTip.error(res.message);
    }
    if (textareaEl.value && textareaEl.value.trim()) {
      const data = {
        taskId,
        variables: { pass: false },
        rejectReason: textareaEl.value.trim()
      };
      Loading.show();
      workflowApi
        .actionTask(data)
        .then(() => {
          Loading.hide();
          handleClose();
          CommonTip.success(L('Success'));
          history.push({ pathname: '/MyApproval' });
        })
        .catch((e) => {
          console.log(e);
          Loading.hide();
        });
    }
  };

  const handleBlur = (value) => {
    const v = value ? value.trim() : '';
    const res = checkReason(v);
    if (!res.error) {
      // setValue(v)
    }
    return res;
  };

  const Transition = React.forwardRef((props, ref) => (
    <Slide direction="up" ref={ref} {...props} />
  ));

  const Dialog = withStyles(() => ({
    paper: {
      minWidth: '40vw',
      minHeight: '45vh'
    }
  }))(HADialog);

  const Title = withStyles(() => ({
    root: {
      height: '3.5em',
      display: 'flex',
      alignItems: 'center',
      maxHeight: '60px'
    }
  }))(DialogTitle);

  return (
    <>
      <Dialog
        open={open || false}
        keepMounted
        disableBackdropClick
        disableEscapeKeyDown
        TransitionComponent={Transition}
      >
        <Title>Reject Reason</Title>
        <DialogContent dividers>
          <Textarea
            onBlur={(value) => handleBlur(value)}
            placeholder="Reject Reason"
            id="rejectReasonTextArea"
            required
            rows={5}
            cols={33}
            maxLength={500}
          />
        </DialogContent>
        <DialogActions
          disableSpacing
          style={{
            display: 'flex',
            justifyContent: 'center'
          }}
        >
          <div>
            <Button
              variant="contained"
              style={{
                width: '5vw',
                marginLeft: '1vw',
                marginRight: '1vw',
                color: '#fff',
                backgroundColor: '#f44336'
              }}
              onClick={handleReject}
            >
              {L('Confirm')}
            </Button>
            <Button
              variant="contained"
              style={{
                width: '5vw',
                marginLeft: '1vw',
                marginRight: '1vw',
                color: '#333',
                backgroundColor: '#eee'
              }}
              onClick={() => handleClose()}
            >
              {L('Cancel')}
            </Button>
          </div>
        </DialogActions>
      </Dialog>
    </>
  );
}
