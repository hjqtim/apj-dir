import React, { useEffect, useState } from 'react';
import { InputLabel as Label, InputBase } from '@material-ui/core';
import { fade, withStyles, makeStyles } from '@material-ui/core/styles';

const fontFamily = [
  '-apple-system',
  'BlinkMacSystemFont',
  '"Segoe UI"',
  'Roboto',
  '"Helvetica Neue"',
  'Arial',
  'sans-serif',
  '"Apple Color Emoji"',
  '"Segoe UI Emoji"',
  '"Segoe UI Symbol"'
].join(',');

export default function HAInput(props) {
  const {
    id,
    width,
    required,
    error,
    label,
    defaultValue,
    disabled,
    helperText,
    autoComplete,
    autoFocus,
    startAdornment,
    endAdornment,
    fullWidth,
    onChange,
    placeholder,
    readOnly
  } = props;

  const [newValue, setNewValue] = useState('');

  const handleChange = (e) => {
    setNewValue(e.target.value);
  };

  useEffect(() => {
    setNewValue(defaultValue && defaultValue.label ? defaultValue.label : '');
  }, [defaultValue]);

  useEffect(() => {
    defaultValue && onChange && onChange(defaultValue);
  }, [defaultValue, onChange]);

  useEffect(() => {
    onChange && onChange({ id, label: newValue, value: new Date(newValue) });
    // eslint-disable-next-line
  }, [newValue]);

  const getWidth = (power) => {
    power = power || 1;
    const basicWidth = 22;
    const labelWidth = label && label.length ? label.length / 1.7 : 6 / 1.7;
    const inputWidth = basicWidth * power;
    return {
      input: inputWidth,
      label: labelWidth,
      container: Math.max(inputWidth, labelWidth)
    };
  };

  const useStyles = makeStyles(() => ({
    root: {
      padding: `0 0 ${error && helperText ? '0' : '1vh'} 0`,
      marginBottom: '1vh',
      marginRight: '5vw'
    },
    flex: {
      display: 'flex',
      marginLeft: '-6vw',
      justifyContent: 'flex-end',
      alignItems: 'center',
      width: `${getWidth(width).container}vw`
    },
    helper: {
      color: '#f44336',
      height: '1vh',
      lineHeight: '1vh',
      fontSize: '1rem',
      fontFamily,
      marginTop: '0.5vh',
      marginLeft: `${getWidth(width).labelWidth}vw`
    }
  }));

  const classes = useStyles();

  const InputLabel = withStyles((theme) => ({
    root: {
      fontSize: '1.1rem',
      color: 'rgba(0,0,0,.85)',
      '-webkit-user-select': 'none',
      '-moz-user-select': 'none',
      fontFamily,
      focused: {
        color: theme.palette.primary.main
      }
    }
  }))(Label);

  const BootstrapInput = withStyles((theme) => ({
    root: {
      width: `${getWidth(width).input}vw`
    },
    input: {
      height: '0.8em',
      marginTop: '0.5em',
      borderRadius: 4,
      position: 'relative',
      backgroundColor: theme.palette.common.white,
      border: props.error ? `1px solid ${theme.palette.error.main}` : '1px solid #ced4da',
      fontSize: 16,
      padding: '10px 12px',
      transition: theme.transitions.create(['border-color', 'box-shadow']),
      fontFamily,
      '&:focus': {
        boxShadow: `${fade(theme.palette.primary.main, 0.25)} 0 0 0 0.2rem`,
        borderColor: theme.palette.primary.main
      }
    }
  }))(InputBase);

  return (
    <div className={classes.root}>
      <InputLabel htmlFor={id} disabled={disabled}>
        {required && <font color="red">*</font>}
        {`${label}:`}
      </InputLabel>
      <div style={{ width: '1vw' }} />
      <div>
        <BootstrapInput
          id={id}
          type="date"
          value={newValue}
          disabled={disabled}
          autoComplete={autoComplete}
          autoFocus={autoFocus}
          startAdornment={startAdornment}
          endAdornment={endAdornment}
          fullWidth={fullWidth}
          onChange={handleChange}
          placeholder={placeholder}
          readOnly={readOnly}
        />
      </div>
      {error && helperText && <div className={classes.helper}>{helperText}</div>}
    </div>
  );
}
