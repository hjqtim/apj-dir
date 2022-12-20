import React, { useCallback, useState, useEffect, memo } from 'react';
import dayjs from 'dayjs';
import {
  Grid,
  TextField,
  Typography,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  CircularProgress
} from '@material-ui/core';
import { useFormik } from 'formik';
import _ from 'lodash';
import Autocomplete from '@material-ui/lab/Autocomplete';
import * as Yup from 'yup';
import { CommonDialog, HAKeyboardDatePicker, Loading, CommonTip } from '../../../../../components';
import FormControlInputProps from '../../../../../models/webdp/PropsModels/FormControlInputProps';
import webAPI from '../../../../../api/webdp/webdp';
import ipassignAPI from '../../../../../api/ipassign';
import { validMacAddress, handleValidation, validIp } from '../../../../../utils/tools';

const Edit = ({
  open,
  setOpen,
  rows,
  currentEditRow,
  getIpAdminList,
  params,
  isAdd,
  hospitalList,
  hospitalLoading
}) => {
  const [loading, setLoading] = useState(false);
  const [initHasUser, setInitHasUser] = useState(false);
  const [initReleaseDate, setInitReleaseDate] = useState(null);
  const [subnetList, setSubnetList] = useState([]);
  const [isExitIP, setIsExitIP] = useState([]);
  const [requesteroptions, setRequesteroptions] = useState([]);

  useEffect(() => {
    if (isAdd && params.hospital) {
      formik.setFieldValue('hospital', params?.hospital || '');
      if (open) getSubnetList({ hospCode: params?.hospital?.hospital });
    }
  }, [params, open]);

  const getSubnetList = (data) => {
    ipassignAPI.getSubnetList(data).then((res) => {
      let resSubnetList = res?.data?.data?.subnetList || [];
      resSubnetList = resSubnetList.map((item) => item.newSubnet);
      resSubnetList = resSubnetList.filter((item) => item);
      resSubnetList = _.unionBy(resSubnetList);
      resSubnetList.sort();
      setSubnetList(resSubnetList);
    });
  };

  useEffect(() => {
    if (!_.isEmpty(currentEditRow)) {
      const subnet = currentEditRow?.ipAddress?.split('.')?.slice(0, 3)?.join('.');
      const startIP = currentEditRow?.ipAddress?.split('.').pop();
      const {
        ipAddress,
        lastUser,
        phone,
        purpose,
        macAddress,
        hospital,
        remark,
        available,
        tempFlag,
        releaseData,
        portId
      } = currentEditRow;
      setInitHasUser(Boolean(lastUser));
      setInitReleaseDate(releaseData);
      formik.setValues({
        subnet,
        ipAddress,
        lastUser,
        phone,
        purpose,
        macAddress,
        hospital,
        remark,
        startIP,
        portId,
        available: Number(available),
        tempFlag: Number(tempFlag),
        releaseData: releaseData || null,
        count: 1
      });
    }
  }, [currentEditRow]);

  const formik = useFormik({
    initialValues: {
      subnet: '',
      ipAddress: '',
      lastUser: '',
      phone: '',
      purpose: '',
      macAddress: '',
      hospital: '',
      remark: '',
      portId: '',
      available: 0,
      tempFlag: 1,
      releaseData: dayjs(new Date()).format('YYYY-MM-DD'),
      startIP: '',
      count: 1
    },
    validationSchema: Yup.object({
      subnet: Yup.string().required('Error'),
      ipAddress: Yup.string().test((ip) => validIp(ip))
    }),
    validate: (values) => {
      const dynamicError = {};
      if (!isAdd && !values.startIP) {
        dynamicError.startIP = 'Error';
      }
      if (values.phone && values.phone.length !== 8) {
        dynamicError.phone = 'Error';
      }
      if (values.macAddress && !validMacAddress(values.macAddress)) {
        dynamicError.macAddress = 'Error';
      }

      if (
        !isAdd &&
        (Number(values.startIP) + Number(values.count) > 255 ||
          Number(values.count) === 0 ||
          !values.count === 0)
      ) {
        dynamicError.count = 'Error';
      }
      return dynamicError;
    },
    onSubmit: (values) => {
      let queryData = {
        ...values,
        remark: remark || '',
        releaseData: releaseData || '',
        ipAddress: `${values.subnet}.${values.startIP}`,
        count: Number(count)
      };
      if (isAdd) {
        queryData = { ...queryData, count: 1, ipAddress: values.ipAddress };
      }
      Loading.show();
      ipassignAPI
        .copyIpAddress(queryData)
        .then((res) => {
          if (res?.data?.code === 200) {
            CommonTip.success(`Success.`);
            if (params.ipAddress) {
              getIpAdminList({ ipAddressList: `${params.subnet}.${ipAddress}` });
            } else if (!params.ipAddress && params.subnet) {
              getIpAdminList({ subnet: params.subnet });
            }
            setOpen(false);
            formik.handleReset();
          }
        })
        .finally(() => {
          Loading.hide();
        });
    }
  });

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    const { subnet, startIP, count } = formik.values;
    const ipLists = [];
    if (count && startIP && Number(count) < 255) {
      new Array(Number(count)).fill('').forEach((_, index) => {
        const ipAddress = `${subnet}.${Number(startIP) + index}`;
        ipLists.push(ipAddress);
      });
    } else {
      setIsExitIP([]);
    }
    if (ipLists.length !== 0) {
      let exitIP = [];
      ipLists.forEach((item) => {
        const currentData = rows?.find((row) => row?.id === item);
        if (currentData?.lastUser) {
          exitIP = [...exitIP, item];
        }
      });
      setIsExitIP(exitIP);
    }
  }, [formik.values.count, formik.values.startIP]);

  const checkAD = useCallback(
    _.debounce((inputValue) => {
      if (inputValue?.length >= 3 && !loading) {
        setLoading(true);
        setRequesteroptions([]);
        webAPI
          .findUserList({ username: inputValue })
          .then((res) => {
            const newOptions = res?.data?.data || [];
            setRequesteroptions(newOptions);
          })
          .finally(() => {
            setLoading(false);
          }, []);
      }
    }, 800),
    [loading]
  );

  const {
    handleBlur,
    handleChange,
    setFieldValue,
    values: {
      subnet,
      ipAddress,
      lastUser,
      phone,
      purpose,
      macAddress,
      hospital,
      remark,
      portId,
      available,
      tempFlag,
      releaseData,
      startIP,
      count
    }
  } = formik;

  return (
    <>
      <CommonDialog
        title={isAdd ? 'Add' : 'Edit'}
        open={open}
        ConfirmText={isAdd ? 'Save' : 'Copy'}
        handleClose={handleClose}
        handleConfirm={() => {
          if (!formik.isValid) handleValidation();
          formik.handleSubmit();
        }}
        isHideFooter={false}
        maxWidth="md"
        content={
          <div style={{ padding: '1em' }}>
            <Grid container spacing={3}>
              <Grid item xs={6}>
                <Autocomplete
                  onChange={(e, value) => {
                    setFieldValue('subnet', value || '');

                    if (value) {
                      setFieldValue('ipAddress', value);
                    } else {
                      setFieldValue('ipAddress', ``);
                    }
                  }}
                  disabled={!isAdd}
                  value={subnet}
                  options={subnetList}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      {...FormControlInputProps}
                      label="Subnet *"
                      name="subnet"
                      onBlur={handleBlur}
                      error={Boolean(formik.errors.subnet && formik.touched.subnet)}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  disabled={!isAdd || !ipAddress}
                  {...FormControlInputProps}
                  label="IP Address *"
                  name="ipAddress"
                  value={ipAddress}
                  onBlur={handleBlur}
                  error={Boolean(formik.errors.ipAddress && formik.touched.ipAddress)}
                  onChange={(e) => {
                    const ipAddress = e.target.value || '';
                    const count = _.countBy(ipAddress)['.'];
                    if (count === 3) {
                      setFieldValue('ipAddress', ipAddress);
                    }
                  }}
                />
              </Grid>
              <Grid item xs={6}>
                <Autocomplete
                  freeSolo
                  forcePopupIcon
                  value={lastUser}
                  disabled={initHasUser}
                  onChange={(e, val) => {
                    const curentrData = requesteroptions.find((item) => item.display === val);
                    setFieldValue('lastUser', val || '');
                    if (!_.isUndefined(curentrData)) {
                      setFieldValue('phone', curentrData.phone || '');
                    }
                    if (!val) {
                      setFieldValue('phone', '');
                    }
                  }}
                  options={requesteroptions?.map((optionItem) => optionItem?.display) || []}
                  renderInput={(inputParams) => (
                    <TextField
                      {...inputParams}
                      label="Current/Last User *"
                      variant="outlined"
                      size="small"
                      name="lastUser"
                      fullWidth
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
                        const inputVal = e?.target?.value || '';
                        setFieldValue('prRequester', inputVal);
                        checkAD(inputVal);
                      }}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  {...FormControlInputProps}
                  label="Phone"
                  name="phone"
                  value={phone || ''}
                  onBlur={handleBlur}
                  error={Boolean(formik.errors.phone && formik.touched.phone)}
                  inputProps={{ maxLength: 8 }}
                  onChange={(e) => {
                    if ((e.target.value && /^[0-9]*$/.test(e.target.value)) || !e.target.value) {
                      handleChange(e);
                    }
                  }}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  {...FormControlInputProps}
                  label="Purpose"
                  name="purpose"
                  value={purpose}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  {...FormControlInputProps}
                  label="Mac Address"
                  name="macAddress"
                  value={macAddress}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  error={Boolean(formik.errors.macAddress && formik.touched.macAddress)}
                />
              </Grid>
              <Grid item xs={6}>
                <Autocomplete
                  onChange={(e, value) => {
                    setFieldValue('releaseData', value.hospital || '');
                  }}
                  value={hospitalList?.find((item) => item.hospital === hospital) || null}
                  options={hospitalList || []}
                  getOptionLabel={(option) => `${option.hospital}---${option.hospitalName}`}
                  disabled={isAdd}
                  loading={hospitalLoading}
                  renderInput={(params) => (
                    <TextField {...params} {...FormControlInputProps} label="Institution" />
                  )}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  {...FormControlInputProps}
                  label="Remarks"
                  name="remark"
                  value={remark}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  {...FormControlInputProps}
                  label="Port ID"
                  name="portId"
                  value={portId}
                  onChange={(e) => {
                    if ((e.target.value && /^[0-9]*$/.test(e.target.value)) || !e.target.value) {
                      handleChange(e);
                    }
                  }}
                />
              </Grid>
              <Grid item xs={6}>
                <FormControl fullWidth size="small" variant="outlined">
                  <InputLabel>Available</InputLabel>
                  <Select
                    label="Available"
                    name="available"
                    value={Number(available)}
                    onChange={(e, params) => {
                      handleChange(e);
                      if (params.props.value === 1) {
                        setFieldValue('releaseData', '');
                      }
                    }}
                  >
                    <MenuItem value={0}>No</MenuItem>
                    <MenuItem value={1}>Yes</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={6}>
                <FormControl fullWidth size="small" variant="outlined">
                  <InputLabel>Perm/Temp</InputLabel>
                  <Select
                    label="Perm/Temp"
                    name="tempFlag"
                    value={Number(tempFlag)}
                    onChange={handleChange}
                  >
                    <MenuItem value={0}>Perm</MenuItem>
                    <MenuItem value={1}>Temp</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={6}>
                <HAKeyboardDatePicker
                  label="Release Date"
                  name="releaseData"
                  disabled={Number(available) === 1}
                  minDate={initReleaseDate || dayjs(new Date()).format('YYYY-MM-DD')}
                  value={releaseData}
                  onChange={(data) => {
                    setFieldValue('releaseData', data);
                  }}
                />
              </Grid>

              {!isAdd && (
                <Grid item xs={12}>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <Typography>IP Copy the data a new IP</Typography>
                    &nbsp;{subnet}.&nbsp;
                    <TextField
                      size="small"
                      variant="outlined"
                      value={startIP}
                      onChange={handleChange}
                      name="startIP"
                      onBlur={handleBlur}
                      error={Boolean(formik.errors.startIP && formik.touched.startIP)}
                      style={{ width: 50 }}
                    />
                    &nbsp;No. of IP: &nbsp;
                    <TextField
                      size="small"
                      variant="outlined"
                      value={count}
                      onChange={handleChange}
                      name="count"
                      onBlur={handleBlur}
                      error={Boolean(formik.errors.count && formik.touched.count)}
                      style={{ width: 50 }}
                    />
                  </div>
                </Grid>
              )}
              {!isAdd && isExitIP.length !== 0 && (
                <Grid item xs={12}>
                  <Typography variant="body2">
                    These's IP [
                    {isExitIP.map((ip, index) => (
                      <span key={ip} style={{ color: 'red', marginLeft: '3px' }}>
                        {ip} {index !== isExitIP.length - 1 && <>,</>}
                      </span>
                    ))}
                    ] can not edit, will be skip.
                  </Typography>
                </Grid>
              )}
            </Grid>
          </div>
        }
      />
    </>
  );
};

export default memo(Edit);
