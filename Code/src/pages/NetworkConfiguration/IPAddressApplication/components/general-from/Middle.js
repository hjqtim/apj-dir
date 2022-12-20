import dayjs from 'dayjs';
import React, { useState, memo, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Grid, TextField, FormControl, InputLabel, Select, MenuItem } from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';
import { HAKeyboardDatePicker, WarningDialog } from '../../../../../components';
import FormControlProps from '../../../../../models/webdp/PropsModels/FormControlProps';
import FormControlInputProps from '../../../../../models/webdp/PropsModels/FormControlInputProps';
// import useWebDPColor from '../../../../../hooks/webDP/useWebDPColor';
import { setDetailItems, setItemTouch } from '../../../../../redux/IPAdreess/ipaddrActions';
import useValidationIPForm from './useValidationIPForm';

const Middle = ({ values, index }) => {
  // const titleColor = useWebDPColor().typography;
  const [open, setOpen] = useState(false);
  const errors = useValidationIPForm()?.items?.[index] || {};
  const touches = useSelector((state) => state.IPAdreess.touches.items[index]) || {};
  const equpTypeList = useSelector((state) => state.IPAdreess.equpTypeList) || [];
  const isMyRequest = useSelector((state) => state.IPAdreess.isMyRequest) || false;
  const isMyApproval = useSelector((state) => state.IPAdreess.isMyApproval) || false;

  const dispatch = useDispatch();
  const fieldsUpdateHandler = (data) => {
    dispatch(setDetailItems(data));
  };

  const fieldsHandlerBlur = (field) => {
    dispatch(setItemTouch({ field, index }));
  };

  const equpTypeVal = useMemo(
    () => equpTypeList.find((item) => item.name === values.equpType),
    [equpTypeList, values.equpType]
  );

  const getMacAddressDisabled = () => {
    if (isMyApproval || isMyRequest) return true;
    if (values?.ipType === '' || values?.ipType === 'STATIC' || values?.ipType === 'DHCP RANGE')
      return true;
    return false;
  };

  return (
    <Grid item xs={12} md={4}>
      <Grid container>
        <Grid {...FormControlProps}>
          <Autocomplete
            value={equpTypeVal || null}
            options={equpTypeList}
            getOptionLabel={(option) => option.name}
            disabled={isMyApproval || isMyRequest}
            onBlur={() => {
              fieldsHandlerBlur('equpType');
            }}
            onChange={(e, data) => {
              fieldsUpdateHandler({
                field: 'equpType',
                data: { index, value: data?.name || '' }
              });
              fieldsUpdateHandler({
                field: 'appType',
                data: { index, value: data?.appType || '' }
              });
            }}
            renderInput={(inputParams) => (
              <TextField
                {...inputParams}
                {...FormControlInputProps}
                label="Equipment Type *"
                error={Boolean(errors?.equpType) && Boolean(touches?.equpType)}
              />
            )}
          />
        </Grid>

        <Grid {...FormControlProps}>
          <TextField
            {...FormControlInputProps}
            label="Host Name"
            onBlur={() => {
              fieldsHandlerBlur('computerName');
            }}
            error={Boolean(errors?.computerName) && Boolean(touches?.computerName)}
            value={values.computerName}
            disabled={isMyApproval || isMyRequest}
            onChange={(e) => {
              fieldsUpdateHandler({
                field: 'computerName',
                data: { index, value: e.target.value }
              });
            }}
          />
        </Grid>
        <Grid {...FormControlProps}>
          <TextField
            {...FormControlInputProps}
            label="Mac Address"
            error={Boolean(errors?.macAddress) && Boolean(touches?.macAddress)}
            disabled={getMacAddressDisabled()}
            value={values.macAddress}
            onBlur={() => {
              fieldsHandlerBlur('macAddress');
            }}
            onChange={(e) => {
              const value = e.target.value || '';
              fieldsUpdateHandler({ field: 'macAddress', data: { index, value } });
            }}
          />
        </Grid>

        <Grid {...FormControlProps}>
          <FormControl fullWidth size="small" variant="outlined">
            <InputLabel>Type</InputLabel>
            <Select
              label="Type"
              disabled={isMyApproval || isMyRequest}
              value={values.isPerm}
              onChange={(e, data) => {
                const value = data?.props?.value;
                fieldsUpdateHandler({
                  field: 'isPerm',
                  data: { index, value }
                });
              }}
            >
              <MenuItem value="Perm">This IP is required permanently </MenuItem>
              <MenuItem value="Temp">This IP is required temporarily </MenuItem>
            </Select>
          </FormControl>
        </Grid>

        {values?.isPerm === 'Temp' && (
          <Grid {...FormControlProps}>
            <HAKeyboardDatePicker
              disabled={isMyApproval || isMyRequest}
              label="Expected Release Date *"
              value={values.releaseDate || null}
              minDate={isMyApproval || isMyRequest ? null : dayjs(new Date()).format('YYYY-MM-DD')}
              error={Boolean(errors?.releaseDate) && Boolean(touches?.releaseDate)}
              onBlur={() => {
                fieldsHandlerBlur('releaseDate');
              }}
              onChange={(value) => {
                fieldsUpdateHandler({ field: 'releaseDate', data: { index, value } });
              }}
            />
          </Grid>
        )}

        <Grid {...FormControlProps}>
          <HAKeyboardDatePicker
            label="Expected Complete Date"
            disabled={isMyApproval || isMyRequest}
            value={values.completeDate || null}
            minDate={isMyApproval || isMyRequest ? null : dayjs(new Date()).format('YYYY-MM-DD')}
            onChange={(value) => {
              fieldsUpdateHandler({ field: 'completeDate', data: { index, value } });
            }}
          />
        </Grid>
      </Grid>

      <WarningDialog
        open={open}
        title="Attention!"
        handleConfirm={() => {}}
        handleClose={() => setOpen(false)}
        content={`The selected row of   Request Information will be removed, and the operation
          could not be fall back! Are you sure to continue?`}
      />
    </Grid>
  );
};

export default memo(Middle);
