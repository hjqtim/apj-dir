import React, {
  // useState,
  // useCallback,
  memo,
  useState
} from 'react';
import { useFormik } from 'formik';
// import _ from 'lodash';
// import dayjs from 'dayjs';
import { SearchBar } from '../../../../components';

const HeadForm = (props) => {
  const { getMeetingListInfo, toAddMeeting } = props;
  const [params, setParams] = useState({});
  const formik = useFormik({
    initialValues: {
      meetingNo: '',
      requestNo: '',
      searchLimitDate: { start: null, end: null },
      seachDangDate: { start: null, end: null }
    },
    onSubmit: (values) => {
      console.log('onSearch BTN', values);
      const newParams = {
        ...params,
        startDate: values.seachDangDate.start || '',
        targetDate: values.seachDangDate.end || '',
        meetingNo: values.meetingNo,
        requestNo: values.requestNo,
        page: 1
      };
      if (newParams.startDate === '') {
        delete newParams.startDate;
      }
      if (newParams.targetDate === '') {
        delete newParams.targetDate;
      }
      if (newParams.meetingNo === '') {
        delete newParams.meetingNo;
      }
      if (newParams.requestNo === '') {
        delete newParams.requestNo;
      }
      setParams(newParams);
      getMeetingListInfo(newParams);
    }
  });
  const { setFieldValue } = formik;

  // 清空表单
  const onClearButton = () => {
    console.log('onClearButton');
    setFieldValue(`meetingNo`, '');
    setFieldValue(`requestNo`, '');
    setFieldValue(`seachDangDate.start`, null);
    setFieldValue(`seachDangDate.end`, null);
    setTimeout(() => {
      formik.handleSubmit();
    }, 500);
  };

  // 配置 查询 条件
  const searchBarFieldList = [
    {
      id: 'meetingNo',
      name: 'meetingNo',
      label: 'Meeting No.',
      type: 'text',
      value: formik.values.meetingNo
    },
    {
      id: 'requestNo',
      name: 'requestNo',
      label: 'Request No.',
      type: 'text',
      value: formik.values.requestNo
    },
    {
      id: 'time',
      type: 'dateRange',
      value: {
        startDate: formik.values.seachDangDate.start || '',
        endDate: formik.values.seachDangDate.end || ''
      },
      startDisableFuture: false,
      endDisableFuture: false,
      endMinDate: formik.values.seachDangDate.start
    }
  ];

  // 配置 额外按钮
  const extendButtonList = [
    {
      id: 'Add Meeting',
      color: 'primary',
      label: 'Add Meeting'
    }
  ];

  // 查询条件 匹配 获取结果
  const onSearchFieldChange = (data, id) => {
    // console.log('onSearchFieldChange', id, data);
    if (id === 'meetingNo') {
      setFieldValue('meetingNo', data.target.value);
    }
    if (id === 'requestNo') {
      setFieldValue('requestNo', data.target.value);
    }

    if (id === 'time') {
      const { startDate, endDate } = data.target.value;
      const obj = {};
      obj.start = startDate ?? null;
      obj.end = endDate ?? null;
      setFieldValue('searchLimitDate', obj);
      setFieldValue('seachDangDate', obj);
    }
  };

  // 额外按钮 匹配 方法
  const onExtendButtonClick = (_, id) => {
    // console.log('onExtendButtonClick', _, id);
    if (id === 'Add Meeting') {
      addMeeting();
    }
  };
  // 调父类方法 add meeting
  const addMeeting = () => {
    toAddMeeting();
  };

  return (
    <>
      <SearchBar
        onSearchFieldChange={onSearchFieldChange}
        onSearchButton={formik.handleSubmit}
        onClearButton={onClearButton}
        fieldList={searchBarFieldList}
        extendButtonList={extendButtonList}
        onExtendButtonClick={onExtendButtonClick}
      />
    </>
  );
};

export default memo(HeadForm);
