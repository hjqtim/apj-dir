import React from 'react';
import { makeStyles, AppBar, Tabs, Tab, Box } from '@material-ui/core';
import { HAPaper } from '../../../components';
import IPList from './components/IPList';
import Subnet from './components/Subnet';

const useStyles = makeStyles({
  tabStyle: {
    '&.MuiAppBar-colorPrimary': {
      color: '#155151',
      backgroundColor: '#fff'
    }
  }
});

function TabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div hidden={value !== index} {...other}>
      {value === index && <Box>{children}</Box>}
    </div>
  );
}

const Admin = () => {
  const [value, setValue] = React.useState(0);
  const classes = useStyles();

  const handleChange = (e, newValue) => {
    setValue(newValue);
  };

  return (
    <HAPaper style={{ padding: '0.8em' }}>
      <AppBar position="static" classes={{ root: classes.tabStyle }}>
        <Tabs value={value} onChange={handleChange}>
          <Tab label="IP List" />
          <Tab label="Subnet List" />
        </Tabs>
      </AppBar>
      <TabPanel value={value} index={0}>
        <IPList />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <Subnet />
      </TabPanel>
    </HAPaper>
  );
};

export default Admin;
