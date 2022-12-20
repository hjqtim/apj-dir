import React, { memo, useState, useMemo, useEffect } from 'react';
import { Grid, Typography, TextField, CircularProgress } from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';

import { useFormik } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router';
import dayjs from 'dayjs';
import { setBindAppForm } from '../../../../../redux/ResourceMX/resourceAction';

import useTitleProps from '../../../../../models/webdp/PropsModels/useTitleProps';
import useWebDPColor from '../../../../../hooks/webDP/useWebDPColor';
import FormControlProps from '../../../../../models/webdp/PropsModels/FormControlProps';
import resourceAPI from '../../../../../api/resourceManage/index';

import CommonSelect from '../../../../../components/CommonSelect';

const JobType = () => {
  const bindAppForm = useSelector((state) => state.resourceMX.bindAppForm);
  const resourceStatus = useSelector((state) => state.resourceMX.resourceStatus);
  const touches = useSelector((state) => state.resourceMX.touches);
  // console.log('touches', touches);
  const dispatch = useDispatch();
  const requestNoT = useParams().requestNo;
  const orderStatus = useParams().status;
  // console.log('orderStatus...', orderStatus, resourceStatus);

  const formik = useFormik({
    initialValues: {
      requestNoInfo: {
        requestername: '',
        requesterphone: '',
        submissiondate: '',
        serviceathosp: ''
      }
    }
  });
  const { setFieldValue } = formik;

  const [requestNoList, setRequestNoList] = useState([]);
  const optionsMemo = useMemo(
    () => requestNoList.map((optionItem) => optionItem.requestNo),
    [requestNoList]
  );
  const [ipListLoading, setIpListLoading] = useState(false);
  const [requestNo, setRequestNoItem] = useState(''); // autoComplete 变更时使用

  const TitleProps = useTitleProps();
  const webdpColor = useWebDPColor();

  const [requestType, setSelectValue3] = useState('');
  const [selectList3] = useState([
    { label: 'DP', value: 'DP' },
    { label: 'AP', value: 'AP' },
    { label: 'DE', value: 'DE' },
    // { label: 'LP', value: 'LP' },
    { label: 'IP', value: 'IP' },
    { label: 'IPR', value: 'IPR' },
    { label: 'IPU', value: 'IPU' }
  ]);

  // for requestType
  const onSelectChange3 = (e) => {
    setSelectValue3(e.target.value);
    const obj = {};
    obj.requestType = e.target.value;
    obj.currentPage = 1;
    obj.pageSize = 1000;
    setIpListLoading(true);
    resourceAPI
      .searchApplicationType(obj)
      .then((res) => {
        if (res?.data?.requestDataList?.list.length > 0) {
          const tempList = res?.data?.requestDataList?.list;
          // 测试数据有问题 有些 目标 数据 未 null 会影响到 autoComplete 组件 的使用
          let newTempList = [];
          tempList.forEach((element) => {
            if (element.requestNo !== null) {
              newTempList = [...newTempList, element];
            }
          });
          // console.log('resourceAPI 2', newTempList);
          setRequestNoList([...newTempList]);
        }
      })
      .finally(() => {
        setIpListLoading(false);
      });
  };

  // AutoComplete text
  // const handleAutoCompleteChange = (e) => {
  // console.log('handleAutoCompleteChange', e);
  // setRequestNoItem(e.target.value);
  // };
  // show requestInfo
  const showRequestInfo = (v) => {
    const tempFilter = requestNoList.filter((item) => item.requestNo === v);
    console.log('showRequestInfo', tempFilter);
    if (tempFilter && tempFilter.length > 0) {
      const obj = {};
      if (requestType === 'DP' || requestType === 'AP') {
        obj.requestername = tempFilter[0].requestername;
        obj.requesterphone = tempFilter[0].requesterphone;
        obj.submissiondate = tempFilter[0].submissiondate;
        obj.serviceathosp = tempFilter[0].serviceathosp;
      }
      if (requestType === 'DE') {
        obj.requestername = tempFilter[0].requesterName;
        obj.requesterphone = tempFilter[0].requesterPhone;
        obj.submissiondate = tempFilter[0].createdDate;
        obj.serviceathosp = tempFilter[0].forRequestHosp;
      }
      if (requestType === 'IP') {
        obj.requestername = tempFilter[0].userName;
        obj.requesterphone = tempFilter[0].userPhone;
        obj.submissiondate = tempFilter[0].createdDate;
        obj.serviceathosp = tempFilter[0].hospital;
      }
      if (requestType === 'IPR') {
        obj.requestername = tempFilter[0].requesterName;
        obj.requesterphone = tempFilter[0].telNo;
        obj.submissiondate = tempFilter[0].createdDate;
        obj.serviceathosp = tempFilter[0].requesterDomain;
      }
      if (requestType === 'IPU') {
        obj.requestername = tempFilter[0].requesterDomain;
        obj.requesterphone = tempFilter[0].requesterPhone;
        obj.submissiondate = dayjs(tempFilter[0].createdDate).format('DD-MMM-YYYY HH:mm:ss');
        obj.serviceathosp = tempFilter[0].hospital;
      }

      setFieldValue('requestNoInfo', obj);
    } else {
      const obj = {
        requestername: '',
        requesterphone: '',
        submissiondate: '',
        serviceathosp: ''
      };
      setFieldValue('requestNoInfo', obj);
    }
  };

  const [networkDesign, setNetworkDesign] = useState('');
  const handlenetworkDesignChange = (e) => {
    // console.log('handlenetworkDesignChange', e);
    setNetworkDesign(e?.target?.value);
    bindAppFormReducer('networkDesign', e?.target?.value);
  };

  const bindAppFormReducer = (fied, value) => {
    if (fied === 'requestType') {
      bindAppForm.requestType = value;
    }
    if (fied === 'requestNo') {
      bindAppForm.requestNo = value;
    }
    if (fied === 'networkDesign') {
      bindAppForm.networkDesign = value;
    }
    dispatch(setBindAppForm(bindAppForm));
    // console.log(bindAppForm);
  };

  const initReducer = () => {
    bindAppFormReducer('requestType', '');
    bindAppFormReducer('requestNo', '');
    bindAppFormReducer('networkDesign', '');
  };
  useEffect(() => {
    initReducer();
  }, []);

  const setDetailData = () => {
    setSelectValue3(bindAppForm.requestType);
    setRequestNoItem(bindAppForm.requestNo);
    setNetworkDesign(bindAppForm.networkDesign);
    toGetSourceFormInfo(bindAppForm.requestType, bindAppForm.requestNo);
  };

  const toGetSourceFormInfo = (requestType, requestNo) => {
    const obj = {};
    obj.requestType = requestType;
    obj.requestNo = requestNo;
    obj.currentPage = 1;
    obj.pageSize = 1000;
    resourceAPI.searchApplicationType(obj).then((res) => {
      if (res?.data?.requestDataList?.list.length > 0) {
        const tempList = res?.data?.requestDataList?.list;
        // 测试数据有问题 有些 目标 数据 未 null 会影响到 autoComplete 组件 的使用
        console.log('toGetSourceFormInfo', tempList);
      }
    });
  };
  // init detail
  useEffect(() => {
    // console.log('bindAppForm');
    setDetailData(bindAppForm);
  }, [bindAppForm]);

  return (
    <Grid container>
      {/* Related Request */}
      <Grid {...TitleProps}>
        <Typography variant="h6" style={{ color: webdpColor.title, marginTop: -10 }}>
          <strong>Related Request</strong>
        </Typography>
      </Grid>
      <Grid container spacing={3}>
        <Grid {...FormControlProps} md={6} lg={3}>
          <CommonSelect
            style={{ background: '#fff', width: '100%' }}
            outlined
            label="Request Type *"
            name=""
            size="small"
            disabled={
              (resourceStatus === 'detailSubmited' && !requestNoT) ||
              orderStatus === 'detail' ||
              resourceStatus === 'detailApproved' ||
              resourceStatus === 'detailDone'
            }
            error={Boolean(touches?.bindAppForm?.requestType)}
            labelWidth={90}
            fullWidth
            value={requestType}
            itemList={selectList3}
            onSelectChange={(e) => {
              onSelectChange3(e);
              bindAppFormReducer('requestType', e.target.value);
            }}
          />
        </Grid>
        <Grid {...FormControlProps} md={6} lg={3}>
          <Autocomplete
            style={{ width: '100%' }}
            // freeSolo
            id="RequestNo"
            value={requestNo || null}
            options={optionsMemo || []}
            onChange={(_, value) => {
              //   console.log('Auto 1', _, value);
              setRequestNoItem(value);
              bindAppFormReducer('requestNo', value);
            }} // 选择下拉 时 触发
            // onInputChange={(_, newInputValue) => {
            //   console.log('newInputValue', newInputValue);
            // }}
            disabled={
              (resourceStatus === 'detailSubmited' && !requestNoT) ||
              orderStatus === 'detail' ||
              resourceStatus === 'detailApproved' ||
              resourceStatus === 'detailDone'
            }
            renderInput={(params) => (
              <TextField
                //   name={`ipList[${index}].ip`}
                {...params}
                label="Request No. *"
                variant="outlined"
                size="small"
                value={requestNo || null}
                // onChange={(e) => {
                //   handleAutoCompleteChange(e);
                //   bindAppFormReducer('requestNo', e.target.value);
                // }} // 手写时 触发
                onBlur={(e) => {
                  // console.log('auto onBlur:', e.target.value);
                  showRequestInfo(e.target.value);
                  bindAppFormReducer('requestNo', e.target.value);
                }} // 检查校对
                error={
                  // Boolean(errors?.bindAppForm?.requestNo) &&
                  Boolean(touches?.bindAppForm?.requestNo)
                }
                // for loading
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <>
                      {ipListLoading && !requestNo ? (
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
        </Grid>
        <Grid {...FormControlProps} md={6} lg={3}>
          <TextField
            label="Network Design"
            variant="outlined"
            size="small"
            fullWidth
            value={networkDesign}
            onChange={handlenetworkDesignChange}
            /*             onBlur={() => {              
            }} */
            error={
              // Boolean(errors?.bindAppForm?.networkDesign) &&
              Boolean(touches?.bindAppForm?.networkDesign)
            }
            disabled={
              (resourceStatus === 'detailSubmited' && !requestNoT) ||
              orderStatus === 'detail' ||
              resourceStatus === 'detailApproved' ||
              resourceStatus === 'detailDone'
            }
          />
        </Grid>
      </Grid>

      {formik.values.requestNoInfo.requestername === '' ? null : (
        <Grid container spacing={3} style={{ marginTop: 20 }}>
          <Grid {...FormControlProps} md={6} lg={3}>
            <TextField
              label="Institution"
              variant="outlined"
              size="small"
              fullWidth
              value={formik.values.requestNoInfo?.serviceathosp || ''}
              disabled
            />
          </Grid>
          <Grid {...FormControlProps} md={6} lg={3}>
            <TextField
              label="Requester Name"
              variant="outlined"
              size="small"
              fullWidth
              value={formik.values.requestNoInfo?.requestername || ''}
              disabled
            />
          </Grid>
          <Grid {...FormControlProps} md={6} lg={3}>
            <TextField
              label="Requester Phone"
              variant="outlined"
              size="small"
              fullWidth
              value={formik.values.requestNoInfo?.requesterphone || ''}
              disabled
            />
          </Grid>
          <Grid {...FormControlProps} md={6} lg={3}>
            <TextField
              label="Submission Date"
              variant="outlined"
              size="small"
              fullWidth
              value={formik.values.requestNoInfo?.submissiondate || ''}
              disabled
            />
          </Grid>
        </Grid>
      )}
    </Grid>
  );
};
export default memo(JobType);
