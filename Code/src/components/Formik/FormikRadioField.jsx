import React from 'react';
import { FormControl, FormControlLabel, FormLabel, RadioGroup, Radio } from '@material-ui/core';
import { useFormikContext } from 'formik';

const FormikRadioField = ({ name, value, options, label, ...rest }) => {
  console.log(
    'render Radio Field----------------------------------------------------------------------',
    rest
  );
  const { setFieldValue } = useFormikContext();
  // const [field, meta] = useField(name);
  const handleChange = (e) => {
    setFieldValue(name, parseInt(e.target.value, 10));
  };

  // const RadioProps = {
  //   name: field.name,
  //   value: field.value,
  //   ...rest
  // };

  // if (meta && meta.touched && meta.error) {
  //   RadioProps.error = true;
  //   RadioProps.helpText = 'You must choose one';
  // }

  return (
    <FormControl component="fieldset" fullWidth>
      <FormLabel component="legend">{label}</FormLabel>
      {/* <RadioGroup {...RadioProps} onChange={handleChange}> */}
      <RadioGroup value={value} onChange={handleChange}>
        {options.map((option) => (
          <FormControlLabel
            key={option.label}
            value={option.value}
            control={<Radio />}
            label={option.label}
          />
        ))}
      </RadioGroup>
    </FormControl>
  );
};

export default FormikRadioField;
