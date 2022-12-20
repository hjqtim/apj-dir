import React, { useCallback, memo, useMemo, useState, useEffect } from 'react';
import dayjs from 'dayjs';
import _ from 'lodash';

import { useFormik } from 'formik';
// import * as Yup from 'yup';

import { Typography, Backdrop, CircularProgress } from '@material-ui/core';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import { HAPaper, Loading, CommonTip } from '../../../../components';

import { FormHeaderProps } from '../../../../models/webdp/PropsModels/FormControlInputProps';
import { validIp, handleValidation } from '../../../../utils/tools';
import ipassignAPI from '../../../../api/ipassign';
import { setRequest, setRestData } from '../../../../redux/IPAdreess/ipaddrActions';

import RequesterBaseInfo from './RequesterBaseInfo';
import UpdateList from './UpdateList';
import SubmitButton from './SubmitButton';
import HandleApproval from './HandleApproval';

const Index = (props) => {
  let { requestNo, status } = props;
  const dispatch = useDispatch();
  const history = useHistory();
  const requestNoURL = useParams().requestNo;
  if (requestNoURL) {
    requestNo = requestNoURL;
  }
  const statusURL = useParams().status;
  if (typeof statusURL !== 'undefined') {
    status = statusURL;
  }

  //   console.log('requestNo', status, requestNo);
  let isApproval = false;
  if (status === 'approval') {
    isApproval = true;
  }
  let isDetail = false;
  if (status === 'detail') {
    isDetail = true;
  }

  const isRequest = !isDetail && !isApproval;
  console.log('isRequest', isRequest, isDetail, isApproval);
  if (isRequest) {
    dispatch(setRestData());
  }

  const [isLoading, setIsLoading] = useState(false);
  const [ipSet, setIPSet] = useState({});
  const [formStatus, setFormStatus] = useState('');
  const [switchStatus, setSwitchStatus] = useState(true);

  const user = useSelector((state) => state.userReducer?.currentUser) || {};
  // console.log('user', user);
  const userInfo = useSelector((state) => state.userReducer.groupInfo) || {};

  const { displayName } = user;
  const displayNametemparr = displayName ? displayName.split(',') : '';

  const initItem = {
    id: 0,
    key: Date.now().toString(36) + Math.random().toString(36).substr(2),
    ip: '',
    macAddress: '',
    requester: '',
    location: '',
    hospital: '',
    block: '',
    floor: '',
    room: ''
  };

  const defaultItem = {
    id: 1,
    key: Date.now().toString(36) + Math.random().toString(36).substr(2),
    ip: '',
    macAddress: '',
    requester: '',
    location: '',
    hospital: '',
    block: '',
    floor: '',
    room: ''
  };

  const [detailItem, setDetailItem] = useState([]);

  const [apiList, setApiList] = useState([]);
  const [ipListLoading, setIpListLoading] = useState(false);
  const [requestphoneError, setRequestphoneError] = useState('');

  useEffect(() => {
    getIpListUpdateMac();
  }, [switchStatus]);

  const getIpListUpdateMac = () => {
    // console.log('getIpListUpdateMac', user, userInfo.groupName);
    const obj = {};
    if (!switchStatus) {
      obj.requester = user?.displayName;
    } else {
      obj.groupName = userInfo?.groupName;
    }
    // Loading.show();
    setIpListLoading(true);
    ipassignAPI
      .getIpListUpdateMac(obj)
      .then((res) => {
        // console.log('getIpListUpdateMac', res.data.data);
        if (res.data.code === 200) {
          const tempData = res.data.data;

          let tempArr = [];
          for (let i = 0; i < tempData?.length; i += 1) {
            const obj = {};
            obj.id = i;
            obj.ip = tempData[i]?.ipAddress;
            obj.macAddress = tempData[i]?.macAddress;
            obj.hospital = tempData[i]?.hospital;
            obj.block = tempData[i]?.block;
            obj.floor = tempData[i]?.floor;
            obj.room = tempData[i]?.room;
            tempArr = [...tempArr, obj];
          }
          setApiList(tempArr);
        }
      })
      .catch(() => {
        // Loading.hide();
        setIpListLoading(false);
      })
      .finally(() => {
        // Loading.hide();
        setIpListLoading(false);
        getIpUpdateMacDetail();
      });
  };
  const getIpUpdateMacDetail = () => {
    if (isDetail || isApproval) {
      Loading.show();
      ipassignAPI
        .getIpUpdateMacDetail(requestNo)
        .then((res) => {
          if (res?.data?.code === 200) {
            // console.log('getIpUpdateMacDetail', res.data.data);
            const ipUpdateDetailList = res?.data?.data?.ipUpdateDetailList;
            const remark = res?.data?.data?.remark;
            const state = res?.data?.data?.state;

            // console.log('getIpUpdateMacDetail', res, ipUpdateDetailList);
            let tempArr = [];
            for (let i = 0; i < ipUpdateDetailList?.length; i += 1) {
              let obj = {};
              obj = ipUpdateDetailList[i];
              obj.ip = ipUpdateDetailList[i]?.ipAddress;
              obj.hospital =
                ipUpdateDetailList[i]?.hospital === null ? '' : ipUpdateDetailList[i]?.hospital;
              obj.block =
                ipUpdateDetailList[i]?.blockName === null ? '' : ipUpdateDetailList[i]?.blockName;
              obj.floor = ipUpdateDetailList[i]?.floor === null ? '' : ipUpdateDetailList[i]?.floor;
              obj.room = ipUpdateDetailList[i]?.room === null ? '' : ipUpdateDetailList[i]?.room;
              obj.id = i;
              obj.key = Date.now().toString(36) + Math.random().toString(36).substr(2);
              tempArr = [...tempArr, obj];
            }
            // console.log('getIpUpdateMacDetail', tempArr, isRequest);
            setDetailItem([...tempArr]);
            if (state === 1) {
              // state===1 表示approval
              setFormStatus(1);
            } else if (state === 2) {
              // state===2 表示 reject
              // console.log('-----------', remark);
              setFormStatus(1);
            }

            const requesterDomain = res?.data?.data?.requesterDomain;
            const requesterPhone = res?.data?.data?.requesterPhone;
            const requesterTitle = res?.data?.data?.requesterTitle;
            const hospital = res?.data?.data?.hospital;

            dispatch(setRequest({ field: 'userPhone', data: res?.data?.data?.requesterPhone }));
            dispatch(setRequest({ field: 'title', data: res?.data?.data?.requesterTitle }));
            dispatch(setRequest({ field: 'name', data: res?.data?.data?.requesterDomain }));
            dispatch(setRequest({ field: 'logonDomain', data: res?.data?.data?.hospital }));
            dispatch(setRequest({ field: 'logonName', data: res?.data?.data?.createdBy }));

            const object = {};
            object.requesterDomain = hospital;
            object.title = requesterTitle;
            object.telNo = requesterPhone;
            object.requesterName = requesterDomain;

            formik.setFieldValue(`ipList`, tempArr);
            formik.setFieldValue(`remark`, remark);
            formik.setFieldValue(`requester`, object);
          }
        })
        .finally(() => {
          Loading.hide();
        });
    }
  };

  const formik = useFormik({
    initialValues: {
      requester: {
        requesterName: isRequest ? getDisplayName : '',
        requesterDomain: isRequest ? user.department || '' : '',
        title: isRequest ? displayNametemparr[1] || '' : '',
        telNo: isRequest ? user?.adPhone || '' : '',
        staffId: isRequest ? user?.username || '' : ''
      },
      releaseDate: dayjs(new Date()).format('YYYY-MM-DD'),
      remark: '',

      ipList: isRequest ? [defaultItem] : detailItem
    },
    validate: (values) => {
      const { ipList, requester } = values;
      // console.log('validate', ipList, requester);

      // 申请者 电话 检查
      const errorRequester = {};
      if (requester.telNo === '' || requester.telNo.length < 8) {
        errorRequester.telNo = 'Error';
      }

      let errorFlag = false;
      let dynamicError = {};
      const errerArr = new Array(ipList.length);

      if (ipList.length === 1) {
        // console.log('IP only one');
        const itemTemp = ipList[0];
        if (!Object.prototype.hasOwnProperty.call(itemTemp, 'ip')) {
          errerArr[0] = { ip: 'Error' };
          errorFlag = true;
        }
        if (itemTemp.ip === '') {
          errerArr[0] = { ...errerArr[0], ip: 'Error' };
          errorFlag = true;
        }
        if (itemTemp.macAddress === '') {
          errerArr[0] = { ...errerArr[0], macAddress: 'Error' };
          errorFlag = true;
        }
      } else if (ipList.length > 1) {
        console.log('IP more', ipList);
        for (let i = 0; i < ipList.length; i += 1) {
          // 检查空白
          if (ipList[i].ip === '') {
            errorFlag = true;
            errerArr[i] = { ...errerArr[i], ip: 'Error' };
          }
          if (ipList[i].macAddress === '') {
            errorFlag = true;
            errerArr[i] = { ...errerArr[i], macAddress: 'Error' };
          }

          // 检查相同
          const count1 = ipList.filter((itemData) => itemData.ip === ipList[i].ip);
          if (count1.length > 1) {
            errerArr[i] = { ...errerArr[i], ip: 'Error' };
            errorFlag = true;
          }
          const count2 = ipList.filter((itemData) => itemData.macAddress === ipList[i].macAddress);
          if (count2.length > 1) {
            errerArr[i] = { ...errerArr[i], macAddress: 'Error' };
            errorFlag = true;
          }

          // 检查 IP 规则
          // if (!validIp(ipList[i].ip)) {
          //   console.log('valid ip', validIp(ipList[i].ip));
          // errerArr[i] = { ...errerArr[i], ip: 'Error' };
          // errorFlag = true;
          // }
          // if (ipList[i].macAddress === '') {
          //   errerArr[i] = { ...errerArr[i], macAddress: 'Error' };
          //   errorFlag = true;
          // }
        }
      }

      if (errorFlag) {
        dynamicError = { ...dynamicError, ipList: errerArr, requester: errorRequester };
        // console.log('dynamicError', dynamicError);
      }
      return dynamicError;
    },
    onSubmit: (values) => {
      const userPhone = values.requester?.telNo;
      // console.log('onSubmit', userPhone);
      if (userPhone === '' || userPhone.length < 8 || userPhone === null) {
        setRequestphoneError(true);
        CommonTip.warning('Phone,please!');
      } else {
        const { ipList } = values;
        const tempArr = [];
        for (let i = 0; i < ipList.length; i += 1) {
          if (ipList[i]?.ip !== '' && ipList[i]?.ip !== null) {
            let obj = {};
            obj = ipList[i];
            obj.blockName = ipList[i].block;
            obj.ipAddress = ipList[i].ip;
            tempArr.push(obj);
          }
        }
        // console.log('onSubmit', tempArr);
        const obj = {};
        obj.detailsParamList = tempArr;
        obj.hospital = user?.department;
        obj.requesterDomain = getDisplayName;
        obj.requesterTitle = formik.values.requester.title;
        obj.requesterPhone = userPhone;
        Loading.show();
        ipassignAPI
          .ipUpdateRequest(obj)
          .then((res) => {
            // console.log('ipUpdateRequest', res);
            if (res.data.code === 200) {
              CommonTip.success('Success');
              history.push('/request');
            } else {
              CommonTip.error('Fail');
            }
          })
          .finally(() => {
            Loading.hide();
          });
      }
    }
  });

  const handleSubmit = () => {
    if (!formik.isValid) handleValidation();
    formik.handleSubmit();
  };

  const genNewItem = useCallback(() => {
    const key = Date.now().toString(36) + Math.random().toString(36).substr(2);
    return { ..._.cloneDeep(initItem), key };
  }, []);

  const checkIp = (ip, index) => {
    if (validIp(ip) && !Object.prototype.hasOwnProperty.call(ipSet, ip)) {
      // console.log('IP address check', ip);
      setIsLoading(true);
      // -------------------检查 这个ip 是否存在
      ipassignAPI
        .checkIp({ ip })
        .then((res) => {
          if (res?.data?.code === 200) {
            const isExit = res?.data?.data?.result;
            // console.log('this ip is ', isExit);
            setIPSet({ ...ipSet, [ip]: isExit });
            if (!isExit) {
              formik.setFieldError(`ipList.[${index}].ip`, 'Error');
            }
          }
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  };

  const getDisplayName = useMemo(() => {
    const arr = user?.displayName?.split?.(',') || [];
    if (arr[0]) {
      return arr[0];
    }
    return '';
  }, [user?.displayName]);

  return (
    <HAPaper style={{ padding: '0.8em' }}>
      <Backdrop open={isLoading} style={{ zIndex: 999 }} invisible>
        <CircularProgress />
      </Backdrop>

      {isRequest && <Typography {...FormHeaderProps}>IP Mac Address Update</Typography>}

      <RequesterBaseInfo
        handleBlur={formik.handleBlur}
        values={formik.values.requester}
        errors={formik.errors.requester}
        touched={formik.touched.requester}
        handleChange={formik.handleChange}
        isRequest={isRequest}
        requestphoneError={requestphoneError}
      />
      <br />

      <UpdateList
        {...{ checkIp, genNewItem, isRequest, isApproval, apiList }}
        formStatus={formStatus}
        switchStatus={switchStatus}
        setSwitchStatus={setSwitchStatus}
        errors={formik.errors.ipList}
        values={formik.values.ipList}
        handleBlur={formik.handleBlur}
        touches={formik.touched.ipList}
        handleChange={formik.handleChange}
        setFieldValue={formik.setFieldValue}
        setValues={formik.setValues}
        setFieldTouched={formik.setFieldTouched}
        ipListLoading={ipListLoading}
      />
      <br />

      {isRequest && <SubmitButton handleSubmit={handleSubmit} />}

      {/* {getDetailShowRemark() && (
        <HandleApproval {...{ formStatus, isDetail }} remark={formik.values.remark} />
      )} */}

      {isApproval && (
        <HandleApproval
          formStatus={formStatus}
          values={formik.values.ipList}
          isApproval={isApproval}
          remark={formik.values.remark}
          handleChange={formik.handleChange}
        />
      )}
    </HAPaper>
  );
};

export default memo(Index);
