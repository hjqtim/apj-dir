import React from 'react';
// import { alpha } from '@material-ui/core/styles';
import { KeyboardDatePicker } from '@material-ui/pickers';

const DatePicker = ({
  id,
  minDate,
  value,
  onChange,
  inputVariant,
  size,
  disabled,
  format,
  label
}) => (
  <KeyboardDatePicker
    autoOk
    fullWidth
    variant="inline"
    inputVariant={inputVariant}
    size={size}
    label={label}
    format={format}
    minDate={minDate}
    value={value}
    InputAdornmentProps={{ position: 'end', fontSize: size }}
    KeyboardButtonProps={{ size }}
    onChange={(fullDate, date) => onChange(fullDate, date, id)}
    disabled={disabled}
  />
);

export default DatePicker;
