import React, { useEffect, useState } from 'react';
import { InputLabel as Label } from '@material-ui/core';
import { fade, withStyles, makeStyles } from '@material-ui/core/styles';
import formatDate from '../../utils/formatDate';

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
  const { id, width, required, error, label, defaultValue, disabled, helperText, onChange } = props;
  const [newValue, setNewValue] = useState(formatDate(defaultValue));

  const handleChange = (e) => {
    setNewValue(e.target.value);
  };

  // useEffect(() => {
  //   defaultValue && onChange && onChange({ id, value: defaultValue })
  //   // eslint-disable-next-line
  // }, [ defaultValue, onChange ])

  useEffect(() => {
    newValue && onChange && onChange({ id, value: new Date(newValue) });
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

  const useStyles = makeStyles((theme) => ({
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
    },
    input: {
      borderRadius: 4,
      width: '100%',
      height: '33px',
      position: 'relative',
      backgroundColor: theme.palette.background.paper,
      transition: theme.transitions.create(['border-color', 'box-shadow']),
      color: disabled ? 'rgba(196, 196, 196, 0.8)' : 'black',
      fontSize: 16,
      marginTop: '0.5em',
      padding: '0px 26px 0px 12px',
      borderWidth: '1px',
      borderStyle: 'solid',
      borderColor: error ? theme.palette.error.main : disabled ? '#dedede' : '#ccc',
      fontFamily,
      '&:focus': {
        borderRadius: 4,
        borderColor: '#80bdff',
        outline: 'none',
        boxShadow: `${fade(theme.palette.primary.main, 0.25)} 0 0 0 0.2rem`
      }
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

  return (
    <div className={classes.root}>
      <InputLabel htmlFor={id} disabled={disabled}>
        {required && <font color="red">*</font>}
        {`${label}:`}
      </InputLabel>
      <div style={{ width: '1vw' }} />
      <div>
        <input
          id={id}
          type="date"
          disabled={disabled}
          onChange={(e) => handleChange(e)}
          defaultValue={newValue || ''}
          className={classes.input}
        />
      </div>
      {error && helperText && <div className={classes.helper}>{helperText}</div>}
    </div>
  );
}
