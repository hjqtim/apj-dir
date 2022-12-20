import React from 'react';
import { TextField, IconButton, makeStyles } from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import ClearIcon from '@material-ui/icons/Clear';

const useStyles = makeStyles(() => ({
  remark: {
    '& .MuiOutlinedInput-multiline.MuiOutlinedInput-marginDense': {
      paddingTop: 10.5,
      paddingBottom: 35.5
    }
  }
}));

const WebdpTextField = ({ value, onChange, onBlur, actions, moneyIcon, error, ...rest }) => {
  const classes = useStyles();
  const PROPS = {
    className: classes.remark,
    variant: 'outlined',
    fullWidth: true,
    size: 'small',
    onChange,
    onBlur,
    value,
    error,
    InputProps: actions && {
      endAdornment: (
        <>
          {actions.search && (
            <IconButton onClick={actions.search} size="small">
              <SearchIcon fontSize="small" />
            </IconButton>
          )}
          {value?.trim().length > 0 && actions.clear && (
            <IconButton onClick={actions.clear} size="small">
              <ClearIcon fontSize="small" />
            </IconButton>
          )}
        </>
      )
    },
    ...rest
  };
  return <TextField {...PROPS} />;
};

export default React.memo(WebdpTextField);
