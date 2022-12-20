import React from 'react';
import { HAKeyboardDatePicker } from '../../../../../components';

const DatePicker = ({
  id,
  minDate,
  value,
  onChange,
  inputVariant,
  size,
  disabled,
  error = false
}) => (
  <HAKeyboardDatePicker
    variant="inline"
    inputVariant={inputVariant}
    size={size}
    label="Expected Completion Date"
    minDate={minDate}
    value={value}
    InputAdornmentProps={{ position: 'end', fontSize: size }}
    KeyboardButtonProps={{ size }}
    onChange={(fullDate, date) => onChange(fullDate, date, id)}
    disabled={disabled}
    error={error}
  />
  // <KeyboardDatePicker
  //   autoOk
  //   fullWidth
  //   variant="inline"
  //   inputVariant={inputVariant}
  //   size={size}
  //   label="Expected Completion Date"
  //   format="dd-MMM-yyyy"
  //   minDate={minDate}
  //   value={value}
  //   InputAdornmentProps={{ position: 'end', fontSize: size }}
  //   KeyboardButtonProps={{ size }}
  //   onChange={(fullDate, date) => onChange(fullDate, date, id)}
  //   disabled={disabled}
  //   error={error}
  // />
);

export default DatePicker;
