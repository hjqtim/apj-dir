import React from 'react';
import { Switch, withStyles } from '@material-ui/core';

const MySwitch = withStyles((theme) => ({
  root: {
    width: 42,
    height: 20,
    padding: 0,
    display: 'flex',
    margin: theme.spacing(1)
  },
  switchBase: {
    padding: 1,
    color: theme.palette.grey[500],
    '&$checked': {
      transform: 'translateX(22px)',
      color: theme.palette.common.white,
      '& + $track': {
        opacity: 1,
        backgroundColor: theme.palette.secondary.main,
        borderColor: theme.palette.secondary.main
      }
    }
  },
  thumb: {
    width: 18,
    height: 18,
    boxShadow: 'none'
  },
  track: {
    border: `1px solid ${theme.palette.grey[500]}`,
    borderRadius: 20 / 2,
    opacity: 1,
    backgroundColor: theme.palette.common.white
  },
  checked: {}
}))(Switch);

const AntSwitch = (props) => <MySwitch {...props} />;

export default AntSwitch;
