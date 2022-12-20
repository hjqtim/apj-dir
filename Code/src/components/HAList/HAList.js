import React, { useEffect, useState } from 'react';
import { InputLabel as Label, InputBase, Button } from '@material-ui/core';
import { fade, withStyles, makeStyles } from '@material-ui/core/styles';
import Select from '@material-ui/core/Select';
import { L } from '../../utils/lang';

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
    multiline,
    onBlur,
    placeholder,
    readOnly,
    showRequest,
    rows,
    rowsMax,
    rowsMin,
    onCheck
  } = props;

  // eslint-disable-next-line no-unused-vars
  const [detailList, setDetailList] = useState([]);
  const [inputvalue, setInputValue] = useState('');
  const [multipleValue, setMultipleValue] = useState([]);

  useEffect(() => {
    const value = defaultValue
      ? defaultValue.value
        ? defaultValue.value
        : typeof defaultValue === 'string'
        ? defaultValue
        : ''
      : '';
    value && onBlur && onBlur({ id, label: value, value });
    setDetailList(value.split('!@#'));
  }, [defaultValue, onBlur, id]);

  const handleBlur = (e) => {
    const { value } = e.target;
    setInputValue(value);
  };

  const handleChangeMultiple = (event) => {
    const { options } = event.target;
    const value = [];
    for (let i = 0, l = options.length; i < l; i += 1) {
      if (options[i].selected) {
        value.push(options[i].value);
      }
    }
    setMultipleValue(value);
  };

  const HandleCheck = () => {
    // onCheck && onCheck(id)
    if (detailList.indexOf(inputvalue) === -1) {
      if (onCheck && onCheck(id, inputvalue)) {
        const data = JSON.parse(JSON.stringify(detailList));
        data.push(inputvalue);
        setDetailList(data);
        onBlur && onBlur({ id, label: data.join('!@#'), value: data.join('!@#') });
      }
    }
  };

  const HandleDelete = () => {
    const data = [];
    // eslint-disable-next-line no-restricted-syntax
    for (const detail of detailList) {
      if (multipleValue.indexOf(detail) === -1) {
        data.push(detail);
      }
    }
    setDetailList(data);
  };

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
      marginRight: '5vw',
      maxWidth: 752
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
    checkButton: {
      marginTop: '-1ch'
    },
    deleteButton: {
      float: 'left',
      marginTop: '3ch'
    },
    select: {
      width: `${getWidth(width).container}vw`,
      float: 'left'
    }
  }));

  const classes = useStyles();

  const InputLabel = withStyles((theme) => ({
    root: {
      fontSize: '1.1rem',
      display: showRequest === false ? 'none' : 'block',
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
      display: showRequest === false ? 'none' : 'block',
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
      <InputLabel htmlFor={id} id={`${id}label`} disabled={disabled}>
        {required && <font color="red">*</font>}
        {`${label}:`}
      </InputLabel>
      <div style={{ width: '1vw' }} />
      <div>
        <BootstrapInput
          id={id}
          disabled={disabled}
          defaultValue={
            defaultValue
              ? defaultValue.value !== undefined
                ? defaultValue.value
                : defaultValue
              : ''
          }
          autoComplete={autoComplete}
          autoFocus={autoFocus}
          startAdornment={startAdornment}
          endAdornment={endAdornment}
          fullWidth={fullWidth}
          multiline={multiline}
          onBlur={handleBlur}
          error={defaultValue ? (defaultValue.error ? defaultValue.error : false) : false}
          placeholder={placeholder}
          readOnly={readOnly}
          rows={rows}
          rowsMax={rowsMax}
          rowsMin={rowsMin}
        />
        <Button
          className={classes.checkButton}
          variant="contained"
          onClick={HandleCheck}
          color="primary"
        >
          Check
        </Button>
      </div>
      <div>
        <Select
          className={classes.select}
          multiple
          native
          inputProps={{
            id: 'select-multiple-native'
          }}
          // value={personName}
          onChange={handleChangeMultiple}
        >
          {detailList.map((name) => (
            <option key={name} value={name}>
              {name}
            </option>
          ))}
        </Select>
        <Button
          className={classes.deleteButton}
          variant="contained"
          onClick={HandleDelete}
          color="primary"
        >
          {L('Delete')}
        </Button>
      </div>
      {error && helperText && <div className={classes.helper}>{helperText}</div>}
    </div>
  );
}
