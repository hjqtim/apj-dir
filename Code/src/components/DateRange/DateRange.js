import React, { useEffect, useState } from 'react';
import KeyboardDatePicker from '../HAKeyboardDatePicker';

function DateRange(props) {
  const {
    // disableFuture,

    inputVariant,
    rangWidth,
    rangFromName,
    rangUntilName,
    onChange,
    label,
    value,
    startDateDisabled,
    endDateDisabled,
    startMinDate,
    endMinDate,
    startDisableFuture = false, // start time disable future
    endDisableFuture = false, // end time disable future
    startMaxDate
  } = props;

  let { justifyContent } = props;
  let marginRightValue = '0ch';
  if (typeof justifyContent === 'undefined') {
    justifyContent = 'space-between';
    marginRightValue = '8ch';
  }
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  useEffect(() => {
    onChange && onChange({ startDate, endDate });
    // eslint-disable-next-line
  }, [startDate, endDate]);
  useEffect(() => {
    if (!value) {
      setStartDate(null);
      setEndDate(null);
    } else {
      setStartDate(value?.startDate || null);
      setEndDate(value?.endDate || null);
    }
  }, [value]);
  const onStartDateChange = (e) => {
    setStartDate(e);
  };
  const onEndDateChange = (e) => {
    setEndDate(e);
  };
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        marginRight: marginRightValue,
        justifyContent,
        height: '48px',
        paddingTop: '22px'
      }}
    >
      <label style={{ marginRight: label ? '2rem' : '' }}>{label || ''}</label>
      <div className="mlClass">
        <KeyboardDatePicker
          label={rangFromName || ''}
          placeholder={rangFromName || 'From'}
          inputVariant={inputVariant || 'standard'}
          minDate={startMinDate || undefined}
          maxDate={startMaxDate || undefined}
          disabled={startDateDisabled || false}
          disableFuture={startDisableFuture}
          value={startDate}
          onChange={(e) => onStartDateChange(e)}
          style={rangWidth ? { width: rangWidth } : { width: '160px' }}
          autoOk
        />
        <KeyboardDatePicker
          label={rangUntilName || ''}
          placeholder={rangUntilName || 'Until'}
          inputVariant={inputVariant || 'standard'}
          minDate={endMinDate || undefined}
          disabled={endDateDisabled || false}
          disableFuture={endDisableFuture}
          value={endDate}
          onChange={(e) => onEndDateChange(e)}
          style={
            rangWidth
              ? { marginLeft: '5ch', width: rangWidth }
              : { marginLeft: '5ch', width: '160px' }
          }
          autoOk
        />
      </div>
    </div>
  );
}

export default DateRange;
