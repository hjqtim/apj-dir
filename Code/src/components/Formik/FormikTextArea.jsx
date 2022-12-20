import React, { useEffect } from 'react';
import { TextField } from '@material-ui/core';
import { useField } from 'formik';

const FormikTextArea = ({ name, ...rest }) => {
  const [field, mata] = useField(name);

  const TextFieldProps = {
    ...field,
    variant: 'outlined',
    multiline: true,
    fullWidth: true,
    minRows: 6,
    maxRows: 10,
    ...rest
  };

  if (mata && mata.touched && mata.error) {
    TextFieldProps.error = true;
    TextFieldProps.helperText = mata.error;
  }

  return <TextField {...TextFieldProps} />;
};

export default FormikTextArea;
