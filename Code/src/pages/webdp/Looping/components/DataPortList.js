import React, { memo } from 'react';
import { Grid } from '@material-ui/core';
import RenderTitle from './RenderTitle';
import DataPortItem from './DataPortItem';
import { CommonTip } from '../../../../components';

const DataPortList = (props) => {
  const {
    values,
    setFieldValue,
    genNewItem,
    isDetail,
    handleBlur,
    touched = [],
    setFieldTouched,
    errors,
    handleChange,
    isApproval,
    requestType,
    isCompleted,
    detailData = {},
    formik
  } = props;

  const setValueByIndex = (index, field, value) => {
    setFieldValue(`dataPortList.items[${index}].${field}`, value);
  };

  // 新增一个DataPort item
  const addDataPortItem = (index) => {
    const newIndex = values?.items?.length;
    // 如果操作是最后一个item，才会新增
    if (newIndex && newIndex - 1 === index) {
      setFieldValue(`dataPortList.items[${newIndex}]`, genNewItem());
    }
  };

  // 删除一个item
  const deleteItem = (row, index) => {
    const isLoading = values.items?.find((item) => item.isChecking);
    if (isLoading) {
      CommonTip.warning('Checking the data port id, Please try again later');
      return;
    }
    const newItems = values.items?.filter((item) => item.id !== row.id);
    setFieldValue('dataPortList.items', newItems);
    const newTouched = touched?.filter((item, idx) => idx !== index);
    setFieldTouched('dataPortList.items', newTouched);
  };

  return (
    <Grid container item spacing={2}>
      <RenderTitle title="Data Port List" />
      <Grid item xs={12}>
        <p style={{ fontWeight: 'bold' }}>Please fill in Data Port ID(s)</p>
        <p style={{ fontWeight: 'bold' }}> *** (One Data Port ID per line) ***</p>
      </Grid>

      <Grid container item spacing={3} xs={12} justifyContent="space-between">
        <Grid item style={{ flex: 1, minWidth: 500 }}>
          <div>
            <Grid container spacing={3} direction="column">
              {values.items?.map((item, index) => (
                <DataPortItem
                  key={item.id}
                  index={index}
                  item={item}
                  setValueByIndex={setValueByIndex}
                  addDataPortItem={addDataPortItem}
                  isLast={values.items?.length - 1 === index}
                  deleteItem={deleteItem}
                  isDetail={isDetail}
                  handleBlur={handleBlur}
                  touched={touched}
                  errors={errors}
                  handleChange={handleChange}
                  isApproval={isApproval}
                  requestType={requestType}
                  isCompleted={isCompleted}
                  listValues={values?.items || []}
                  setFieldValue={setFieldValue}
                  detailData={detailData}
                  formik={formik}
                />
              ))}
            </Grid>
          </div>
        </Grid>
        {!isApproval && (
          <Grid item style={{ width: '260px' }}>
            <img src="/static/img/avatars/DataportID_UCH.png" alt="" />
          </Grid>
        )}
      </Grid>
    </Grid>
  );
};

export default memo(DataPortList);
