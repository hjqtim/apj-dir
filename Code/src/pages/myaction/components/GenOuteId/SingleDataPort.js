import React, { useEffect, useState, memo } from 'react';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { makeStyles, Accordion, AccordionDetails, AccordionSummary } from '@material-ui/core';
import _ from 'lodash';
import dayjs from 'dayjs';
import { useFormik } from 'formik';
import { HAPaper, WarningDialog, Loading } from '../../../../components';
import API from '../../../../api/webdp/webdp';
import RenderItem from './RenderItem';
import Header from './Header';

const useStyles = makeStyles(() => ({
  accordion: {
    marginBottom: ' 0 !important'
  }
}));

const SingleDataPort = ({ isDetail, beforeSubmit, saveData, itemData, isAllCloset, hospital }) => {
  const classes = useStyles();
  const [closet, setCloset] = useState([]);
  const [backData, setBackData] = useState([]);
  const [optionsData, setOptionsData] = useState({
    blockAndFoolList: [],
    cableTypeList: [],
    closetLocationVoList: [],
    conduitTypeList: [],
    isPublicAreaList: [],
    duplexList: [],
    facePlateList: [],
    outletStatusList: [],
    outletTypeList: [],
    polarityList: [],
    portSecurityList: [],
    portSpeedList: [],
    pstypeList: [],
    vlanIDList: []
  });
  const [load, setLoad] = useState(true);
  const [defaultCableType, setDefaultCableType] = useState();
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState(true);
  const formik = useFormik({
    initialValues: {
      portItems: [],
      cabinetOptions: {},
      equipmentOptions: {},
      portIdOptions: {}
    },
    validate: (values) => {
      let dynamicError = {};
      //   是否要添加 error 的标志
      let errorFlag = false;
      const { portItems } = values;
      const errerArr = new Array(portItems.length);

      const closetIdNotEmptyItem = portItems.map((obj, index) => {
        let item = { ...obj, index };
        if (!obj?.closetID) {
          item = null;
        }
        return item;
      });
      // 找出空的数据设为error
      closetIdNotEmptyItem.forEach((item, index) => {
        let err;
        // 生成 Outlet ID前的限制  -----------------------------
        if (!_.isNull(item) && !item?.equipid) {
          err = { ...err, equipid: 'Can not be empty' };
          errorFlag = true;
        }
        if (!_.isNull(item) && !item?.ownEquipId) {
          err = { ...err, ownEquipId: 'Can not be empty' };
          errorFlag = true;
        }
        if (!_.isNull(item) && !item?.portid) {
          err = { ...err, portid: 'Can not be empty' };
          errorFlag = true;
        }

        // 判断 Outlet ID 是否符合规则 -----------------------------
        if (item?.outletId && item?.outletId?.split('-').length < 4) {
          err = { ...err, outletId: 'Misformat' };
          errorFlag = true;
        }
        // 判断 Outlet ID 是否为空 -----------------------------
        if (!item?.outLetCanEmpty && item?.portid && !item?.outletId) {
          err = { ...err, outletId: 'Can not be empty' };
          errorFlag = true;
        }

        // 判断 Outlet ID 是否存在相同 -----------------------------------
        if (item?.outletId) {
          const arr = closetIdNotEmptyItem.filter((data) => data?.outletId === item?.outletId);
          if (arr.length > 1) {
            errorFlag = true;
            err = { ...err, outletId: 'Can not be same' };
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
      const oulletIdAllEmpty = values?.portItems.find((item) => item?.outletId);
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
    const newData = formik?.values?.portItems?.map((item, index) => {
      let data = item;
      if (item?.portid) {
        data = { closetId: item.closetID, equipId: item.equipid };
        indexArr.push(index);
      } else {
        data = {};
      }
      return data;
    });
    genOutletId(newData, indexArr);
    setOpen(false);
  };

  useEffect(() => {
    const oneList = itemData?.oneList || [];
    setBackData(oneList);
    const newData = oneList.map((item) => ({
      idx: item.idx,
      dpLocationId: item.dpLocationId,
      equipmentStatus: item.equipmentStatus,
      ownEquipId: item.ownEquipId,
      closetID: item.closetID,
      equipid: item.equipid,
      portid: item.portid,
      oldOwnEquipId: item.ownEquipId,
      oldPortId: item.portid,
      oldOutletId: item.outletId,
      targetDate: item.targetDate || dayjs().add(21, 'day'),
      cableType: item.cableType,
      outletType: item.outletType,
      outletId: item.outletId,
      // portstatus: item.portstatus,
      outLetCanEmpty: true,
      pstype: item.pstype,
      linkPort: item.linkPort,
      cabinetID: item.cabinetID,
      project: item.project,
      facePlate: item.facePlate,
      conduitType: item.conduitType,
      cablelength: item.cablelength || 0,
      patchPanelID: item.patchPanelID,
      patchPanelPort: item.patchPanelPort,
      status: item.status || 'Planned',
      acceptDate: item.acceptDate || dayjs().add(21, 'day'),
      polarity: item.polarity,
      portSpeed: item.portSpeed,
      duplex: item.duplex,
      isPublicArea: item.isPublicArea,
      vlanID: item.vlanID,
      portSecurity: item.portSecurity,
      newPortId: item.newPortId
    }));
    formik.setValues({
      ...formik.values,
      portItems: [...newData]
    });
  }, [itemData]);

  useEffect(() => {
    const touchData = {
      closetID: true,
      equipid: true,
      ownEquipId: true,
      outletId: true,
      portid: true
    };
    if (beforeSubmit) {
      const touchArr = new Array(formik.values?.portItems.length).fill('').map(() => touchData);
      formik.setTouched({
        portItems: touchArr
      });

      let canSubmit = false;
      if (_.isEmpty(formik.errors)) {
        canSubmit = true;
      }

      // 改动的数据
      const newData = formik.values.portItems.map((item) => ({
        ...item,
        linkId: item.equipid && item.portid ? item.equipid + item.portid : null
      }));
      // 删除的数据
      const deleteData = backData.filter((x) =>
        newData.some((item) => {
          let flag = false;
          if (x.outletId && x.outletId === item.oldOutletId && !item.outletId) {
            flag = true;
          }
          return flag;
        })
      );
      // 判断outletID是否为空
      newData.forEach((item) => {
        if (item.closetID && !item?.outletId) {
          canSubmit = false;
        }
      });
      const items = formik.values.portItems.map((item) => ({
        ...item,
        outLetCanEmpty: false
      }));
      formik.setValues({
        ...formik.values,
        portItems: items
      });

      saveData(newData, deleteData, canSubmit);
    }
  }, [beforeSubmit]);

  //   生成一个 outletId
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
        indexArr.forEach((idxVal, index) => {
          formik.setFieldValue(`portItems[${idxVal}].outletId`, resData?.[index]?.outLetId || '');
        });
      })
      .finally(() => {
        Loading.hide();
      });
  };

  // 根据hospital来获取select List
  useEffect(() => {
    if (hospital) {
      Loading.show();

      API.getDataPortSelect({
        hospital,
        isAll: isAllCloset || false
      }).then((res) => {
        const closetData = res?.data?.data?.closetLocationVoList || [];
        const newclosetData = _.map(closetData, 'closetId');
        const newOptionsData = res?.data?.data || {};
        const resDefaultType = res?.data?.data?.cableTypeList?.[0]?.optionValue || '';
        setCloset(newclosetData);
        setDefaultCableType(resDefaultType);
        const {
          blockAndFoolList,
          cableTypeList,
          closetLocationVoList,
          conduitTypeList,
          isPublicAreaList,
          duplexList,
          facePlateList,
          outletStatusList,
          outletTypeList,
          polarityList,
          portSecurityList,
          portSpeedList,
          pstypeList,
          vlanIDList
        } = newOptionsData;

        setOptionsData({
          blockAndFoolList: blockAndFoolList || [],
          cableTypeList: cableTypeList || [],
          closetLocationVoList: closetLocationVoList || [],
          conduitTypeList: conduitTypeList || [],
          isPublicAreaList: isPublicAreaList || [],
          duplexList: duplexList || [],
          facePlateList: facePlateList || [],
          outletStatusList: outletStatusList || [],
          outletTypeList: outletTypeList || [],
          polarityList: polarityList || [],
          portSecurityList: portSecurityList || [],
          portSpeedList: portSpeedList || [],
          pstypeList: pstypeList || [],
          vlanIDList: vlanIDList || []
        });
        setLoad(false);
        Loading.hide();
      });
    }
  }, [hospital, isAllCloset]);

  // 设置  cableType 默认值
  useEffect(() => {
    if (defaultCableType) {
      const portItemsData = formik.values.portItems;
      const newData = portItemsData.map((item) => {
        let tempData = item;
        if (!item.cableType) {
          tempData = { ...tempData, cableType: defaultCableType };
        }
        return tempData;
      });
      formik.setValues({
        ...formik.values,
        portItems: newData
      });
    }
  }, [defaultCableType]);

  const handleSubmit = () => {
    const items = formik.values.portItems.map((item) => ({
      ...item,
      outLetCanEmpty: true
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
      <Accordion
        className={classes.accordion}
        expanded={expanded}
        onChange={() => setExpanded(!expanded)}
        style={{ width: '100%', marginTop: '1rem' }}
      >
        {!load && formik.values?.portItems?.length !== 0 && (
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1bh-content"
            id="panel1bh-header"
            style={{ alignItems: 'self-start' }}
          >
            <Header
              isDetail={isDetail}
              type={itemData.serviceType || ''}
              hospital={itemData.serviceathosp || ''}
              block={itemData.block || ''}
              floor={itemData.floor || ''}
              numOfDP={itemData.numOfDP || ''}
              handleSubmit={handleSubmit}
            />
          </AccordionSummary>
        )}
        <AccordionDetails style={{ display: 'block' }}>
          {!load &&
            formik.values?.portItems?.map((item, index) => (
              <RenderItem
                index={index}
                // formik={formik}
                genOutletId={genOutletId}
                closet={closet}
                item={item || {}}
                isDetail={isDetail}
                type={itemData.type}
                key={item?.id || index}
                optionsData={optionsData}
                errors={formik.errors.portItems?.[index] || {}}
                touched={formik.touched.portItems?.[index] || {}}
                handleChange={formik.handleChange}
                setFieldValue={formik.setFieldValue}
                portItems={formik.values.portItems}
                cabinetOptions={formik.values.cabinetOptions}
                portIdOptions={formik.values.portIdOptions}
                equipmentOptions={formik.values.equipmentOptions}
              />
            ))}
        </AccordionDetails>
      </Accordion>

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
export default memo(SingleDataPort);
