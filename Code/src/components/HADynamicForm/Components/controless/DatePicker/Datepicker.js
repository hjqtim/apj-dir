import React, { useCallback, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { InputLabel as Label, Tooltip } from '@material-ui/core';
import getCommonStyle from '../../CommonStyle';

function DatePicker(props) {
  const {
    id,
    required,
    fieldDisplayName,
    abbrFieldName,
    fieldName,
    defaultValue,
    disabled,
    onChange,
    checkField,
    style
  } = props;

  const [error, setError] = useState(false);
  const [helperText, setHelperText] = useState(false);

  const handleChange = useCallback(
    async (e) => {
      const { value } = e.target;
      if (onChange) onChange(fieldName, value);
      if (checkField) {
        const { error, message } = checkField(props);
        setError(error);
        setHelperText(message);
      }
      // eslint-disable-next-line
    },
    [onChange]
  );

  const useStyles = makeStyles((theme) =>
    getCommonStyle(theme, style, error, helperText, disabled)
  );

  const classes = useStyles();

  return (
    <div className={classes.root} id={`element_${fieldName}`}>
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
      <div>
        <input
          id={id}
          type="date"
          disabled={disabled}
          onChange={(e) => handleChange(e)}
          defaultValue={defaultValue || ''}
          className={classes.input}
        />
      </div>
    </div>
  );
}

export default DatePicker;
