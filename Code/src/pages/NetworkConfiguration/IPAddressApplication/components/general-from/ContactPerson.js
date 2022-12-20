import React, { memo, useCallback, useState, useMemo, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import _ from 'lodash';
import { Autocomplete } from '@material-ui/lab';
import { Grid, Typography, TextField } from '@material-ui/core';
import API from '../../../../../api/webdp/webdp';
import useTitleProps from '../../../../../models/webdp/PropsModels/useTitleProps';
import useWebDPColor from '../../../../../hooks/webDP/useWebDPColor';
import FormControlProps from '../../../../../models/webdp/PropsModels/FormControlProps';
import FormControlInputProps from '../../../../../models/webdp/PropsModels/FormControlInputProps';
import { setContractPerson, setTouch } from '../../../../../redux/IPAdreess/ipaddrActions';
import useValidationIPForm from './useValidationIPForm';

const ContactPerson = () => {
  const dispatch = useDispatch();
  const TitleProps = useTitleProps();
  const webdpColor = useWebDPColor();
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const contactPerson = useSelector((state) => state.IPAdreess.contactPerson);
  const errors = useValidationIPForm()?.contactPerson || {};
  const isMyRequest = useSelector((state) => state.IPAdreess.isMyRequest) || false;
  const isMyApproval = useSelector((state) => state.IPAdreess.isMyApproval) || false;

  const touches = useSelector((state) => state.IPAdreess.touches.contactPerson);

  const fieldsUpdateHandler = (data) => {
    dispatch(setContractPerson(data));
  };

  const phoneOnChange = (e) => {
    if (e.target.value && /^[0-9]*$/.test(e.target.value) && e.target?.value?.length < 9) {
      fieldsUpdateHandler({ field: 'endUserPhone', data: e.target.value });
    } else if (e.target.value && /^[0-9]*$/.test(e.target.value) && e.target?.value?.length === 9) {
      fieldsUpdateHandler({ field: 'endUserPhone', data: contactPerson.endUserPhone });
    } else if (!e.target.value) {
      fieldsUpdateHandler({ field: 'endUserPhone', target: e.target.value });
    }
  };

  const checkAD = useCallback(
    _.debounce((inputValue) => {
      // the function will only run when input more than 3 characters and finished loading
      if (inputValue?.length >= 3) {
        // set loading status to optimize performance
        setLoading(true);
        fieldsUpdateHandler({ field: 'endUserName', data: '' });
        fieldsUpdateHandler({ field: 'endUserTitle', data: '' });
        fieldsUpdateHandler({ field: 'endUserPhone', data: '' });
        fieldsUpdateHandler({ field: 'endUserEmail', data: '' });
        fieldsUpdateHandler({ field: 'endUserCorp', data: '' });
        API.findUserList({ username: inputValue })
          .then((res) => {
            const newContactOptions = res?.data?.data || [];
            setOptions(newContactOptions);
          })
          .finally(() => {
            setLoading(false);
          }, []);
      }
    }, 800),
    []
  );

  useEffect(() => {
    setInputValue(contactPerson?.endUserName || '');
  }, [contactPerson?.endUserName]);

  const optionsMemo = useMemo(() => options?.map((item) => item.display), [options]);

  return (
    <Grid container>
      <Grid {...TitleProps}>
        <Typography variant="h6" style={{ color: webdpColor.title }}>
          <strong>Contact person</strong>
        </Typography>
      </Grid>
      <Grid container spacing={3}>
        <Grid {...FormControlProps} md={6} lg={3}>
          <Autocomplete
            forcePopupIcon
            disabled={isMyApproval || isMyRequest}
            value={inputValue || ''}
            onBlur={() => {
              if (!contactPerson.endUserCorp) {
                setInputValue('');
              }
            }}
            onChange={(e, value) => {
              const contactValue = options?.find((item) => item.display === value);
              setInputValue(contactValue?.display || '');
              fieldsUpdateHandler({ field: 'endUserName', data: contactValue?.display || '' });
              fieldsUpdateHandler({
                field: 'endUserTitle',
                data: contactValue?.display?.split?.(',')?.[1]?.trim() || ''
              });
              fieldsUpdateHandler({ field: 'endUserPhone', data: contactValue?.phone || '' });
              fieldsUpdateHandler({ field: 'endUserEmail', data: contactValue?.mail || '' });
              fieldsUpdateHandler({ field: 'endUserCorp', data: contactValue?.corp || '' });
            }}
            options={optionsMemo}
            loading={loading}
            renderInput={(inputParams) => (
              <TextField
                {...inputParams}
                {...FormControlInputProps}
                label="Contact's Name"
                onChange={(e) => {
                  const inputVal = e?.target?.value || '';
                  setInputValue(inputVal);
                  checkAD(inputVal);
                }}
              />
            )}
          />
        </Grid>

        <Grid {...FormControlProps} md={6} lg={3}>
          <TextField
            {...FormControlInputProps}
            value={contactPerson.endUserTitle}
            disabled
            label="Title"
          />
        </Grid>

        <Grid {...FormControlProps} md={6} lg={3}>
          <TextField
            {...FormControlInputProps}
            value={contactPerson.endUserEmail}
            disabled
            label="Email"
          />
        </Grid>
        <Grid {...FormControlProps} md={6} lg={3}>
          <TextField
            label="Phone *"
            {...FormControlInputProps}
            value={contactPerson.endUserPhone}
            disabled={!inputValue || isMyApproval || isMyRequest}
            onBlur={() => {
              dispatch(setTouch({ field: 'contactPerson', data: { endUserPhone: true } }));
            }}
            error={Boolean(errors?.endUserPhone) && Boolean(touches?.endUserPhone)}
            onChange={phoneOnChange}
          />
        </Grid>
      </Grid>
    </Grid>
  );
};

export default memo(ContactPerson);
