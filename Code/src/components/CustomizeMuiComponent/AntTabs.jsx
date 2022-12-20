import React from 'react';
import { Tabs as MuiTabs, withStyles } from '@material-ui/core';

const Tabs = withStyles((theme) => ({
  root: {
    paddingLeft: '20px'
  },
  indicator: {
    backgroundColor: theme.palette.secondary.main
  }
}))(MuiTabs);

const AntTabs = (props) => <Tabs {...props} />;

export default AntTabs;
