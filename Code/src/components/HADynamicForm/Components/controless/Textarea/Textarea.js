import React, { useCallback, useState } from 'react';
import { InputLabel as Label } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import getCommonStyle from '../../CommonStyle';
import fontFamily from '../../../../../utils/fontFamily';

export default function Textarea(props) {
  const { onBlur, disabled, placeholder, id, label, required, rows, cols, maxLength } = props;

  const [error, setError] = useState(false);
  const [helperText, setHelperText] = useState(false);
  const handleBlur = useCallback(
    async (e) => {
      const { value } = e.target;
      const result = onBlur && onBlur(value);
      if (result) {
        const { error, message } = result;
        setError(error);
        setHelperText(message);
      }
    },
    [onBlur]
  );

  const useStyles = makeStyles((theme) => getCommonStyle(theme, {}, error, helperText, disabled));
  const classes = useStyles();

  return (
    <div className={classes.root} id={`element_${id}`}>
      {label && (
        <Label className={classes.label} htmlFor={id} id={`${id}label`}>
          {required && <font color="red">*</font>}
          {`${label}:`}
        </Label>
      )}
      <div style={{ width: '1vw' }} />
      <div>
        <textarea
          id={id}
          disabled={disabled}
          className={classes.textarea}
          onBlur={handleBlur}
          placeholder={placeholder}
          rows={rows}
          cols={cols}
          maxLength={maxLength}
        />
      </div>
      {error && helperText && (
        <div
          style={{
            color: '#f44336',
            height: '1vh',
            lineHeight: '1vh',
            fontSize: '1em',
            fontFamily,
            marginTop: '0.5em'
          }}
        >
          {helperText}
        </div>
      )}
    </div>
  );
}
