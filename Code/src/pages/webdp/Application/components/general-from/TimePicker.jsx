import React from 'react';
import PropsType from 'prop-types';
import { KeyboardTimePicker } from '@material-ui/pickers';

const TimePicker = ({
  id,
  label,
  value,
  onChange,
  icon,
  inputVariant,
  fullWidth,
  size,
  disabled
}) => (
  <KeyboardTimePicker
    label={label}
    fullWidth={fullWidth}
    inputVariant={inputVariant}
    size={size}
    placeholder="08:00"
    mask="__:__"
    value={value}
    ampm={false}
    onChange={(fullDateTime, time) => onChange(fullDateTime, time, id)}
    keyboardIcon={icon}
    clearable
    disabled={disabled}
  />
);

TimePicker.propTypes = {
  id: PropsType.string,
  label: PropsType.string,
  value: PropsType.object,
  onChange: PropsType.func,
  icon: PropsType.object,
  inputVariant: PropsType.string,
  fullWidth: PropsType.bool,
  size: PropsType.string
};

export default TimePicker;
