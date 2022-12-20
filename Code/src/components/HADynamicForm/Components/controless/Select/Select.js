import React, { useState } from 'react';
import { InputLabel as Label } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import getCommonStyle from '../../CommonStyle';

export default function Select(props) {
  const {
    // id,
    required,
    label,
    disabled,
    fieldName,
    checkField,
    onChange,
    itemList,
    labelField,
    valueField,
    defaultValue,
    style
  } = props;

  const handleChange = async (e) => {
    const { value } = e.target;
    if (onChange) await onChange(fieldName, value);
    const { error, message } = checkField(props);
    setError(error);
    setHelperText(message);
  };

  const [error, setError] = useState(false);
  const [helperText, setHelperText] = useState(false);

  const useStyles = makeStyles((theme) =>
    getCommonStyle(theme, style, error, helperText, disabled)
  );

  const classes = useStyles();

  return (
    <div className={classes.root} id={`element_${fieldName}`}>
      <Label className={classes.label}>
        {required && <font color="red">*</font>}
        {`${label}:`}
      </Label>
      <div style={{ width: '1vw' }} />
      <div>
        <select
          id={fieldName}
          disabled={disabled}
          onChange={handleChange}
          defaultValue={defaultValue || ''}
          className={classes.input}
        >
          {/* <option value="" /> */}
          {itemList &&
            itemList.map((el, i) => (
              <option key={`${el[labelField]}__${i}`} value={el[valueField]}>
                {el[labelField]}
              </option>
            ))}
        </select>
      </div>
      <div className={classes.helperText}>{error && helperText ? helperText : ''}</div>
    </div>
  );
}
