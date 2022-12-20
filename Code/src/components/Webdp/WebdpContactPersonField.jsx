import React, { useState, useCallback, useMemo } from 'react';
import _ from 'lodash';
import { TextField, CircularProgress } from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';
import API from '../../api/webdp/webdp';
import getDisplayName from '../../utils/getDisplayName';
import FormControlInputProps from '../../models/webdp/PropsModels/FormControlInputProps';

const WebdpContactPersonField = ({ error, setError, value, setValue, label, ...rest }) => {
  const [loading, setLoading] = useState(false);
  const [contactOptions, setContactOptions] = useState([]);

  const checkAD = useCallback(
    _.debounce((inputValue) => {
      // the function will only run when input more than 3 characters and finished loading
      if (inputValue?.length >= 3 && !loading) {
        // set loading status to optimize performance
        setLoading(true);
        API.findUserList({ username: inputValue })
          .then((res) => {
            const newContactOptions = res?.data?.data || [];
            setContactOptions(newContactOptions);
          })
          .finally(() => {
            setLoading(false);
          }, []);
      }
    }, 800),
    [loading]
  );

  // save the contact options to a memo for preventing the unnecessary update
  const memorizedOptions = useMemo(
    () => contactOptions.map((item) => item.display),
    [contactOptions]
  );

  const handleChange = (data) => {
    // if the original object has email field
    if (value.email !== undefined) {
      setValue({
        data: {
          name: data.name,
          title: data.title,
          phone: data.phone,
          email: data.email,
          corp: data.corp
        },
        error: {
          contact: false,
          title: false,
          phone: false,
          email: false
        }
      });
    } else {
      // if the original object has no email field
      setValue({
        data: {
          name: data.name,
          title: data.title,
          phone: data.phone,
          corp: data.corp || ''
        },
        error: {
          contact: false,
          title: false,
          phone: false
        }
      });
    }
  };

  return (
    <Autocomplete
      freeSolo
      forcePopupIcon
      value={value.name}
      options={memorizedOptions}
      loading
      {...rest}
      // onChange function for clicking the option to update value
      onChange={(e, contactValue) => {
        // make an array with display name only
        const userItem = contactOptions.find((item) => item.display === contactValue);
        if (contactValue) {
          const newSiteContact = {
            name: getDisplayName(userItem?.display),
            title: userItem?.display?.split?.(',')?.[1]?.trim() || '',
            phone: userItem?.phone || '',
            email: userItem?.mail || '',
            corp: userItem?.corp || ''
          };
          handleChange(newSiteContact);
        } else {
          // if the value is undefined, means click the X icon
          // endAdornment X icon set all fields to empty and reset error
          setValue({
            data: { name: '', email: '', title: '', phone: '', corp: '' },
            error: { contact: false, email: false, title: false, phone: false }
          });
          // set options to empty array
          setContactOptions([]);
        }
      }}
      renderInput={(inputParams) => (
        <TextField
          {...inputParams}
          {...FormControlInputProps}
          label={label}
          error={error}
          InputProps={{
            ...inputParams.InputProps,
            endAdornment: (
              <>
                {/* show loading icon */}
                {loading ? <CircularProgress size={20} color="inherit" /> : null}
                {inputParams.InputProps.endAdornment}
              </>
            )
          }}
          // onChange function for update input field and fetch the options array
          onChange={(e) => {
            const inputVal = e?.target?.value || '';
            const userItem = contactOptions.find((item) => item.display === inputVal);
            setValue({
              data: {
                ...value,
                name: inputVal,
                corp: userItem?.corp || '',
                email: userItem?.mail || '',
                title: userItem?.title || '',
                phone: userItem?.phone || ''
              },
              error: { ...error, contact: false }
            });
            if (inputVal.length === 0) {
              setContactOptions([]);
            }
            checkAD(inputVal);
          }}
        />
      )}
    />
  );
};

export default React.memo(WebdpContactPersonField);
