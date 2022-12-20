import React from 'react';
import {
  FormControl,
  FormControlLabel,
  FormLabel,
  FormHelperText,
  Radio,
  RadioGroup
} from '@material-ui/core';

const WebdpRadioField = ({
  value,
  label,
  id,
  options,
  onChange,
  error,
  helperText,
  name,
  disabled = false,
  ...rest
}) => {
  const PROPS = {
    id,
    name,
    value,
    onChange,
    ...rest
  };
  return (
    <FormControl component="fieldset" error={error} fullWidth>
      <FormLabel component="legend" id={id}>
        {label}
      </FormLabel>
      {/* <RadioGroup {...RadioProps} onChange={handleChange}> */}
      <RadioGroup {...PROPS}>
        {options.map((option) => (
          <FormControlLabel
            key={option.label}
            value={option.value}
            control={<Radio />}
            label={option.label}
            disabled={disabled}
          />
        ))}
      </RadioGroup>
      <FormHelperText>{error ? helperText : ''}</FormHelperText>
    </FormControl>
  );
};

export default WebdpRadioField;
