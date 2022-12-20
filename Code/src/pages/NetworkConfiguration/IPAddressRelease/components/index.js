import React, { useCallback, memo, useMemo, useState, useEffect } from 'react';
import * as Yup from 'yup';
import dayjs from 'dayjs';
import _ from 'lodash';
import { Typography, Backdrop, CircularProgress } from '@material-ui/core';
import { useSelector, useDispatch } from 'react-redux';
import { useFormik } from 'formik';
import { useHistory, useParams } from 'react-router-dom';
import { HAPaper, Loading, CommonTip } from '../../../../components';
import RequesterBaseInfo from './RequesterBaseInfo';
import ReleaseDate from './ReleaseDate';
import ReleaseList from './ReleaseList';
import HandleApproval from './HandleApproval';
import SubmitButton from './SubmitButton';
import { FormHeaderProps } from '../../../../models/webdp/PropsModels/FormControlInputProps';
import { validIp, handleValidation } from '../../../../utils/tools';
import ipassignAPI from '../../../../api/ipassign';
import { setRequest, setRestData } from '../../../../redux/IPAdreess/ipaddrActions';

const Index = (props) => {
  let { requestNo } = props;
  const dispatch = useDispatch();
  const history = useHistory();
  const requestNoURL = useParams().requestNo;
  if (requestNoURL) {
    requestNo = requestNoURL;
  }
  const { isDetail = false, isApproval = false } = props;
  const isRequest = !isDetail && !isApproval;
  if (isRequest) {
    dispatch(setRestData());
  }

  const [ipSet, setIPSet] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [formStatus, setFormStatus] = useState('');

  const user = useSelector((state) => state.userReducer?.currentUser) || {};

  const { displayName } = user;
  const temparr = displayName ? displayName.split(',') : '';

  useEffect(() => {
    if ((isDetail || isApproval) && requestNo) {
      Loading.show();
      ipassignAPI
        .getDetails(requestNo)
        .then((res) => {
          if (res?.data?.code === 200) {
            const {
              ipReleaseDetails,
              requesterName,
              requesterId,
              telNo,
              releaseDate,
              title,
              requesterDomain,
              status,
              remark
            } = res?.data?.data || {};
            const ipList = ipReleaseDetails?.map((item) => ({
              ip: item?.ipAddress || '',
              hospital: item?.hospital || '',
              block: item?.block || '',
              floor: item?.floor || '',
              room: item?.room || '',
              key: Date.now().toString(36) + Math.random().toString(36).substr(2)
            }));

            setFormStatus(status);
            formik.setValues({
              ...formik.values,
              requester: { requesterName, requesterId, telNo, title, requesterDomain },
              releaseDate,
              remark,
              ipList
            });

            dispatch(setRequest({ field: 'userPhone', data: res?.data?.data?.telNo }));
            dispatch(setRequest({ field: 'title', data: res?.data?.data?.title }));
            dispatch(setRequest({ field: 'name', data: res?.data?.data?.requesterName }));
            dispatch(setRequest({ field: 'logonDomain', data: res?.data?.data?.requesterDomain }));
            dispatch(setRequest({ field: 'logonName', data: res?.data?.data?.requesterId }));
          }
        })
        .finally(() => {
          Loading.hide();
        });
    }
  }, []);

  const defaultItem = {
    id: -1,
    key: Date.now().toString(36) + Math.random().toString(36).substr(2),
    ip: '',
    hospital: '',
    block: '',
    floor: '',
    room: ''
  };

  const formik = useFormik({
    initialValues: {
      requester: {
        requesterName: isRequest ? getDisplayName : '',
        requesterDomain: isRequest ? user.department || '' : '',
        title: isRequest ? temparr[1] || '' : '',
        telNo: isRequest ? user?.phone || '' : '',
        staffId: isRequest ? user?.username || '' : ''
      },
      releaseDate: dayjs(new Date()).format('YYYY-MM-DD'),
      ipListType: 1,
      hospital: '',
      block: '',
      floor: '',
      room: '',
      remark: '',

      ipList: [_.cloneDeep(defaultItem)]
    },
    // 静态校验
    validationSchema: Yup.object({
      requester: Yup.object({
        telNo: Yup.string()
          .required('Can not be empty')
          .length(8, 'The length of the phone must be 8')
      })
    }),
    validate: (values) => {
      const { ipList } = values;
      let errorFlag = false;
      let dynamicError = {};
      const errerArr = new Array(ipList.length);

      if (ipList.length === 1 && !validIp(ipList?.[0]?.ip)) {
        errerArr[0] = { ip: 'Error1' };
        errorFlag = true;
      } else {
        ipList.forEach((item, index) => {
          const currentIPIsExit = ipSet?.[item.ip];
          const count = ipList.filter((itemData) => itemData.ip === item.ip);

          if (index !== ipList.length - 1) {
            if (
              !validIp(item.ip) ||
              (currentIPIsExit !== undefined && validIp(item.ip) && !currentIPIsExit)
            ) {
              errerArr[index] = { ip: 'Error2' };
              errorFlag = true;
            }
          }

          // 存在相同
          if (count.length > 1) {
            errerArr[index] = { ip: 'Error3' };
            errorFlag = true;
          }
        });
      }

      if (errorFlag) dynamicError = { ...dynamicError, ipList: errerArr };
      return dynamicError;
    },
    onSubmit: (values) => {
      const {
        requester: { title, telNo, requesterDomain } = {},
        releaseDate,
        ipList
      } = values || {};
      const releaseRequestIpLists = ipList.map((item) => ({
        ipAddress: item.ip,
        hospital: item.hospital,
        block: item.block,
        floor: item.floor,
        room: item.room
      }));
      if (!releaseRequestIpLists?.[releaseRequestIpLists.length - 1]?.ipAddress) {
        releaseRequestIpLists.pop();
      }
      const queryData = {
        title,
        telNo,
        releaseRequestIpLists,
        requesterDomain,
        releaseDate: dayjs(releaseDate).format('YYYY-MM-DD HH:mm:ss')
      };
      if (!isLoading) {
        Loading.show();
        ipassignAPI
          .applyRequest(queryData)
          .then((res) => {
            if (res?.data.code === 200) {
              history.push('/request');
              CommonTip.success('Success');
            }
          })
          .finally(() => {
            Loading.hide();
          });
      }
    }
  });

  const getDisplayName = useMemo(() => {
    const arr = user?.displayName?.split?.(',') || [];
    if (arr[0]) {
      return arr[0];
    }
    return '';
  }, [user?.displayName]);

  const genNewItem = useCallback(() => {
    const key = Date.now().toString(36) + Math.random().toString(36).substr(2);
    return { ..._.cloneDeep(defaultItem), key };
  }, []);

  const checkIp = (ip, index) => {
    if (validIp(ip) && !Object.prototype.hasOwnProperty.call(ipSet, ip)) {
      setIsLoading(true);
      ipassignAPI
        .checkIp({ ip })
        .then((res) => {
          if (res?.data?.code === 200) {
            const isExit = res?.data?.data?.result;
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

  const handleSubmit = () => {
    if (!formik.isValid) handleValidation();
    formik.handleSubmit();
  };

  const getDetailShowRemark = () => {
    if (isDetail && (formStatus === 'Released' || formStatus === 'Rejected')) return true;
    return false;
  };

  return (
    <HAPaper style={{ padding: '0.8em' }}>
      <Backdrop open={isLoading} style={{ zIndex: 999 }} invisible>
        <CircularProgress />
      </Backdrop>

      {isRequest && <Typography {...FormHeaderProps}>IP Address Release</Typography>}

      <RequesterBaseInfo
        handleBlur={formik.handleBlur}
        values={formik.values.requester}
        errors={formik.errors.requester}
        touched={formik.touched.requester}
        handleChange={formik.handleChange}
        isRequest={isRequest}
      />

      <br />

      <ReleaseDate
        setFieldValue={formik.setFieldValue}
        releaseDate={formik.values.releaseDate}
        ipListType={formik.values.ipListType}
        isRequest={isRequest}
      />

      <ReleaseList
        {...{ checkIp, genNewItem, isRequest }}
        errors={formik.errors.ipList}
        values={formik.values.ipList}
        handleBlur={formik.handleBlur}
        touches={formik.touched.ipList}
        ipListType={formik.values.ipListType}
        setFieldValue={formik.setFieldValue}
        setFieldTouched={formik.setFieldTouched}
      />
      <br />

      {isRequest && <SubmitButton handleSubmit={handleSubmit} />}

      {getDetailShowRemark() && (
        <HandleApproval {...{ formStatus, isDetail }} remark={formik.values.remark} />
      )}

      {isApproval && (
        <HandleApproval
          {...{ formStatus, isApproval }}
          remark={formik.values.remark}
          handleChange={formik.handleChange}
        />
      )}
    </HAPaper>
  );
};

export default memo(Index);
