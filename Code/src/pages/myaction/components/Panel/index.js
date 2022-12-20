import React, { useEffect, useState, memo } from 'react';
import dayjs from 'dayjs';
import _ from 'lodash';
import { useFormik } from 'formik';
import { HAPaper } from '../../../../components';
import API from '../../../../api/webdp/webdp';
import RenderItem from './RenderItem';
import Header from './Header';

const Backbone = ({
  isDetail,
  itemData,
  beforeSubmit,
  saveData,
  isAllCloset,
  hospital,
  contract,
  reqNo
}) => {
  const [optionsData, setOptionsData] = useState({
    closetLocationVoList: [],
    partNoList: [],
    statusSelect: []
  });
  const [load, setLoad] = useState(true);
  const formik = useFormik({
    initialValues: {
      portItems: [],
      cabinetOptions: {}
    },
    validate: (values) => {
      let dynamicError = {};

      let errorFlag = false;
      const { portItems } = values;
      const errerArr = new Array(portItems.length);

      const closetIdNotEmptyItem = portItems.map((obj, index) => {
        let item = { ...obj, index };
        if (!obj?.closetid) {
          item = null;
        }
        return item;
      });

      // 找出空的数据设为error
      closetIdNotEmptyItem.forEach((item, index) => {
        let err;
        // 生成 Outlet ID前的限制  -----------------------------
        if (!_.isNull(item) && !item?.partno) {
          err = { ...err, partno: 'Can not be empty' };
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
      reqno: item.reqno,
      equipid: item.equipid,
      closetid: item.closetid,
      cabinetid: item.cabinetid,
      partno: item.partno,
      modeldesc: item.modeldesc,
      targetDate: item.targetDate || dayjs().add(21, 'day'),
      deliverynote: item.deliverynote,
      panelid: item.panelid,
      acceptancedate: item.acceptancedate || dayjs().add(21, 'day'),
      status: item.status || 'Planned',
      remark: item.remark,
      contactPerson: item.contactPerson,
      phone: item.phone,
      email: item.email
    }));
    formik.setValues({
      ...formik.values,
      portItems: [...newData]
    });
  }, [itemData]);

  useEffect(() => {
    if (hospital && contract) {
      const params = {
        hospital,
        contractNo: contract,
        isAll: isAllCloset || false
      };
      API.getPanelSelect(params).then((res) => {
        const newOptionsData = res?.data?.data || [];
        const { closetLocationVoList, partNoList, statusSelect } = newOptionsData;
        setOptionsData({
          closetLocationVoList: closetLocationVoList || [],
          partNoList: partNoList || [],
          statusSelect: statusSelect || []
        });
        setLoad(false);
      });
    }
  }, [hospital, contract, isAllCloset]);

  const handleSubmit = () => {
    const newPanelItems = [
      ...formik.values?.portItems,
      {
        id: '',
        reqno: '',
        equipid: '',
        closetid: '',
        cabinetid: '',
        partno: '',
        modeldesc: '',
        targetDate: dayjs().add(21, 'day'),
        deliverynote: '',
        panelid: '',
        acceptancedate: dayjs().add(21, 'day'),
        status: 'Planned',
        remark: '',
        contactPerson: '',
        phone: '',
        email: ''
      }
    ];
    formik.setValues({
      ...formik.values,
      portItems: newPanelItems
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
            type={itemData.type}
            key={item?.idx || index}
            optionsData={optionsData}
            errors={formik.errors.portItems?.[index] || {}}
            touched={formik.touched.portItems?.[index] || {}}
            handleChange={formik.handleChange}
            setFieldValue={formik.setFieldValue}
            values={formik.values}
            contractNo={contract}
            reqNo={reqNo}
          />
        ))}
    </HAPaper>
  );
};
export default memo(Backbone);
