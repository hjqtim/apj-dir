import React, { memo, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Grid, Select, MenuItem, FormControl, InputLabel } from '@material-ui/core';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { CommonDialog, MyTextField, CommonTip, Loading } from '../../../../components';
import { textFieldProps } from '../../../../utils/tools';
import webdpAPI from '../../../../api/webdp/webdp';
import { setCabinetPowerList } from '../../../../redux/networkCloset/network-closet-actions';

const AddCabinetPower = () => {
  const dispatch = useDispatch();
  const isOpenAddPower = useSelector((state) => state.networkCloset.isOpenAddPower);
  const cabinetList = useSelector((state) => state.networkCloset.cabinetList);
  const closetSelectItem = useSelector((state) => state.networkCloset.closetSelectItem);
  const cabinetSelectItem = useSelector((state) => state.networkCloset.cabinetSelectItem);
  const statusList = useSelector((state) => state.networkCloset.statusList);

  const cabinetPowerStatusList = useMemo(
    () => statusList.filter((item) => item.optionType === 'CabinetPower'),
    [statusList]
  );

  const getCabinetPowerList = () => {
    const params = {
      closetId: closetSelectItem?.closetid,
      cabinetId: cabinetSelectItem?.cabinetId
    };
    webdpAPI.getCabinetPowerList(params).then((res) => {
      dispatch(setCabinetPowerList(res?.data?.data?.list || []));
    });
  };

  const formik = useFormik({
    initialValues: {
      cabinetId: '',
      powerBarId: '',
      upsid: '',
      sourceMCB: '',
      remark: '',
      status: ''
    },
    validationSchema: Yup.object({
      cabinetId: Yup.string().required('Can not be empty')
    }),
    onSubmit: (values) => {
      Loading.show();
      const saveParams = {
        ...values,
        closetId: closetSelectItem?.closetid
      };
      webdpAPI
        .saveCabinetPower(saveParams)
        .then((res) => {
          if (res?.data?.data?.result) {
            CommonTip.success('Success', 2000);
            handleClose();
            formik.handleReset();
            getCabinetPowerList();
          }
        })
        .finally(() => {
          Loading.hide();
        });
    }
  });

  const handleClose = () => {
    const action = {
      type: 'networkCloset/setIsOpenAddPower',
      payload: false
    };
    dispatch(action);
  };

  const handleConfirm = () => {
    formik.handleSubmit();
  };

  const {
    cabinetId = '',
    powerBarId = '',
    upsid = '',
    sourceMCB = '',
    remark = '',
    status = ''
  } = formik.values;

  return (
    <>
      <CommonDialog
        open={isOpenAddPower}
        title="Add Cabinet Power Connection"
        isHideFooter={false}
        handleClose={handleClose}
        handleConfirm={handleConfirm}
        content={
          <div style={{ padding: 20 }}>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <FormControl
                  {...textFieldProps}
                  error={Boolean(formik.errors.cabinetId && formik.touched.cabinetId)}
                >
                  <InputLabel>Cabinet ID *</InputLabel>
                  <Select
                    label="Cabinet ID *"
                    name="cabinetId"
                    value={cabinetId}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  >
                    {cabinetList.map((item) => (
                      <MenuItem key={item.cabinetId} value={item.cabinetId}>
                        {item.cabinetId}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={6}>
                <FormControl {...textFieldProps}>
                  <InputLabel>Status</InputLabel>
                  <Select
                    label="Status"
                    name="status"
                    value={status}
                    onChange={formik.handleChange}
                  >
                    {cabinetPowerStatusList.map((item) => (
                      <MenuItem key={item.id} value={item.optionValue}>
                        {item.optionValue}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={6}>
                <MyTextField
                  value={powerBarId}
                  label="Pw Unit"
                  name="powerBarId"
                  onChange={formik.handleChange}
                />
              </Grid>

              <Grid item xs={6}>
                <MyTextField
                  value={upsid}
                  label="Power Eqt. Ref. ID"
                  name="upsid"
                  onChange={formik.handleChange}
                />
              </Grid>

              <Grid item xs={6}>
                <MyTextField
                  value={sourceMCB}
                  label="E/N: MCB# (Pw Source)"
                  name="sourceMCB"
                  onChange={formik.handleChange}
                />
              </Grid>

              <Grid item xs={6}>
                <MyTextField
                  value={remark}
                  label="Remark"
                  name="remark"
                  onChange={formik.handleChange}
                />
              </Grid>
            </Grid>
          </div>
        }
      />
    </>
  );
};

export default memo(AddCabinetPower);
