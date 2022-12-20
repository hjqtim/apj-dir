import React from 'react';
import { useFormik } from 'formik';
import dayjs from 'dayjs';
import { SearchBar } from '../../../../../components';

const HeadForm = (props) => {
  const { params, setParams, isInit } = props;
  const formik = useFormik({
    initialValues: {
      startTime: params.startTime,
      endTime: params.endTime,
      requestNo: params.requestNo
    },
    onSubmit: (values) => {
      const newParams = {
        ...params,
        page: 1,
        startTime: values.startTime || '',
        endTime: values.endTime || '',
        requestNo: values.requestNo
      };
      setParams(newParams);
    }
  });

  // 清空表单
  const onClearButton = () => {
    formik.setValues({
      startTime: '',
      endTime: '',
      requestNo: ''
    });

    const newParams = {
      page: 1,
      limit: 10,
      startTime: '',
      endTime: '',
      requestNo: ''
    };
    setParams(newParams);
  };

  const searchBarFieldList = [
    {
      id: 'requestNo',
      name: 'requestNo',
      label: 'Search by Request No.',
      type: 'text',
      disabled: false,
      readOnly: false,
      value: formik.values.requestNo
    },
    {
      id: 'time',
      // label: 'Date',
      type: 'dateRange',
      disabled: false,
      readOnly: false,
      value: {
        startDate: formik.values.startTime || '',
        endDate: formik.values.endTime || ''
      },
      endMinDate: formik.values.startTime,
      startDisableFuture: true,
      endDisableFuture: true
    }
    // {
    //   label: 'Status',
    //   // type: 'text',
    //   disabled: false,
    //   value: formik.values.dprequeststatus,
    //   name: 'dprequeststatus',
    //   id: 'dprequeststatus',
    //   isSelector: true,
    //   itemList: [
    //     { value: '', label: 'All' },
    //     { value: 'Draft', label: 'Draft' },
    //     { value: 'Inprogress', label: 'Inprogress' },
    //     { value: 'Submit', label: 'Submit' },
    //     { value: 'Cancel', label: 'Cancel' },
    //     { value: 'Complete', label: 'Complete' }
    //   ]
    // }
  ];

  const onSearchFieldChange = (value, id) => {
    const { startDate, endDate } = value.target?.value || {};

    if (!isInit) {
      return;
    }

    if (id === 'time') {
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
    <>
      <SearchBar
        onSearchFieldChange={onSearchFieldChange}
        onSearchButton={formik.handleSubmit}
        onClearButton={onClearButton}
        fieldList={searchBarFieldList}
      />
    </>
  );
};

export default HeadForm;
