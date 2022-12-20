import React, { useState } from 'react';
import {
  Button as HAButton,
  Dialog as HADialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Slide
} from '@material-ui/core/';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import Condition from './Condition';
import downloadFile from '../../utils/downloadFile';

const Transition = React.forwardRef((props, ref) => <Slide direction="up" ref={ref} {...props} />);

const Dialog = withStyles(() => ({
  paper: {
    width: '50vw',
    height: '50vh'
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

export default function DownloadDialog(props) {
  const { page, open, onClose } = props;

  const classes = useStyles();

  const [downloadAPI, setDownloadAPI] = useState();
  const [condition, setCondition] = useState({});
  const [fileName, setFileName] = useState('file');

  const closeHandle = () => {
    onClose && onClose();
  };

  const downloadHandle = () => {
    downloadAPI &&
      downloadAPI(condition).then(({ data }) => {
        downloadFile(data, fileName);
      });
  };

  const onConditionChange = (newAPI, newCondition, fileName) => {
    setDownloadAPI(newAPI);
    setCondition(newCondition);
    setFileName(fileName);
  };

  return (
    <>
      <Dialog
        open={open}
        keepMounted
        onClose={() => {}}
        disableEscapeKeyDown
        TransitionComponent={Transition}
      >
        <Title>
          Export
          {page || ''}
        </Title>
        <Content dividers>
          <Condition page="VM" onChange={onConditionChange} />
        </Content>
        <Actions disableSpacing>
          <Button
            color="primary"
            variant="contained"
            className={classes.button}
            onClick={downloadHandle}
          >
            Download
          </Button>
          <Button
            color="secondary"
            variant="contained"
            className={classes.button}
            onClick={closeHandle}
          >
            Cancel
          </Button>
        </Actions>
      </Dialog>
    </>
  );
}
