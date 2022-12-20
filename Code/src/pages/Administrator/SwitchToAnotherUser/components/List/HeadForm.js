import React, { memo } from 'react';
import { useFormik } from 'formik';
import dayjs from 'dayjs';
import { makeStyles } from '@material-ui/core';
import { SearchBar } from '../../../../../components';

const useStyles = makeStyles(() => ({
  root: {
    '& .mlClass': {
      marginLeft: '0 !important'
    }
  }
}));

const HeadForm = (props) => {
  const { params, setParams } = props;
  const classes = useStyles();

  const defaultValue = {
    startTime: '',
    endTime: '',
    originUserName: '',
    switchUserName: ''
  };

  const formik = useFormik({
    initialValues: {
      ...defaultValue
    },
    onSubmit: (values) => {
      const newParams = {
        ...params,
        pageIndex: 1,
        ...values
      };
      setParams(newParams);
    }
  });

  // 清空表单
  const onClearButton = () => {
    formik.handleReset();
    const newParams = {
      ...params,
      pageIndex: 1,
      ...defaultValue
    };
    setParams(newParams);
  };

  const searchBarFieldList = [
    {
      id: 'originUserName',
      name: 'originUserName',
      label: 'Original User',
      type: 'text',
      value: formik.values.originUserName
    },
    {
      id: 'switchUserName',
      name: 'switchUserName',
      label: 'Switched User',
      type: 'text',
      value: formik.values.switchUserName
    },
    {
      id: 'time',
      type: 'dateRange',
      value: {
        startDate: formik.values.startTime || '',
        endDate: formik.values.endTime || ''
      },
      endMinDate: formik.values.startTime,
      startDisableFuture: true,
      endDisableFuture: true
    }
  ];

  const onSearchFieldChange = (value, id) => {
    if (id === 'time') {
      const { startDate, endDate } = value.target?.value || {};
      formik.setFieldValue(
        'startTime',
        startDate ? dayjs(startDate).format('YYYY-MM-DD 00:00:00') : ''
      );

      // the start time must be longer the end time
      if (
        startDate &&
        endDate &&
        dayjs(startDate).format('YYYY-MM-DD 00:00:00').valueOf() >
          dayjs(endDate).format('YYYY-MM-DD 00:00:00').valueOf()
      ) {
        formik.setFieldValue('endTime', '');
      } else {
        formik.setFieldValue(
          'endTime',
          endDate ? dayjs(endDate).format('YYYY-MM-DD 23:59:59') : ''
        );
      }
    } else {
      formik.handleChange(value);
    }
  };

  return (
    <div className={classes.root}>
      <SearchBar
        onSearchFieldChange={onSearchFieldChange}
        onSearchButton={formik.handleSubmit}
        onClearButton={onClearButton}
        fieldList={searchBarFieldList}
      />
    </div>
  );
};

export default memo(HeadForm);
