import React, { useEffect, useState } from 'react';
import { InputLabel as Label, InputBase, Button } from '@material-ui/core';
import { fade, withStyles, makeStyles } from '@material-ui/core/styles';
import EmailCheck from '../EmailCheck/EmailCheck';
import CommonTip from '../CommonTip';

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
    apiKey,
    apiValue,
    title
  } = props;

  // eslint-disable-next-line no-unused-vars
  const [inputvalue, setInputValue] = useState('');
  const [open, setOpen] = useState(false);
  const [emails, setEmails] = useState([]);
  useEffect(() => {
    const value = defaultValue
      ? defaultValue.value
        ? defaultValue.value
        : typeof defaultValue === 'string'
        ? defaultValue
        : ''
      : '';
    setInputValue(value);
    value && onBlur && onBlur({ id, label: value, value });
  }, [defaultValue, onBlur, id]);

  const handleBlur = (e) => {
    const { value } = e.target;
    onBlur && onBlur({ id, label: value, value });
    setInputValue(value);
  };

  const onCheckClose = () => {
    setOpen(false);
  };

  const handleEmailCheck = (email) => {
    setInputValue(email);
    onBlur && onBlur({ id, label: email, value: email });
  };

  const HandleCheck = () => {
    if (inputvalue) {
      apiKey &&
        apiKey({ email: inputvalue, id, ...apiValue }).then(({ data }) => {
          const result = data.data;
          setEmails(result);
          setOpen(true);
        });
    } else {
      CommonTip.error('value can not be found');
    }
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
          defaultValue={inputvalue}
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
      {error && helperText && <div className={classes.helper}>{helperText}</div>}

      <EmailCheck
        open={open}
        onClose={onCheckClose}
        emails={emails}
        title={title}
        handleEmail={handleEmailCheck}
      />
    </div>
  );
}
