import React, { useState, useEffect } from 'react';
import {
  Grid,
  Typography,
  Accordion,
  AccordionDetails,
  AccordionSummary,
  makeStyles
} from '@material-ui/core';

import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

// import API from '../../../../api/webdp/webdp';
import { Styles, Param } from './indexStyle';

import DataPortItem from './DataPortItem';

const DataPortID = (props) => {
  const {
    dataPortList,
    setDataPortList,
    error03,
    detail01,
    detail02,
    detail03,
    detail04,
    hospital,
    serviceType,
    setCheckLoad,
    setDetail06,
    setN3CheckArray,
    dataPortListStatus,
    setDataPortListStatus
  } = props.toProps;

  const [expanded05, setExpanded05] = useState(true);

  const useStyles = makeStyles(() => ({
    radio: {
      '&$checked': {
        color: '#155151'
      }
    },
    checked: {},
    checkBox: {
      '&$checked': {
        color: '#155151'
      }
    },
    muiAccordinSummaryRoot: {
      //   borderBottom: '1px solid #155151',
      marginBottom: 5,
      minHeight: 'unset!important',
      height: '48px'
    },
    muiAccordinSummaryContent: {
      margin: '12px 0'
    },
    inputValidation: {
      '& .MuiOutlinedInput-root': {
        borderColor: '#ff0000',
        borderWidth: '2px'
      }
    },
    inputDefult: {
      '& .MuiOutlinedInput-root': {
        borderColor: '#ff0000',
        borderWidth: '1px'
      }
    }
  }));
  const classes = useStyles();

  useEffect(() => {
    checkDataPortListApproach(dataPortList);
  }, [dataPortList]);

  // Change DataPortID Data
  const handleInputDataPortID2 = (e, i, value) => {
    // console.log('handleInputDataPortID2', e, i, value);
    const tempString = value;
    let dataPortListTemp = [];
    dataPortListTemp = dataPortList;
    dataPortListTemp[i].dataPortID = tempString;
    setDataPortList([...dataPortListTemp]);
    setDataPortListStatus([...dataPortListTemp]);
  };

  // Change Remarks Data
  const handleInputDataPortRemarks = (e, i) => {
    const tempString = e.target.value;
    let tempArray01 = [{ dataPortRemarks: '', dataPortID: '' }];
    tempArray01 = [...dataPortList];
    tempArray01[i].dataPortRemarks = tempString;
    setDataPortList([...tempArray01]);
  };

  // add input DataPortID
  const autoCompleteOnChange = (e, index, value) => {
    // console.log('autoCompleteOnChange', index, value);
    let tempArray = [];
    tempArray = [...dataPortList];
    tempArray[index].dataPortID = value;
    tempArray[index].checkState = '';

    let couter01 = 0;
    for (let i = 0; i < tempArray.length; i += 1) {
      if (tempArray[i].dataPortID === '') {
        couter01 += 1;
      }
    }

    if (couter01 < 1) {
      // tempArray = [
      //   ...tempArray,
      //   {
      //     dataPortID: '',
      //     dataPortRemarks: '',
      //     dataPortStatus: '',
      //     list: [{ outletID: '' }],
      //     open: false,
      //     loading: false,
      //     checkState: ''
      //   }
      // ];
      tempArray.push({
        dataPortID: '',
        dataPortRemarks: '',
        dataPortStatus: '',
        list: [{ outletID: '' }],
        open: false,
        loading: false,
        checkState: ''
      });
      setDataPortList([...tempArray]);
      setDataPortListStatus([...tempArray]);
    }
  };

  // onBlur
  const inputDataPortIDOnBlur = (e, index, value) => {
    if (value !== '') {
      // setValue
      let tempArray = [];
      tempArray = [...dataPortList];
      tempArray[index].dataPortID = value;
      tempArray[index].checkState = '';

      // add input
      let couter01 = 0;
      let couter02 = 0;
      for (let i = 0; i < tempArray.length; i += 1) {
        if (tempArray[i].dataPortID === '') {
          couter01 += 1;
        }
        if (tempArray[i].dataPortID === value) {
          couter02 += 1;
        }
      }
      if (couter01 < 1 && couter02 < 2) {
        // tempArray = [
        //   ...tempArray,
        //   {
        //     dataPortID: '',
        //     dataPortRemarks: '',
        //     dataPortStatus: '',
        //     list: [{ outletID: '' }],
        //     open: false,
        //     loading: false,
        //     checkState: ''
        //   }
        // ];
        tempArray.push({
          dataPortID: '',
          dataPortRemarks: '',
          dataPortStatus: '',
          list: [{ outletID: '' }],
          open: false,
          loading: false,
          checkState: ''
        });
        setDataPortList([...tempArray]);
        setDataPortListStatus([...tempArray]);
      } else if (couter02 > 1) {
        tempArray[index].checkState = 'again';
        setDataPortList([...tempArray]);
        setDataPortListStatus([...tempArray]);
      }
    }
  };

  // set Approach
  const handleChangeApproach = (e, index) => {
    console.log('handleChangeApproach', e.target.value, index);
    let tempArray = [];
    tempArray = [...dataPortList];
    tempArray[index].approach = e.target.value;
    setDataPortList([...tempArray]);
    checkDataPortListApproach(tempArray);
  };
  // check apprach decision detail04
  const checkDataPortListApproach = (tempArray) => {
    console.log('checkDataPortListApproach', tempArray);
    let status = false;
    for (let i = 0; i < tempArray.length; i += 1) {
      if (tempArray[i].approach === 'Manual') {
        status = true;
      }
    }
    if (status === true) {
      console.log('checkDataPortListApproach', 'Manual');
      setDetail06(false);
    } else {
      setDetail06(true);
      // clear 2 radio selected
      setN3CheckArray(['', '']);
    }
  };

  return (
    <Accordion
      expanded={expanded05}
      onChange={() => setExpanded05(!expanded05)}
      style={{ width: '100%', marginTop: '1rem' }}
    >
      <AccordionSummary
        expandIcon={<ExpandMoreIcon style={{ ...Styles.title }} />}
        aria-controls="panel1bh-content"
        id="panel1bh-header"
        classes={{
          root: classes.muiAccordinSummaryRoot
        }}
      >
        <Typography variant="h4" style={{ ...Styles.typography }}>
          Data Port List
        </Typography>
      </AccordionSummary>
      <AccordionDetails style={{ display: 'block', minHeight: 280 }}>
        <Grid container spacing={3}>
          <Grid container {...Param.FormControlProps} md={6} lg={12}>
            <Grid {...Param.FormControlProps} md={6} lg={8}>
              <label>Please Fill In Data Port ID(s)</label>
            </Grid>

            <Grid {...Param.FormControlProps} md={6} lg={4}>
              <img
                src="/static/img/avatars/DataportID_UCH.png"
                alt="Case"
                style={
                  detail03 === true
                    ? { display: 'none' }
                    : { display: 'block', position: 'absolute', right: 30 }
                }
              />
            </Grid>
          </Grid>
        </Grid>
        {/* for Testing */}
        {dataPortList.map((item, index) => {
          console.log('dataPortList : ', item);
          // const obj = {};
          // obj.target.value = item.approach;
          // handleChangeApproach(obj, index);

          return (
            <div style={{ marginTop: 20 }} key={item.id ? item.id : index}>
              <DataPortItem
                item={item}
                dataPortList={dataPortList}
                setDataPortList={setDataPortList}
                index={index}
                detail01={detail01}
                detail02={detail02}
                detail03={detail03}
                detail04={detail04}
                autoCompleteOnChange={autoCompleteOnChange}
                inputDataPortIDOnBlur={inputDataPortIDOnBlur}
                handleInputDataPortID2={handleInputDataPortID2}
                handleChangeApproach={handleChangeApproach}
                handleInputDataPortRemarks={handleInputDataPortRemarks}
                hospital={hospital}
                serviceType={serviceType}
                setCheckLoad={setCheckLoad}
                dataPortListStatus={dataPortListStatus}
                setDataPortListStatus={setDataPortListStatus}
              />
            </div>
          );
        })}
        {/* Alert */}
        <Grid container>
          <label
            style={
              error03
                ? { display: 'block', color: 'red', padding: '5px 10px' }
                : { display: 'none' }
            }
          >
            Enter At Least One Data Port ID
          </label>
        </Grid>
      </AccordionDetails>
    </Accordion>
  );
};
export default DataPortID;
