import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core';
import { useSelector, useDispatch } from 'react-redux';
import { Resizable } from 're-resizable';
//
import Closet from './components/Closet';
import Cabinet from './components/Cabinet';
import CabinetPower from './components/CabinetPower';
import AntTab from '../../../components/CustomizeMuiComponent/AntTab';
import AntTabs from '../../../components/CustomizeMuiComponent/AntTabs';
import Equipment from './components/Equipment';
import Outlet from './components/Outlet';
import Backbone from './components/Backbone';
import NCSModule from './components/NCSModule';
import ActionLog from './components/ActionLog';
import {
  recoverRedux,
  setTabValue,
  setStatusList
} from '../../../redux/networkCloset/network-closet-actions';
import webdpAPI from '../../../api/webdp/webdp';

const actionLogHeight = '30px';

const useStyles = makeStyles(() => ({
  root: {
    width: '100%',
    backgroundColor: '#fff',
    display: 'block',
    '& .closet-cell-edit': {
      background: 'url("/static/img/svg/tick.svg") no-repeat',
      backgroundSize: '10px 10px',
      backgroundPosition: '100% 0'
    },
    '& .my-table-active-color': {
      backgroundColor: '#F5F5F5'
    }
  },
  main: {
    display: 'flex',
    height: `calc(100vh - 195px - ${actionLogHeight})`,
    minHeight: '600px',
    width: '100%'
  }
}));

const NetworkCloset = () => {
  const dispatch = useDispatch();
  const classes = useStyles();
  const borderWidth = '2px';
  const borderStyle = 'solid';
  const bordrColor = '#ddd';

  const tabValue = useSelector((state) => state.networkCloset.tabValue);
  const [topHeight, setTopHeight] = useState('33%'); // 头部高度
  const [middleHeight, setHiddleHeight] = useState('33%'); // 中间部分的高度

  // 关闭左侧menu
  useEffect(() => {
    const action = {
      type: 'global/setIsShowMenu',
      payload: false
    };
    dispatch(action);
  }, []);

  // 销毁时清空redux恢复默认值
  useEffect(() => {
    console.log();
    return () => {
      console.log();
      dispatch(recoverRedux());
    };
  }, []);

  // 获取status列表
  const getClosetStatusOptions = () => {
    webdpAPI.getOptionList().then((res) => {
      dispatch(setStatusList(res?.data?.data?.optionTypeList || []));
    });
  };

  useEffect(() => {
    getClosetStatusOptions();
  }, []);

  return (
    <div className={classes.root}>
      <div style={{ height: actionLogHeight }}>
        <ActionLog />
      </div>
      <div className={classes.main}>
        <Resizable
          enable={{ right: true }}
          style={{
            borderRightWidth: borderWidth,
            borderRightStyle: borderStyle,
            borderRightColor: bordrColor
          }}
          defaultSize={{
            width: '420px',
            height: '100%'
          }}
          maxWidth="100%"
          minWidth="420px"
        >
          <Closet />
        </Resizable>
        <div
          style={{
            display: 'flex',
            // width: '100%',
            flex: 1,
            minWidth: '1px',
            flexDirection: 'column'
          }}
        >
          <Resizable
            onResizeStop={(e, direction, ref) => {
              setTopHeight(ref.style.height);
            }}
            enable={{ bottom: true }}
            style={{
              display: 'flex',
              borderBottomWidth: borderWidth,
              borderBottomStyle: borderStyle,
              borderBottomColor: bordrColor
            }}
            size={{ width: '100%', height: topHeight }}
            maxWidth="100%"
            minWidth="1"
          >
            <Resizable
              enable={{ right: true }}
              defaultSize={{
                width: '50%',
                height: '100%',
                flex: 1
              }}
              maxWidth="100%"
              minWidth="1"
            >
              <Cabinet />
            </Resizable>
            <div
              style={{
                // width: '50%',
                flex: 1,
                borderLeftWidth: borderWidth,
                borderLeftStyle: borderStyle,
                borderLeftColor: bordrColor
              }}
            >
              <CabinetPower />
            </div>
          </Resizable>
          <Resizable
            onResizeStop={(e, direction, ref) => {
              setHiddleHeight(ref.style.height);
            }}
            enable={{ bottom: true }}
            style={{
              borderBottomWidth: borderWidth,
              borderBottomStyle: borderStyle,
              borderBottomColor: bordrColor,
              display: 'flex',
              flexDirection: 'column'
            }}
            size={{ width: '100%', height: middleHeight }}
            maxWidth="100%"
            minWidth="1"
          >
            <div>
              <AntTabs
                value={tabValue}
                onChange={(e, v) => {
                  dispatch(setTabValue(v));
                  if (v === 'equipment') {
                    setTopHeight('33%');
                    setHiddleHeight('33%');
                  } else if (tabValue === 'equipment') {
                    setTopHeight('50%');
                    setHiddleHeight('50%');
                  }
                }}
                textColor="primary"
              >
                <AntTab label="Equipment" value="equipment" />
                <AntTab label="Outlet" value="outlet" />
                <AntTab label="Backbone" value="backbone" />
              </AntTabs>
            </div>
            <div style={{ flex: 1 }}>
              {tabValue === 'equipment' && <Equipment />}
              {tabValue === 'outlet' && <Outlet />}
              {tabValue === 'backbone' && <Backbone />}
            </div>
          </Resizable>
          {tabValue === 'equipment' && (
            <div style={{ height: `calc(100% - ${topHeight} - ${middleHeight})` }}>
              <NCSModule />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NetworkCloset;
