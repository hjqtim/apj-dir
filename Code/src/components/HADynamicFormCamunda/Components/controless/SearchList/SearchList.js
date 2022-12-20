import React, { useCallback, useState, useRef, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Button, IconButton, InputLabel as Label, Tooltip } from '@material-ui/core';
import HighlightOffTwoToneIcon from '@material-ui/icons/HighlightOffTwoTone';
import getCommonStyle from '../../CommonStyle';
import CommonTip from '../../../../CommonTip';
import Loading from '../../../../Loading';
import SearchDialog from './SearchDialog';
import accountAPI from '../../../../../api/accountManagement';

function SearchInput(props) {
  const {
    id,
    required,
    fieldDisplayName,
    abbrFieldName,
    fieldName,
    defaultValue,
    disabled,
    onChange,
    asyncCheck,
    style,
    apiKey,
    apiValue,
    buttonText,
    getDisplayName
  } = props;

  const inputEl = useRef(null);

  const [error, setError] = useState(false);
  const [helperText, setHelperText] = useState(false);
  const [open, setOpen] = useState(false);
  const [dataList, setDataList] = useState([]);
  const [displayList, setDisplayList] = useState([]);
  const [selectedList, setSelectedList] = useState([]);

  useEffect(() => {
    onChange && onChange(fieldName, selectedList);
    async function asyncCheckField() {
      const { error, message } = await asyncCheck(props);
      setError(error);
      setHelperText(message);
    }
    asyncCheckField();
    // eslint-disable-next-line
  }, [selectedList]);

  useEffect(() => {
    defaultValue && setSelectedList(defaultValue);
    const body = {
      valueList: defaultValue,
      ...apiValue
    };
    getDisplayName &&
      accountAPI
        .getDisplayName(body)
        .then(({ data }) => {
          const displayValueList = data.data;
          const displayList = [];
          defaultValue &&
            defaultValue.forEach((value) => {
              const [displayValue] = displayValueList.filter(
                (displayValue) => value === displayValue.corp
              );
              displayValue &&
                displayValue.display !== undefined &&
                displayValue.display !== null &&
                displayList.push(displayValue.display);
            });
          setDisplayList(displayList);
        })
        .catch((e) => console.log(e));
    // eslint-disable-next-line
  }, [defaultValue]);

  const onDialogClose = useCallback(() => {
    setOpen(false);
  }, []);

  const onDialogSelect = useCallback(
    (data) => {
      const { corp, display } = data;
      if (selectedList.indexOf(corp) !== -1) return;
      const newSelectedList = [...selectedList, `${corp}`];
      const newDisplayList = [...displayList, `${display}`];
      setSelectedList(newSelectedList);
      setDisplayList(newDisplayList);
    },
    [selectedList, displayList]
  );

  const useStyles = makeStyles((theme) => ({
    ...getCommonStyle(theme, style, error, helperText, disabled),
    row: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      height: '25%',
      padding: '0 0.5em 0 1em',
      '&:hover': {
        backgroundColor: '#E9EDFE'
      }
    }
  }));

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
        apiKey({ email: inputValue, id, ...apiValue })
          .then(({ data }) => {
            const result = data.data;
            if (!result || !result.length) {
              CommonTip.error('Value can not be found');
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

  const handleRemove = (i) => {
    const newSelectList = [...selectedList];
    newSelectList.splice(i, 1);
    const newDisplayList = [...displayList];
    newDisplayList.splice(i, 1);
    setSelectedList(newSelectList);
    setDisplayList(newDisplayList);
  };

  return (
    <>
      <div
        className={classes.root}
        style={{
          height: '13em'
        }}
        id={`element_${fieldName}`}
      >
        {fieldDisplayName && fieldDisplayName.length > 40 ? (
          <Tooltip title={fieldDisplayName}>
            <Label className={classes.label} htmlFor={id} id={`${id}label`}>
              {required && <font color="red">*</font>}
              {`${abbrFieldName}:`}
            </Label>
          </Tooltip>
        ) : (
          <Label className={classes.label} htmlFor={id} id={`${id}label`}>
            {required && <font color="red">*</font>}
            {`${abbrFieldName}:`}
          </Label>
        )}
        <div style={{ width: '1vw' }} />
        <div style={{ display: 'flex', alignItems: 'flex-end' }}>
          <input
            ref={inputEl}
            id={fieldName}
            type="text"
            disabled={disabled}
            className={classes.input}
          />
          <Button disabled={disabled} className={classes.inputCheck} onClick={handleCheck}>
            {buttonText || 'Check'}
          </Button>
        </div>
        <div
          id={`${fieldName}_dataList`}
          style={{
            border: '1px solid #ccc',
            height: '7em',
            marginTop: '0.5em',
            overflowY: 'auto'
          }}
        >
          {displayList &&
            displayList.map((el, i) => (
              <div key={`${el}_${i}`} className={classes.row}>
                <div
                  style={{
                    userSelect: 'none',
                    MozUserSelect: 'none'
                  }}
                >
                  {el}
                </div>
                {!disabled && (
                  <Tooltip title="Remove">
                    <IconButton
                      aria-label="edit"
                      onClick={() => {
                        handleRemove(i);
                      }}
                      disabled={disabled}
                    >
                      <HighlightOffTwoToneIcon fontSize="small" style={{ color: '#2553F4' }} />
                    </IconButton>
                  </Tooltip>
                )}
              </div>
            ))}
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
