import React, { useState, useEffect } from 'react';
import { TextField } from '@material-ui/core';
import { useField, useFormik, useFormikContext } from 'formik';
import Autocomplete from '@material-ui/lab/Autocomplete';

const FormikAutocomplete = ({ name, label, options, ...rest }) => {
  const [field, meta] = useField(name);
  const { setFieldValue } = useFormikContext();
  // console.log(field);

  const [value, setValue] = useState(options[1].value);
  const [inputValue, setInputValue] = useState('');

  // useEffect(() => {
  //   console.log(value);
  //   console.log(inputValue);
  // }, [value]);

  const handleChange = (e, data) => {
    setFieldValue(name, parseInt(data.value, 10));
  };

  const AutocompleteProps = {
    getOptionLabel: (option) => option.label,
    options,
    id: label,
    label,
    value: field.value,
    onChange: handleChange,
    renderInput: (params) => (
      <TextField {...params} onChange={handleChange} label={label} variant="outlined" />
    ),
    ...rest
  };

  if (meta && meta.touched && meta.error) {
    AutocompleteProps.error = true;
    AutocompleteProps.helpText = 'You must choose one';
  }

  return <Autocomplete {...AutocompleteProps} />;
};

export default FormikAutocomplete;
