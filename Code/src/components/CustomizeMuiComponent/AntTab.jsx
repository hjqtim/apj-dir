import React from 'react';
import { Tab as MuiTab, withStyles } from '@material-ui/core';

const Tab = withStyles((theme) => ({
  root: {
    minWidth: '100px',
    '&$selected': {
      color: theme.palette.secondary.main
    }
  },
  selected: {
    color: theme.palette.secondary.main
  }
}))(MuiTab);

const AntTab = (props) => <Tab {...props} />;

export default AntTab;
