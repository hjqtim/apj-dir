// 该组件为金钱输入框
// 该组件为金钱输入框
// 该组件为金钱输入框
import React from 'react';
import NumberFormat from 'react-number-format';
import { TextField, makeStyles, InputAdornment } from '@material-ui/core';

const useStyles = makeStyles(() => ({
  textRight: {
    '& input': {
      textAlign: 'right'
    }
  }
}));

const CustomInput = (inputProps) => {
  const classes = useStyles();

  return (
    <TextField
      variant="outlined"
      fullWidth
      size="small"
      className={classes.textRight}
      InputProps={{
        startAdornment: <InputAdornment position="start">$</InputAdornment>
      }}
      {...inputProps}
    />
  );
};

const CommonNumberFormat = (props) => (
  <>
    <NumberFormat
      {...props}
      isNumericString
      allowNegative={false}
      customInput={CustomInput}
      decimalScale={2}
      thousandSeparator
    />
  </>
);

export default CommonNumberFormat;
