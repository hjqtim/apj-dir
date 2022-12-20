import React from 'react';
import { IconButton, TextField } from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import ClearIcon from '@material-ui/icons/Clear';
import { useField, useFormikContext } from 'formik';

const FormikTextField = ({ name, actions, ...rest }) => {
  const [field, mata] = useField(name);
  const { setFieldValue } = useFormikContext();
  const search = () => {
    setFieldValue(name, actions.search());
  };
  const clearValue = () => {
    setFieldValue(name, '');
  };

  const TextFieldProps = {
    ...field,
    variant: 'outlined',
    fullWidth: true,
    size: 'small',
    InputProps: actions && {
      endAdornment: (
        <>
          {actions.search && (
            <IconButton onClick={search} size="small">
              <SearchIcon fontSize="small" />
            </IconButton>
          )}
          {field.value?.trim().length > 0 && actions.clear && (
            <IconButton onClick={clearValue} size="small">
              <ClearIcon fontSize="small" />
            </IconButton>
          )}
        </>
      )
    },
    ...rest
  };

  if (mata && mata.touched && mata.error) {
    TextFieldProps.error = true;
    TextFieldProps.helperText = mata.error;
  }

  return <TextField {...TextFieldProps} />;
};

export default FormikTextField;
