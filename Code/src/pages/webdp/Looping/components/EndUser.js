import React, { memo, useCallback, useState, useMemo } from 'react';
import { Grid, TextField, CircularProgress } from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';
import _ from 'lodash';
import RenderTitle from './RenderTitle';
import API from '../../../../api/webdp/looping';
import phoneOnBlur from '../../../../utils/phoneOnBlur';

const inputProps = {
  variant: 'outlined',
  fullWidth: true,
  size: 'small'
};

const itemProps = {
  xs: 12,
  sm: 6,
  md: 4,
  item: true
};

const EndUser = (props) => {
  const {
    values,
    handleChange,
    isDetail,
    setFieldValue,
    handleBlur,
    errors = {},
    touched = {},
    isApproval
  } = props;
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isSelect, setIsSelect] = useState(false); // 是根据下拉框选中的还是手动输入的
  const [corp, setCorp] = useState('');

  const checkAD = useCallback(
    _.debounce((inputValue) => {
      if (inputValue.length >= 3) {
        setLoading(true);
        setOptions([]);
        API.findUserList({ username: inputValue })
          .then((res) => {
            const newOptions = res?.data?.data || [];
            setOptions(newOptions);
          })
          .finally(() => {
            setLoading(false);
          }, []);
      }
    }, 800),
    []
  );

  const optionsMemo = useMemo(() => options.map((optionItem) => optionItem.display), [options]);

  const getUserName = (display) => {
    const arr = display?.split?.(',') || [];
    if (arr[0]) {
      return arr[0];
    }
    return display || '';
  };
  console.log('EndUser');

  return (
    <Grid container item spacing={2}>
      <RenderTitle title="End-user Information (Optional)" />

      <Grid container item spacing={3}>
        <Grid {...itemProps}>
          <Autocomplete
            freeSolo
            forcePopupIcon
            disabled={isDetail || isApproval}
            name="endUser.endRequesterName"
            value={values.endRequesterName}
            onChange={(event, value) => {
              const userItem = options.find((item) => item.display === value);
              setCorp(userItem?.corp || '');
              if (value) {
                setIsSelect(true);
                setFieldValue('endUser', {
                  ...values,
                  endRequesterTitle: userItem?.display?.split?.(',')?.[1]?.trim() || '',
                  endRequesterPhone: userItem?.phone || '',
                  endRequesterName: getUserName(userItem?.display)
                });
              } else {
                setFieldValue('endUser', {
                  ...values,
                  endRequesterTitle: '',
                  endRequesterPhone: '',
                  endRequesterName: ''
                });
                setOptions([]);
                setIsSelect(false);
              }
            }}
            options={optionsMemo || []}
            loading
            renderInput={(inputParams) => (
              <TextField
                {...inputParams}
                {...inputProps}
                variant="outlined"
                size="small"
                name="endUser.endRequesterName"
                label="Name"
                onBlur={handleBlur}
                // error={Boolean(errors.endRequesterName && touched.endRequesterName)}
                InputProps={{
                  ...inputParams.InputProps,
                  endAdornment: (
                    <>
                      {loading ? <CircularProgress size={20} color="inherit" /> : null}
                      {inputParams.InputProps.endAdornment}
                    </>
                  )
                }}
                onChange={(e) => {
                  setIsSelect(false);
                  setCorp('');
                  const newValue = e?.target?.value || '';
                  setFieldValue('endUser.endRequesterName', newValue);
                  if (!newValue) {
                    setOptions([]);
                  }
                  checkAD(newValue);
                }}
              />
            )}
          />
        </Grid>

        <Grid {...itemProps}>
          <TextField
            {...inputProps}
            label={`Title${values.endRequesterName ? ' *' : ''}`}
            name="endUser.endRequesterTitle"
            value={values.endRequesterTitle}
            onChange={handleChange}
            onBlur={handleBlur}
            error={Boolean(errors.endRequesterTitle && touched.endRequesterTitle)}
            disabled={isDetail || isSelect || isApproval || !values.endRequesterName}
          />
        </Grid>

        <Grid {...itemProps}>
          <TextField
            {...inputProps}
            label={`Phone${values.endRequesterName ? ' *' : ''}`}
            name="endUser.endRequesterPhone"
            value={values.endRequesterPhone}
            onBlur={(e) => {
              handleBlur(e);
              if (!isDetail) {
                phoneOnBlur(corp, values.endRequesterPhone);
              }
            }}
            error={Boolean(errors.endRequesterPhone && touched.endRequesterPhone)}
            onChange={(e) => {
              if (e.target.value && /^[0-9]*$/.test(e.target.value)) {
                handleChange(e);
              } else if (!e.target.value) {
                handleChange(e);
              }
            }}
            disabled={isDetail || isApproval || !values.endRequesterName}
            inputProps={{ maxLength: 8 }}
          />
        </Grid>

        <Grid container item>
          <TextField
            {...inputProps}
            label="Remarks"
            name="endUser.endRequesterRemarks"
            value={values.endRequesterRemarks}
            onChange={handleChange}
            fullWidth
            disabled={isDetail || isApproval}
          />
        </Grid>
      </Grid>
    </Grid>
  );
};

export default memo(EndUser);
