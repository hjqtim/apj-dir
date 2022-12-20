import React, { memo, useEffect, useState } from 'react';
import { Resizable } from 're-resizable';
import { makeStyles, IconButton } from '@material-ui/core';
import { DoubleArrow } from '@material-ui/icons';
import { useFormik } from 'formik';
import { useSelector, useDispatch } from 'react-redux';
import AntTab from '../../../../components/CustomizeMuiComponent/AntTab';
import AntTabs from '../../../../components/CustomizeMuiComponent/AntTabs';
import PortConnectionModule from './PortConnection/PortConnectionModule';
import Outlet from './PortConnection/Outlet';
import ApConnection from './PortConnection/ApConnection';
import { CommonTip } from '../../../../components';
import webdpAPI from '../../../../api/webdp/webdp';
import { setConnectPortSelectItem } from '../../../../redux/networkCloset/network-closet-actions';

const antTabsHeight = '130px';
const useStyles = makeStyles((theme) => ({
  main: {
    display: 'flex',
    height: `calc(100vh - 195px - ${antTabsHeight})`,
    minHeight: '300px',
    width: '100%',
    '& .closet-cell-edit': {
      background: 'url("/static/img/svg/tick.svg") no-repeat',
      backgroundSize: '10px 10px',
      backgroundPosition: '100% 0'
    }
  },
  action: {
    width: '50px',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center'
  },
  button: {
    margin: theme.spacing(0.5, 0)
  },
  transform: {
    transform: 'rotate(180deg)'
  },
  dataPort: {
    flexGrow: 1
  }
}));

