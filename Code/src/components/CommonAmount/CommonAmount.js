// 该组件用于数量输入框，数量 >= 0
// 该组件用于数量输入框，数量 >= 0
// 该组件用于数量输入框，数量 >= 0

import React, { memo } from 'react';
import { TextField } from '@material-ui/core';

const CommonAmount = (props) => {
  const { onChange = () => {}, ...others } = props;
  return (
    <TextField
      type="number"
      fullWidth
      variant="outlined"
      size="small"
      onChange={(e) => {
        const { value } = e.target;
        const newValue = String(value).replace(/[^\d]/g, '');
        onChange(newValue);
      }}
      {...others}
    />
  );
};

export default memo(CommonAmount);
