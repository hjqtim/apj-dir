import React from 'react';

import PropTypes from 'prop-types';

import { makeStyles, AppBar, Tabs, Tab, Box } from '@material-ui/core';

import Prpreparation from './PRpreparation';
// import FundingTransfer from './FundingTransfer';
import PRPOSummary from './PRPOSummary';
import POLineSummary from './POLineSummary';
import GoodsReceiptedDN from './GoodsReceiptedDN';
// import FundingTXSummary from './FundingTXSummary';
import ProblemLog from './ProblemLog';

const useStyles = makeStyles({
  tabPanel: {
    background: '#fff',
    height: '73vh',
    padding: '5px 10px',
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15
  },
  tabPanel01: {
    background: '#fff',
    padding: '5px 10px',
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15
  },
  tabStyle: {
    '&.MuiAppBar-colorPrimary': {
      color: '#155151',
      backgroundColor: '#fff',
      padding: '5px 20px',
      borderTopLeftRadius: 15,
      borderTopRightRadius: 15
    }
  },
  tabSelected: {
    '&.MuiTab-textColorInherit.Mui-selected': {
      color: '#229ffa' // if will be look like Bitrix24 color style change here #155151
    }
  }
});

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

const Preparation = () => {
  const classes = useStyles();
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <div>
      <AppBar position="static" classes={{ root: classes.tabStyle }}>
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="simple tabs example"
          TabIndicatorProps={{ style: { background: '#229ffa' } }}
        >
          <Tab
            label="PR Preparation"
            {...a11yProps(0)}
            classes={{ selected: classes.tabSelected }}
          />
          <Tab
            label="PR/PO Summary"
            {...a11yProps(1)}
            classes={{ selected: classes.tabSelected }}
          />
          <Tab
            label="PO Line Summary"
            {...a11yProps(2)}
            classes={{ selected: classes.tabSelected }}
          />
          <Tab label="DN" {...a11yProps(3)} classes={{ selected: classes.tabSelected }} />
          <Tab label="Problem Log" {...a11yProps(4)} classes={{ selected: classes.tabSelected }} />
        </Tabs>
      </AppBar>
      <TabPanel value={value} index={0} className={classes.tabPanel01}>
        <Prpreparation />
      </TabPanel>

      <TabPanel value={value} index={1} className={classes.tabPanel01}>
        <PRPOSummary />
      </TabPanel>
      <TabPanel value={value} index={2} className={classes.tabPanel01}>
        <POLineSummary />
      </TabPanel>
      <TabPanel value={value} index={3} className={classes.tabPanel01}>
        <GoodsReceiptedDN />
      </TabPanel>

      <TabPanel value={value} index={4} className={classes.tabPanel01}>
        <ProblemLog />
      </TabPanel>
    </div>
  );
};

export default Preparation;
