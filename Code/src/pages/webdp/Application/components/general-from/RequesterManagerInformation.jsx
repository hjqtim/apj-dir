import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Grid, Typography, TextField } from '@material-ui/core';
import _ from 'lodash';
import { Autocomplete } from '@material-ui/lab';
import webdpColor from '../../../../../hooks/webDP/useWebDPColor';
import WebdpTextField from '../../../../../components/Webdp/WebdpTextField';
import useTitleProps from '../../../../../models/webdp/PropsModels/useTitleProps';
import { setRequesterManager } from '../../../../../redux/webDP/webDP-actions';
import API from '../../../../../api/webdp/webdp';
import FormControlInputProps from '../../../../../models/webdp/PropsModels/FormControlInputProps';

const RequesterManagerInformation = () => {
  const dispatch = useDispatch();
  const rManager = useSelector((state) => state.webDP.rManager);

  const viewOnly = useSelector((state) => state.webDP.viewOnly);
  const [loading, setLoading] = useState(false);
  const TitleProps = useTitleProps();
  const rManagerError = useSelector((state) => state.webDP.error.rManager);

  const [inputValue, setInputValue] = useState('');

  const setRManagerByField = (field, value) => {
    dispatch(setRequesterManager({ [field]: value, field }));
  };

  const checkAD = useCallback(
    _.debounce((inputValue) => {
      // the function will only run when input more than 3 characters and finished loading
      if (inputValue?.length >= 3) {
        // set loading status to optimize performance
        setLoading(true);
        setRManagerByField('name', '');
        setRManagerByField('title', '');
        setRManagerByField('phone', '');
        setRManagerByField('email', '');
        setRManagerByField('corp', '');
        API.findUserList({ username: inputValue })
          .then((res) => {
            const newContactOptions = res?.data?.data || [];
            setRManagerByField('options', newContactOptions);
          })
          .finally(() => {
            setLoading(false);
          }, []);
      }
    }, 800),
    []
  );

  const optionsMemo = useMemo(
    () => rManager?.options?.map((optionItem) => optionItem.display),
    [rManager.options]
  );

  useEffect(() => {
    setInputValue(rManager?.name || '');
  }, [rManager?.name]);

  return (
    <>
      <Grid {...TitleProps}>
        <Typography variant="h6" style={{ color: webdpColor().title }}>
          <strong>Requester's Manager Information (For Approval - Optional)</strong>
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <Grid container style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Grid item xs={3}>
            <Autocomplete
              forcePopupIcon
              disabled={viewOnly}
              value={inputValue || ''}
              onBlur={() => {
                if (!rManager.corp) {
                  setInputValue('');
                }
              }}
              onChange={(e, value) => {
                const contactValue = rManager?.options?.find((item) => item.display === value);
                setInputValue(contactValue?.display || '');
                setRManagerByField('name', contactValue?.display || '');
                setRManagerByField('title', contactValue?.display?.split?.(',')?.[1]?.trim() || '');
                setRManagerByField('phone', contactValue?.phone || '');
                setRManagerByField('email', contactValue?.mail || '');
                setRManagerByField('corp', contactValue?.corp || '');
              }}
              options={optionsMemo}
              loading={loading}
              renderInput={(inputParams) => (
                <TextField
                  {...inputParams}
                  {...FormControlInputProps}
                  label="Manager's Name"
                  onChange={(e) => {
                    const inputVal = e?.target?.value || '';
                    setInputValue(inputVal);
                    checkAD(inputVal);
                  }}
                />
              )}
            />
          </Grid>
          <Grid item xs={3} style={{ paddingLeft: '0.5rem' }}>
            <WebdpTextField value={rManager.title} label="Title" id="title" disabled />
          </Grid>
          <Grid item xs={3} style={{ paddingLeft: '0.5rem' }}>
            <WebdpTextField
              value={rManager.email}
              label="Email"
              error={Boolean(rManagerError?.email)}
              disabled={viewOnly || Boolean(!rManager.corp)}
              onChange={(e) => {
                setRManagerByField('email', e.target.value);
              }}
            />
          </Grid>
          <Grid item xs={3} style={{ paddingLeft: '0.5rem' }}>
            <WebdpTextField
              value={rManager.phone}
              label="Phone"
              error={Boolean(rManagerError?.phone)}
              disabled={viewOnly || Boolean(!rManager.corp)}
              onChange={(e) => {
                const { value } = e.target;
                if (!value) {
                  setRManagerByField('phone', '');
                } else if (/^\d*$/.test(value) && value.length <= 8) {
                  setRManagerByField('phone', value);
                }
              }}
            />
          </Grid>
        </Grid>
      </Grid>
    </>
  );
};

export default RequesterManagerInformation;
