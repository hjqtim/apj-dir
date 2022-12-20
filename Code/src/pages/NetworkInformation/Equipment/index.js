import React, { useState, useEffect } from 'react';
import { parse } from 'qs';
import { useFormik } from 'formik';
import { useDispatch } from 'react-redux';
import { IconButton } from '@material-ui/core';
import { ArrowBack, ArrowForward } from '@material-ui/icons';
import AntTabs from '../../../components/CustomizeMuiComponent/AntTabs';
import AntTab from '../../../components/CustomizeMuiComponent/AntTab';
import Filter from './components/Filter';
import EquipmentTab from './components/EquipmentTab';
import PortConnectionTab from './components/PortConnectionTab';
import PortAssignmentTab from './components/PortAssignmentTab';
import webdpAPI from '../../../api/webdp/webdp';
import { CommonTip, Loading } from '../../../components';
import ActionLog from './components/PortConnection/ActionLog';

export default function Index(props) {
  const dispatch = useDispatch();
  const [openDataPort, setOpenDataPort] = useState(false);
  const {
    equipId = '',
    assetNo = '',
    ipAddress = '',
    serialNo = ''
  } = parse(props.location?.search?.replace('?', '')) || {};

  const formik = useFormik({
    initialValues: {
      // 头部筛选器数据
      filterData: {
        equipFilterList: [],
        assetNoFilterList: [],
        serialFilterList: [],
        ipAddressFilterList: [],
        equipObj: equipId ? { equipId } : null,
        assetNoObj: assetNo ? { assetNo } : null,
        serialObj: serialNo ? { serialNo, modelDesc: '' } : null,
        ipAddressObj: ipAddress ? { ipAddress, equipId: '' } : null
      },
      history: {
        type: null
      },
      freshData: 0, // 通知页面刷新数据
      baseData: {}, // equipment基础数据
      cabinets: [], // closet对应的cabinet数据
      closet: {}, // closet数据
      maintenance: {}, // 保修单数据
      modules: [], // module表格数据
      statusList: [],
      cabinetPowerList: [], // 电源列表
      connectPortList: [] // Port Connection左边列表
    }
  });

  const { setFieldValue, handleChange } = formik;
  const { freshData } = formik.values;
  // 获取status列表
  const getClosetStatusOptions = () => {
    webdpAPI.getOptionList().then((res) => {
      setFieldValue('statusList', res?.data?.data?.optionTypeList || []);
    });
  };

  const getDetailData = (params) => {
    if (freshData === 0) {
      Loading.show();
    }
    webdpAPI
      .getEquipmentDetail(params)
      .then((res) => {
        const newData = res?.data?.data?.data || {};
        setFieldValue('baseData', newData.baseData || {});
        setFieldValue('cabinets', newData.cabinets || []);
        setFieldValue('closet', newData.closet || {});
        setFieldValue('maintenance', newData.maintenance || {});
        setFieldValue('modules', newData.modules || []);

        getCabinetPower(newData.baseData?.closetid, newData.baseData?.cabinetid);

        if (params.isShowSuccess) {
          CommonTip.success('Success', 2000);
        }
      })
      .finally(() => {
        if (freshData === 0) {
          Loading.hide();
        }
      });
  };

  // 哪个有值就根据哪个去查询数据
  const getDetailByOne = (params = {}) => {
    const { equipObj, assetNoObj, serialObj, ipAddressObj } = formik.values.filterData;
    if (
      equipObj?.equipId ||
      assetNoObj?.assetNo ||
      serialObj?.serialNo ||
      ipAddressObj?.ipAddress
    ) {
      const queryParams = {
        ...params,
        equipId: equipObj?.equipId,
        assetNo: assetNoObj?.assetNo,
        serialNo: serialObj?.serialNo,
        ipAddress: ipAddressObj?.ipAddress
      };
      getDetailData(queryParams);
    }
  };

  // 打开菜单栏
  const handleOpenMenu = () => {
    const action = {
      type: 'global/setIsShowMenu',
      payload: true
    };
    dispatch(action);
  };

  // Port connection里的Data port显示隐藏按钮
  const handleOpenDataPort = () => {
    setOpenDataPort(!openDataPort);
  };

  useEffect(() => {
    handleOpenMenu();
    getClosetStatusOptions();
    getDetailByOne();
  }, [freshData]);

  const [tabValue, setTabValue] = useState('Port Connection');

  const {
    baseData,
    history,
    maintenance,
    closet,
    modules,
    statusList,
    cabinets,
    cabinetPowerList
  } = formik.values;

  // 获取电源列表
  const getCabinetPower = (closetId, cabinetId) => {
    if (!closetId || !cabinetId) {
      return;
    }

    webdpAPI.getCabinetAndSub({ closetId, cabinetId }).then((res) => {
      setFieldValue('cabinetPowerList', res?.data?.data?.data?.cabinetPowerSources || []);
    });
  };

  // 提交修改
  const handleSave = () => {
    const saveParams = {
      id: baseData.id,
      ipAddress: baseData.ipAddress || '',
      unitNo: baseData.unitNo || '',
      defGateway: baseData.defGateway || '',
      subnetMask: baseData.subnetMask || '',
      blockDHCP: baseData.blockDHCP || '',
      configFile: baseData.configFile || '',
      status: baseData.status || '',
      networkApplied: baseData.networkApplied || '',
      remark: baseData.remark || '',
      cabinetid: baseData.cabinetid || '',
      sequence: parseInt(baseData.sequence) >= 0 ? parseInt(baseData.sequence) : null,
      powerBarId: baseData.powerBarId || '',
      deliveryDate: baseData.deliveryDate || null,
      deliveryNoteReceviedDate: baseData.deliveryNoteReceviedDate || null
    };
    Loading.show();
    webdpAPI
      .updateEquip(saveParams)
      .then((res) => {
        if (res?.data?.data?.data) {
          getDetailByOne({ isShowSuccess: true });
        }
      })
      .catch(() => {
        Loading.hide();
      });
  };

  return (
    <div style={{ backgroundColor: '#fff', padding: '5px' }}>
      <div>
        <Filter
          filterData={formik.values.filterData}
          setFieldValue={setFieldValue}
          getDetailData={getDetailData}
        />
      </div>

      <div style={{ padding: '10px 0px', display: 'flex' }}>
        <AntTabs
          style={{ paddingLeft: 0 }}
          value={tabValue}
          onChange={(e, v) => {
            setTabValue(v);
          }}
          textColor="primary"
        >
          <AntTab label="Equipment" value="Equipment" />
          <AntTab label="Port Connection" value="Port Connection" />
          {/* <AntTab label="Port Assignment" value="Port Assignment" /> */}
        </AntTabs>
        {tabValue === 'Port Connection' && (
          <span style={{ paddingTop: '10px', marginLeft: 'auto' }}>
            <ActionLog />
          </span>
        )}
        {tabValue === 'Port Connection' && (
          <IconButton onClick={handleOpenDataPort}>
            {!openDataPort ? <ArrowBack /> : <ArrowForward />}
          </IconButton>
        )}
      </div>

      <div>
        {tabValue === 'Equipment' && (
          <EquipmentTab
            setFieldValue={setFieldValue}
            history={history}
            baseData={baseData}
            maintenance={maintenance}
            closet={closet}
            modules={modules}
            statusList={statusList}
            cabinets={cabinets}
            cabinetPowerList={cabinetPowerList}
            handleChange={handleChange}
            getCabinetPower={getCabinetPower}
            handleSave={handleSave}
            getDetailByOne={getDetailByOne}
            freshData={freshData}
          />
        )}
        {tabValue === 'Port Connection' && (
          <PortConnectionTab
            setFieldValue={setFieldValue}
            history={history}
            baseData={baseData}
            statusList={statusList}
            openDataPort={openDataPort}
          />
        )}
        {tabValue === 'Port Assignment' && <PortAssignmentTab />}
      </div>
    </div>
  );
}
