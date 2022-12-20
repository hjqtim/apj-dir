import React, { memo } from 'react';
import { TextField } from '@material-ui/core';
import { textFieldProps } from '../../utils/tools';

const MyTextField = (props) => {
  const { ...others } = props;
  return <TextField {...others} {...textFieldProps} />;
};

export default memo(MyTextField);
