import React from 'react';
import {
  Button as HAButton,
  Dialog as HADialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Slide
} from '@material-ui/core';
import { makeStyles, withStyles } from '@material-ui/core/styles';

export default function Detail(props) {
  const { open, onClose, row } = props;

  const useStyles = makeStyles(() => ({
    button: {
      marginLeft: '1vw',
      marginRight: '1vw'
    }
  }));

  const Transition = React.forwardRef((props, ref) => (
    <Slide direction="up" ref={ref} {...props} />
  ));

  const Content = withStyles(() => ({
    root: {
      padding: '0 4vw'
    }
  }))(DialogContent);

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

  const classes = useStyles();
  const getP = (obj) => {
    const PList = JSON.stringify(obj, null, 4).split('\n');
    return (
      <>
        {PList &&
          PList.map((el, i) => (
            <pre
              style={{
                fontFamily: 'Arial',
                fontSize: '14px',
                wordBreak: 'break-all'
              }}
              key={i}
            >
              {el}
            </pre>
          ))}
      </>
    );
  };
  return (
    <div>
      <Dialog open={open} keepMounted TransitionComponent={Transition}>
        <Title>Log Detail</Title>
        <Content dividers>
          <article style={{ fontFamily: 'Arial', fontSize: '14px' }}>
            <p style={{ fontSize: '16px' }}>
              <b>Request</b>
            </p>
            {row.request && getP(row.request)}
            <hr />
            <p style={{ fontSize: '16px' }}>
              <b>Response</b>
            </p>
            {row.response && getP(row.response)}
          </article>
        </Content>
        <Actions disableSpacing>
          <Button color="primary" variant="contained" className={classes.button} onClick={onClose}>
            OK
          </Button>
        </Actions>
      </Dialog>
    </div>
  );
}
