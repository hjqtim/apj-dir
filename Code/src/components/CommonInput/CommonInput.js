import React, { memo } from 'react';
import { TextField, InputLabel, Tooltip } from '@material-ui/core';
import { fade, makeStyles } from '@material-ui/core/styles';

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

const HAInput = (props) => {
  const { require = false, ...other } = props;
  const { width, labels, fullWidth = false, disabled = false, value } = other;

  const getWidth = (power) => {
    power = power || 1;
    const basicWidth = 15;
    const labelWidth = labels && labels.length ? labels.length / 1.2 : 6 / 1.7;
    const inputWidth = basicWidth * power;
    return {
      input: inputWidth,
      labels: labelWidth,
      container: Math.max(inputWidth, labelWidth) + 0.5
    };
  };

  const useStyles = makeStyles((theme) => ({
    root: {
      margin: theme.spacing(2, 0),
      width: fullWidth ? '100%' : `${getWidth(width).container}vw`
    },
    helper: {
      color: '#f44336',
      height: '1vh',
      lineHeight: '1vh',
      fontSize: '1rem',
      fontFamily,
      marginLeft: `${getWidth(width).labelWidth}vw`
    },
    labels: {
      color: disabled ? '#909090' : 'rgba(0,0,0,.85)',
      fontSize: '1.2em',
      margin: theme.spacing(4, 0)
    },
    starts: {
      color: disabled ? '#909090' : 'red'
    },
    input: {
      '& input': {
        fontFamily,
        '&:focus': {
          borderRadius: 4,
          borderColor: '#80bdff',
          outline: 'none',
          transition: theme.transitions.create(['border-color', 'box-shadow']),
          boxShadow: `${fade(theme.palette.primary.main, 0.25)} 0 0 0 0.2rem`
        }
      },
      '& .MuiInputBase-input:focus': {
        borderColor: '#80bdff',
        borderWidth: '2px'
      },
      // '& .MuiInputBase-input:hover':{
      //   border:'red'
      // },
      '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
        borderColor: '#80bdff',
        borderWidth: '2px'
      }
    }
  }));

  const classes = useStyles();

  return (
    <div className={classes.root}>
      {labels && (
        <InputLabel className={classes.labels}>
          {require && (
            <span className={classes.starts} color={disabled ? '#9F9F9F' : 'red'}>
              *
            </span>
          )}
          {labels}:
        </InputLabel>
      )}
      {disabled ? (
        <Tooltip title={value || ''}>
          <TextField {...other} size="small" variant="outlined" className={classes.input} />
        </Tooltip>
      ) : (
        <TextField {...other} size="small" variant="outlined" className={classes.input} />
      )}
    </div>
  );
};

export default memo(HAInput);
