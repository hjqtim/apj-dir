import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Backdrop, CircularProgress } from '@material-ui/core';

// const useStyles = makeStyles((theme) => ({
//   backdrop: {
//     zIndex: theme.zIndex.drawer + 1,
//     color: '#fff',
//   },
// }))

export default class Loading extends Component {
  static show() {
    const oldDiv = document.getElementById('HALoading');
    if (oldDiv) return;
    const div = document.createElement('div');
    div.id = 'HALoading';
    div.style.position = 'absolute';
    div.style.zIndex = '1300';
    document.body.append(div);

    const Loading = () => (
      <Backdrop open>
        <CircularProgress color="inherit" />
      </Backdrop>
    );
    ReactDOM.render(<Loading />, div);
  }

  static hide() {
    const div = document.getElementById('HALoading');
    if (!div) return;
    ReactDOM.unmountComponentAtNode(div);
    setTimeout(() => div.remove(), 50);
  }
}
