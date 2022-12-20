import React, { useMemo, memo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Grid, TextField, MenuItem, InputLabel, FormControl, Select } from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';
import FormControlProps from '../../../../../models/webdp/PropsModels/FormControlProps';
import FormControlInputProps from '../../../../../models/webdp/PropsModels/FormControlInputProps';
import { setDetailItems, setItemTouch } from '../../../../../redux/IPAdreess/ipaddrActions';
import useValidationIPForm from './useValidationIPForm';
import { WarningDialog } from '../../../../../components';
import TextAreaProps from '../../../../../models/webdp/PropsModels/TextAreaProps';

const Left = ({ values, index }) => {
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const errors = useValidationIPForm()?.items?.[index] || {};
  const touches = useSelector((state) => state.IPAdreess.touches.items[index]);
  const projectList = useSelector((state) => state.IPAdreess.projectList) || [];
  const isMyRequest = useSelector((state) => state.IPAdreess.isMyRequest) || false;
  const isMyApproval = useSelector((state) => state.IPAdreess.isMyApproval) || false;

  const projectVal = useMemo(
    () => projectList.find((item) => item.project === values.purpose),
    [projectList, values.purpose]
  );

  const fieldsUpdateHandler = (data) => {
    dispatch(setDetailItems(data));
  };

  const fieldsHandlerBlur = (field) => {
    dispatch(setItemTouch({ field, index }));
  };

  const getNumberDisabled = () => {
    if (isMyApproval || isMyRequest) return true;
    if (values?.ipType === 'DHCP RESERVED') return true;
    return false;
  };

  const projectChange = (e, data) => {
    const dataObj = projectList?.find((item) => item.project === data?.project);
    const ipType = dataObj?.dataObj || '';
    fieldsUpdateHandler({
      field: 'purpose',
      data: { index, value: data?.project || '' }
    });
    if (dataObj) {
      fieldsUpdateHandler({ field: 'ipType', data: { index, value: ipType || 'STATIC' } });
      fieldsUpdateHandler({ field: 'defaultIPType', data: { index, value: ipType || 'STATIC' } });
      fieldsUpdateHandler({ field: 'ipNumber', data: { index, value: 1 } });
    }
    if (ipType === 'DHCP RANGE') {
      fieldsUpdateHandler({ field: 'macAddress', data: { index, value: '' } });
      fieldsUpdateHandler({ field: 'macAddress', data: { index, value: '' } });
    } else if (ipType === 'STATIC' || !ipType) {
      fieldsUpdateHandler({ field: 'macAddress', data: { index, value: '' } });
      //
    }
  };

  return (
    <Grid item xs={12} md={4}>
      <Grid container>
        <Grid {...FormControlProps} md={12}>
          <Autocomplete
            onBlur={() => {
              fieldsHandlerBlur('purpose');
            }}
            disabled={isMyApproval || isMyRequest}
            onChange={projectChange}
            options={projectList}
            value={projectVal || null}
            getOptionLabel={(option) => `${option.project}---${option.description}`}
            renderInput={(params) => (
              <TextField
                {...params}
                {...FormControlInputProps}
                label="Project *"
                error={Boolean(errors?.purpose) && Boolean(touches?.purpose)}
              />
            )}
          />
        </Grid>

        <Grid {...FormControlProps}>
          <FormControl fullWidth size="small" variant="outlined">
            <InputLabel>IP Type Required *</InputLabel>
            <Select
              label="IP Type Required *"
              value={values?.ipType}
              onBlur={() => {
                fieldsHandlerBlur('ipType');
              }}
              disabled={isMyApproval || isMyRequest}
              onChange={(e, data) => {
                const value = data?.props?.value;
                fieldsUpdateHandler({ field: 'ipType', data: { index, value } });

                if (value === 'STATIC') {
                  fieldsUpdateHandler({ field: 'macAddress', data: { index, value: '' } });
                } else if (value === 'DHCP RESERVED') {
                  fieldsUpdateHandler({ field: 'ipNumber', data: { index, value: 1 } });
                } else if (value === 'DHCP RANGE') {
                  fieldsUpdateHandler({ field: 'macAddress', data: { index, value: '' } });
                  fieldsUpdateHandler({ field: 'dataPortId', data: { index, value: '' } });
                } else {
                  setOpen(true);
                }
              }}
              error={Boolean(errors?.ipType) && Boolean(touches?.ipType)}
            >
              <MenuItem value="STATIC">Static</MenuItem>
              <MenuItem value="DHCP RESERVED">DHCP Reserved</MenuItem>
              <MenuItem value="DHCP RANGE">DHCP Range</MenuItem>
              <MenuItem value="DHCP">DHCP</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid {...FormControlProps}>
          <TextField
            {...FormControlInputProps}
            type="number"
            label="Quantity of Required IP *"
            value={values?.ipNumber}
            disabled={getNumberDisabled()}
            onBlur={() => {
              fieldsHandlerBlur('ipNumber');
            }}
            error={Boolean(errors?.ipNumber) && Boolean(touches?.ipNumber)}
            onChange={(e) => {
              if (
                (e.target.value &&
                  /^[0-9]*$/.test(e.target.value) &&
                  Number(e?.target?.value || '') <= 100) ||
                e.target.value === ''
              ) {
                let value = e?.target?.value !== '' ? Number(e?.target?.value || '') : '';
                value = value === 0 ? 1 : value;
                fieldsUpdateHandler({ field: 'ipNumber', data: { index, value } });
              }
            }}
          />
        </Grid>

        <Grid {...FormControlProps}>
          <TextField
            {...TextAreaProps}
            label="Reason *"
            minRows={3}
            disabled={isMyApproval || isMyRequest}
            value={values?.remarks}
            error={Boolean(errors?.remarks) && Boolean(touches?.remarks)}
            onBlur={() => {
              fieldsHandlerBlur('remarks');
            }}
            onChange={(e) => {
              const value = e?.target?.value || '';
              fieldsUpdateHandler({ field: 'remarks', data: { index, value } });
            }}
          />
        </Grid>
      </Grid>

      <WarningDialog
        open={open}
        isHideConfirm
        handleClose={() => {
          setOpen(false);
          fieldsUpdateHandler({ field: 'ipType', data: { index, value: '' } });
        }}
        CancelText="OK"
        content={
          <>
            For DHCP, IP Address will be obtained automatically via DHCP server. Please contact IP
            Address Administrator at 3523-1986 or via{' '}
            <a
              href="mailto:ipa@pyn.ha.org.hk"
              rel="noreferrer"
              style={{ color: '#229FFA', textDecoration: 'none' }}
            >
              email
            </a>{' '}
            for any further assistance.
          </>
        }
      />
    </Grid>
  );
};

export default memo(Left);
