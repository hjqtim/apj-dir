import React, { memo, useEffect, useState, useMemo } from 'react';
import { Grid, TextField, Tooltip, IconButton, CircularProgress } from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';
import CloseIcon from '@material-ui/icons/Close';
import FormControlProps from '../../../../models/webdp/PropsModels/FormControlProps';
import FormControlInputProps from '../../../../models/webdp/PropsModels/FormControlInputProps';

const UpdateListItem = ({
  values, // 传进来的 formik
  errors,
  // touches,
  handleChange,
  // handleBlur,
  // setFieldValue,
  // setValues,
  addItem,
  setDeleteIndex,
  setDeleteDialog,
  index,
  isRequest,
  isApproval,
  // checkIp,
  apiList,
  formStatus,
  ipListLoading
}) => {
  const [disableStatus, setDisableStatus] = useState(false);
  const optionsMemo = useMemo(() => apiList.map((optionItem) => optionItem.ip), [apiList]);

  useEffect(() => {
    isRequestFun();
    // console.log('values: ', values);
  }, []);

  const isRequestFun = () => {
    if (isRequest === true || isApproval === true) {
      if (formStatus === 1) {
        // console.log('formStatus', formStatus);
        setDisableStatus(false);
      } else {
        setDisableStatus(true);
      }
    } else {
      setDisableStatus(false);
    }
  };

  return (
    <>
      <Grid {...FormControlProps} xs={2}>
        <Autocomplete
          freeSolo
          id={`${index}-ipaddress`}
          value={values?.ip || null}
          options={optionsMemo || []}
          onChange={(_, value) => {
            values.ip = value?.ip !== '' ? value?.ip : '';
          }}
          // onInputChange={(_, newInputValue) => {
          //   console.log('newInputValue', newInputValue);
          // }}
          renderInput={(params) => {
            console.log('inputParams', params.inputProps.value);
            return (
              <TextField
                {...params}
                label="IP Address *"
                variant="outlined"
                size="small"
                value={values?.ip || null}
                name={`ipList[${index}].ip`}
                onChange={() => {
                  handleChange;
                }}
                onBlur={(e) => {
                  // console.log('auto onBlur:', e.target.value);
                  // if (e.target.value !== '') {
                  // setTimeout(() => {
                  addItem(e.target.value, index);
                }}
                // error={Boolean(errors?.ip === 'Error') && Boolean(touches?.ip)}
                error={Boolean(errors?.ip === 'Error')}
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <>
                      {ipListLoading && !values?.ip ? (
                        <CircularProgress size={20} color="inherit" />
                      ) : null}
                      {params.InputProps.endAdornment}
                    </>
                  )
                }}
              />
            );
          }}
          disabled={!disableStatus}
        />
      </Grid>
      <Grid {...FormControlProps} xs={10}>
        <Grid container spacing={3}>
          <Grid item xs={3}>
            <TextField
              label="Mac Address *"
              disabled={!disableStatus}
              onChange={handleChange}
              value={values?.macAddress}
              {...FormControlInputProps}
              name={`ipList[${index}].macAddress`}
              error={Boolean(errors?.macAddress === 'Error')}
            />
          </Grid>
          <Grid item xs={3}>
            <TextField
              label="Institution"
              disabled
              value={values?.hospital}
              {...FormControlInputProps}
              name={`ipList[${index}].location`}
            />
          </Grid>
          <Grid item xs={2}>
            <TextField
              label="Block"
              disabled
              value={values?.block}
              {...FormControlInputProps}
              name={`ipList[${index}].block`}
            />
          </Grid>
          <Grid item xs={1}>
            <TextField
              label="Floor"
              disabled
              value={values?.floor}
              {...FormControlInputProps}
              name={`ipList[${index}].floor`}
            />
          </Grid>
          <Grid item xs={1}>
            <TextField
              label="Room"
              disabled={!disableStatus}
              value={values?.room}
              {...FormControlInputProps}
              name={`ipList[${index}].room`}
              onChange={handleChange}
            />
          </Grid>
          {disableStatus && (
            <Grid item xs={1}>
              <Tooltip title="Delete">
                <IconButton
                  style={{ padding: 7 }}
                  className="clearIcon"
                  color="primary"
                  onClick={() => {
                    setDeleteDialog(true);
                    setDeleteIndex(index);
                  }}
                >
                  <CloseIcon />
                </IconButton>
              </Tooltip>
            </Grid>
          )}
        </Grid>
      </Grid>
    </>
  );
};

export default memo(UpdateListItem);
