import React, { useEffect, useState, memo } from 'react';
import _ from 'lodash';
import dayjs from 'dayjs';
import { useFormik } from 'formik';
import { HAPaper, Loading, WarningDialog } from '../../../../components';
import API from '../../../../api/webdp/webdp';
import RenderDualItem from './RenderDualItem';
import Header from './Header';

const DualDataPort = ({ beforeSubmit, saveData, isDetail, itemData, outletOptions }) => {
  const [closet, setCloset] = useState([]);
  const [cableOptions, setCableOptions] = useState([]);
  const [defaultCableType, setDefaultCableType] = useState();
  const [backData, setBackData] = useState([]);
  const [open, setOpen] = useState(false);

  const formik = useFormik({
    initialValues: {
      portItems: [],
      equipmentOptions: {},
      portIdOptions: {},
      equipModuleOptions: {}
    },

    validate: (values) => {
      let dynamicError = {};
      //   是否要添加 error 的标志
      let errorFlag = false;
      const { portItems } = values;
      const errerArr = new Array(portItems.length);
      //
      const closetIdNotEmptyItem = portItems.map((obj, index) => {
        let item = { ...obj, index };
        if (!obj?.primary?.closetid && !obj?.second?.closetid) {
          item = null;
        }
        return item;
      });

      closetIdNotEmptyItem.forEach((item, index) => {
        let err = { primary: {}, second: {} };

        if (!_.isNull(item)) {
          Object.keys(item.primary).forEach((key) => {
            if (
              !item?.primary?.[key] &&
              (key === 'closetid' || key === 'equipid' || key === 'ownEquipId' || key === 'portid')
            ) {
              err = { ...err, primary: { ...err.primary, [key]: 'Can not be empty' } };
              errorFlag = true;
            }
          });

          Object.keys(item.second).forEach((key) => {
            if (
              !item?.second?.[key] &&
              (key === 'closetid' || key === 'equipid' || key === 'ownEquipId' || key === 'portid')
            ) {
              err = { ...err, second: { ...err.second, [key]: 'Can not be empty' } };
              errorFlag = true;
            }
          });
        }

        // 判断 Outlet ID 是否为空 -----------------------------------
        if (!item?.primary?.outLetCanEmpty && item?.primary?.portid && !item?.primary?.outletid) {
          err = { ...err, primary: { ...err.primary, outletid: 'Can not be empty' } };
          errorFlag = true;
        }
        if (!item?.second?.outLetCanEmpty && item?.second?.portid && !item?.second?.outletid) {
          err = { ...err, second: { ...err.second, outletid: 'Can not be empty' } };
          errorFlag = true;
        }

        // 判断 Outlet ID 是否符合规则 -----------------------------
        if (item?.primary?.outletid && item?.primary?.outletid?.split('-')?.length < 4) {
          err = { ...err, primary: { ...err.primary, outletid: 'Misformat' } };
          errorFlag = true;
        }
        if (item?.second?.outletid && item?.second?.outletid?.split('-')?.length < 4) {
          err = { ...err, second: { ...err.second, outletid: 'Misformat' } };
          errorFlag = true;
        }

        // 判断 Outlet ID 是否相同 -----------------------------------
        const primaryArr = [];
        if (item?.primary?.outletid) {
          closetIdNotEmptyItem.forEach((data) => {
            if (data?.primary?.outletid === item?.primary?.outletid) primaryArr.push(data?.primary);
            if (data?.second?.outletid === item?.primary?.outletid) primaryArr.push(data?.second);
          });
          if (primaryArr.length > 1) {
            errorFlag = true;
            err = { ...err, primary: { ...err.primary, outletid: 'Can not be same' } };
          }
        }
        //
        const secondArr = [];
        if (item?.second?.outletid) {
          closetIdNotEmptyItem.forEach((data) => {
            if (data?.primary?.outletid === item?.second?.outletid) secondArr.push(data?.primary);
            if (data?.second?.outletid === item?.second?.outletid) secondArr.push(data?.second);
          });
          if (secondArr.length > 1) {
            errorFlag = true;
            err = { ...err, second: { ...err.second, outletid: 'Can not be same' } };
          }
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
      const oulletIdAllEmpty = values?.portItems.find(
        (item) => item?.primary?.outletid || item?.second?.outletid
      );
      if (!_.isUndefined(oulletIdAllEmpty)) {
        setOpen(true);
        return;
      }
      handleGenOutletId();
    }
  });

  // 生成 OutletId
  const handleGenOutletId = () => {
    const indexArr = [];
    const queryData = [];

    formik?.values?.portItems?.forEach((item, index) => {
      if (item?.primary.portid) {
        indexArr.push({ index, type: 'primary' });
        queryData.push({ closetId: item?.primary?.closetid, equipId: item?.primary?.equipid });
      }
      if (item?.second.portid) {
        indexArr.push({ index, type: 'second' });
        queryData.push({ closetId: item?.second?.closetid, equipId: item?.second?.equipid });
      }
    });
    genOutletId(queryData, indexArr);
    setOpen(false);
  };

  useEffect(() => {
    const portList = itemData?.portList || [];
    setBackData(portList);
    const newData = portList.map((item) => ({
      key: Date.now().toString(36) + Math.random().toString(36).substr(2),
      primary: {
        idx: item?.Production.idx,
        dpLocationId: item?.Production?.dpLocationId,
        equipmentStatus: item?.Production?.equipmentStatus,
        ownEquipId: item?.Secondary?.ownEquipId,
        cableType: item?.Production?.cableType,
        outletType: item?.Production?.outletType,
        targetDate: item?.Production?.targetDate || dayjs().add(21, 'day'),
        closetid: item?.Production?.closetid,
        equipid: item?.Production?.equipid,
        portid: item?.Production?.portid,
        outletid: item?.Production?.outletid,
        portstatus: item?.Production?.portstatus,
        oldOwnEquipId: item?.Production?.ownEquipId,
        oldPortId: item?.Production?.portid,
        oldOutletId: item?.Production?.outletid,
        outLetCanEmpty: true
      },
      second: {
        idx: item?.Secondary.idx,
        dpLocationId: item?.Secondary?.dpLocationId,
        equipmentStatus: item?.Secondary?.equipmentStatus,
        ownEquipId: item?.Secondary?.ownEquipId,
        cableType: item?.Secondary?.cableType,
        outletType: item?.Secondary?.outletType,
        targetDate: item?.Secondary?.targetDate || dayjs().add(21, 'day'),
        closetid: item?.Secondary?.closetid,
        equipid: item?.Secondary?.equipid,
        portid: item?.Secondary?.portid,
        outletid: item?.Secondary?.outletid,
        portstatus: item?.Secondary?.portstatus,
        oldOwnEquipId: item?.Secondary?.ownEquipId,
        oldPortId: item?.Secondary?.portid,
        oldOutletId: item?.Secondary?.outletid,
        outLetCanEmpty: true
      }
    }));

    formik.setValues({
      ...formik.values,
      portItems: [...newData]
    });
  }, [itemData]);

  useEffect(() => {
    const touchData = {
      closetid: true,
      equipid: true,
      ownEquipId: true,
      outletid: true,
      portid: true
    };
    if (beforeSubmit) {
      const touchArr = new Array(formik.values?.portItems.length).fill('').map(() => ({
        primary: touchData,
        second: touchData
      }));
      formik.setTouched({
        portItems: touchArr
      });
      let canSubmit = false;
      if (_.isEmpty(formik.errors)) {
        canSubmit = true;
      }
      const newData = [];
      const deleteData = [];
      formik.values.portItems.forEach((item) => {
        const linkId =
          item?.primary?.equipid && item?.primary?.portid
            ? `${item?.primary?.equipid}${item?.primary?.portid}`
            : null;
        newData.push({ ...item?.primary, linkId });
        newData.push({ ...item?.second, linkId });
      });

      backData.forEach((x) => {
        newData.forEach((item) => {
          if (
            x?.Production?.outletid &&
            x?.Production?.outletid === item?.oldOutletId &&
            !item?.outletid
          ) {
            deleteData.push(x?.Production || {});
          }
          if (
            x?.Secondary?.outletid &&
            x?.Secondary?.outletid === item?.oldOutletId &&
            !item?.outletid
          ) {
            deleteData.push(x?.Secondary || {});
          }
        });
      });

      // 判断outletID是否为空
      newData.forEach((item) => {
        if (item?.closetid && !item?.outletid) {
          canSubmit = false;
        }
        if (item?.closetid && !item?.outletid) {
          canSubmit = false;
        }
      });
      const items = formik.values.portItems.map((item) => ({
        ...item,
        primary: { ...item.primary, outLetCanEmpty: false },
        second: { ...item.second, outLetCanEmpty: false }
      }));
      formik.setValues({
        ...formik.values,
        portItems: items
      });
      saveData(newData, deleteData, canSubmit);
    }
  }, [beforeSubmit]);

  useEffect(() => {
    Promise.all([
      API.getCloset({
        hospital: itemData?.serviceathosp,
        block: itemData?.block,
        floor: itemData?.floor,
        isAll: false
      }),
      // API.getCloset({ hospital: 'KH', block: 'Main Block', floor: 'G' }),
      API.getCableOrOutletType({
        type: 'cable',
        hospital: itemData?.serviceathosp,
        block: itemData?.block
      })
      // API.getCableOrOutletType({ type: 'cable', hospital: 'KH', block: 'Main Block' })
    ]).then((res) => {
      const closetData = res?.[0]?.data?.data?.closet || [];
      const cableTypeList = res?.[1]?.data?.data?.cableTypeList || [];
      const resDefaultType = res?.[1]?.data?.data?.autoCableType || '';
      const newCableOptions = _.map(cableTypeList, 'preDefinedValue');
      const newclosetData = _.map(closetData, 'closetid');
      setCloset(newclosetData);
      setDefaultCableType(resDefaultType);
      setCableOptions(newCableOptions);
    });
  }, []);

  // 设置  cableType 默认值
  useEffect(() => {
    if (defaultCableType) {
      const portItemsData = formik.values.portItems;
      const newData = portItemsData.map((item) => {
        let tempData = item;

        if (!item?.primary?.cableType) {
          tempData = { ...tempData, primary: { ...item?.primary, cableType: defaultCableType } };
        }
        if (!item?.second?.cableType) {
          tempData = { ...tempData, second: { ...item?.second, cableType: defaultCableType } };
        }
        return tempData;
      });
      formik.setValues({
        ...formik.values,
        portItems: newData
      });
    }
  }, [defaultCableType]);

  //   生成 outletid
  const genOutletId = (data, indexArr) => {
    const newData = data.filter((item) => !_.isEmpty(item));

    const queryData = newData.map((item) => ({
      ...item,
      block: itemData.block,
      floor: itemData.floor,
      hospital: itemData.serviceathosp
    }));

    if (queryData?.length === 0) return;
    Loading.show();
    API.generateOutletID(queryData)
      .then((res) => {
        const resData = res?.data?.data?.generateOutletIdList || [];
        indexArr.forEach((item, idx) => {
          formik.setFieldValue(
            `portItems[${item?.index}].${item?.type}.outletid`,
            resData?.[idx]?.outLetId || ''
          );
        });
      })
      .finally(() => {
        Loading.hide();
      });
  };
  const handleSubmit = () => {
    const items = formik.values.portItems.map((item) => ({
      ...item,
      primary: { ...item.primary, outLetCanEmpty: true },
      second: { ...item.second, outLetCanEmpty: true }
    }));
    formik.setValues({
      ...formik.values,
      portItems: items
    });
    setTimeout(() => {
      formik.handleSubmit();
    }, 0);
  };
  return (
    <HAPaper style={{ padding: '16px' }}>
      {formik.values?.portItems?.length !== 0 && (
        <Header
          isDetail={isDetail}
          type={itemData.serviceType || ''}
          hospital={itemData.serviceathosp || ''}
          block={itemData.block || ''}
          floor={itemData.floor || ''}
          handleSubmit={handleSubmit}
        />
      )}

      {formik.values?.portItems?.map((item, index) => (
        <div key={item?.key} style={{ marginBottom: '30px' }}>
          <RenderDualItem
            item={item?.primary || {}}
            index={index}
            isDetail={isDetail}
            closet={closet}
            genOutletId={genOutletId}
            tip="Primary"
            formik={formik}
            setFieldValue={formik.setFieldValue}
            type={itemData.type}
            errors={formik.errors?.portItems?.[index]?.primary || {}}
            touched={formik.touched?.portItems?.[index]?.primary || {}}
            cableOptions={cableOptions}
            outletOptions={outletOptions}
          />
          <RenderDualItem
            item={item?.second || {}}
            index={index}
            isDetail={isDetail}
            closet={closet}
            tip="Secondary"
            formik={formik}
            genOutletId={genOutletId}
            setFieldValue={formik.setFieldValue}
            type={itemData.type}
            cableOptions={cableOptions}
            outletOptions={outletOptions}
            errors={formik.errors?.portItems?.[index]?.second || {}}
            touched={formik.touched?.portItems?.[index]?.second || {}}
          />
        </div>
      ))}

      {open && (
        <WarningDialog
          open={open}
          handleConfirm={handleGenOutletId}
          handleClose={() => setOpen(false)}
          content="The existing Outlet ID will be recovered.  Are you sure to continue?"
        />
      )}
    </HAPaper>
  );
};
export default memo(DualDataPort);
