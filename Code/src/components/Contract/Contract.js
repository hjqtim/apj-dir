import React, { useEffect, useRef, useState } from 'react';
import {
  Button as HAButton,
  Dialog as HADialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Slide
} from '@material-ui/core/';
import { withStyles, makeStyles } from '@material-ui/core/styles';

const Transition = React.forwardRef((props, ref) => <Slide direction="up" ref={ref} {...props} />);

const Dialog = withStyles(() => ({
  paper: {
    minWidth: '65vw',
    minHeight: '90vh'
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
    padding: '0 4vw'
  }
}))(DialogContent);

const useStyles = makeStyles(() => ({
  buttonGroup: {
    display: 'flex',
    justifyContent: 'center'
  },
  button: {
    marginLeft: '1vw',
    marginRight: '1vw'
  }
}));

export default function Contract(props) {
  const { open, onClose, contractList } = props;

  const [index, setIndex] = useState(0);
  const [disabled, setDisabled] = useState(true);

  const contentEl = useRef(null);

  useEffect(() => {
    if (
      contentEl.current &&
      contentEl.current.scrollTop + contentEl.current.clientHeight ===
        contentEl.current.scrollHeight
    ) {
      setDisabled(false);
    } else {
      setDisabled(true);
    }
  }, [index]);

  useEffect(() => {
    if (!contentEl.current) return () => {};
    contentEl.current.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleResize);
    return () => {
      // eslint-disable-next-line
      contentEl.current.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
    };
    // eslint-disable-next-line
  }, [contentEl.current]);

  const classes = useStyles();

  const rejectHandle = () => {
    onClose(false);
    setDisabled(true);
    setIndex(0);
    if (contentEl && contentEl.current) {
      contentEl.current.scrollTop = 0;
    }
  };

  const acceptHandle = () => {
    if (!contractList || !contractList.length) return;
    if (index + 1 === contractList.length) {
      onClose(true);
      setIndex(0);
      if (contentEl && contentEl.current) {
        contentEl.current.scrollTop = 0;
        setDisabled(true);
      }
      return;
    }
    setIndex(index + 1);
    if (contentEl && contentEl.current) {
      contentEl.current.scrollTop = 0;
      setDisabled(true);
    }
  };

  const handleScroll = () => {
    if (
      contentEl.current.scrollTop + contentEl.current.clientHeight ===
      contentEl.current.scrollHeight
    ) {
      setDisabled(false);
    }
  };

  const handleResize = () => {
    if (
      contentEl.current.scrollTop + contentEl.current.clientHeight ===
      contentEl.current.scrollHeight
    ) {
      setDisabled(false);
    }
  };

  const onEnter = () => {
    if (contentEl.current.clientHeight === contentEl.current.scrollHeight) {
      setDisabled(false);
    } else {
      setDisabled(true);
    }
  };

  return (
    <div>
      <Dialog
        open={open}
        onEnter={onEnter}
        onClose={onClose}
        keepMounted
        disableBackdropClick
        disableEscapeKeyDown
        TransitionComponent={Transition}
      >
        <Title>{contractList && contractList[index] && contractList[index].title}</Title>
        <Content dividers ref={contentEl}>
          {contractList && contractList[index] && contractList[index].content}
        </Content>
        <Actions disableSpacing>
          <Button
            color="secondary"
            variant="contained"
            className={classes.button}
            onClick={rejectHandle}
          >
            Reject
          </Button>
          <Button
            color="primary"
            variant="contained"
            className={classes.button}
            disabled={disabled}
            onClick={acceptHandle}
          >
            Accept
          </Button>
        </Actions>
      </Dialog>
    </div>
  );
}
