import React, { memo, useState, useMemo } from 'react';
import { Autocomplete } from '@material-ui/lab';
import {
  Grid,
  TextField,
  CircularProgress,
  IconButton,
  makeStyles,
  Tooltip,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@material-ui/core';

import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import CancelIcon from '@material-ui/icons/Cancel';
import ErrorIcon from '@material-ui/icons/Error';

import _ from 'lodash';
import { CommonTip } from '../../../../components';
import { getUser } from '../../../../utils/auth';
import API from '../../../../api/webdp/webdp';
import { Param } from './indexStyle';

const useStyles = makeStyles(() => ({
  dataPortItem: {
    '&:hover .clearIcon': {
      visibility: 'visible !important'
    }
  }
}));

const DataPortItem = (props) => {
  const classes = useStyles();
  const {
    item,
    dataPortList,
    detail01,
    detail02,
    detail03,
    detail04,
    index,
    autoCompleteOnChange,
    inputDataPortIDOnBlur,
    handleInputDataPortID2,
    handleChangeApproach,
    handleInputDataPortRemarks,
    hospital,
    serviceType,
    setCheckLoad,
    dataPortListStatus,
    setDataPortListStatus
  } = props;

  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [checkState, setCheckState] = useState('');
  const optionsMemo = useMemo(() => options.map((optionItem) => optionItem.outletID), [options]);
  //   const optionsMemo = options.filter((item) => item.outletId === item.dataPortID);

  const userInfo = getUser();
  // console.log('usersssss', userInfo);

  //   onBlur
  const checkStatehandle = (value, index) => {
    if (value !== '') {
      setLoading(true);
      setCheckLoad(true);
      let checkStatus = 0;
      for (let i = 0; i < dataPortList.length; i += 1) {
        if (dataPortList[i].dataPortID === value) {
          checkStatus += 1;
        }
      }
      if (checkStatus > 1) {
        setLoading(false);
        setCheckLoad(false);
        setCheckState('again');
      } else {
        const obj = {};
        obj.outletID = value;
        obj.type = serviceType;
        obj.userId = userInfo.username;
        API.deRequestCheckIDStatus(obj).then((res) => {
          // console.log('deRequestCheckIDStatus', serviceType, res);
          if (res.data.code === 200) {
            setLoading(false);
            setCheckLoad(false);
            // console.log('Onblur', dataPortList, index, value);
            if (serviceType === 'Disable') {
              if (res.data.data === true) {
                setCheckState('true');
                updataStatus('true', index);
              } else if (res.data.data === false) {
                setCheckState('false');
                updataStatus('false', index);
              } else {
                setCheckState('incorrect');
                updataStatus('incorrect', index);
              }
            } else if (serviceType === 'Enable') {
              if (res.data.data === true) {
                setCheckState('true');
                updataStatus('false', index);
              } else if (res.data.data === false) {
                setCheckState('false');
                updataStatus('true', index);
              } else {
                setCheckState('incorrect');
                updataStatus('incorrect', index);
              }
            }
            // console.log('CheckStatus', dataPortList);
          }
        });
      }
    } else {
      setCheckState('');
    }
  };
  // updataStatus
  const updataStatus = (status, index) => {
    // console.log('updataStatus', dataPortListStatus);
    if (dataPortListStatus[index]) {
      let temp = [];
      temp = dataPortListStatus;
      temp[index].checkState = status;
      setDataPortListStatus(temp);
    }
  };

  return (
    <Grid
      container
      item
      alignItems="center"
      className={classes.dataPortItem}
      xs={12}
      lg={12}
      md={6}
    >
      <Autocomplete
        freeSolo
        forcePopupIcon
        name="dataPortList.items"
        disabled={detail02 || detail04}
        value={item.dataPortID || ''}
        onChange={(event, value) => {
          autoCompleteOnChange(event, index, value || '');
          if (!value) {
            setOptions([]);
          }
        }}
        options={optionsMemo || []}
        loading
        renderInput={(inputParams) => (
          <TextField
            {...inputParams}
            variant="outlined"
            size="small"
            name={`dataPortList.items[${index}].dataPortId`}
            label={`Data Port ID ${index + 1}`}
            style={{ width: 300 }}
            onFocus={() => {
              // console.log('onFocus', serviceType);
              if (hospital === '') {
                CommonTip.warning(`Please select a institution`);
              } else if (serviceType === null || serviceType === '') {
                CommonTip.warning('Select service type first');
              }
            }}
            onBlur={(e) => {
              const { value } = inputParams.inputProps;
              inputDataPortIDOnBlur(e, index, value);
              // Accurate Check ID
              console.log('xxx', hospital, serviceType);
              if (hospital === '') {
                CommonTip.warning(`Please select a institution`);
              } else if (serviceType === '') {
                CommonTip.warning('Please select Disable or Enable');
                // dataPortList[index].dataPortID = ''; //clear value
              } else {
                checkStatehandle(value, index);
              }
            }}
            onChange={(e) => {
              const newValue = e?.target?.value || '';
              handleInputDataPortID2(e, index, newValue);
              //   当输入第三个点的时候;
              const count = _.countBy(newValue)['.'];
              if (count === 3 && newValue.substr(newValue?.length - 1) === '.') {
                setLoading(true);
                API.deRequestCheckLikeID({ outletID: newValue, hospital })
                  .then((res) => {
                    console.log('Yancy DE ...', res);
                    const newOptions = res?.data?.data || [];
                    setOptions(newOptions);
                  })
                  .finally(() => {
                    setLoading(false);
                  });
              } else if (!newValue) {
                setOptions([]);
              }
            }}
          />
        )}
      />

      {/* Loading */}
      <IconButton size="small">
        {loading ? <CircularProgress color="inherit" size={30} /> : null}
      </IconButton>

      {/* GREEN(#00ab91) = OK Yellow = Warning  Red = Error */}
      <IconButton size="small">
        {(checkState === 'true' || checkState === 'false') && (
          <Tooltip
            placement="right"
            title={`Current status is  ${checkState === 'true' ? 'enabled' : 'disabled'}`}
          >
            {(serviceType === 'Disable' && checkState === 'true') ||
            (serviceType === 'Enable' && checkState === 'false') ? (
              <CheckCircleIcon color="primary" size={45} />
            ) : (
              <ErrorIcon color="primary" size={30} />
            )}
          </Tooltip>
        )}
        {/* {checkState === 'true' ? (
          <Tooltip placement="right" title="Current state enable">
            <CheckCircleIcon color="primary" size={45} />
          </Tooltip>
        ) : null}
        {checkState === 'false' ? (
          <Tooltip placement="right" title="Current state disable">
            <ErrorIcon color="primary" size={30} />
          </Tooltip>
        ) : null} */}
        {checkState === 'incorrect' ? (
          <Tooltip placement="right" title="This data port ID is incorrect!">
            <ErrorIcon style={{ color: '#ff8a80' }} size={30} />
          </Tooltip>
        ) : null}
        {checkState === 'again' ? (
          <Tooltip placement="right" title="This data port ID is recurring!">
            <CancelIcon color="secondary" size={30} />
          </Tooltip>
        ) : null}
      </IconButton>

      {/* N3 Mark Approach */}
      <FormControl
        {...Param.inputPropsDataPortID}
        variant="outlined"
        style={detail03 === true ? { width: '15%', marginLeft: 20 } : { display: 'none' }}
      >
        <InputLabel>Approach</InputLabel>
        <Select
          // labelId={`n3approach${index}`}
          // native
          label="Approach"
          value={item.approach}
          fullWidth
          onChange={(e) => {
            handleChangeApproach(e, index);
          }}
          disabled={detail02 || detail04}
        >
          {/* <MenuItem value="" /> */}
          {/* <MenuItem value="Progress">Progress</MenuItem> */}
          <MenuItem value="Auto">Redo</MenuItem>
          <MenuItem value="Manual">Manual</MenuItem>
          <MenuItem value="Skip">Skip</MenuItem>
        </Select>
      </FormControl>

      {/*  N3 Remark */}
      <TextField
        {...Param.inputPropsDataPortID}
        id={`dataPortID${index}`}
        value={item.dataPortRemarks}
        onChange={(e) => handleInputDataPortRemarks(e, index)}
        label="N3 Remark"
        fullWidth
        disabled={detail02 || detail04}
        style={detail03 === true ? { width: '15%', marginLeft: 20 } : { display: 'none' }}
      />

      {/* Automatic dataPortStatus Script Processing result */}
      <TextField
        {...Param.inputPropsDataPortID}
        label="Data Port Status"
        value={item.dataPortStatus === 'null' ? '' : item.dataPortStatus}
        fullWidth
        style={
          detail01 === true
            ? { display: 'block', width: '15%', marginLeft: 20 }
            : { display: 'none' }
        }
        disabled
      />
    </Grid>
  );
};
export default memo(DataPortItem);
