import React from 'react';
// import dayjs from 'dayjs';
import { useFormik } from 'formik';
import { SearchBar } from '../../../../../components';

const HeadForm = ({ params, setParams }) => {
  const formik = useFormik({
    initialValues: {
      jobName: '',
      triggerState: ''
    },
    onSubmit: (values) => {
      const newParams = {
        ...params,
        ...values,
        pageNo: 1
      };
      setParams(newParams);
    }
  });

  // Clear
  const handleClear = () => {
    formik.handleReset();
    const newParams = {
      ...params,
      jobName: '',
      triggerState: '',
      pageNo: 1
    };
    setParams(newParams);
  };

  const searchBarFieldList = [
    {
      id: 'jobName',
      name: 'jobName',
      label: 'Job Name',
      type: 'text',
      value: formik.values.jobName
    },
    {
      label: 'State',
      disabled: false,
      value: formik.values.triggerState,
      name: 'triggerState',
      id: 'triggerState',
      isSelector: true,
      itemList: [
        { value: '', label: 'All' },
        { value: 'ACQUIRED', label: 'Enable' },
        { value: 'PAUSED', label: 'Disable' }
      ]
    }
  ];

  const onSearchFieldChange = (e, id) => {
    if (id === 'triggerState') {
      const newParams = {
        ...params,
        ...formik.values,
        triggerState: e?.target?.value
      };
      setParams(newParams);
    }
    formik.handleChange(e);
  };

  return (
    <>
      <SearchBar
        onSearchFieldChange={onSearchFieldChange}
        onSearchButton={formik.handleSubmit}
        onClearButton={handleClear}
        fieldList={searchBarFieldList}
      />
    </>
  );
};

export default HeadForm;
