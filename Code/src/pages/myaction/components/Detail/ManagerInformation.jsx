import React, { useState, memo, useCallback } from 'react';
import { Grid, Typography, TextField } from '@material-ui/core';
import { useSelector, useDispatch } from 'react-redux';
import { Autocomplete } from '@material-ui/lab';
import _ from 'lodash';
import useTitleProps from '../../../../models/webdp/PropsModels/useTitleProps';
import useWebDPColor from '../../../../hooks/webDP/useWebDPColor';
import WebdpTextField from '../../../../components/Webdp/WebdpTextField';
import webdpAPI from '../../../../api/webdp/webdp';

import WebdpRadioField from '../../../../components/Webdp/WebdpRadioField';
import { setManagerInformation } from '../../../../redux/myAction/my-action-actions';
import useSetReqManBudTouch from '../../../../hooks/webDP/useSetReqManBudTouch';

const ManagerInformation = () => {
  const TitleProps = useTitleProps();
  const webdpColor = useWebDPColor();
  const dispatch = useDispatch();
  const readOnly = useSelector((state) => state.myAction.requestForm?.readOnly) || false;
  const isCancel = useSelector((state) => state.myAction.requestForm?.isCancel) || false;
  const isPending = useSelector((state) => state.myAction.requestForm?.isPending) || false;
  const requestForm = useSelector((state) => state.myAction.requestForm); // 整张form
  const { isRequester } = requestForm || {};
  const managerInformation = useSelector((state) => state.myAction.managerInformation);
  const reqManBudTouch = useSelector((state) => state.myAction.reqManBudTouch);
  const setReqManBudTouchByFiled = useSetReqManBudTouch();

  const { isNeedManager, rmanagerid, options, rmanagertitle, rmanagerphone, rmanageremail } =
    managerInformation || {};

  const dprequeststatusno = useSelector(
    (state) => state.myAction.requestForm?.dpRequest?.dprequeststatusno
  );

  const setManagerDataByFiled = (field, value) => {
    const newData = {
      field,
      data: value
    };
    dispatch(setManagerInformation(newData));
  };

  // const currentUser = useSelector((state) => state.userReducer.currentUser);
  const [loading, setLoading] = useState(false);

  const getFormDisabled = () => {
    if (readOnly || isCancel || isPending) {
      return true;
    }
    if (isRequester && dprequeststatusno === 100) {
      return false;
    }
    return true;
  };

  const checkAD = useCallback(
    _.debounce((inputValue) => {
      if (inputValue?.length >= 3) {
        setLoading(true);
        webdpAPI
          .findUserList({ username: inputValue })
          .then((res) => {
            const newOptions = res?.data?.data || [];
            setManagerDataByFiled('options', newOptions);
          })
          .finally(() => {
            setLoading(false);
          });
      }
    }, 800),
    []
  );

  const rmanageridMap = options.find((item) => rmanagerid === item.corp) || null;

  return (
    <>
      <Grid {...TitleProps}>
        <Typography variant="h6" style={{ color: webdpColor.title }}>
          <strong>Requester's Manager Information (For Approval)</strong>
        </Typography>
      </Grid>

      <Grid item xs={12}>
        <WebdpRadioField
          label="Required Manager Approval? *"
          value={isNeedManager}
          disabled={getFormDisabled()}
          options={[
            { label: 'Yes', value: true },
            { label: 'No', value: false }
          ]}
          onChange={(e, v) => {
            setManagerDataByFiled('isNeedManager', v === 'true');
          }}
          row
        />
      </Grid>

      {isNeedManager && (
        <>
          <Grid item xs={3}>
            <Autocomplete
              forcePopupIcon
              value={rmanageridMap}
              loading={loading}
              options={options}
              disabled={getFormDisabled()}
              onBlur={() => setReqManBudTouchByFiled('rmanagerid')}
              onChange={(e, val) => {
                setManagerDataByFiled('rmanagerphone', val?.phone || '');
                setManagerDataByFiled('rmanageremail', val?.mail || '');
                setManagerDataByFiled('rmanagerid', val?.corp || '');
                setManagerDataByFiled('rmanagername', val?.display || '');
                setManagerDataByFiled(
                  'rmanagertitle',
                  val?.display?.split?.(',')?.[1]?.trim() || ''
                );
              }}
              getOptionLabel={(option) => option.display || ''}
              renderInput={(inputParams) => (
                <TextField
                  {...inputParams}
                  label="Manager *"
                  size="small"
                  error={Boolean(!rmanageridMap && reqManBudTouch.rmanagerid)}
                  fullWidth
                  variant="outlined"
                  onChange={(e) => {
                    checkAD(e.target.value);
                  }}
                />
              )}
            />
          </Grid>
          <Grid item xs={3} style={{ paddingLeft: '0.5rem' }}>
            <WebdpTextField value={rmanagertitle || ''} label="Title" disabled />
          </Grid>

          <Grid item xs={3} style={{ paddingLeft: '0.5rem' }}>
            <WebdpTextField
              value={rmanageremail || ''}
              type="email"
              label="Email *"
              disabled={getFormDisabled()}
              error={Boolean(!rmanageremail && reqManBudTouch.rmanageremail)}
              onBlur={() => setReqManBudTouchByFiled('rmanageremail')}
              onChange={(e) => {
                const { value } = e.target;
                setManagerDataByFiled('rmanageremail', value);
              }}
            />
          </Grid>

          <Grid item xs={3} style={{ paddingLeft: '0.5rem' }}>
            <WebdpTextField
              label="Phone *"
              value={rmanagerphone || ''}
              disabled={getFormDisabled()}
              error={Boolean(rmanagerphone?.length !== 8 && reqManBudTouch.rmanagerphone)}
              onBlur={() => setReqManBudTouchByFiled('rmanagerphone')}
              onChange={(e) => {
                const { value } = e.target;
                if (/^\d*$/.test(value) && value.length <= 8) {
                  setManagerDataByFiled('rmanagerphone', value);
                }
              }}
            />
          </Grid>
        </>
      )}
    </>
  );
};

export default memo(ManagerInformation);
