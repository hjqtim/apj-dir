import React, { useState, memo } from 'react';

import PropTypes from 'prop-types';
import { Grid, makeStyles, Box, Tabs, Tab } from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import { parse } from 'qs';

import { BaseInfo, DataPort, Backbone, Cabinet, Panel, Other } from './components';

const useStyles = makeStyles((theme) => ({
  root: {
    padding: '0.8rem',
    backgroundColor: '#e6eaf1',
    borderRadius: '0.5rem',
    '& .MuiInputBase-input.Mui-disabled': {
      cursor: 'not-allowed'
    }
  },
  footer: {
    backgroundColor: '#FFF',
    padding: theme.spacing(4),
    '& button': {
      marginLeft: theme.spacing(4)
    }
  }
}));

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box>{children}</Box>}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`
  };
}

const RequestFormDetail = () => {
  const classes = useStyles();
  const history = useHistory();

  const [tabValue, setTabValue] = useState(0);

  const urlObj = parse(history.location.search?.replace('?', '')) || {}; // 根据url获取请求参数
  const [reqNo] = React.useState(urlObj.reqNo || null);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <>
      <Grid container className={classes.root}>
        <h1>Request Form Detail</h1>

        <BaseInfo reqNo={reqNo} />

        <Grid container style={{ background: '#fff', padding: '8px', minHeight: '300px' }}>
          <Box sx={{ width: '100%' }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tabs value={tabValue} onChange={handleTabChange} aria-label="basic tabs example">
                <Tab label="Data Port" {...a11yProps(0)} />
                <Tab label="Backbone" {...a11yProps(1)} />
                <Tab label="Cabinet" {...a11yProps(2)} />
                <Tab label="Panel" {...a11yProps(3)} />
                <Tab label="Other" {...a11yProps(4)} />
              </Tabs>
            </Box>

            <TabPanel value={tabValue} index={0}>
              <DataPort />
            </TabPanel>
            <TabPanel value={tabValue} index={1}>
              <Backbone />
            </TabPanel>
            <TabPanel value={tabValue} index={2}>
              <Cabinet />
            </TabPanel>
            <TabPanel value={tabValue} index={3}>
              <Panel />
            </TabPanel>
            <TabPanel value={tabValue} index={4}>
              <Other />
            </TabPanel>
          </Box>
        </Grid>
      </Grid>
    </>
  );
};

export default memo(RequestFormDetail);
