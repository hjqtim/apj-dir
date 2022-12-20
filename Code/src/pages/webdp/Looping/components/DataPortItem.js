import React, { memo, useState, useMemo } from 'react';
import {
  Grid,
  TextField,
  CircularProgress,
  IconButton,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Tooltip
} from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';
import { ClearOutlined, Error, CheckCircle } from '@material-ui/icons';
import _ from 'lodash';
import { CommonTip } from '../../../../components';
import webdpAPI from '../../../../api/webdp/webdp';

const iconWidth = 60;

const DataPortItem = (props) => {
  const {
    item,
    index,
    setValueByIndex,
    addDataPortItem,
    isLast, // 是否为数组最后一项
    deleteItem,
    isDetail,
    handleBlur,
    touched,
    handleChange,
    isApproval,
    requestType,
    isCompleted = false,
    listValues,
    setFieldValue,
    errors,
    detailData,
    formik
  } = props;

  const [loading, setLoading] = useState(false);
  const [options, setOptions] = useState([]);

  const optionsMemo = useMemo(() => {
    const result = options
      .map((optionItem) => optionItem.outletID)
      .filter((filterItem) =>
        filterItem.toLowerCase?.()?.includes(item.dataPortId?.toLowerCase?.())
      );
    return result;
  }, [options, item.dataPortId]);

  const getDataPortError = () => {
    // 如果数组只有一项
    if (index === 0 && isLast && touched?.[0] && errors?.[0]) {
      return true;
    }
    if (errors?.[index] && touched?.[index] && !item.isChecking && !isLast) {
      return true;
    }
    return false;
  };

  //   失去焦点时新增一个item
  const onBlur = (e) => {
    handleBlur(e);

    if (!isDetail && !isApproval && isLast && item.dataPortId) {
      addDataPortItem(index);
    }

    if (!requestType) {
      CommonTip.warning('Select service type first');
      return;
    }

    const hasSame = listValues?.find(
      (findItem) => findItem.id !== item.id && findItem.dataPortId === item.dataPortId
    );

    if (hasSame) {
      setValueByIndex(index, 'checkStatus', 'same');
      return;
    }

    if (!item.dataPortId || item.isChecking || isApproval) {
      return;
    }

    const checkParams = {
      outletID: item.dataPortId,
      type: requestType
    };
    setValueByIndex(index, 'isChecking', true);

    webdpAPI
      .checkLoopDataPortID(checkParams)
      .then((res) => {
        const { status = 'inexistence' } = res?.data?.data || {};
        setValueByIndex(index, 'checkStatus', status);
      })
      .finally(() => {
        setValueByIndex(index, 'isChecking', false);
      });
  };

  const getGridProps = () => {
    const approvalProps = {
      xl: 3,
      lg: 4,
      md: 6,
      sm: 12,
      xs: 12,
      alignItems: 'center',
      container: true,
      item: true
    };

    const detailProps = {
      xl: 4,
      lg: 6,
      md: 12,
      sm: 12,
      xs: 12,
      alignItems: 'center',
      container: true,
      item: true
    };

    const defaultProps = {
      alignItems: 'center',
      container: true,
      item: true
    };

    if (isApproval) {
      return approvalProps;
    }
    if (isDetail) {
      return detailProps;
    }
    return defaultProps;
  };

  const getStatusMap = (status) => {
    const statusMap = {
      true: {
        icon: <CheckCircle style={{ color: '#00AB91' }} size={30} />,
        title: 'CHECK OK'
      },
      false: {
        icon: <Error style={{ color: '#F99500' }} size={30} />,
        title: `This data port id is in ${requestType} state`
      },
      inexistence: {
        icon: <Error color="error" size={30} />,
        title: 'This data port id does not exist'
      },
      same: {
        icon: <Error style={{ color: '#F99500' }} size={30} />,
        title: 'The data port id already exists'
      }
    };
    return statusMap[status] || { icon: null, title: '' };
  };

  return (
    <Grid container item alignItems="center" spacing={4}>
      <Grid {...getGridProps()} style={{ width: !isDetail && !isApproval ? 400 : '' }}>
        <Grid item style={{ flex: 1 }}>
          <Tooltip title={isDetail || isApproval ? item.dataPortId : ''} placement="top">
            <Autocomplete
              freeSolo
              forcePopupIcon
              name="dataPortList.items"
              disabled={isDetail || isApproval}
              value={item.dataPortId || ''}
              onChange={(event, value) => {
                setValueByIndex(index, 'dataPortId', value || '');
                if (!value) {
                  setOptions([]);
                }
              }}
              options={optionsMemo || []}
              onBlur={onBlur}
              loading
              renderInput={(inputParams) => (
                <TextField
                  {...inputParams}
                  variant="outlined"
                  size="small"
                  name={`dataPortList.items[${index}].dataPortId`}
                  label={`Data Port ID ${index + 1}${
                    !isLast || (isLast && index === 0) ? ' *' : ''
                  }`}
                  fullWidth
                  error={getDataPortError()}
                  InputProps={{
                    ...inputParams.InputProps,
                    endAdornment: (
                      <>
                        {loading ? <CircularProgress size={20} color="inherit" /> : null}
                        {inputParams.InputProps.endAdornment}
                      </>
                    )
                  }}
                  onChange={(e) => {
                    const newValue = e?.target?.value || '';
                    setValueByIndex(index, 'dataPortId', newValue);
                    //   当输入第三个点的时候;
                    const count = _.countBy(newValue)['.'];
                    if (count === 3 && newValue.substr(newValue?.length - 1) === '.') {
                      setLoading(true);
                      webdpAPI
                        .deRequestCheckLikeID({
                          outletID: newValue,
                          hospital: formik.values.service.requestHosp?.hospital
                        })
                        .then((res) => {
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
          </Tooltip>
        </Grid>
        <Grid item container style={{ width: iconWidth }} alignItems="center">
          {!isLast && !isDetail && !isApproval && !item.isChecking && (
            <IconButton size="small" onClick={() => deleteItem(item, index)}>
              <ClearOutlined />
            </IconButton>
          )}

          {item.isChecking && (
            <CircularProgress size={20} style={{ marginLeft: '3px' }} color="inherit" />
          )}

          {item.checkStatus && !item.isChecking && (
            <Tooltip title={getStatusMap(item.checkStatus).title} placement="right">
              {getStatusMap(item.checkStatus).icon}
            </Tooltip>
          )}
        </Grid>
      </Grid>

      {isApproval && (
        <Grid {...getGridProps()}>
          <Grid item style={{ flex: 1 }}>
            <FormControl
              fullWidth
              size="small"
              variant="outlined"
              disabled={isCompleted || detailData?.readOnly || false}
            >
              <InputLabel>Approach</InputLabel>
              <Select
                label="Approach"
                value={item.approach || ''}
                name={`dataPortList.items[${index}].approach`}
                onChange={(e) => {
                  handleChange(e);
                  listValues[index].approach = e.target.value;
                  const hasManual = listValues.find(
                    (approachItem) => approachItem.approach === 'Manual'
                  );
                  if (!hasManual) {
                    setFieldValue('configureSwitch', false);
                    setFieldValue('configureSwitch2', false);
                  }
                }}
              >
                <MenuItem value="Progress">Progress</MenuItem>
                <MenuItem value="Auto">Auto</MenuItem>
                <MenuItem value="Manual">Manual</MenuItem>
                {/* <MenuItem value="Skip">Skip</MenuItem> */}
              </Select>
            </FormControl>
          </Grid>
          <Grid item style={{ width: iconWidth }} />
        </Grid>
      )}

      {(isApproval || isDetail) && (
        <Grid {...getGridProps()}>
          <Grid item style={{ flex: 1 }}>
            <Tooltip title={isDetail || isCompleted ? item.dataPortRemarks : ''} placement="top">
              <TextField
                name={`dataPortList.items[${index}].dataPortRemarks`}
                label="Remarks"
                variant="outlined"
                size="small"
                fullWidth
                value={item.dataPortRemarks || ''}
                onChange={handleChange}
                disabled={isDetail || isCompleted || detailData?.readOnly || false}
              />
            </Tooltip>
          </Grid>
          <Grid item style={{ width: iconWidth }} />
        </Grid>
      )}

      {isApproval && (
        <Grid {...getGridProps()}>
          <Grid item style={{ flex: 1 }}>
            <TextField
              name={`dataPortList.items[${index}].processStatus`}
              label="Data Port Status"
              variant="outlined"
              size="small"
              fullWidth
              value={item.processStatus || ''}
              disabled
            />
          </Grid>
          <Grid item style={{ width: iconWidth }} />
        </Grid>
      )}
    </Grid>
  );
};

export default memo(DataPortItem);
