import React from 'react';
import { TextField, FormControlLabel, Switch } from '@material-ui/core';
import { KeyboardDatePicker } from '@material-ui/pickers';
import CommonSelect from '../CommonSelect';

function SearchBar(props) {
  const { onSearchFieldChange, fieldList } = props;
  const handleDataChange = (value, id) => {
    const data = {
      target: {
        value
      }
    };
    onSearchFieldChange(data, id);
  };
  const handleBoolChange = (event, id) => {
    const data = {
      target: {
        value: event.target.checked
      }
    };
    onSearchFieldChange(data, id);
  };
  return (
    <>
      <div
        style={{
          marginBottom: '10px',
          padding: '0 10px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}
      >
        <div>
          {fieldList &&
            fieldList.map((field) => {
              switch (field.type) {
                case 'text':
                  return (
                    <TextField
                      id={field.id.toString()}
                      key={field.id + field.label}
                      label={field.label}
                      type={field.type}
                      error={field.error || false}
                      helperText={field.helperText || ''}
                      disabled={field.disabled || false}
                      variant="outlined"
                      required={field.required || false}
                      onChange={
                        !field.readOnly ? (event) => onSearchFieldChange(event, field.id) : null
                      }
                      // onBlur={!field.readOnly && onFormFieldBlur ? (e) => onFormFieldBlur(e, field.id) : null}
                      value={field.value ? field.value : ''}
                      defaultValue={field.value ? field.value : ''}
                      InputProps={{
                        readOnly: field.readOnly
                      }}
                      InputLabelProps={{
                        shrink: field.type === 'date' ? true : undefined
                      }}
                      style={{ marginTop: '5ch', marginRight: '10ch' }}
                    />
                  );
                case 'date':
                  return (
                    <KeyboardDatePicker
                      clearable="true"
                      variant="inline"
                      inputVariant="outlined"
                      key={field.id + field.label}
                      views={field.views ? field.views : undefined}
                      format={field.views ? 'yyyy' : 'yyyy / MM / dd'}
                      label={field.label}
                      error={field.error || false}
                      helperText={field.helperText || ''}
                      value={field.value === '' ? null : field.value}
                      style={{ marginTop: '5ch', marginRight: '10ch' }}
                      readOnly={field.readOnly}
                      onChange={handleDataChange && ((event) => handleDataChange(event, field.id))}
                    />
                  );
                case 'boolean':
                  return (
                    // eslint-disable-next-line react/jsx-no-undef
                    <FormControlLabel
                      key={field.id + field.label}
                      style={{ marginTop: '5ch', marginRight: '10ch' }}
                      control={
                        <Switch
                          checked={field.value === '' ? false : field.value}
                          onChange={
                            handleBoolChange && ((event) => handleBoolChange(event, field.id))
                          }
                          name={field.id}
                          color="primary"
                        />
                      }
                      label={field.label}
                    />
                  );
                case 'select':
                  return (
                    <CommonSelect
                      id={field.id.toString()}
                      key={field.id + field.label}
                      label={field.label}
                      error={field.error || false}
                      helperText={field.helperText || ''}
                      value={field.value || ''}
                      disabled={field.disabled || false}
                      outlined
                      itemList={field.itemList}
                      labelField={field.labelField}
                      valueField={field.valueField}
                      width={field.width}
                      labelWidth={field.labelWidth}
                      hasMt
                      onSelectChange={
                        !field.readOnly ? (event) => onSearchFieldChange(event, field.id) : null
                      }
                    />
                  );
                default:
                  return (
                    <TextField
                      id={field.id}
                      key={field.id + field.label}
                      label={field.label}
                      type={field.type}
                      error={field.error || false}
                      helperText={field.helperText || ''}
                      disabled={field.disabled || false}
                      variant="outlined"
                      required={field.required || false}
                      onChange={
                        !field.readOnly ? (event) => onSearchFieldChange(event, field.id) : null
                      }
                      // onBlur={!field.readOnly && onFormFieldBlur ? (e) => onFormFieldBlur(e, field.id) : null}
                      value={field.value}
                      InputProps={{
                        readOnly: field.readOnly
                      }}
                      InputLabelProps={{
                        shrink: field.type === 'date' ? true : undefined
                      }}
                      style={{ marginTop: '5ch', marginRight: '10ch' }}
                    />
                  );
              }
            })}
        </div>
      </div>
    </>
  );
}

export default SearchBar;
