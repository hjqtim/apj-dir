import { Button, Checkbox, TextField } from '@material-ui/core';
import InputAdornment from '@material-ui/core/InputAdornment';
import DateRangeOutlinedIcon from '@material-ui/icons/DateRangeOutlined';
import ArrowDropDownOutlinedIcon from '@material-ui/icons/ArrowDropDownOutlined';
import 'date-fns';
import React from 'react';

import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';

const Checkboxs = (props) => {
  const { fieldDisplayName, state } = props.card;
  const backgroundColor = state ? '#E5EAF0' : '#FFFFFF';
  const checkBoxList = [
    { name: 'simulated data' },
    { name: 'simulated data' },
    { name: 'simulated data' }
  ];
  return (
    <div
      style={{
        backgroundColor,
        padding: '0.5rem',
        paddingTop: '0'
      }}
    >
      <label htmlFor="" style={{ height: '2rem', lineHeight: '2rem' }}>
        {fieldDisplayName}:
      </label>
      <FormGroup row>
        {checkBoxList.map((item, index) => (
          <FormControlLabel
            key={index}
            control={<Checkbox checked={false} name="checkedA" />}
            label={item.name}
          />
        ))}
      </FormGroup>
    </div>
  );
};

const TextFields = (props) => {
  const { fieldDisplayName, state, fieldName } = props.card;
  const backgroundColor = state ? '#E5EAF0' : '#FFFFFF';
  return (
    <div
      style={{
        backgroundColor,
        padding: '0.5rem',
        paddingTop: '0'
      }}
    >
      <label htmlFor="" style={{ height: '2rem', lineHeight: '2rem' }}>
        {fieldDisplayName}:
      </label>
      <TextField variant="outlined" label={fieldName} disabled fullWidth size="small" />
    </div>
  );
};

const Datepickers = (props) => {
  const { state, fieldDisplayName } = props.card;
  const backgroundColor = state ? '#E5EAF0' : '#FFFFFF';
  return (
    <div
      style={{
        backgroundColor,
        padding: '0.5rem',
        paddingTop: '0'
      }}
    >
      <label htmlFor="" style={{ height: '2rem', lineHeight: '2rem' }}>
        {fieldDisplayName}:
      </label>
      <TextField
        id="date"
        variant="outlined"
        disabled
        type="date"
        fullWidth
        defaultValue="年/月/日"
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <DateRangeOutlinedIcon />
            </InputAdornment>
          )
        }}
        size="small"
      />
    </div>
  );
};

const List = (props) => {
  const { fieldDisplayName, state, fieldName } = props.card;
  const backgroundColor = state ? '#E5EAF0' : '#FFFFFF';
  return (
    <div
      style={{
        backgroundColor,
        padding: '0.5rem',
        paddingTop: '0'
      }}
    >
      <label htmlFor="" style={{ lineHeight: '2rem' }}>
        {fieldDisplayName}:
      </label>
      <div style={{ display: 'flex', flexDirection: 'row' }}>
        <TextField variant="outlined" label={fieldName} disabled size="small" fullWidth />
        <Button variant="contained" color="primary">
          check
        </Button>
      </div>
      <div
        style={{
          width: '100%',
          height: '3rem',
          border: '1px solid rgb(204, 204, 204)',
          marginTop: '0.5rem'
        }}
      />
    </div>
  );
};

const Selects = (props) => {
  const { fieldDisplayName, state, fieldName } = props.card;
  const backgroundColor = state ? '#E5EAF0' : '#FFFFFF';
  return (
    <div
      style={{
        backgroundColor,
        padding: '0.5rem',
        paddingTop: '0'
      }}
    >
      <label htmlFor="" style={{ height: '2rem', lineHeight: '2rem' }}>
        {fieldDisplayName}:
      </label>
      <TextField
        variant="outlined"
        label={fieldName}
        disabled
        fullWidth
        size="small"
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <ArrowDropDownOutlinedIcon />
            </InputAdornment>
          )
        }}
      />
    </div>
  );
};

const InputCheck = (props) => {
  const { fieldDisplayName, state, fieldName } = props.card;
  const backgroundColor = state ? '#E5EAF0' : '#FFFFFF';
  return (
    <div
      style={{
        backgroundColor,
        padding: '0.5rem',
        paddingTop: '0'
      }}
    >
      <label htmlFor="" style={{ lineHeight: '2rem' }}>
        {fieldDisplayName}:
      </label>
      <div style={{ display: 'flex', flexDirection: 'row' }}>
        <TextField variant="outlined" label={fieldName} disabled size="small" fullWidth />
        <Button variant="contained" color="primary">
          check
        </Button>
      </div>
    </div>
  );
};

const Procedure = (props) => {
  const { fieldDisplayName, state, fieldName } = props.card;
  const backgroundColor = state ? '#E5EAF0' : '#FFFFFF';
  return (
    <div
      style={{
        backgroundColor,
        padding: '0.5rem',
        paddingTop: '0'
      }}
    >
      <label htmlFor="" style={{ height: '2rem', lineHeight: '2rem' }}>
        {fieldDisplayName}:
      </label>
      <TextField
        variant="outlined"
        label={fieldName}
        disabled
        fullWidth
        size="small"
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <ArrowDropDownOutlinedIcon />
            </InputAdornment>
          )
        }}
      />
    </div>
  );
};

export { Checkboxs, TextFields, Datepickers, List, Selects, InputCheck, Procedure };
