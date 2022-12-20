// import React, { useState, useEffect } from 'react';
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
// import dayjs from 'dayjs'
import { Button, TextField, CircularProgress } from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { KeyboardDatePicker } from '@material-ui/pickers';
import CommonSelect from '../CommonSelect';
import DateRange from '../DateRange';
// import { DateRange } from "@material-ui/icons";

const useStyles = makeStyles((theme) => ({
  root: {
    marginBottom: '10px',
    display: 'flex',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    marginLeft: '1em'
  },
  textField: {
    marginRight: theme.spacing(10),
    width: '25ch'
  },
  KeyboardDatePicker: {
    marginRight: theme.spacing(10),
    width: '25ch'
  },
  clearButton: {
    // backgroundColor: '#FFF',
    color: '#229FFA',
    // border: '1px solid #229FFA',
    width: '10ch',
    marginRight: '2ch'
  },
  searchButton: {
    marginRight: '2ch',
    // backgroundColor: '#229FFA',
    width: '10ch'
  },
  button: {
    marginRight: '2ch',
    // backgroundColor: '#229FFA',
    color: '#fff'
  }
}));

function SearchBar(props) {
  const {
    onSearchFieldChange,
    onClearButton,
    onSearchButton,
    fieldList,
    extendButtonList,
    onExtendButtonClick
  } = props;
  const classes = useStyles();
  const handleDataChange = (value, id) => {
    // console.log('SearchBar handleDataChange:', value, fieldList);
    const data = {
      target: {
        value
      }
    };
    onSearchFieldChange(data, id);
  };

  return (
    <div className={classes.root}>
      {/*
        type list, see: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#Form_%3Cinput%3E_types
      */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'flex-end',
          justifyContent: 'flex-start'
        }}
      >
        {fieldList &&
          fieldList.map((field) =>
            field.isSelector ? (
              <CommonSelect
                id={field.id}
                key={field.id + field.label}
                label={field.label}
                error={field.error || false}
                helperText={field.helperText || ''}
                value={field.value || ''}
                itemList={field.itemList}
                outlined={false}
                style={{ ...field?.style }}
                labelField={field.labelField}
                valueField={field.valueField}
                multiple={field?.multiple || false}
                onSelectChange={(event) => onSearchFieldChange(event, field.id)}
                name={field.name || null}
              />
            ) : field.type === 'date' ? (
              <KeyboardDatePicker
                clearable="true"
                variant="inline"
                key={field.id + field.label}
                error={field.error || false}
                helperText={field.helperText || ''}
                views={field.views ? field.views : undefined}
                // format={field.views ? 'yyyy' : 'yyyy / MM / dd'}
                // format="YYYY/MMM/DD"
                label={field.label}
                value={field.value === '' ? null : field.value}
                style={{ marginRight: '8ch', marginTop: '1em' }}
                onChange={(event) => handleDataChange(event, field.id)}
                name={field.name || null}
              />
            ) : field.type === 'dateRange' ? (
              <DateRange
                clearable="true"
                variant="inline"
                key={field.id + field.label}
                error={field.error || false}
                helperText={field.helperText || ''}
                views={field.views ? field.views : undefined}
                // format={field.views ? 'yyyy' : 'yyyy / MM / dd'}
                // format="YYYY/MMM/DD"
                label={field.label}
                value={field.value === '' ? null : field.value}
                style={{ marginRight: '8ch' }}
                startMinDate={field.startMinDate || null}
                endMinDate={field.endMinDate || null}
                endDateDisabled={field.endDateDisabled || false}
                startDateDisabled={field.startDateDisabled || false}
                onChange={(event) => handleDataChange(event, field.id)}
                name={field.name || null}
                startDisableFuture={field.startDisableFuture}
                endDisableFuture={field.endDisableFuture}
                startMaxDate={field.startMaxDate}
              />
            ) : field.type === 'autocomplete' ? (
              <Autocomplete
                key={field.id + field.label}
                onChange={(event, value) => {
                  const newTarget = {
                    target: {
                      value
                    }
                  };
                  onSearchFieldChange(newTarget, field.id);
                }}
                freeSolo={field?.freeSolo || false}
                forcePopupIcon={field?.freeSolo || false}
                options={field.options || []}
                disabled={field.disabled || false}
                style={{ marginRight: '8ch', width: field.width || '150px', ...field?.style }}
                getOptionLabel={field.getOptionLabel || undefined}
                value={field.value || null}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    error={field.error || false}
                    label={field.label}
                    InputProps={{
                      ...params.InputProps,
                      endAdornment: (
                        <>
                          {field?.listLoading ? (
                            <CircularProgress size={20} color="inherit" />
                          ) : null}
                          {params.InputProps.endAdornment}
                        </>
                      )
                    }}
                    InputLabelProps={field?.inputLabelProps || {}}
                    onChange={(e) => {
                      const newTarget = {
                        target: {
                          value: e.target?.value || ''
                        }
                      };
                      onSearchFieldChange(newTarget, field.id);
                      field?.actionFun?.(e.target?.value || '');
                    }}
                    id={field.id}
                  />
                )}
              />
            ) : (
              <TextField
                id={field.id}
                key={field.id + field.label}
                label={field.label}
                type={field.type}
                onKeyDown={(e) => {
                  if (e.keyCode === 13) onSearchButton();
                }}
                error={field.error || false}
                helperText={field.helperText || ''}
                disabled={field.disabled || false}
                required={field.required || false}
                onChange={!field.readOnly ? (event) => onSearchFieldChange(event, field.id) : null}
                value={field.value}
                InputLabelProps={{
                  shrink: field.type === 'date' ? true : undefined
                }}
                style={{ marginRight: '8ch', ...field.style }}
                name={field.name || null}
              />
            )
          )}
      </div>
      <div style={{ minWidth: '25ch' }}>
        <Button
          variant="contained"
          color="secondary"
          onClick={onSearchButton}
          className={classes.searchButton}
        >
          Search
        </Button>
        <Button
          color="secondary"
          variant="outlined"
          onClick={onClearButton}
          className={classes.clearButton}
        >
          Clear
        </Button>
        {extendButtonList &&
          extendButtonList.map((item, i) => (
            <Button
              key={`${i}__${item.id}`}
              variant="contained"
              color={item.color}
              onClick={onExtendButtonClick ? (e) => onExtendButtonClick(e, item.id) : null}
              className={classes.button}
            >
              {item.label}
            </Button>
          ))}
      </div>
    </div>
  );
}

export default SearchBar;
