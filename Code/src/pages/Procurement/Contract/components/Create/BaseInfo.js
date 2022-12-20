import React, { memo } from 'react';
import { Grid, TextField, Typography } from '@material-ui/core';
import { HAPaper, CommonTip, HAKeyboardDatePicker } from '../../../../../components';
import { InputControlProps } from '../../../../../models/procurement/contract/FormControlProps';
import API from '../../../../../api/webdp/webdp';

const BaseInfo = ({
  backData,
  values,
  handleChange,
  handleBlur,
  setFieldValue,
  errors,
  isDetal,
  touched
}) => {
  const checkContract = (e) => {
    handleBlur(e);

    // 新输入的contract 和 初始数据的contract一样则不走后端验证
    if (backData?.contract?.contract === e.target?.value) return;

    setFieldValue('baseInfo.isChecking', true);

    API.checkContract({ contractNo: e.target.value })
      .then((res) => {
        const { contractNoStatus } = res?.data?.data || {};
        // 后端存在 contractNo
        setFieldValue('baseInfo.isExit', Boolean(contractNoStatus));
        if (contractNoStatus) {
          CommonTip.warning('This already exists on the server.');
        }
      })
      .finally(() => {
        setFieldValue('baseInfo.isChecking', false);
      });
  };

  const commonProps = { item: true, xs: 12, md: 6, lg: 3 };
  return (
    <HAPaper>
      <Typography variant="h3">Basic Information</Typography>
      <br />
      <Grid container spacing={3}>
        <Grid item xs={11} md={11} lg={11}>
          <Grid container spacing={3}>
            <Grid {...commonProps}>
              <TextField
                {...InputControlProps}
                label="Contract *"
                disabled={isDetal}
                onBlur={checkContract}
                name="baseInfo.contract"
                onChange={handleChange}
                error={errors?.contract && touched?.contract}
                value={values.contract || ''}
              />
            </Grid>

            <Grid {...commonProps}>
              <TextField
                {...InputControlProps}
                label="Vendor *"
                disabled={isDetal}
                name="baseInfo.vendor"
                onChange={(e) => {
                  const value = e?.target?.value;
                  if (value?.length < 20) {
                    setFieldValue('baseInfo.vendor', value);
                  }
                }}
                error={errors?.vendor && touched?.vendor}
                value={values.vendor || ''}
              />
            </Grid>

            <Grid {...commonProps}>
              <TextField
                {...InputControlProps}
                label="Phone *"
                disabled={isDetal}
                name="baseInfo.phone"
                onChange={(e) => {
                  const value = e?.target?.value;
                  if (value && /^[0-9]*$/.test(value) && value?.length < 9) {
                    setFieldValue('baseInfo.phone', value);
                  }
                }}
                error={errors?.phone && touched?.phone}
                value={values.phone || ''}
              />
            </Grid>
            <Grid {...commonProps}>
              <TextField
                {...InputControlProps}
                label="Email *"
                disabled={isDetal}
                name="baseInfo.email"
                onChange={handleChange}
                error={errors?.email && touched?.email}
                value={values.email || ''}
              />
            </Grid>
            <Grid {...commonProps}>
              <HAKeyboardDatePicker
                label="Start Time *"
                disabled={isDetal}
                name="baseInfo.startTime"
                value={values.startTime || null}
                maxDate={values.endTime || undefined}
                error={errors?.startTime && touched?.startTime}
                onChange={(data) => {
                  setFieldValue('baseInfo.startTime', data);
                }}
              />
            </Grid>

            <Grid {...commonProps}>
              <HAKeyboardDatePicker
                label="End Time *"
                disabled={isDetal}
                name="baseInfo.endTime"
                value={values.endTime || null}
                minDate={values.startTime || undefined}
                error={errors?.endTime && touched?.endTime}
                onChange={(data) => {
                  setFieldValue('baseInfo.endTime', data);
                }}
              />
            </Grid>

            <Grid {...commonProps}>
              <TextField
                {...InputControlProps}
                disabled={isDetal}
                label="Vendor Coordinator *"
                name="baseInfo.vendorCoordinator"
                error={errors?.vendorCoordinator && touched?.vendorCoordinator}
                onChange={handleChange}
                value={values.vendorCoordinator || ''}
              />
            </Grid>
            <Grid {...commonProps}>
              <TextField
                {...InputControlProps}
                disabled={isDetal}
                label="Requester Vendor Code *"
                name="baseInfo.reqVendorCode"
                error={errors?.reqVendorCode && touched?.reqVendorCode}
                onChange={(e) => {
                  const value = e?.target?.value || '';
                  if (value?.length < 3) {
                    setFieldValue('baseInfo.reqVendorCode', value);
                  }
                }}
                value={values.reqVendorCode || ''}
              />
            </Grid>
            <Grid {...commonProps}>
              <TextField
                {...InputControlProps}
                disabled={isDetal}
                label="Vendor Code *"
                name="baseInfo.vendorCode"
                error={errors?.vendorCode && touched?.vendorCode}
                onChange={(e) => {
                  const value = e?.target?.value || '';

                  if (value?.length < 6) {
                    setFieldValue('baseInfo.vendorCode', value);
                  }
                }}
                value={values.vendorCode || ''}
              />
            </Grid>
          </Grid>
        </Grid>

        <Grid item xs={1} />
      </Grid>
    </HAPaper>
  );
};

export default memo(BaseInfo);
