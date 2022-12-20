import { TextField, Select, MenuItem, FormControl, FormHelperText } from '@material-ui/core';
import React, { useState } from 'react';

const SelectForm = (props) => {
  const {
    fieldDisplayName,
    fieldName,
    fieldType,
    remark,
    showOnRequest,
    required,
    readable,
    writable,
    foreignDisplayKey,
    foreignKey,
    foreignTable
  } = props.PropertyData;
  const [deftFieldType, setAge] = useState(fieldType);
  const [deftShowOnRequest, setOnRequest] = useState(showOnRequest);
  const [deftRequired, setRequired] = useState(required);
  const [deftReadable, setReadable] = useState(readable);
  const [deftWritable, setWritable] = useState(writable);
  const data = [
    {
      type: 'showOnRequest',
      deftvalu: deftShowOnRequest,
      setFun: setOnRequest
    },
    { type: 'required', deftvalu: deftRequired, setFun: setRequired },
    { type: 'readable', deftvalu: deftReadable, setFun: setReadable },
    { type: 'writable', deftvalu: deftWritable, setFun: setWritable }
  ];
  return (
    <div>
      <FormControl fullWidth>
        <TextField
          id="outlined-basic"
          label="fieldDisplayName"
          variant="outlined"
          autoComplete="off"
          defaultValue={fieldDisplayName}
          onChange={(item) => {
            props.AllProperty('fieldDisplayName', item.target.value);
          }}
        />
        <TextField
          style={{
            marginTop: 10
          }}
          id="outlined-basic"
          label="fieldName"
          variant="outlined"
          autoComplete="off"
          defaultValue={fieldName}
          onChange={(item) => {
            props.AllProperty('fieldName', item.target.value);
          }}
        />
        <FormHelperText>fieldType</FormHelperText>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={deftFieldType}
          variant="outlined"
          onChange={(item) => {
            props.AllProperty('fieldType', item.target.value);
            setAge(item.target.value);
          }}
        >
          <MenuItem value="string">string</MenuItem>
          <MenuItem value="int">int</MenuItem>
          <MenuItem value="date">date</MenuItem>
        </Select>
        <TextField
          style={{
            marginTop: 10
          }}
          id="outlined-basic"
          label="remark"
          variant="outlined"
          autoComplete="off"
          defaultValue={remark}
          onChange={(item) => {
            props.AllProperty('remark', item.target.value);
          }}
        />
        {data.map((itemType, index) => (
          <FormControl
            style={{
              marginTop: 10
            }}
            key={index}
          >
            <FormHelperText>{itemType.type}</FormHelperText>
            <Select
              key={itemType.type}
              value={itemType.deftvalu}
              variant="outlined"
              onChange={(item) => {
                props.AllProperty(itemType.type, item.target.value);
                itemType.setFun(item.target.value);
              }}
            >
              <MenuItem value="0">false</MenuItem>
              <MenuItem value="1">true</MenuItem>
            </Select>
          </FormControl>
        ))}
      </FormControl>
      <TextField
        style={{
          marginTop: 10
        }}
        fullWidth
        label="foreignTable"
        variant="outlined"
        autoComplete="off"
        defaultValue={foreignTable}
        onChange={(item) => {
          props.AllProperty('foreignTable', item.target.value);
        }}
      />
      <TextField
        style={{
          marginTop: 10
        }}
        fullWidth
        id="outlined-basic"
        label="foreignDisplayKey"
        variant="outlined"
        autoComplete="off"
        defaultValue={foreignDisplayKey}
        onChange={(item) => {
          props.AllProperty('foreignDisplayKey', item.target.value);
        }}
      />
      <TextField
        style={{
          marginTop: 10
        }}
        fullWidth
        id="outlined-basic"
        label="foreignKey"
        variant="outlined"
        autoComplete="off"
        defaultValue={foreignKey}
        onChange={(item) => {
          props.AllProperty('foreignKey', item.target.value);
        }}
      />
    </div>
  );
};

export { SelectForm };
