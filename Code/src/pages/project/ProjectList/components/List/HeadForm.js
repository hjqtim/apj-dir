import React from 'react';
import { parse } from 'qs';
import { useHistory } from 'react-router-dom';
import { useFormik } from 'formik';
import { SearchBar } from '../../../../../components';
import { L } from '../../../../../utils/lang';

const HeadForm = (props) => {
  const history = useHistory();
  const { handleSearch, handleReset } = props;
  const urlObj = parse(history.location.search?.replace('?', '')) || {}; // 根据url获取请求参数

  const formik = useFormik({
    initialValues: {
      appType: urlObj?.appType || '',
      projectName: urlObj?.projectName || '',
      status: urlObj?.status || ''
    },
    onSubmit: (values) => {
      handleSearch(values);
    }
  });

  // 清楚搜索参数
  const onClearButton = () => {
    // formik.handleReset();  //该方法有bug
    formik.setValues({
      appType: '',
      projectName: '',
      status: ''
    });
    handleReset();
  };

  // 搜索字段
  const searchBarFieldList = [
    {
      label: L('project'),
      type: 'text',
      disabled: false,
      value: formik.values.projectName,
      name: 'projectName'
    },
    {
      label: L('type'),
      type: 'text',
      disabled: false,
      value: formik.values.appType,
      name: 'appType',
      isSelector: true,
      itemList: [
        { value: '', label: 'All' },
        { value: 'DP', label: 'DP' },
        { value: 'AP', label: 'AP' },
        { value: 'IP', label: 'IP' }
      ]
    },
    {
      label: L('status'),
      type: 'text',
      disabled: false,
      value: formik.values.status,
      name: 'status',
      isSelector: true,
      itemList: [
        { value: '', label: 'All' },
        { value: 'Active', label: 'Active' },
        { value: 'Inactive', label: 'Inactive' }
      ]
    }
  ];
  return (
    <SearchBar
      onSearchFieldChange={formik.handleChange}
      onSearchButton={formik.handleSubmit}
      onClearButton={onClearButton}
      fieldList={searchBarFieldList}
    />
  );
};

export default HeadForm;
