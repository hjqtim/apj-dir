import _ from 'lodash';
import React, { memo, useEffect, useMemo, useState } from 'react';
import ClearIcon from '@material-ui/icons/Clear';
import { Grid, TextField, Tooltip, IconButton, CircularProgress } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import Autocomplete from '@material-ui/lab/Autocomplete';
import FormControlProps from '../../../../models/webdp/PropsModels/FormControlProps';
import FormControlInputProps from '../../../../models/webdp/PropsModels/FormControlInputProps';
import ipassignAPI from '../../../../api/ipassign';
import { validIp } from '../../../../utils/tools';

const ReleaseListItem = ({
  values,
  errors,
  touches,
  addItem,
  setDeleteIndex,
  setDeleteDialog,
  index,
  isRequest,
  handleBlur,
  ipOptions,
  setFieldValue,
  ipListLoading,
  checkIpIsExit,
  hospitalList
}) => {
  const [ipList, setIsList] = useState([]);

  useEffect(() => {
    const iplistData = ipOptions?.map((item) => item?.ipAddress) || [];
    setIsList(iplistData);
  }, [ipOptions]);

  const hospitalVal = useMemo(() => {
    const obj = hospitalList?.find((item) => item.hospital === values?.hospital) || {};
    const hospitaStr = _.isEmpty(obj) ? '' : `${obj?.hospital}---${obj?.hospitalName}`;
    return hospitaStr;
  }, [hospitalList, values?.hospital]);

  const getIpData = (ipAddressList) => {
    ipassignAPI.getIpAdminList({ ipAddressList }).then((res) => {
      const reslist = res?.data?.data || [];
      if (reslist.length === 1) {
        setFieldValue(`ipList.[${index}].hospital`, reslist?.[0]?.hospital || '');
        setFieldValue(`ipList.[${index}].block`, reslist?.[0]?.block || '');
        setFieldValue(`ipList.[${index}].floor`, reslist?.[0]?.floor || '');
        setFieldValue(`ipList.[${index}].room`, reslist?.[0]?.room || '');
      }
    });
  };

  // 160.129.254.2
  return (
    <>
      {isRequest ? (
        <Grid {...FormControlProps} xs={3}>
          <Autocomplete
            onChange={(e, ip) => {
              values.ip = ip || '';
              const selectValue = ipOptions?.find((item) => item?.ipAddress === ip);
              setFieldValue(`ipList.[${index}].ip`, selectValue?.ipAddress || '');
              setFieldValue(`ipList.[${index}].hospital`, selectValue?.hospital || '');
              setFieldValue(`ipList.[${index}].block`, selectValue?.block || '');
              setFieldValue(`ipList.[${index}].floor`, selectValue?.floor || '');
              setFieldValue(`ipList.[${index}].room`, selectValue?.room || '');
            }}
            freeSolo
            inputValue={values?.ip || ''}
            disabled={!isRequest}
            options={ipList || []}
            onBlur={(e) => {
              if (e.target.value) addItem();
              handleBlur(e);
              checkIpIsExit(e.target.value, index);

              if (validIp(e.target.value)) {
                getIpData(e.target.value);
              }
            }}
            disableClearable
            renderInput={(params) => (
              <TextField
                {...params}
                label="IP Address *"
                {...FormControlInputProps}
                name={`ipList[${index}].ip`}
                onChange={(e) => {
                  setFieldValue(`ipList.[${index}].ip`, e.target.value || '');
                }}
                error={Boolean(errors?.ip) && Boolean(touches?.ip)}
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <>
                      {ipListLoading && !values?.ip ? (
                        <CircularProgress
                          size={20}
                          color="inherit"
                          style={{ marginRight: '10px' }}
                        />
                      ) : null}
                      {values?.ip ? (
                        <Tooltip title="Clear">
                          <IconButton
                            style={{ width: 20, height: 20 }}
                            onClick={() => {
                              setFieldValue(`ipList.[${index}].ip`, '');
                              setFieldValue(`ipList.[${index}].hospital`, '');
                              setFieldValue(`ipList.[${index}].block`, '');
                              setFieldValue(`ipList.[${index}].floor`, '');
                              setFieldValue(`ipList.[${index}].room`, '');
                            }}
                          >
                            <ClearIcon style={{ fontSize: 22, color: '#999' }} />
                          </IconButton>
                        </Tooltip>
                      ) : null}
                      {params.InputProps.endAdornment}
                    </>
                  )
                }}
              />
            )}
          />
        </Grid>
      ) : (
        <Grid {...FormControlProps} item xs={3}>
          <TextField label="IP Address *" disabled value={values?.ip} {...FormControlInputProps} />
        </Grid>
      )}

      <Grid {...FormControlProps} item xs={3}>
        <TextField label="Institution" disabled value={hospitalVal} {...FormControlInputProps} />
      </Grid>

      <Grid {...FormControlProps} xs={3}>
        <Grid container spacing={3}>
          <Grid item xs={6}>
            <TextField label="Block" disabled value={values?.block} {...FormControlInputProps} />
          </Grid>
          <Grid item xs={6}>
            <TextField label="Floor" disabled value={values?.floor} {...FormControlInputProps} />
          </Grid>
        </Grid>
      </Grid>

      <Grid {...FormControlProps} xs={3}>
        <Grid container spacing={3}>
          <Grid item xs={6}>
            <TextField label="Room" disabled value={values?.room} {...FormControlInputProps} />
          </Grid>
          {isRequest && (
            <Grid item xs={6}>
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

export default memo(ReleaseListItem);
