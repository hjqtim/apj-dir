import React, { useEffect, useState } from 'react';
import { InputLabel as Label, InputBase, Select as MuiSelect, MenuItem } from '@material-ui/core';
import { withStyles, makeStyles } from '@material-ui/core/styles';

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

export default function HASelect(props) {
  const {
    id,
    width,
    required,
    error,
    label,
    disabled,
    helperText,
    onChange,
    itemList,
    labelField,
    valueField,
    defaultValue,
    isNew
  } = props;

  const [newValue, setNewValue] = useState(defaultValue);

  const handleChange = (e) => {
    setNewValue(e.target.value);
  };

  useEffect(() => {
    if (isNew) {
      setNewValue('');
    }
  }, [isNew]);

  useEffect(() => {
    onChange && onChange({ id, value: newValue });
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
      marginTop: '0.5vh',
      fontFamily,
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
      width: '100%'
    },
    input: {
      borderRadius: 4,
      height: '0.87em',
      // lineHeight: '1em',
      position: 'relative',
      backgroundColor: theme.palette.background.paper,
      fontSize: 16,
      marginTop: '0.5em',
      padding: '8px 26px 10px 12px',
      border: props.error ? `1px solid ${theme.palette.error.main}` : '1px solid #ced4da',
      transition: theme.transitions.create(['border-color', 'box-shadow']),
      fontFamily,
      '&:focus': {
        borderRadius: 4,
        borderColor: '#80bdff',
        boxShadow: '0 0 0 0.2rem rgba(0,123,255,.25)'
      }
    }
  }))(InputBase);

  const Select = withStyles(() => ({
    icon: {
      marginTop: '0.2em'
    }
  }))(MuiSelect);

  return (
    <div className={classes.root}>
      <InputLabel htmlFor={id} disabled={disabled}>
        {required && <font color="red">*</font>}
        {`${label}:`}
      </InputLabel>
      <div style={{ width: '1vw' }} />
      <div>
        <Select
          labelId="demo-customized-select-label"
          id="demo-customized-select"
          value={newValue || ''}
          disabled={disabled}
          // defaultValue={defaultValue ? (defaultValue.value ? defaultValue.value : defaultValue) : ''}
          onChange={handleChange}
          input={<BootstrapInput />}
        >
          <MenuItem value="">
            <em>None</em>
          </MenuItem>
          {itemList &&
            itemList.map((el, i) => (
              <MenuItem key={`${el[labelField]}__${i}`} value={el[valueField]}>
                {el[labelField]}
              </MenuItem>
            ))}
        </Select>
      </div>
      {error && helperText && <div className={classes.helper}>{helperText}</div>}
    </div>
  );
}
