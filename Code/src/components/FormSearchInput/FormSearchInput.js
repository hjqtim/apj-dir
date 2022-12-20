import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Button, InputLabel as Label } from '@material-ui/core';
import { fade, withStyles, makeStyles } from '@material-ui/core/styles';
import accountAPI from '../../api/accountManagement';
import CommonTip from '../CommonTip';
import Loading from '../Loading';
import SearchDialog from '../HADynamicForm/Components/controless/SearchInput/SearchDialog';

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

export default function FormInput(props) {
  const {
    id,
    width,
    required,
    error,
    label,
    defaultValue,
    disabled,
    helperText,
    onBlur,
    showRequest,
    apiValue,
    buttonText
  } = props;

  const inputEl = useRef(null);

  const [newValue, setNewValue] = useState(defaultValue);
  const [defaultDisplayValue, setDefaultDisplayValue] = useState('');
  const [dataList, setDataList] = useState([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    onBlur && onBlur({ id, value: newValue });
    // eslint-disable-next-line
  }, [newValue]);

  useEffect(() => {
    if (!defaultValue) return;
    onBlur && onBlur({ id, value: newValue });
    const data = {
      valueList: [defaultValue],
      isCorp: true,
      ...apiValue
    };
    accountAPI
      .getDisplayName(data)
      .then(({ data }) => {
        const displayValueList = data.data;
        const displayValue = displayValueList ? displayValueList[0] : null;
        setDefaultDisplayValue(displayValue ? displayValue.display : '');
      })
      .catch((e) => console.log(e));
    // eslint-disable-next-line
  }, [defaultValue]);

  const handleBlur = (e) => {
    setNewValue(e.target.value);
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

  const handleCheck = () => {
    const inputValue = inputEl && inputEl.current ? inputEl.current.value : '';
    if (!inputValue || inputValue.trim() === '') {
      CommonTip.warning('Please input the keyword first');
      return;
    }
    const apiKey = accountAPI.findUsers;
    if (!apiKey) return;
    if (inputValue) {
      Loading.show();
      apiKey &&
        apiKey({ email: inputValue, isCorp: true, ...apiValue })
          .then(({ data }) => {
            const result = data.data;
            if (!result || !result.length) {
              CommonTip.error('value can not be found');
            } else {
              setDataList(result);
              setOpen(true);
            }
          })
          .finally(() => {
            Loading.hide();
          })
          .catch((e) => {
            console.log(e);
            Loading.hide();
          });
    }
  };

  const onDialogSelect = useCallback((data) => {
    const { corp, display } = data;
    if (inputEl && inputEl.current) {
      inputEl.current.value = `${display}`;
    }
    handleBlur({ target: { value: `${corp}` } });
    // eslint-disable-next-line
  }, []);

  const onDialogClose = useCallback(() => {
    setOpen(false);
  }, []);

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
    },
    inputCheck: {
      padding: '0',
      width: '2em',
      height: '33px',
      color: '#fff',
      backgroundColor: '#2553F4',
      '&:hover': {
        backgroundColor: '#2196f3'
      }
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

  return (
    <div className={classes.root}>
      <InputLabel htmlFor={id} id={`${id}label`} disabled={disabled}>
        {required && <font color="red">*</font>}
        {`${label}:`}
      </InputLabel>
      <div style={{ width: '1vw' }} />
      <div style={{ display: 'flex', alignItems: 'flex-end' }}>
        <input
          id={id}
          ref={inputEl}
          type="text"
          disabled={disabled}
          className={classes.input}
          onBlur={handleBlur}
          defaultValue={defaultDisplayValue || ''}
        />
        <Button disabled={disabled} className={classes.inputCheck} onClick={handleCheck}>
          {buttonText || 'Check'}
        </Button>
      </div>
      {error && helperText && <div className={classes.helper}>{helperText}</div>}
      <SearchDialog
        open={open}
        onClose={onDialogClose}
        title={id}
        dataList={dataList}
        onSelect={onDialogSelect}
      />
    </div>
  );
}
