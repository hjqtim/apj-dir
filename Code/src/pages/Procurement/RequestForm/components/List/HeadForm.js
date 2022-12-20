import React, { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import dayjs from 'dayjs';
import { SearchBar } from '../../../../../components';
import API from '../../../../../api/adGroup';
import { SENSE_NMSRS } from '../../../../../utils/constant';

const HeadForm = (props) => {
  const { params, setParams, isInit } = props;

  const [nMSOptions, setNMSOptions] = useState([]);
  const [nMSOptionsMap, setNMSOptionsMap] = useState([]);

  const formik = useFormik({
    initialValues: {
      startTime: params.startTime,
      endTime: params.endTime,
      reqNo: params.reqNo,
      status: params.status
    },
    onSubmit: (values) => {
      const newParams = {
        ...params,
        page: 1,
        startTime: values.startTime || '',
        endTime: values.endTime || '',
        reqNo: values.reqNo,
        status: values.status,
        vendor: values.vendor
      };
      setParams(newParams);
    }
  });

  // 清空表单
  const onClearButton = () => {
    formik.setValues({
      startTime: '',
      endTime: '',
      reqNo: '',
      status: ''
    });

    const newParams = {
      page: 1,
      limit: 10,
      startTime: '',
      endTime: '',
      reqNo: '',
      status: ''
    };
    setParams(newParams);
  };

  const searchBarFieldList = [
    {
      id: 'reqNo',
      name: 'reqNo',
      label: 'Search by Req No.',
      type: 'text',
      disabled: false,
      readOnly: false,
      value: formik.values.reqNo
    },
    {
      id: 'vendor',
      name: 'Vendor',
      label: 'Vendor',
      type: 'text',
      disabled: false,
      readOnly: false,
      value: formik.values.vendor
    },
    {
      id: 'respStaff',
      label: 'NMS Responsible Staff',
      type: 'autocomplete',
      options: nMSOptions,
      inputLabelProps: { style: { fontSize: '12px' } },
      getOptionLabel: (option) => `${option.displayName}`,
      value: nMSOptionsMap[formik.values.respStaff] || null
    },
    {
      label: 'Status',
      // type: 'text',
      disabled: false,
      value: formik.values.status,
      name: 'status',
      id: 'status',
      isSelector: true,
      itemList: [
        { value: '', label: 'All' },
        { value: 'Auto', label: 'Auto' },
        { value: 'Work pending', label: 'Work pending' },
        { value: 'Job Completed', label: 'Job Completed' },
        { value: 'Cancelled', label: 'Cancelled' }
      ]
    }
    // {
    //   id: 'time',
    //   // label: 'Date',
    //   type: 'dateRange',
    //   disabled: false,
    //   readOnly: false,
    //   value: {
    //     startDate: formik.values.startTime || '',
    //     endDate: formik.values.endTime || ''
    //   },
    //   endMinDate: formik.values.startTime,
    //   startDisableFuture: true,
    //   endDisableFuture: true
    // }
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

  useEffect(() => {
    // 获取nms resp staff List
    API.getUsersForGroup({ groupNames: SENSE_NMSRS.split(',') }).then((res) => {
      const newOptions = res?.data?.data || [];
      const newOptionMap = {};
      newOptions.forEach((item) => {
        if (item.username && item.displayName) {
          newOptionMap[item.username] = item;
        }
      });

      setNMSOptionsMap(newOptionMap);
      setNMSOptions(newOptions);
    });
  }, []);

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
