import React, { useEffect, useState, memo } from 'react';
import dayjs from 'dayjs';
import _ from 'lodash';
import { useFormik } from 'formik';
import { HAPaper } from '../../../../components';
import API from '../../../../api/webdp/webdp';
import RenderItem from './RenderItem';
import Header from './Header';

const Backbone = ({ isDetail, itemData, saveData, beforeSubmit, isAllCloset, hospital }) => {
  const [optionsData, setOptionsData] = useState({
    closetLocationVoList: [],
    cableTypeList: [],
    fibreCoreQtyList: [],
    facePlateList: [],
    conduitTypeList: [],
    statusSelect: []
  });
  const [load, setLoad] = useState(false);

  const formik = useFormik({
    initialValues: {
      portItems: [],
      cabinetAOptions: {},
      cabinetBOptions: {}
    },
    validate: (values) => {
      console.log(values);
      let dynamicError = {};
      //   是否要添加 error 的标志
      let errorFlag = false;
      const { portItems } = values;
      const errerArr = new Array(portItems.length);

      const backboneIdNotEmptyItem = portItems.map((obj, index) => {
        let item = { ...obj, index };
        if (!obj?.backboneId) {
          item = null;
        }
        return item;
      });

      console.log(backboneIdNotEmptyItem);

      // 找出空的数据设为error
      backboneIdNotEmptyItem.forEach((item, index) => {
        let err;
        if (!_.isNull(item) && !item?.backboneId) {
          err = { ...err, backboneId: 'Can not be empty' };
          errorFlag = true;
        }
        if (!_.isNull(item) && !item?.onlyBackboneId) {
          err = { ...err, backboneId: 'is Not Only' };
          errorFlag = true;
        }
        if (!_.isNull(item) && !item?.cableType) {
          err = { ...err, backboneId: 'Can not be empty' };
          errorFlag = true;
        }
        errerArr[index] = err || undefined;
      });

      // 修改 error
      if (errorFlag) {
        dynamicError = { ...dynamicError, portItems: [...errerArr] };
      }
      return dynamicError;
    },
    onSubmit: (values) => {
      console.log(values);
    }
  });

  // 父级触发save向上传值
  useEffect(() => {
    if (beforeSubmit) {
      let canSubmit = false;
      if (_.isEmpty(formik.errors)) {
        canSubmit = true;
      }
      formik.handleSubmit();
      saveData(formik.values?.portItems || [], canSubmit);
    }
  }, [beforeSubmit]);

  useEffect(() => {
    const data = itemData || [];
    const newData = data.map((item) => ({
      id: item.id,
      backboneId: item.backboneId,
      closetidAend: item.closetidAend,
      cabinetidAend: item.cabinetidAend,
      closetidBend: item.closetidBend,
      cabinetidBend: item.cabinetidBend,
      cableType: item.cableType,
      fibreCoreQty: item.fibreCoreQty,
      facePlate: item.facePlate,
      project: item.project,
      conduitType: item.conduitType,
      targetDate: item.targetDate || dayjs().add(21, 'day'),
      contactPerson: item.contactPerson,
      cableLength: item.cableLength || 0,
      status: item.status,
      acceptDate: item.acceptDate || dayjs().add(21, 'day'),
      remark: item.remark,
      onlyBackboneId: true
    }));
    formik.setValues({
      ...formik.values,
      portItems: [...newData]
    });
  }, [itemData]);

  // 根据hospital来获取select List
  useEffect(() => {
    if (hospital) {
      setLoad(true);
      // 获取Backbone全部Select
      API.getBackboneSelect({
        hospital,
        isAll: isAllCloset || false
      }).then((res) => {
        console.log(res);
        const newOptionsData = res?.data?.data || {};
        const closetData = _.map(newOptionsData?.closetLocationVoList, 'closetId');
        // setOptionsData({ ...optionsData, ...newOptionsData });
        setOptionsData({
          closetLocationVoList: closetData || [],
          cableTypeList: newOptionsData?.cableTypeList || [],
          fibreCoreQtyList: newOptionsData?.fibreCoreQtyList || [],
          facePlateList: newOptionsData?.facePlateList || [],
          conduitTypeList: newOptionsData?.conduitTypeList || [],
          statusSelect: newOptionsData?.statusSelect || []
        });
        setLoad(false);
      });
    }
  }, [hospital, isAllCloset]);

  const handleSubmit = () => {
    const portItems = formik.values.portItems || [];
    formik.setValues({
      ...formik.values,
      portItems: [
        ...portItems,
        {
          backboneId: '',
          closetidAend: '',
          cabinetidAend: '',
          closetidBend: '',
          cabinetidBend: '',
          cableType: '',
          fibreCoreQty: '',
          facePlate: '',
          project: '',
          conduitType: '',
          targetDate: dayjs().add(21, 'day'),
          contactPerson: '',
          cableLength: 0,
          status: 'Planned',
          acceptDate: dayjs().add(21, 'day'),
          remark: '',
          onlyBackboneId: true
        }
      ]
    });
  };

  return (
    <HAPaper style={{ padding: '16px' }}>
      <Header isDetail={isDetail} type={itemData.serviceType || ''} handleSubmit={handleSubmit} />
      {!load &&
        formik.values?.portItems?.map((item, index) => (
          <RenderItem
            index={index}
            item={item || {}}
            isDetail={isDetail}
            key={item?.id || index}
            optionsData={optionsData}
            errors={formik.errors.portItems?.[index] || {}}
            touched={formik.touched.portItems?.[index] || {}}
            values={formik.values}
            handleChange={formik.handleChange}
            handleBlur={formik.handleBlur}
            setFieldValue={formik.setFieldValue}
            formik={formik}
          />
        ))}
    </HAPaper>
  );
};
export default memo(Backbone);
