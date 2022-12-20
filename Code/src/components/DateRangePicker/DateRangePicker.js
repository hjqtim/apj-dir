import React, { useEffect, useState } from 'react';
import { DatePicker } from '@material-ui/pickers';
import withStyles from '@material-ui/core/styles/withStyles';
import { InputLabel as Label } from '@material-ui/core';

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

const InputLabel = withStyles((theme) => ({
  root: {
    fontSize: '1.1rem',
    color: 'rgba(0,0,0,.85)',
    '-webkit-user-select': 'none',
    '-moz-user-select': 'none',
    fontFamily,
    focused: {
      color: theme.palette.primary.main
    }
  }
}))(Label);

export default function DateRangePicker(props) {
  const { onChange, label, disableFuture, startMaxDate, endMinDate } = props;
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  useEffect(() => {
    onChange && onChange(startDate, endDate);
    // eslint-disable-next-line
  }, [startDate, endDate]);
  const onStartDateChange = (e) => {
    setStartDate(e);
  };
  const onEndDateChange = (e) => {
    setEndDate(e);
  };
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end' }}>
      <InputLabel style={{ textAlign: 'right' }}>{label || ''}</InputLabel>
      <div style={{ marginLeft: '2rem', display: 'flex', alignItems: 'flex-end' }}>
        <DatePicker
          placeholder="From"
          clearable
          maxDate={startMaxDate || undefined}
          disableFuture={disableFuture || false}
          format="dd-MMM-yyyy"
          value={startDate}
          style={{ width: '70%' }}
          onChange={(e) => onStartDateChange(e)}
        />
        <DatePicker
          placeholder="Until"
          clearable
          minDate={endMinDate || undefined}
          disableFuture={disableFuture || false}
          format="dd-MMM-yyyy"
          value={endDate}
          onChange={(e) => onEndDateChange(e)}
          style={{ marginLeft: '2em' }}
        />
      </div>
    </div>
  );
}