const PortConnectionTab = (props) => {
  const { baseData, openDataPort, statusList } = props;
  const [tabValue, setTabValue] = useState('outlet');
  const { equipid, closetid } = baseData;
  const dispatch = useDispatch();
  const portCheckbox = useSelector((state) => state.networkCloset.connectPortSelectItem);

  const classes = useStyles();
  const dataPortWidth = '50%';

  const formik = useFormik({
    initialValues: {
      outletStatusList: [],
      polarityStatusList: [],
      outletTypeList: [],
      duplexList: [],
      vlanList: [],
      modules: [],
      portSecurityList: [],
      portTypeList: [],
      equipmentIpList: [],
      portUsageList: [],
      portAssignStatusList: [],
      connectPsuList: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
      connectTypeList: ['L2', 'L3'],
      connectPortList: [], // Port Connection左边列表
      outletList: [], // 右边outlet列表
      backboneList: [], // 右边backbone列表
      apList: [],
      isRefresh: false
    }
  });

  const { setFieldValue } = formik;
  const allData = formik.values;
  const { apList } = allData;

  useEffect(() => {
    if (!statusList.length) {
      return;
    }

    const tempOutletStatusList = [];
    const tempPolarityStatusList = [];
    const tempOutletTypeList = [];
    const tempDuplexList = [];
    const tempVlanList = [];
    const tempPortSecurityList = [];
    const tempPortTypeList = [];
    const tempPortUsageList = [];
    const tempPortAssignStatusList = [];
    statusList.forEach((item) => {
      if (item.optionType === 'OutletStatus') {
        tempOutletStatusList.push(item);
      } else if (item.optionType === 'OutletPolarity') {
        tempPolarityStatusList.push(item);
      } else if (item.optionType === 'OutletType') {
        tempOutletTypeList.push(item);
      } else if (item.optionType === 'OutletDuplex') {
        tempDuplexList.push(item);
      } else if (item.optionType === 'OutletVLAN') {
        tempVlanList.push(item);
      } else if (item.optionType === 'PortSecurity') {
        tempPortSecurityList.push(item);
      } else if (item.optionType === 'PortType') {
        tempPortTypeList.push(item);
      } else if (item.optionType === 'PortUsage') {
        tempPortUsageList.push(item);
      } else if (item.optionType === 'PortAssignStatus') {
        tempPortAssignStatusList.push(item);
      }
    });

    setFieldValue('outletStatusList', tempOutletStatusList);
    setFieldValue('polarityStatusList', tempPolarityStatusList);
    setFieldValue('outletTypeList', tempOutletTypeList);
    setFieldValue('duplexList', tempDuplexList);
    setFieldValue('vlanList', tempVlanList);
    setFieldValue('portSecurityList', tempPortSecurityList);
    setFieldValue('portTypeList', tempPortTypeList);
    setFieldValue('portUsageList', tempPortUsageList);
    setFieldValue('portAssignStatusList', tempPortAssignStatusList);
  }, [statusList]);

  const handleAllLeft = () => {
    // console.log('move left');
  };

  const handleAllRight = () => {
    const deleteParam = [];
    portCheckbox.forEach((item) => {
      if (item?.outletid) {
        deleteParam.push({ id: item.id, outletid: item.outletid });
      }
    });
    if (deleteParam.length) {
      deletePort(deleteParam);
    }
  };

  // 删除port connection
  const deletePort = (params) => {
    webdpAPI
      .deleteConnectPort(params)
      .then((res) => {
        const result = res?.data?.data?.result || false;
        if (result) {
          setFieldValue('isRefresh', !allData.isRefresh);
          dispatch(setConnectPortSelectItem([]));
          CommonTip.success('Success', 1000);
        }
      })
      .finally(() => {
        // console.log('outlet');
      });
  };

  const getConnectPortList = (params) => {
    webdpAPI
      .getConnectPorts(params)
      .then((res) => {
        const newData = res?.data?.data?.ports || [];
        setFieldValue('connectPortList', newData);
      })
      .finally(() => {
        // console.log('done');
      });
  };

  const getWoOutletList = (closetID, type, setField) => {
    const queryParams = {
      closetID,
      type
    };
    webdpAPI
      .getWoOutlet(queryParams)
      .then((res) => {
        const outletData = res?.data?.data?.outletLists || [];
        setFieldValue(setField, outletData);
      })
      .finally(() => {
        // console.log('outlet');
      });
  };

  const getEquipmentIpList = (params) => {
    webdpAPI
      .getEquipmentIp(params)
      .then((res) => {
        const ipList = res?.data?.data?.data || [];
        setFieldValue('equipmentIpList', ipList);
      })
      .finally(() => {
        // console.log('outlet');
      });
  };

  useEffect(() => {
    getEquipmentIpList({ closetID: closetid });
  }, [closetid]);

  useEffect(() => {
    if (equipid) {
      const queryParams = {
        equipId: equipid
      };
      getConnectPortList(queryParams);
    }

    if (closetid) {
      getWoOutletList(closetid, 'outlet', 'outletList');
      getWoOutletList(closetid, 'backbone', 'backboneList');
    }
  }, [equipid, closetid, allData.isRefresh]);

  const hasOutletidSelect = portCheckbox.filter((item) => item?.outletid);

  return (
    <div className={classes.main}>
      {/* Port Connection */}
      <Resizable
        enable={{ right: true }}
        style={{
          flex: 1
        }}
        defaultSize={{
          width: '50%',
          height: '100%'
        }}
        maxWidth="100%"
        minWidth="220px"
      >
        <PortConnectionModule {...props} {...allData} setFieldValue={setFieldValue} />
      </Resizable>

      <div className={classes.action} style={{ display: !openDataPort ? 'none' : 'flex' }}>
        <IconButton onClick={handleAllRight} disabled={hasOutletidSelect.length === 0}>
          <DoubleArrow
            color="secondary"
            style={{ color: hasOutletidSelect.length ? '#229FFA' : '#eee' }}
          />
        </IconButton>
        <IconButton onClick={handleAllLeft} disabled>
          <DoubleArrow color="secondary" style={{ color: '#eee' }} className={classes.transform} />
        </IconButton>
      </div>

      {/*  Data Port W/O */}
      <div
        style={{
          width: dataPortWidth,
          display: !openDataPort ? 'none' : 'flex',
          flexDirection: 'column'
        }}
      >
        <div
          style={{ color: '#078080', fontSize: '16px', paddingLeft: '4px', marginBottom: '3px' }}
        >
          <strong>Data Port W/O Connection</strong>
        </div>

        <div style={{ flex: 1 }}>
          {tabValue === 'outlet' && (
            <Outlet {...props} {...allData} type="outlet" setFieldValue={setFieldValue} />
          )}
          {tabValue === 'backbone' && (
            <Outlet {...props} {...allData} type="backbone" setFieldValue={setFieldValue} />
          )}
          {tabValue === 'AP connection' && (
            <ApConnection
              {...props}
              apList={apList}
              baseData={baseData}
              ouletSelectItem={allData.ouletSelectItem}
              setFieldValue={setFieldValue}
              isRefresh={allData.isRefresh}
            />
          )}
        </div>

        <div>
          <AntTabs
            value={tabValue}
            onChange={(e, v) => {
              setTabValue(v);
            }}
            textColor="primary"
          >
            <AntTab label="Outlet" value="outlet" />
            <AntTab label="Backbone" value="backbone" />
            <AntTab label="AP connection" value="AP connection" />
          </AntTabs>
        </div>
      </div>
    </div>
  );
};

export default memo(PortConnectionTab);
