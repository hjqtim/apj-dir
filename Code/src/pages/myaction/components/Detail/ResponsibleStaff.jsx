import React, { useState, useEffect, memo } from 'react';
import { Grid, Typography, TextField, Button } from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';
import _ from 'lodash';
import { useDispatch, useSelector } from 'react-redux';
// import SubmitButton from '../../../../components/Webdp/SubmitButton';

import FormControlProps from '../../../../models/webdp/PropsModels/FormControlProps';
import useTitleProps from '../../../../models/webdp/PropsModels/useTitleProps';
import useWebDPColor from '../../../../hooks/webDP/useWebDPColor';
import WebdpTextField from '../../../../components/Webdp/WebdpTextField';
// import WebdpContactPersonField from '../../../../../components/Webdp/WebdpContactPersonField';
import API from '../../../../api/myAction';
import AAAAPI from '../../../../api/adGroup';
import webdpAPI from '../../../../api/webdp/webdp';
import { CommonTip, Loading } from '../../../../components';
import { setNMSResponsible } from '../../../../redux/myAction/my-action-actions';
import { SENSE_NMSRS } from '../../../../utils/constant';

const ResponsibleStaff = () => {
  const dispatch = useDispatch();
  const [options, setOptions] = useState([]);
  const NMSResponsible = useSelector((state) => state.myAction.NMSResponsible);
  // console.log(NMSResponsible);
  const readOnly = useSelector((state) => state.myAction.requestForm?.readOnly) || false;
  const isPending = useSelector((state) => state.myAction.requestForm?.isPending) || false;
  const isCancel = useSelector((state) => state.myAction.requestForm?.isCancel) || false;
  const requestNo = useSelector((state) => state.myAction.requestForm?.dpRequest?.requestNo);
  const dpRequestStatusNo = useSelector(
    (state) => state.myAction.requestForm?.dpRequest?.dprequeststatusno
  );
  const requestForm = useSelector((state) => state.myAction.requestForm); // 整张form的数据
  const { isN3, isN4, isN5 } = requestForm || {};

  const [staffPhoneError, setStaffPhoneError] = useState({ error: false, touch: false });

  useEffect(() => {
    AAAAPI.getUsersForGroup({ groupNames: SENSE_NMSRS.split(',') }).then((res) => {
      let newOptions = res?.data?.data || [];
      newOptions = newOptions.map((item) => ({ ...item, corpId: item?.username }));
      setOptions(newOptions);
      getAdData(newOptions);
    });
  }, []);

  // 自动分配时去 findUserList拿数据
  const getAdData = (optionsData) => {
    const isExit = optionsData.find((item) => item.corpId === NMSResponsible.staffUserId);
    // ADGround 中不存在 该 ID
    if (_.isUndefined(isExit) && NMSResponsible?.staffUserId) {
      webdpAPI.findUserList({ username: NMSResponsible?.staffUserId }).then((res) => {
        const resData = res.data.data || [];
        if (resData.length) {
          const newOptions = [
            ...optionsData,
            { ...resData?.[0], corpId: resData?.[0]?.corp, displayName: resData?.[0]?.display }
          ];
          setOptions(newOptions);
        }
      });
    }
  };

  const TitleProps = useTitleProps();
  const webdpColor = useWebDPColor();

  const submitHandler = () => {
    const phone = NMSResponsible.staffPhone;
    const displayName = NMSResponsible.staffDisplay;
    // let givenName = ''; // givenName改从displayName中截取出来
    // const givenArr = displayName?.split(',');
    // if (givenArr?.length > 1) {
    //   // 正常账号
    //   givenName = `${givenArr[0]}`;
    // } else if (givenArr?.length === 1) {
    //   // 测试的开发账号
    //   givenName = givenArr[0]?.substring(givenArr[0]?.indexOf('Account'));
    // }
    if (!phone || phone?.length < 8) {
      setStaffPhoneError({ error: true, touch: true });
      return;
    }
    setStaffPhoneError({ ...staffPhoneError, error: false });
    const saveParams = {
      respStaff: NMSResponsible.staffUserId,
      staffPhone: NMSResponsible.staffPhone,
      givenName: displayName || '',
      displayName: NMSResponsible.staffDisplay,
      requestNo
    };

    Loading.show();
    API.saveNmsResponsible(saveParams)
      .then((res) => {
        if (res?.data?.code === 200) {
          CommonTip.success('Success');
          setTimeout(() => {
            window.location.reload();
          }, 2000);
        }
      })
      .finally(() => {
        Loading.hide();
      });
  };

  const getFormDisabled = () => {
    if (readOnly || isCancel || isPending) {
      return true;
    }

    if (dpRequestStatusNo >= 30 && dpRequestStatusNo < 160) {
      if (isN3 || isN4 || isN5) {
        return false;
      }
    }

    return true;
  };

  const getToLowerCase = (val) => val?.toLowerCase();

  const staffValue = options.find(
    (item) =>
      item.corpId && getToLowerCase(item.corpId) === getToLowerCase(NMSResponsible.staffUserId)
  );

  const getButtonDisabled = () => {
    if (readOnly || isCancel || isPending) {
      return true;
    }

    if (dpRequestStatusNo >= 30 && dpRequestStatusNo < 160 && NMSResponsible.staffUserId) {
      if (isN3 || isN4 || isN5) {
        return false;
      }
    }

    return true;
  };

  return (
    <>
      <Grid {...TitleProps}>
        <Typography variant="h6" style={{ color: webdpColor.title }}>
          <strong>HO IT&HI NMS Responsible Staff</strong>
        </Typography>
      </Grid>
      <Grid container spacing={3}>
        <Grid {...FormControlProps} md={4} xs={6}>
          <Autocomplete
            forcePopupIcon
            value={staffValue || null}
            onChange={(event, value) => {
              const newNMSResponsible = {
                ...NMSResponsible,
                staffUserId: value?.corpId || '',
                staffPhone: value?.phone || '',
                staffTitle: value?.title || '',
                givenName: value?.givenName || '',
                staffDisplay: value?.displayName || ''
              };
              dispatch(setNMSResponsible(newNMSResponsible));
            }}
            options={options}
            getOptionLabel={(option) => option?.displayName || ''}
            disabled={getFormDisabled()}
            renderInput={(inputParams) => (
              <TextField
                {...inputParams}
                variant="outlined"
                size="small"
                fullWidth
                label="Responsible Staff *"
              />
            )}
          />
        </Grid>

        <Grid {...FormControlProps} md={4} xs={6}>
          <WebdpTextField label="Title" value={NMSResponsible.staffTitle || ''} disabled />
        </Grid>
        <Grid {...FormControlProps} md={4} xs={6}>
          <WebdpTextField
            error={staffPhoneError?.error && staffPhoneError.touch}
            label="Phone"
            value={NMSResponsible.staffPhone || ''}
            disabled={getFormDisabled()}
            onBlur={() => setStaffPhoneError({ ...staffPhoneError, touch: true })}
            onChange={(e) => {
              const { value } = e.target;

              if (value && /^\d*$/.test(value)) {
                setStaffPhoneError({ ...staffPhoneError, error: value?.length !== 8 });
              }

              if (value && /^\d*$/.test(value) && value.length <= 8) {
                const newNMSResponsible = {
                  ...NMSResponsible,
                  staffPhone: value
                };

                dispatch(setNMSResponsible(newNMSResponsible));
              } else if (!value) {
                const newNMSResponsible = {
                  ...NMSResponsible,
                  staffPhone: ''
                };

                dispatch(setNMSResponsible(newNMSResponsible));
              }
            }}
          />
        </Grid>

        <Grid {...FormControlProps}>
          <Button
            variant="contained"
            color="primary"
            size="small"
            onClick={submitHandler}
            disabled={getButtonDisabled()}
          >
            Assign
          </Button>
        </Grid>
      </Grid>
    </>
  );
};
export default memo(ResponsibleStaff);
