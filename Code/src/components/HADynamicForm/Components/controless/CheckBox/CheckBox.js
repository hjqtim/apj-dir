import React, { useCallback, useEffect, useState } from 'react';
import { InputLabel as Label } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import getCommonStyle from '../../CommonStyle';
import { cloneSet1 } from '../../../../../utils/clone';

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

export default function HACheckBox(props) {
  const {
    id,
    required,
    label,
    disabled,
    helperText,
    onChange,
    itemList,
    style,
    checkField,
    fieldName,
    getCheckBoxStatus,
    defaultValue,
    getCurrentValue
  } = props;

  const [error, setError] = useState(false);
  const [message, setMessage] = useState(false);
  const [checkedList, setCheckedList] = useState(new Set());

  useEffect(() => {
    const initData = new Set();
    defaultValue &&
      defaultValue.forEach((data) => {
        const [target] = itemList.filter((e) => e.type === data);
        if (target && target.id) {
          initData.add(target.id);
        }
      });
    setCheckedList(initData);
    // eslint-disable-next-line
  }, [defaultValue]);

  const useStyles = makeStyles((theme) =>
    getCommonStyle(theme, style, error, helperText, disabled)
  );

  const handleChange = useCallback(
    (e, el) => {
      const currentValue = (getCurrentValue && getCurrentValue(fieldName)) || new Set();
      // const newList = new Set([ ...cloneSet1(checkedList), ...currentValue ])
      const newList = cloneSet1(currentValue);
      newList.has(el.id) ? newList.delete(el.id) : newList.add(el.id);
      if (getCheckBoxStatus) {
        const model = {
          type: el.type,
          status: newList.has(el.id) ? 1 : -1
        };
        const res = getCheckBoxStatus(model);
        res &&
          res.forEach((status, type) => {
            const [target] = itemList.filter((e) => e.type === type);
            if (status === -1) {
              newList.delete(target.id);
            }
            if (status === 1) {
              newList.add(target.id);
            }
          });
      }
      setCheckedList(new Set());
      setCheckedList(newList);
      onChange && onChange(fieldName, newList);
      if (checkField) {
        const { error, message } = checkField(props);
        setError(error);
        setMessage(message);
      }
      // eslint-disable-next-line
    },
    [checkedList, onChange]
  );

  const classes = useStyles();

  return (
    <div
      style={{
        minWidth: '700px',
        maxWidth: '950px',
        boxSizing: 'border-box',
        minHeight: '5.5em',
        marginBottom: '2.5em',
        ...(style ? style.root : {})
      }}
      id={`element_${fieldName}`}
    >
      <Label
        className={classes.label}
        htmlFor={id}
        id={`${id}label`}
        style={{
          color: error ? '#f44336' : '#333'
        }}
      >
        {required && <font color="red">*</font>}
        {`${label}:`}
      </Label>
      <div style={{ width: '1vw' }} />
      <div
        style={{
          display: 'flex',
          justifyContent: 'flex-start',
          flexWrap: 'wrap',
          marginTop: '1em',
          marginLeft: '1em'
        }}
      >
        {itemList &&
          itemList.map((el, i) => (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                marginRight: '1em',
                marginBottom: '1em'
              }}
              key={`${el.labelField}_${i}`}
            >
              <input
                type="checkbox"
                id={`checkbox_${fieldName}_${el.type}`}
                disabled={disabled || el.disabled}
                checked={checkedList.has(el.id)}
                onChange={(e) => handleChange(e, el, i)}
              />
              <label
                htmlFor={`checkbox_${fieldName}_${el.type}`}
                style={{
                  fontSize: '1.1em'
                }}
              >
                {el.type}
              </label>
            </div>
          ))}
      </div>
      {error && message && (
        <div
          className={classes.helper}
          style={{
            color: '#f44336',
            height: '1vh',
            lineHeight: '1vh',
            fontSize: '1em',
            fontFamily,
            marginTop: '0.5em',
            marginLeft: '1em'
          }}
        >
          {message}
        </div>
      )}
    </div>
  );
}
