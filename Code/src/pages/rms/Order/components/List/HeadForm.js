import React, { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import { SearchBar } from '../../../../../components';
import webdpAPI from '../../../../../api/webdp/webdp';

const HeadForm = (props) => {
  const { params, setParams } = props;
  const [hospitalOptions, setHospitalOptions] = useState([]);
  const [hospitalMap, setHospitalMap] = useState({});
  const formik = useFormik({
    initialValues: {
      requestNo: params.requestNo,
      hospital: params.hospital,
      status: params.status,
      staff: params.staff
    },
    onSubmit: (values) => {
      const newParams = {
        ...params,
        ...values,
        page: 1
      };
      setParams(newParams);
    }
  });

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

  const onClearButton = () => {
    formik.setValues({
      requestNo: '',
      hospital: '',
      status: 'All',
      staff: ''
    });
    const newParams = {
      page: 1,
      pageSize: 10,
      requestNo: '',
      hospital: '',
      status: 'All',
      staff: ''
    };
    setParams(newParams);
  };

  const onSearchFieldChange = (value, id) => {
    if (id === 'hospital') {
      formik.setFieldValue('hospital', value?.target?.value?.hospital || '');
    } else {
      formik.handleChange(value);
    }
  };

  const searchBarFieldList = [
    {
      id: 'requestNo',
      name: 'requestNo',
      label: 'Req. No',
      type: 'text',
      value: formik.values.requestNo
    },
    {
      id: 'hospital',
      name: 'hospital',
      label: 'Institution',
      type: 'autocomplete',
      options: hospitalOptions,
      value: hospitalMap[formik.values.hospital] || null,
      getOptionLabel: (option) => `${option.hospital}---${option.hospitalName}`
    },
    {
      id: 'status',
      name: 'status',
      label: 'Status',
      isSelector: true,
      value: formik.values.status,
      itemList: [
        { value: 'All', label: 'All' },
        { value: 'In Progress', label: 'In Progress' },
        { value: 'Completed', label: 'Completed' },
        { value: 'Cancelled', label: 'Cancelled' }
      ]
    },
    {
      id: 'staff',
      name: 'staff',
      label: 'Resp Staff',
      type: 'text',
      value: formik.values.staff
    }
  ];

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
