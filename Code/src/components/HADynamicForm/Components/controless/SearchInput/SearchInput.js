import React, { useCallback, useState, useRef, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Button, InputLabel as Label } from '@material-ui/core';
import getCommonStyle from '../../CommonStyle';
import CommonTip from '../../../../CommonTip';
import Loading from '../../../../Loading';
import SearchDialog from './SearchDialog';
import accountAPI from '../../../../../api/accountManagement';

function SearchInput(props) {
  const {
    id,
    required,
    label,
    fieldName,
    defaultValue,
    disabled,
    onBlur,
    asyncCheck,
    style,
    apiKey,
    apiValue,
    checkMail,
    buttonText,
    getDisplayName
  } = props;

  const inputEl = useRef(null);

  const [error, setError] = useState(false);
  const [helperText, setHelperText] = useState(false);
  const [open, setOpen] = useState(false);
  const [dataList, setDataList] = useState([]);
  const [defaultDisplayValue, setDefaultDisplayValue] = useState('');

  const handleBlur = useCallback(
    async (e) => {
      const { value } = e.target;
      onBlur && onBlur(fieldName, value);
      const { error, message } = await asyncCheck(props);
      setError(error);
      setHelperText(message);
      // eslint-disable-next-line
    },
    [onBlur]
  );

  useEffect(() => {
    onBlur && onBlur(fieldName, defaultValue);
    const data = {
      valueList: [defaultValue],
      ...apiValue
    };
    getDisplayName &&
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

  const onDialogClose = useCallback(() => {
    setOpen(false);
  }, []);

  const onDialogSelect = useCallback((data) => {
    const { corp, display } = data;
    if (inputEl && inputEl.current) {
      inputEl.current.value = `${display}`;
    }
    handleBlur({ target: { value: `${corp}` } });
    // eslint-disable-next-line
  }, []);

  const useStyles = makeStyles((theme) =>
    getCommonStyle(theme, style, error, helperText, disabled)
  );

  const classes = useStyles();

  const handleCheck = () => {
    const inputValue = inputEl && inputEl.current ? inputEl.current.value : '';
    if (!inputValue || inputValue.trim() === '') {
      CommonTip.warning('Please input the keyword first');
      return;
    }
    if (!apiKey) return;
    if (inputValue) {
      Loading.show();
      apiKey &&
        apiKey({ email: inputValue, ...apiValue })
          .then(({ data }) => {
            let result = data.data;
            console.log(result, checkMail);
            if (result && result.length > 0 && checkMail) {
              result = result.filter((_) => !!_.mail);
            }
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

  return (
    <>
      <div className={classes.root} id={`element_${fieldName}`}>
        <Label className={classes.label} htmlFor={id} id={`${id}label`}>
          {required && <font color="red">*</font>}
          {`${label}:`}
        </Label>
        <div style={{ width: '1vw' }} />
        <div style={{ display: 'flex', alignItems: 'flex-end' }}>
          <input
            ref={inputEl}
            id={fieldName}
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
        {error && helperText && <div className={classes.helperText}>{helperText}</div>}
      </div>
      <SearchDialog
        open={open}
        onClose={onDialogClose}
        title={fieldName}
        dataList={dataList}
        onSelect={onDialogSelect}
      />
    </>
  );
}

export default SearchInput;
