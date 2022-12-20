import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Snackbar as MuiSnackbar } from '@material-ui/core';
import MuiAlert from '@material-ui/lab/Alert';
import styled from 'styled-components';
import { spacing } from '@material-ui/system';
import { lang } from '../../lang/lang';

class CommonTip extends Component {
  static info(msg) {
    this.showtip({ msg, serverity: 'info' });
  }

  static success(msg, autoHideDuration = 5000) {
    this.showtip({ msg, severity: 'success', autoHideDuration });
  }

  static warning(msg) {
    this.showtip({ msg, severity: 'warning' });
  }

  static error(msg, autoHideDuration) {
    const options = { msg, severity: 'error' };
    if (autoHideDuration) {
      options.autoHideDuration = autoHideDuration;
    }
    this.showtip(options);
  }

  static showtip(options) {
    const { ex_us } = lang;
    options.msg = ex_us[options.msg] ? ex_us[options.msg] : options.msg;
    const defaultOptions = {
      msg: '',
      severity: 'info',
      autoHideDuration: options.autoHideDuration ? options.autoHideDuration : 5000,
      vertical: 'top',
      horizontal: 'center',
      ...options
    };
    const opt = { ...defaultOptions };
    const Snackbar = styled(MuiSnackbar)(spacing);
    const div = document.createElement('div');
    div.style.position = 'absolute';
    div.style.zIndex = '1300';
    document.body.append(div);

    const handleClose = (event, reason) => {
      if (reason === 'clickaway') {
        return;
      }

      ReactDOM.unmountComponentAtNode(div);
      setTimeout(() => document.body.removeChild(div), 50);
    };

    const Alert = (props) => (
      <Snackbar
        anchorOrigin={{
          vertical: props.vertical,
          horizontal: props.horizontal
        }}
        open
        autoHideDuration={props.autoHideDuration}
        onClose={handleClose}
      >
        <MuiAlert variant="filled" severity={props.severity}>
          {props.msg}
        </MuiAlert>
        {/* <div>{props.msg}</div> */}
      </Snackbar>
      // <Snackbar anchorOrigin={{ vertical: props.vertical, horizontal: props.horizontal }} open={true}  autoHideDuration={props.autoHideDuration} onClose={handleClose}>
      //   <MuiAlert variant="filled" severity={props.severity} onClose={handleClose}>
      //     {props.msg}
      //   </MuiAlert>
      // </Snackbar>
    );
    ReactDOM.render(<Alert {...opt} />, div);
  }
}
export default CommonTip;
