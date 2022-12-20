import React, { useState } from 'react';
import dayjs from 'dayjs';
import { stringify } from 'qs';
import { useFormik } from 'formik';
import { useHistory } from 'react-router-dom';
import { SearchBar } from '../../../../../components';

const HeadForm = ({ params, setParams, getPackageLists }) => {
  const history = useHistory();
  const [isInit, setIsInit] = useState(true);

  const formik = useFormik({
    initialValues: {
      packageName: params.packageName || '',
      vendor: params.vendor || '',
      startTime: params.startTime || '',
      endTime: params.endTime || ''
    },
    onSubmit: (values) => {
      const newParams = {
        ...params,
        pageIndex: 1,
        packageName: values.packageName || '',
        vendor: values.vendor || '',
        startTime: values.startTime || '',
        endTime: values.endTime || ''
      };
      setParams(newParams);
      const url = `?${stringify(newParams)}`;
      history.push(url);
      getPackageLists({
        packageName: values.packageName || undefined,
        vendor: values.vendor || undefined,
        startTime:
          (values?.startTime && dayjs(values?.startTime).format('YYYY-MM-DD HH:mm:ss')) ||
          undefined,
        endTime:
          (values?.endTime && dayjs(values?.endTime).format('YYYY-MM-DD HH:mm:ss')) || undefined
      });
      console.log(newParams);
    }
  });

  // Clear
  const handleClear = () => {
    formik.setValues({ packageName: '', vendor: '' });
    history.push('/Procurement/PackageList');
    getPackageLists({
      packageName: undefined,
      vendor: undefined
    });
    setParams({
      pageIndex: 1,
      createdBy: '',
      systemName: '',
      module: '',
      startTime: '',
      endTime: '',
      pageSize: params.pageSize
    });
  };

  const searchBarFieldList = [
    {
      id: 'packageName',
      name: 'packageName',
      label: 'PackageName',
      type: 'text',
      value: formik.values.packageName
    },
    {
      id: 'vendor',
      name: 'vendor',
      label: 'Vendor',
      type: 'text',
      value: formik.values.vendor
    },
    {
      id: 'date',
      type: 'dateRange',
      startMaxDate: formik.values.endTime,
      endMinDate: formik.values.startTime,
      value: {
        // startDate: dayjs(formik.values.startTime).format('YYYY/MMM/DD') || null,
        startDate: formik.values.startTime || null,
        endDate: formik.values.endTime || null
      }
    }
  ];

  const onSearchFieldChange = (e, id) => {
    if (isInit) return;
    if (id === 'date') {
      let newStartTime = e?.target?.value?.startDate || '';
      let newEndTime = e?.target?.value?.endDate || '';

      if (newStartTime) {
        newStartTime = dayjs(newStartTime).format('YYYY-MM-DD 00:00:00');
      }
      if (newEndTime) {
        newEndTime = dayjs(newEndTime).format('YYYY-MM-DD 23:59:59');
      }
      formik.setValues({
        ...formik.values,
        startTime: newStartTime,
        endTime: newEndTime
      });
    } else {
      formik.handleChange(e);
    }
  };

  return (
    <>
      <SearchBar
        onSearchFieldChange={(e, id) => {
          onSearchFieldChange(e, id);
          setIsInit(false);
        }}
        onSearchButton={formik.handleSubmit}
        onClearButton={handleClear}
        fieldList={searchBarFieldList}
      />
    </>
  );
};

export default HeadForm;
