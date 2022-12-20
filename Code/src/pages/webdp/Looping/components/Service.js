import React, { memo, useState, useEffect, useMemo } from 'react';
import { Grid, TextField, Radio, RadioGroup, FormControlLabel, FormLabel } from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import dayjs from 'dayjs';
import RenderTitle from './RenderTitle';
import webdpAPI from '../../../../api/webdp/webdp';
import { CommonTip, HAKeyboardDatePicker } from '../../../../components';

const inputProps = {
  variant: 'outlined',
  fullWidth: true,
  size: 'small'
};

const Service = (props) => {
  const {
    values,
    handleChange,
    isDetail,
    handleBlur,
    errors = {},
    touched = {},
    isApproval,
    setFieldValue,
    formik
  } = props;
  const [options, setOptions] = useState([]);

  useEffect(() => {
    webdpAPI.getHospitalList().then((hospitalRes) => {
      const { hospitalList = [] } = hospitalRes?.data?.data || {};
      setOptions(hospitalList);
    });
  }, []);

  const hospitalVal = useMemo(
    () => options.find((item) => item.hospital === values.requestHosp?.hospital),
    [options, values.requestHosp?.hospital]
  );

  return (
    <Grid container item spacing={2}>
      <RenderTitle title="Service Required" />
      <Grid container item spacing={2}>
        <Grid item xs={12}>
          <Autocomplete
            value={hospitalVal || null}
            onChange={(event, value) => {
              const newRequestHospital = {
                target: {
                  value: value || {},
                  name: 'service.requestHosp'
                }
              };
              handleChange(newRequestHospital);
            }}
            disabled={isDetail || isApproval}
            options={options}
            onBlur={handleBlur}
            getOptionLabel={(option) => `${option.hospital}---${option.hospitalName}`}
            renderInput={(params) => (
              <TextField
                {...params}
                {...inputProps}
                name="service.requestHosp.hospital"
                label="Request Institution *"
                error={Boolean(errors.hospital && touched.requestHosp)}
              />
            )}
          />
        </Grid>
        <Grid item xs={12}>
          <FormLabel error={errors.requestType && touched.requestType}>Service Type *</FormLabel>
          <RadioGroup
            name="service.requestType"
            value={values.requestType || null}
            onChange={(e) => {
              const hasLoading = formik.values.dataPortList.items.find((item) => item.isChecking);
              if (hasLoading) {
                CommonTip.warning('Checking the data port id, Please try again later');
                return;
              }
              handleChange(e);
              setFieldValue('dataPortList.items', formik.initialValues.dataPortList.items);

              // if (dataPortValues?.length > 1) {
              //   CommonTip.warning('You have selected a new type, please re-check the data port');
              // }
            }}
            onBlur={handleBlur}
          >
            <FormControlLabel
              value="Disable"
              control={<Radio />}
              label="Disable Looping Protection (Allow Multiple Devices)"
              disabled={isDetail || isApproval}
            />
            <FormControlLabel
              value="Enable"
              control={<Radio />}
              label="Enable Looping Protection (Allow Single Device)"
              disabled={isDetail || isApproval}
            />
          </RadioGroup>
        </Grid>

        {values.requestType === 'Disable' && (
          <Grid container item xs={12} spacing={4}>
            <Grid item xs={12}>
              <FormLabel>Exemption Period</FormLabel>
              <Grid container spacing={4} style={{ marginTop: 5 }}>
                <Grid item>
                  <HAKeyboardDatePicker
                    name="service.exemptFrom"
                    label="From *"
                    disabled={isDetail || isApproval}
                    disablePast
                    onBlur={handleBlur}
                    error={errors.exemptFrom && touched.exemptFrom}
                    value={values.exemptFrom || null}
                    onChange={(dateVal) => {
                      setFieldValue(
                        'service.exemptFrom',
                        dateVal ? dayjs(dateVal).format('YYYY-MM-DD 00:00:00') : ''
                      );

                      setFieldValue(
                        'service.exemptTo',
                        dateVal ? dayjs(dateVal).add(6, 'month').format('YYYY-MM-DD 23:59:59') : ''
                      );
                    }}
                  />
                </Grid>
                <Grid item>
                  <HAKeyboardDatePicker
                    name="service.exemptTo"
                    label="To *"
                    disabled={isDetail || isApproval}
                    disablePast
                    onBlur={handleBlur}
                    error={errors.exemptTo && touched.exemptTo}
                    minDate={values.exemptFrom ? values.exemptFrom : undefined}
                    maxDate={
                      values.exemptFrom
                        ? dayjs(values.exemptFrom).add(6, 'month').format('YYYY-MM-DD 23:59:59')
                        : undefined
                    }
                    onChange={(dateVal) => {
                      const newExemptTo = {
                        target: {
                          value: dateVal ? dayjs(dateVal).format('YYYY-MM-DD 23:59:59') : '',
                          name: 'service.exemptTo'
                        }
                      };
                      handleChange(newExemptTo);
                    }}
                    value={values.exemptTo || null}
                  />
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12}>
              <TextField
                {...inputProps}
                label="Purpose / Justification *"
                name="service.purpose"
                value={values.purpose}
                onChange={handleChange}
                disabled={isDetail || isApproval}
                onBlur={handleBlur}
                error={errors.purpose && touched.purpose}
              />
            </Grid>
          </Grid>
        )}
      </Grid>
    </Grid>
  );
};

export default memo(Service);
