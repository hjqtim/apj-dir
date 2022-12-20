import React, { useEffect, useState } from 'react';
import { InputLabel as Label, TextField } from '@material-ui/core';
import withStyles from '@material-ui/core/styles/withStyles';
import DateRangePicker from '../../../../DateRangePicker';
import api from '../../../../../api/vm';
import formatDate from '../../../../../utils/formatDate';

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

export default function VM(props) {
  const { onChange } = props;
  const [condition, setCondition] = useState({});
  const [createdAt, setCreatedAt] = useState([null, null]);
  const [updatedAt, setUpdatedAt] = useState([null, null]);
  const [serialNumber, setSerialNumber] = useState('');

  const onCreatedAtChange = (startDate, endDate) => {
    setCreatedAt([formatDate(startDate), formatDate(endDate)]);
  };
  const onUpdatedAtChange = (startDate, endDate) => {
    setUpdatedAt([formatDate(startDate), formatDate(endDate)]);
  };
  const onSerialNumberChange = (e) => {
    setSerialNumber(e.target.value);
  };

  useEffect(() => {
    setCondition({
      serialNumber,
      createdAt,
      updatedAt
    });
  }, [serialNumber, createdAt, updatedAt]);

  useEffect(() => {
    onChange && onChange(() => api.download, condition, 'VM.xlsx');
    // eslint-disable-next-line
  }, [condition]);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-around',
        height: '100%'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-end' }}>
        <InputLabel style={{ textAlign: 'right' }}>Serial Number</InputLabel>
        <TextField
          // label = {'Serial Number'}
          type="text"
          onChange={onSerialNumberChange}
          value={serialNumber}
          style={{ marginLeft: '2em' }}
        />
      </div>
      <DateRangePicker
        startMaxDate={createdAt[1]}
        endMinDate={createdAt[0]}
        onChange={onCreatedAtChange}
        label="Created At"
        disableFuture
      />
      <DateRangePicker
        startMaxDate={updatedAt[1]}
        endMinDate={updatedAt[0]}
        onChange={onUpdatedAtChange}
        label="Updated At"
        disableFuture
      />
    </div>
  );
}
