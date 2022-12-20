import React, { useCallback, useState } from 'react';
import { InputLabel as Label, Tooltip, TextField } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import getCommonStyle from '../../CommonStyle';

export default function HAInput(props) {
  const {
    id,
    required,
    fieldName,
    fieldDisplayName,
    defaultValue,
    disabled,
    onBlur,
    style,
    abbrFieldName,
    asyncCheck,
    placeholder
  } = props;

  const [error, setError] = useState(false);
  const [helperText, setHelperText] = useState(false);

  const handleBlur = useCallback(
    async (e) => {
      const { value } = e.target;
      if (onBlur) onBlur(fieldName, value);
      if (asyncCheck) {
        const { error, message } = await asyncCheck(props);
        setError(error);
        setHelperText(message);
      }
      // eslint-disable-next-line
    },
    [onBlur]
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
        <div style={{ paddingTop: '0.5rem' }}>
          <TextField
            variant="outlined"
            // label={fieldName}
            fullWidth
            disabled={disabled}
            onBlur={handleBlur}
            defaultValue={defaultValue !== undefined && defaultValue !== null ? defaultValue : ''}
            placeholder={placeholder || ''}
            size="small"
          />
        </div>
        {/* <input
          id={fieldName}
          type="text"
          disabled={disabled}
          className={classes.input}
          onBlur={handleBlur}
          defaultValue={defaultValue !== undefined && defaultValue !== null ? defaultValue : ''}
          placeholder={placeholder ? placeholder : ''}
        /> */}
      </div>
      {error && helperText && <div className={classes.helperText}>{helperText}</div>}
    </div>
  );
}
