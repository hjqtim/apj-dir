import React, { memo, useState, useMemo, useEffect } from 'react';
import { Grid, Typography, TextField, CircularProgress } from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';
// import dayjs from 'dayjs';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router';
import dayjs from 'dayjs';
import { setJobType, setRestserviceForm } from '../../../../../redux/ResourceMX/resourceAction'; // redux

import useTitleProps from '../../../../../models/webdp/PropsModels/useTitleProps';
import useWebDPColor from '../../../../../hooks/webDP/useWebDPColor';
import FormControlProps from '../../../../../models/webdp/PropsModels/FormControlProps';
import webDPAPI from '../../../../../api/webdp/webdp';

import CommonSelect from '../../../../../components/CommonSelect';
import HAKeyboardDatePicker from '../../../../../components/HAKeyboardDatePicker';

import APForm from './APForm';
import ACLForm from './ACLForm';
import FormVR from './VRForm';
import FormVLan from './VLanForm';

import InstallationForm from './InstallationForm';

const JobType = () => {
  const jobTypeDate = useSelector((state) => state.resourceMX.jobType);
  const resourceStatus = useSelector((state) => state.resourceMX.resourceStatus);
  const touches = useSelector((state) => state.resourceMX.touches);
  const dispatch = useDispatch();
  // console.log('touches', touches);
  const TitleProps = useTitleProps();
  const webdpColor = useWebDPColor();
  const requestNoT = useParams().requestNo;
  const orderStatus = useParams().status;

  // for Job type
  const [jobType, setjobType] = useState('1');
  const [selectList] = useState([
    { label: 'Configuration', value: '0' },
    { label: 'New installation', value: '1' }
  ]);

  // for Service type
  const [serviceType, setServiceType] = useState('1');
  // console.log('serviceType', serviceType);
  const [Configuration] = useState([
    { label: 'AP standard config', value: '0' },
    { label: 'ACL', value: '1' },
    { label: 'VR', value: '2' },
    { label: 'VLAN', value: '3' }
  ]);
  const [Installation] = useState([]);
  const [selectList1, setSelectList1] = useState(Configuration);

  // for Job Type change
  const onSelectChange = (e) => {
    setjobType(e.target.value);
    if (e.target.value === '0') {
      setSelectList1(Configuration);
      jobTypeReducer('jobType', e.target.value);

      // 转场时 默认 配置 工作
      jobTypeReducer('serviceType', '1');
      const serviceFormRedux = [
        {
          id: '',
          key: Date.now().toString(36) + Math.random().toString(36).substr(2),
          switchIp: '',
          switchPort: '',
          Details: ''
        }
      ];
      dispatch(setRestserviceForm(serviceFormRedux));
    }
    if (e.target.value === '1') {
      setSelectList1(Installation);
      // setServiceType('');
      jobTypeReducer('jobType', e.target.value);
    }
  };
  // for Service Type change
  const onSelectChange1 = (e) => {
    setServiceType(e.target.value);
    jobTypeReducer('serviceType', e.target.value);

    if (e.target.value === '0' || e.target.value === '2' || e.target.value === '3') {
      const serviceFormRedux = [
        {
          id: '',
          key: Date.now().toString(36) + Math.random().toString(36).substr(2),
          switchIp: '',
          switchPort: '',
          vLan: ''
        }
      ];
      dispatch(setRestserviceForm(serviceFormRedux));
    }
    if (e.target.value === '1') {
      const serviceFormRedux = [
        {
          id: '',
          key: Date.now().toString(36) + Math.random().toString(36).substr(2),
          switchIp: '',
          switchPort: '',
          Details: ''
        }
      ];
      dispatch(setRestserviceForm(serviceFormRedux));
    }
  };

  const [staffListLoading, setStaffListLoading] = useState(false);
  const [statffName, setStaffName] = useState('');
  const [staffList, setStaffList] = useState([]);

  const optionsStaff = useMemo(
    () => staffList.map((optionItem) => optionItem.display),
    [staffList]
  );

  const [targetAt, setTargetAt] = useState([dayjs('1990-01-01'), dayjs('1990-01-01')]);
  const [rangeDate, setRangeDate] = useState({ startDate: null, endDate: null });

  const handleDataChange = (val, status) => {
    let { startDate } = rangeDate;
    let { endDate } = rangeDate;

    if (status === 'startDate') {
      startDate = val;
      setTargetAt([targetAt[0], startDate]);
      setRangeDate({ startDate, endDate });
      jobTypeReducer('startDate', startDate);
      jobTypeReducer('endDate', endDate);
    }
    if (status === 'endDate') {
      endDate = val;
      setRangeDate({ startDate, endDate });
      jobTypeReducer('startDate', startDate);
      jobTypeReducer('endDate', endDate);
    }
  };

  const checkUser2 = (value) => {
    // console.log('chekc', value);
    setStaffListLoading(true);
    const obj = {};
    obj.username = value;
    webDPAPI
      .getADUserList(obj)
      .then((res) => {
        // console.log('getADUserList', res.data.data);
        if (res.data.code === 200) {
          const tempData = res.data.data;
          setStaffList([...tempData]);
        }
      })
      .finally(() => {
        setStaffListLoading(false);
      });
  };

  // useEffect(() => {
  //   FormRequest();
  // }, [serviceType]);

  const jobTypeReducer = (fied, value) => {
    if (fied === 'jobType') {
      jobTypeDate.jobType = value;
    }
    if (fied === 'serviceType') {
      jobTypeDate.serviceType = value;
    }
    if (fied === 'staffName') {
      jobTypeDate.staffName = value;
    }
    if (fied === 'startDate') {
      jobTypeDate.startDate = value;
    }
    if (fied === 'endDate') {
      jobTypeDate.endDate = value;
    }
    dispatch(setJobType(jobTypeDate));
  };

  const initReducer = () => {
    jobTypeReducer('jobType', '1');
    jobTypeReducer('serviceType', '1');
    jobTypeReducer('staffName', '');
    jobTypeReducer('startDate', '');
    jobTypeReducer('endDate', '');
  };
  useEffect(() => {
    initReducer();
  }, []);

  const setDetailJobType = (jobTypeDate) => {
    // console.log('setDetailJobType', jobTypeDate);
    setjobType(jobTypeDate.jobType?.toString());
    setServiceType(jobTypeDate.serviceType?.toString());
    setStaffName(jobTypeDate.staffName);
    setRangeDate({ startDate: jobTypeDate.startDate, endDate: jobTypeDate.endDate });

    jobTypeReducer('jobType', jobTypeDate.jobType?.toString());
    jobTypeReducer('serviceType', jobTypeDate.serviceType?.toString());
    jobTypeReducer('staffName', jobTypeDate.staffName);
    jobTypeReducer('startDate', jobTypeDate.startDate);
    jobTypeReducer('endDate', jobTypeDate.endDate);
  };
  // init detail
  useEffect(() => {
    // console.log('jobTypeDate', jobTypeDate);
    setDetailJobType(jobTypeDate);
  }, [jobTypeDate]);

  return (
    <Grid container>
      {/* Job and Service type */}
      <Grid {...TitleProps}>
        <Typography variant="h6" style={{ color: webdpColor.title }}>
          <strong>Job and Service Type</strong>
        </Typography>
      </Grid>
      <Grid container spacing={3}>
        <Grid {...FormControlProps} md={6} lg={3} style={{ marginTop: 10, marginBottom: 10 }}>
          <CommonSelect
            style={{ background: '#fff', width: '100%' }}
            fullWidth
            outlined
            label="Job Type"
            name="Job Type"
            size="small"
            // width={2.557}
            value={jobType}
            itemList={selectList}
            onSelectChange={onSelectChange}
            disabled={
              (resourceStatus === 'detailSubmited' && !requestNoT) ||
              orderStatus === 'detail' ||
              resourceStatus === 'detailApproved' ||
              resourceStatus === 'detailDone'
            }
          />
        </Grid>
        <Grid {...FormControlProps} md={6} lg={3} style={{ marginTop: 10, marginBottom: 10 }}>
          {jobType === '0' ? (
            <CommonSelect
              style={{ background: '#fff', width: '100%' }}
              fullWidth
              outlined
              labelWidth={90}
              label="Service Type *"
              name="Service Type "
              size="small"
              // width={2.557}
              value={serviceType}
              itemList={selectList1}
              onSelectChange={onSelectChange1}
              error={Boolean(touches?.jobType?.serviceType)}
              disabled={
                (resourceStatus === 'detailSubmited' && !requestNoT) ||
                orderStatus === 'detail' ||
                resourceStatus === 'detailApproved' ||
                resourceStatus === 'detailDone'
              }
            />
          ) : null}
        </Grid>
        <Grid {...FormControlProps} md={6} lg={3} style={{ marginTop: 10, marginBottom: 10 }}>
          {jobType === '0' ? (
            <Autocomplete
              style={{ width: '100%' }}
              freeSolo
              id="Assignstaff"
              value={statffName || null}
              options={optionsStaff || []}
              onChange={(_, value) => {
                // console.log('staffName Slect', _, value);
                setStaffName(value);
                // jobTypeReducer('staffName', value);
                // dispatch(setTouch({ field: 'jobType', data: { staffName: true } }));
              }} // 选择下拉 时 触发
              disabled={
                (resourceStatus === 'detailSubmited' && !requestNoT) ||
                orderStatus === 'detail' ||
                resourceStatus === 'detailApproved' ||
                resourceStatus === 'detailDone'
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Contact Person *"
                  variant="outlined"
                  size="small"
                  value={statffName || null}
                  onChange={(e) => {
                    const staffNameTemp = e.target.value;
                    if (staffNameTemp.length > 2) {
                      checkUser2(e.target.value);
                    }
                  }} // 手写时 触发
                  onBlur={(e) => {
                    console.log('staffName onBlur:', e.target.value);
                    setStaffName(e.target.value);
                    jobTypeReducer('staffName', e.target.value);
                  }}
                  error={Boolean(touches?.jobType?.staffName)}
                  // for loading
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <>
                        {staffListLoading && !staffList ? (
                          <CircularProgress size={20} color="inherit" />
                        ) : null}
                        {params.InputProps.endAdornment}
                      </>
                    )
                  }}
                />
              )}
              // disabled={!disableStatus}
            />
          ) : null}
        </Grid>

        <Grid {...FormControlProps} md={6} lg={3} style={{ marginTop: 10, marginBottom: 10 }} />
        {jobType === '0' ? (
          <>
            <Grid {...FormControlProps} sm="auto" md="auto" lg={2}>
              <HAKeyboardDatePicker
                label="Start Date *"
                minDate={targetAt[0]}
                value={rangeDate.startDate || ''}
                onChange={(val) => {
                  // console.log('HAKeyboardDatePicker', val);
                  handleDataChange(val, 'startDate');
                  // dispatch(setTouch({ field: 'jobType', data: { startDate: true } }));
                }}
                error={Boolean(touches?.jobType?.startDate)}
                disabled={
                  (resourceStatus === 'detailSubmited' && !requestNoT) ||
                  orderStatus === 'detail' ||
                  resourceStatus === 'detailApproved' ||
                  resourceStatus === 'detailDone'
                }
              />
            </Grid>
            <Grid {...FormControlProps} sm="auto" md="auto" lg={2}>
              <HAKeyboardDatePicker
                label="Target Date *"
                minDate={targetAt[1]}
                value={rangeDate.endDate || ''}
                onChange={(val) => {
                  // console.log('HAKeyboardDatePicker', val);
                  handleDataChange(val, 'endDate');
                  // dispatch(setTouch({ field: 'jobType', data: { endDate: true } }));
                  // console.log(touches.jobType.endDate);
                }}
                error={Boolean(touches?.jobType?.endDate)}
                disabled={
                  (resourceStatus === 'detailSubmited' && !requestNoT) ||
                  orderStatus === 'detail' ||
                  resourceStatus === 'detailApproved' ||
                  resourceStatus === 'detailDone'
                }
              />
            </Grid>
          </>
        ) : null}
        {/* </Grid> */}
      </Grid>

      <Grid container spacing={3}>
        <Grid {...FormControlProps} md={12} lg={12} style={{ marginTop: 18 }}>
          {jobType === '0' && serviceType === '0' ? (
            <APForm />
          ) : jobType === '0' && serviceType === '1' ? (
            <ACLForm />
          ) : jobType === '0' && serviceType === '2' ? (
            <FormVR />
          ) : jobType === '0' && serviceType === '3' ? (
            <FormVLan />
          ) : jobType === '1' ? (
            <InstallationForm />
          ) : null}
        </Grid>
      </Grid>
    </Grid>
  );
};
export default memo(JobType);
