import * as React from 'react';

import {
  Button,
  styled,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton
  // Typography
} from '@material-ui/core';

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuDialogContent-root': {
    padding: theme.spacing(2)
  },
  '& .MuDialogActions-root': {
    padding: theme.spacing(1)
  }
}));

const BootstrapDialogTitle = (props) => {
  const { children, onClose, ...other } = props;

  return (
    <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
      {children}
      {onClose ? (
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500]
          }}
        />
      ) : null}
    </DialogTitle>
  );
};

export default class CustomizedDialogs extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false
    };
  }

  componentDidMount() {
    this.props.onRef(this);
  }

  handleClickOpen = () => {
    this.setState({
      open: true
    });
  };

  handleClose = () => {
    this.setState({
      open: false
    });
  };

  render() {
    return (
      <div>
        <BootstrapDialog
          onClose={this.handleClose}
          aria-labelledby="customized-dialog-title"
          open={this.state.open}
        >
          <BootstrapDialogTitle id="customized-dialog-title" onClose={this.handleClose}>
            Xml
          </BootstrapDialogTitle>
          <DialogContent dividers>
            <pre>{this.props.xml}</pre>
          </DialogContent>
          <DialogActions>
            <Button autoFocus onClick={this.handleClose}>
              Cancel
            </Button>
          </DialogActions>
        </BootstrapDialog>
      </div>
    );
  }
}
