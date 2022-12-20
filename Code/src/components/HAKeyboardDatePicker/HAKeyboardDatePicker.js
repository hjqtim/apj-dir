import React, { useState, useEffect, memo } from 'react';
import { KeyboardDatePicker } from '@material-ui/pickers';
import dayjs from 'dayjs';

const HAKeyboardDatePicker = (props) => {
  const {
    fullWidth = true,
    autoOk = true,
    variant = 'inline',
    inputVariant = 'outlined',
    size = 'small',
    onBlur = () => {},
    onChange = () => {},
    value,
    disablePast = false,
    disableFuture = false,
    minDate = dayjs().add(-5, 'year').format('YYYY-MM-DD 23:59:59'),
    maxDate = dayjs().add(5, 'year').format('YYYY-MM-DD 23:59:59'),
    nowFormat = 'YYYY-MM-DD', // 现在传进来的是什么格式，默认年-月-日
    ...others
  } = props;

  const format = 'dd-MMM-yyyy';
  const mask = '__-__-____';

  // 验证日期是否符合格式  年-月-日 xxxx-xx-xx
  const verifyDate = (date) => /^\d{4}-\d{2}-\d{2}$/.test(dayjs(date).format('YYYY-MM-DD'));

  let val = null;
  if (verifyDate(value)) {
    val = dayjs(value).format('DD-MMM-YYYY');
  }
  const [defaultValue, setDefaultValue] = useState(val);

  useEffect(() => {
    setDefaultValue(val);
  }, [value]);

  const clearInput = () => {
    onChange('');
    setDefaultValue(null);
  };

  // 获取时间戳
  const getTimeStamp = (date) => {
    if (!date) {
      return dayjs(dayjs().format('YYYY-MM-DD 00:00:00')).valueOf();
    }
    return dayjs(dayjs(date).format('YYYY-MM-DD 00:00:00')).valueOf();
  };

  const handleOnBlur = () => {
    // const nowFormatValue = dayjs(defaultValue, 'DD-MMM-YYYY').format(nowFormat);
    const dateArr = defaultValue?.split?.('-') || [];
    const day = dateArr[0] || '';
    const month = dateArr[1] || '';
    const year = dateArr[2] || '';
    const newDate = `${year}-${month}-${day}`;
    if (/^\d{4}-.{2,3}-\d{2}$/.test(newDate)) {
      const nowFormatValue = dayjs(newDate).format(nowFormat);
      onChange(nowFormatValue);

      // 禁用之前
      if (disablePast && getTimeStamp(nowFormatValue) < getTimeStamp()) {
        clearInput();
      }

      // 禁用未来
      if (disableFuture && getTimeStamp(nowFormatValue) > getTimeStamp()) {
        clearInput();
      }

      // 不能小于最小时间
      if (minDate && getTimeStamp(nowFormatValue) < getTimeStamp(minDate)) {
        clearInput();
      }

      // 不能大于最大时间
      if (maxDate && getTimeStamp(nowFormatValue) > getTimeStamp(maxDate)) {
        clearInput();
      }
    } else {
      clearInput();
    }
  };

  return (
    <>
      <KeyboardDatePicker
        {...others}
        value={defaultValue}
        fullWidth={fullWidth}
        mask={mask}
        autoOk={autoOk}
        format={format}
        inputVariant={inputVariant}
        variant={variant}
        size={size}
        disablePast={disablePast}
        disableFuture={disableFuture}
        minDate={minDate}
        maxDate={maxDate}
        onBlur={(e) => {
          onBlur(e);
          handleOnBlur();
        }}
        onChange={(dateObj, dateString) => {
          setDefaultValue(dateString || null);
          const dateArr = dateString?.split?.('-') || [];
          const day = dateArr[0] || '';
          const month = dateArr[1] || '';
          const year = dateArr[2] || '';
          const newDate = `${year}-${month}-${day}`;
          if (!dateString) {
            onChange('');
          } else if (/^\d{4}-.{2,3}-\d{2}$/.test(newDate)) {
            const nowFormatValue = dayjs(newDate).format(nowFormat);
            onChange(nowFormatValue);
          }
        }}
      />
    </>
  );
};

export default memo(HAKeyboardDatePicker);
