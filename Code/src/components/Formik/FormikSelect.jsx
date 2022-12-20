import React, { useEffect } from 'react';
import { TextField } from '@material-ui/core';
import { useField } from 'formik';

const FormikSelect = ({ name, ...rest }) => {
  const [field, mata] = useField(name);

  const TextFieldProps = {
    ...field,
    variant: 'outlined',
    fullWidth: true,
    size: 'small',
    ...rest
  };

  if (mata && mata.touched && mata.error) {
    TextFieldProps.error = true;
    TextFieldProps.helperText = mata.error;
  }

  return <TextField {...TextFieldProps} />;
};

export default FormikSelect;
