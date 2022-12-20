import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useFormik } from 'formik';
import dayjs from 'dayjs';
import _ from 'lodash';
import { SearchBar } from '../../index';
import webdpAPI from '../../../api/webdp/webdp';
import AAAAPI from '../../../api/adGroup';
import { SENSE_NMSRS } from '../../../utils/constant';

const HeadForm = (props) => {
  const { params, setParams, isInit, isMyApproval, stepNameOptions } = props;
  const [hospitalOptions, setHospitalOptions] = useState([]);
  const [nMSOptions, setNMSOptions] = useState([]);
  const [nMSOptionsMap, setNMSOptionsMap] = useState([]);
  const [hospitalMap, setHospitalMap] = useState({});

  const [requesterOptions, setRequesterOptions] = useState([]);
  const [loading, setLoading] = useState(false);

  const formik = useFormik({
    initialValues: {
      startDate: params.startDate,
      endDate: params.endDate,
      requestNo: params.requestNo,
      hospital: params.hospital,
      stepName: params.stepName,
      respStaff: params.respStaff,
      appType: params.appType,
      requester: params.requester,
      isMyTeam: params.isMyTeam
    },
    onSubmit: (values) => {
      const newParams = {
        ...params,
        ...values,
        pageIndex: 1
      };
      setParams(newParams);
    }
  });

  // 清空表单
  const onClearButton = () => {
    formik.setValues({
      startDate: '',
      endDate: '',
      requestNo: '',
      hospital: '',
      stepName: '',
      respStaff: '',
      appType: [],
      requester: '',
      isMyTeam: isMyApproval ? 1 : 2
    });

    const newParams = {
      ...params,
      pageIndex: 1,
      requestNo: '',
      startDate: '',
      endDate: '',
      hospital: '',
      stepName: '',
      respStaff: '',
      appType: [],
      requester: '',
      isMyTeam: isMyApproval ? 1 : 2
    };
    setParams(newParams);
  };

  const stepNameValue = useMemo(
    () => stepNameOptions.find((item) => item.name === formik.values.stepName),
    [stepNameOptions, formik.values.stepName]
  );

  const checkAD = useCallback(
    _.debounce((inputValue) => {
      if (inputValue?.length >= 3 && !loading) {
        setLoading(true);
        setRequesterOptions([]);
        webdpAPI
          .findUserList({ username: inputValue })
          .then((res) => {
            let newOptions = res?.data?.data || [];
            newOptions = newOptions.map((item) => item?.display) || [];
            setRequesterOptions(newOptions);
          })
          .finally(() => {
            setLoading(false);
          }, []);
      }
    }, 800),
    [loading]
  );

  const stepNameOptionsFilter = _.uniqBy(stepNameOptions, 'name');

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
      id: 'appType',
      name: 'appType',
      label: 'Application Type',
      isSelector: true,
      multiple: true,
      style: { maxWidth: '150px' },
      value: formik.values.appType,
      itemList: [
        { value: 'DP', label: 'DP' },
        { value: 'AP', label: 'AP' },
        { value: 'DE', label: 'DE' },
        { value: 'LP', label: 'LP' },
        { value: 'IP', label: 'IP' },
        { value: 'IPR', label: 'IPR' },
        { value: 'IPU', label: 'IPU' }
      ]
    },
    {
      id: 'time',
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
      id: 'hospital',
      label: 'Institution',
      type: 'autocomplete',
      options: hospitalOptions,
      // getOptionLabel: (option) => `${option.hospital}---${option.hospitalName}`,
      getOptionLabel: (option) => `${option.hospital}`,
      value: hospitalMap[formik.values.hospital] || null
    },
    {
      id: 'isMyTeam',
      name: 'isMyTeam',
      // label: 'Rating',
      isSelector: true,
      value: formik.values.isMyTeam,
      itemList: [
        { value: 1, label: 'All' },
        { value: 2, label: isMyApproval ? 'Raised to me' : 'Raised by me' },
        { value: 3, label: isMyApproval ? 'Raised to my team' : 'Raised by my team' }
      ]
    },
    {
      label: 'Progress',
      name: 'stepName',
      id: 'stepName',
      // width: '220px',
      type: 'autocomplete',
      options: stepNameOptionsFilter,
      getOptionLabel: (item) => item.name,
      value: stepNameValue?.name ? stepNameValue : null
    },
    {
      id: 'respStaff',
      label: 'NMS Responsible Staff',
      type: 'autocomplete',
      options: nMSOptions,
      style: { display: isMyApproval ? 'block' : 'none' },
      inputLabelProps: { style: { fontSize: '12px' } },
      getOptionLabel: (option) => `${option.displayName}`,
      value: nMSOptionsMap[formik.values.respStaff] || null
    },
    {
      id: 'requester',
      label: 'Requester',
      type: 'autocomplete',
      options: requesterOptions,
      freeSolo: true,
      actionFun: checkAD,
      value: formik.values?.requester || '',
      listLoading: loading
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

    //
    AAAAPI.getUsersForGroup({ groupNames: SENSE_NMSRS.split(',') }).then((res) => {
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
    if (!isInit) {
      return;
    }

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
    } else if (id === 'respStaff') {
      formik.setFieldValue('respStaff', value?.target?.value?.username || '');
    } else if (id === 'stepName') {
      formik.setFieldValue('stepName', value?.target?.value?.name || '');
    } else if (id === 'requester') {
      formik.setFieldValue('requester', value?.target?.value || '');
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
