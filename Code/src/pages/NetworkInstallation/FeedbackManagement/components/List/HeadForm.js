import React, { useState, useEffect, memo } from 'react';
import { useFormik } from 'formik';
import dayjs from 'dayjs';
import { SearchBar } from '../../../../../components';
import webdpAPI from '../../../../../api/webdp/webdp';

const HeadForm = (props) => {
  const { params } = props;
  const [hospitalOptions, setHospitalOptions] = useState([]);
  const [hospitalMap, setHospitalMap] = useState({});

  const formik = useFormik({
    initialValues: {
      startDate: params.startDate,
      endDate: params.endDate,
      requestNo: params.requestNo,
      requester: params.requester,
      hospital: params.hospital,
      project: params.project,
      rating: params.rating,
      comment: params.comment,
      respStaff: params.respStaff,
      handled: params.handled
    },
    onSubmit: (values) => {
      console.log(values);
    }
  });

  // 清空表单
  const onClearButton = () => {};

  const searchBarFieldList = [
    {
      id: 'time',
      label: 'Date',
      type: 'dateRange',
      disabled: false,
      readOnly: false,
      value: {
        startDate: formik.values.startDate || '',
        endDate: formik.values.endDate || ''
      },
      endMinDate: formik.values.startDate,
      startDisableFuture: true,
      endDisableFuture: true
    },
    {
      id: 'requestNo',
      name: 'requestNo',
      label: 'Request No.',
      type: 'text',
      disabled: false,
      readOnly: false,
      value: formik.values.requestNo
    },
    {
      id: 'requester',
      name: 'requester',
      label: 'Requester',
      type: 'text',
      disabled: false,
      readOnly: false,
      value: formik.values.requester
    },
    {
      id: 'hospital',
      label: 'Institution',
      type: 'autocomplete',
      options: hospitalOptions,
      getOptionLabel: (option) => `${option.hospital}---${option.hospitalName}`,
      value: hospitalMap[formik.values.hospital] || null
    },
    {
      id: 'rating',
      name: 'rating',
      label: 'Rating',
      isSelector: true,
      value: formik.values.rating,
      itemList: [
        { value: '', label: 'All' },
        { value: '1', label: '1' },
        { value: '2', label: '2' },
        { value: '3', label: '3' },
        { value: '4', label: '4' },
        { value: '5', label: '5' }
      ]
    },
    {
      id: 'comment',
      name: 'comment',
      label: 'Comment',
      type: 'text',
      disabled: false,
      readOnly: false,
      value: formik.values.comment
    },
    {
      id: 'respStaff',
      name: 'respStaff',
      label: 'Resp Staff',
      type: 'text',
      disabled: false,
      readOnly: false,
      value: formik.values.respStaff
    },
    {
      id: 'handled',
      name: 'handled',
      label: 'Handled',
      isSelector: true,
      value: formik.values.handled,
      itemList: [
        { value: '', label: 'All' },
        { value: 'Y', label: 'Y' },
        { value: 'N', label: 'N' }
      ]
    }
  ];

  useEffect(() => {
    webdpAPI.getHospitalList().then((hospitalRes) => {
      const { hospitalList = [] } = hospitalRes?.data?.data || {};
      const hospitalListData = [];
      const newHospitalMap = {};
      hospitalList.forEach((hospitalItem) => {
        if (hospitalItem.hospitalName && hospitalItem.hospital) {
          hospitalListData.push(hospitalItem);
          newHospitalMap[hospitalItem.hospital] = hospitalItem;
        }
      });
      hospitalListData.sort((a, b) =>
        `${a.hospital}${a.hospitalName}`?.localeCompare(`${b.hospital}${b.hospitalName}`)
      );
      setHospitalMap(newHospitalMap);
      setHospitalOptions(hospitalListData);
    });
  }, []);

  const onSearchFieldChange = (value, id) => {
    if (id === 'time') {
      const { startDate, endDate } = value.target?.value || {};
      formik.setFieldValue(
        'startDate',
        startDate ? dayjs(startDate).format('YYYY-MM-DD 00:00:00') : ''
      );

      // the start time must be longer the end time
      if (
        startDate &&
        endDate &&
        dayjs(startDate).format('YYYY-MM-DD 00:00:00').valueOf() >
          dayjs(endDate).format('YYYY-MM-DD 00:00:00').valueOf()
      ) {
        formik.setFieldValue('endDate', '');
      } else {
        formik.setFieldValue(
          'endDate',
          endDate ? dayjs(endDate).format('YYYY-MM-DD 23:59:59') : ''
        );
      }
    } else if (id === 'hospital') {
      formik.setFieldValue('hospital', value?.target?.value?.hospital || '');
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

export default memo(HeadForm);
