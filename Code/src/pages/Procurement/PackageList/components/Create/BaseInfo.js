import React, { memo } from 'react';
import { Grid, TextField, Typography } from '@material-ui/core';
import { HAPaper, HAKeyboardDatePicker } from '../../../../../components';
import { InputControlProps } from '../../../../../models/procurement/contract/FormControlProps';

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
  const checkPackage = (e) => {
    handleBlur(e);
    console.log(backData);

    // 新输入的PackageName 和 初始数据的PackageName一样则不走后端验证
    // if (backData?.packageName?.packageName === e.target?.value) return;

    // setFieldValue('baseInfo.isChecking', true);

    // API.checkPackageName({ packageName: e.target.value })
    //   .then((res) => {
    //     const { packageNameStatus } = res?.data?.data || {};
    //     // 后端存在 contractNo
    //     // setFieldValue('baseInfo.isExit', Boolean(packageNameStatus));
    //     console.log('输入类型：', typeof e.target.value);
    //     console.log(res.data);
    //     if (packageNameStatus) {
    //       CommonTip.warning('This already exists on the server.');
    //     }
    //   })
    //   .finally(() => {
    //     // setFieldValue('baseInfo.isChecking', false);
    //   });
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
                label="PackageName *"
                disabled={isDetal}
                onBlur={checkPackage}
                name="baseInfo.packageName"
                onChange={handleChange}
                error={errors?.contract && touched?.contract}
                value={values.packageName || ''}
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
                label="CreatedBy"
                name="baseInfo.createBy"
                error={errors?.vendorCoordinator && touched?.vendorCoordinator}
                onChange={handleChange}
                value={values.createBy || ''}
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
