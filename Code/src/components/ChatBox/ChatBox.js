import React, { useState } from 'react';

import {
  Button as HAButton,
  Dialog as HADialog,
  DialogActions,
  DialogTitle,
  Card,
  CardContent,
  Typography,
  InputLabel as Label
} from '@material-ui/core/';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import DialogContent from '@material-ui/core/DialogContent';
import AccountCircle from '@material-ui/icons/AccountCircle';
import { L } from '../../utils/lang';
import API from '../../api/workFlow';
import formatDateTime from '../../utils/formatDateTime';

const useStyles = makeStyles(() => ({
  buttonGroup: {
    display: 'flex',
    justifyContent: 'center'
  },
  button: {
    marginLeft: '1vw',
    marginRight: '1vw'
  },
  contentMessage: {
    height: '12vh'
  },
  root: {
    margin: '1vh'
  }
}));

const Dialog = withStyles(() => ({
  paper: {
    minWidth: '65vw',
    minHeight: '80vh'
  }
}))(HADialog);

const Actions = withStyles(() => ({
  root: {
    display: 'flex',
    height: '10vh',
    width: '100%',
    margin: '0',
    padding: '2vh 0',
    justifyContent: 'center',
    alignItems: 'center'
  }
}))(DialogActions);

const Button = withStyles(() => ({
  root: {
    width: '5vw'
  }
}))(HAButton);

const Title = withStyles(() => ({
  root: {
    height: '8vh',
    display: 'flex',
    alignItems: 'center',
    maxHeight: '60px'
  }
}))(DialogTitle);

const Content = withStyles(() => ({
  root: {
    padding: '0 4vw',
    minHeight: '90px',
    backgroundColor: '#F7F9FC'
  }
}))(DialogContent);

const MessageContent = withStyles(() => ({
  root: {
    padding: '0 4vw',
    height: '200px',
    backgroundColor: '#F7F9FC'
  }
}))(DialogContent);

export default function ChatBox(props) {
  const { open, onClose, taskId, disabled, request } = props;
  const classes = useStyles();
  const [messageList, setMessageList] = useState([]);
  const [reasonValue, setReasonValue] = useState(null);
  const [api] = useState(request || API);

  // 初始化
  const onEnter = () => {
    // 获取 messageList
    api.getTaskMessage({ taskId }).then(({ data }) => {
      setMessageList(data.data);
    });
    // 用 setMessageList 方法更新 messageList
  };

  const InputLabel = withStyles((theme) => ({
    root: {
      fontSize: '1.1rem',
      display: 'block',
      color: 'rgba(0,0,0,.85)',
      '-webkit-user-select': 'none',
      '-moz-user-select': 'none',
      focused: {
        color: theme.palette.primary.main
      }
    }
  }))(Label);

  const dialogReason = {
    title: L('message'),
    value: '',
    formField: {
      id: 'message',
      label: L('message'),
      type: 'text',
      disabled: false,
      readOnly: false,
      required: true,
      helperText: L('NotEmpty')
    },
    onSubmit: () => {
      // console.log(value)
    }
  };

  const handleReasonChange = (event) => {
    setReasonValue(event.target.value);
  };

  // 提交处理
  const submitHandle = () => {
    if (reasonValue && reasonValue.length > 0) {
      const message = reasonValue;
      api.addMessage({ taskId, message }).then(({ data }) => {
        setReasonValue('');
        setMessageList(data.data);
      });
    }
  };

  // 关闭处理
  const closeHandle = () => {
    // 额外处理
    onClose();
  };

  return (
    <>
      <Dialog open={open} onEnter={onEnter}>
        <Title>{L('message')}</Title>
        {/* {messageList.map((label) => { */}
        {/*  return ( */}
        {/*    // eslint-disable-next-line react/jsx-key */}
        {/*    <DialogContentText theme={{ wordBreak: 'break-word' }}> */}
        {/*      {formatDateTime(label.createAt)} */}
        {/*      {label.username} */}
        {/*      {label.message} */}
        {/*    </DialogContentText>) */}
        {/* })} */}
        <Content dividers style={{ height: '80vh' }}>
          {messageList.map((label, index) => (
            <Card key={index} className={classes.root} variant="outlined">
              <CardContent>
                <ListItem alignItems="flex-start">
                  <ListItemAvatar>
                    <Avatar alt="" style={{ width: '30px', height: '30px' }}>
                      <AccountCircle />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={`${label.username}   ${formatDateTime(new Date(label.createAt))}`}
                    secondary={
                      <>
                        <Typography
                          component="span"
                          variant="body2"
                          className={classes.inline}
                          color="textSecondary"
                        >
                          {label.message}
                        </Typography>
                      </>
                    }
                  />
                </ListItem>
              </CardContent>
            </Card>
          ))}
        </Content>
        <MessageContent
          className={classes.contentMessage}
          style={{ backgroundColor: '#fff' }}
          dividers={false}
        >
          <div style={{ marginTop: '3vh' }}>
            <InputLabel id="messagelabel">
              <font color="red">*</font>
              Message:
            </InputLabel>
            <div style={{ width: '1vw' }} />
            <div>
              <textarea
                rows="5"
                cols="20"
                error={dialogReason.formField.error || false}
                disabled={dialogReason.formField.disabled || false}
                required={dialogReason.formField.required || false}
                style={{ marginTop: '10px', resize: 'none', width: '100%' }}
                onChange={
                  !dialogReason.formField.readOnly ? (event) => handleReasonChange(event) : null
                }
              />
            </div>
          </div>
          {/* <TextField */}
          {/*  fullWidth={true} */}
          {/*  id={dialogReason.formField.id.toString()} */}
          {/*  key={dialogReason.formField.id + dialogReason.formField.label} */}
          {/*  label={dialogReason.formField.label} */}
          {/*  type={dialogReason.formField.type} */}
          {/*  error={dialogReason.formField.error || false} */}
          {/*  helperText={dialogReason.formField.helperText || ''} */}
          {/*  disabled={dialogReason.formField.disabled || false} */}
          {/*  required={dialogReason.formField.required || false} */}
          {/*  onChange={!dialogReason.formField.readOnly ? (event) => handleReasonChange(event) : null} */}
          {/*  value={reasonValue} */}
          {/*  multiline */}
          {/* /> */}
        </MessageContent>
        <Actions disableSpacing>
          <Button
            color="primary"
            variant="contained"
            disabled={disabled}
            className={classes.button}
            onClick={submitHandle}
          >
            Submit
          </Button>
          <Button variant="contained" className={classes.button} onClick={closeHandle}>
            Close
          </Button>
        </Actions>
      </Dialog>
    </>
  );
}
