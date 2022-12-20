import 'date-fns';
import React, { useMemo } from 'react';
import { Grid, TextField, Checkbox, FormControlLabel } from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';
import { DatePicker } from '@material-ui/pickers';
import { HAKeyboardDatePicker } from '../../../../../../components';
import {
  FormControlProps,
  InputControlProps,
  CheckControlProps,
  TextAreaProps
} from '../../../../../../models/rms/req/FormControlProps';

export default function Index({ formik, item }) {
  const render = (type) => {
    console.log(formik.values[item.filed]);
    switch (type) {
      case 'date':
        return (
          <Grid {...FormControlProps} {...item.itemFormControlProps}>
            <DatePicker
              autoOk
              fullWidth
              variant="inline"
              inputVariant="outlined"
              label={item.labelName}
              format="dd-MMM-yyyy"
              minDate={item.minDate || undefined}
              maxDate={item.maxDate || undefined}
              size="small"
              name={item.filed}
              disabled={item.disabled || false}
              value={formik.values[item.filed] || null}
              error={formik.errors[item.filed] && formik.touched[item.filed]}
              onChange={(date) => {
                if (item.handleChange) {
                  item.handleChange(date);
                  return;
                }
                formik.setFieldValue(item.filed, date);
              }}
            />
          </Grid>
        );
      case 'keyData':
        return (
          <Grid {...FormControlProps} {...item.itemFormControlProps}>
            <HAKeyboardDatePicker
              label={item.labelName}
              minDate={item.minDate || undefined}
              maxDate={item.maxDate || undefined}
              disabled={item.disabled || false}
              value={formik.values[item.filed] || null}
              InputAdornmentProps={{ position: 'end' }}
              error={formik.errors[item.filed] && formik.touched[item.filed]}
              onChange={(date) => {
                if (item.handleChange) {
                  item.handleChange(date);
                  return;
                }
                formik.setFieldValue(item.filed, date);
              }}
            />
          </Grid>
        );
      case 'check':
        return (
          <Grid
            {...CheckControlProps}
            {...item.itemFormControlProps}
            className={item.className || ''}
          >
            <FormControlLabel
              control={
                <Checkbox
                  name={item.filed}
                  disabled={item.disabled || false}
                  checked={formik.values[item.filed] || false}
                  onChange={item.handleChange ? item.handleChange : formik.handleChange}
                  value={formik.values[item.filed] || false}
                  color="secondary"
                />
              }
              labelPlacement="start"
              label={item.labelName}
            />
          </Grid>
        );
      case 'textArea':
        return (
          <Grid {...FormControlProps} {...item.itemFormControlProps}>
            <TextField
              {...TextAreaProps}
              label={item.labelName}
              value={formik.values[item.filed] || ''}
              minRows={5}
              maxRows={5}
              name={item.filed}
              disabled={item.disabled || false}
              onChange={formik.handleChange}
            />
          </Grid>
        );
      case 'number':
        return (
          <Grid {...FormControlProps} {...item.itemFormControlProps}>
            <TextField
              {...InputControlProps}
              label={item.labelName}
              name={item.filed}
              type="number"
              onChange={(e) => {
                if (e.currentTarget.value < 0 || e.currentTarget.value > item?.maxValue) return;
                formik.handleChange(e);
              }}
              disabled={item.disabled || false}
              value={formik.values[item.filed] || 0}
            />
          </Grid>
        );
      case 'autoSelect':
        return (
          <Grid
            {...FormControlProps}
            {...item.itemFormControlProps}
            className={item.className || ''}
          >
            <Autocomplete
              value={
                typeof formik.values[item.filed] !== 'string' &&
                formik.values[item.filed] !== undefined
                  ? formik?.values?.[item?.filed]
                  : null
              }
              options={item.data || []}
              onBlur={formik.handleBlur}
              getOptionLabel={(option) =>
                item.renderOptionLabel
                  ? item.renderOptionLabel(option)
                  : `${option.id}---${option.value}`
              }
              disabled={Boolean(item.disabled)}
              onChange={(e, value) => {
                item.handleChange
                  ? item.handleChange(e, value)
                  : formik.setFieldValue(item.filed, value);
              }}
              name={item.filed}
              renderInput={(params) => (
                <TextField
                  {...params}
                  {...InputControlProps}
                  error={Boolean(formik.errors[item.filed] && formik.touched[item.filed])}
                  // helperText={formik.touched[item.filed] && formik.errors[item.filed]}
                  label={item.labelName}
                />
              )}
            />
          </Grid>
        );
      case 'autoSelectNotObj':
        return (
          <Grid
            {...FormControlProps}
            {...item.itemFormControlProps}
            className={item.className || ''}
          >
            <Autocomplete
              value={formik.values[item?.filed] || ''}
              options={item.data || []}
              onBlur={formik.handleBlur}
              disabled={Boolean(item.disabled)}
              onChange={(e, value) => {
                item.handleChange
                  ? item.handleChange(e, value)
                  : formik.setFieldValue(item.filed, value);
              }}
              name={item.filed}
              renderInput={(params) => (
                <TextField
                  {...params}
                  {...InputControlProps}
                  error={Boolean(formik.errors[item.filed] && formik.touched[item.filed])}
                  label={item.labelName}
                />
              )}
            />
          </Grid>
        );
      default:
        return (
          <Grid {...FormControlProps} {...item.itemFormControlProps}>
            <TextField
              {...InputControlProps}
              label={item.labelName}
              name={item.filed}
              onChange={formik.handleChange}
              disabled={Boolean(item.disabled)}
              value={formik.values[item.filed] || ''}
            />
          </Grid>
        );
    }
  };

  // 防止重复渲染
  const view = useMemo(
    () => render(item?.type),
    [
      formik.values[item.filed],
      formik.touched[item.filed],
      formik.errors[item.filed],
      item.data,
      item.listensData
    ]
  );

  return <>{view}</>;
}
