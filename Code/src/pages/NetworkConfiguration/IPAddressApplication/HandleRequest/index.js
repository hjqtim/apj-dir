import React, { useEffect, useState, memo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import _ from 'lodash';
import { Backdrop, CircularProgress } from '@material-ui/core';
import StaticIP from './StaticIP';
import DHCPRange from './DHCPRange';
import HandleRequestBTN from './HandleRequestBTN';
import {
  staticItemTouch,
  reserverItemTouch,
  rangeItemTouch
} from '../../../../models/ipaddr/TouchModel';
import { setBaseData } from '../../../../redux/IPAdreess/ipaddrActions';

const HandleRequest = () => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const ipRequest = useSelector((state) => state.IPAdreess?.ipRequest) || {};
  const ipRequestDetailsList = useSelector((state) => state?.IPAdreess?.ipRequestDetailsList) || [];
  const formStatus = useSelector((state) => state.IPAdreess.formStatus);
  const staticIPData = useSelector((state) => state.IPAdreess.staticIPData) || [];
  const DHCPReservedData = useSelector((state) => state.IPAdreess.DHCPReservedData) || [];
  // const DHCPRangeData = useSelector((state) => state.IPAdreess.DHCPRangeData) || [];
  // console.log('redux:', formStatus, ipRequestDetailsList);
  const [DHCPRangeData, setDHCPRangeData] = useState([]);
  const [DHCPRangeData2, setDHCPRangeData2] = useState([]);
  const [wrong, setWrong] = useState(false);
  const [saveStatus, setSaveStatus] = useState(false);

  useEffect(() => {
    if (formStatus === 0) {
      // 首次进来构造数据，ipList还未有数据
      dataProcessorSubmitStatus();
    } else if (formStatus === 10 || formStatus === 20) {
      // 经过审批后，ipList已经有数据
      dataProcessorConfirmStatus();
    }
  }, [ipRequest, ipRequestDetailsList]);

  // 来自 审核之后 detail
  const dataProcessorConfirmStatus = () => {
    const itemsList = ipRequestDetailsList;

    let staticList = [];
    let resverList = [];
    let rangeList = [];
    let rangeList2 = [];
    itemsList?.forEach((item) => {
      if (item?.ipType === 'STATIC' || item?.ipType === 'DHCP RESERVED') {
        item?.ipList?.forEach((itemData) => {
          const obj = {
            id: item?.id || '',
            ipType: item?.ipType || '',
            hospital: item?.hospital || '',
            block: item?.block || '',
            floor: item?.floor || '',
            room: item?.room || '',
            isPerm: item?.isPerm || '',
            releaseDate: item?.releaseDate || '',
            computerType: item?.computerType || '',
            purpose: item?.purpose || '',
            dataPortId: item?.dataPortId || '',
            remarks: item?.remarks || '',
            macAddress: item?.macAddress || '',
            ipNumber: item?.ipNumber || 0,
            subnetListAndOneDetail: item?.subnetListAndOneDetail || [],
            subnetSelected: `${itemData?.subnet}` || '',
            bit: itemData?.bit || '',
            subnetMask: itemData?.mask || '',
            gateway: itemData?.gateway || '',
            ipAddress: itemData?.subnet ? `${itemData?.subnet}.` : '',
            ipaddressLast: itemData?.ipAddress?.split('.')?.[3] || ''
          };
          if (item?.ipType === 'STATIC') {
            staticList = [...staticList, obj];
          } else {
            resverList = [...resverList, obj];
          }
        });
      } else {
        const ipList = item?.ipList;
        const tempFrom = ipList[0].ipAddress;
        const tempFromArr = tempFrom.split('.');
        const rangeFrom = tempFromArr[3];
        // console.log('Array ', tempFrom, tempFromArr, rangeFrom);

        const tempTo = ipList[ipList.length - 1].ipAddress;
        const tempToArr = tempTo.split('.');
        const rangeTo = tempToArr[3];
        const subnetSelected2 = item?.subnetListAndOneDetail?.[0]?.newSubnet || '';

        // console.log('subnetSelected', ipList, rangeFrom, rangeTo, subnetSelected2, item);
        rangeList = [
          {
            ...item,
            rangeIpList: ipList || [],
            rangeFrom,
            rangeTo,
            subnetSelected2,
            bit: item?.subnetListAndOneDetail?.[0]?.bit || '',
            saveStatus: ipRequest?.saveStatus
          }
        ];
        rangeList2 = [
          {
            ...item,
            rangeIpList: ipList || [],
            rangeFrom,
            rangeTo,
            subnetSelected: `${subnetSelected2}`,
            subnetSelected2,
            bit: item?.subnetListAndOneDetail?.[0]?.bit || '',
            saveStatus: ipRequest?.saveStatus
          }
        ];
        // console.log('subnetSelected rangeList', rangeList, rangeList2);
      }
    });
    dispatch(setBaseData({ staticIPData: staticList }));
    dispatch(setBaseData({ DHCPReservedData: resverList }));
    // dispatch(setBaseData({ DHCPRangeData: rangeList2 }));
    setDHCPRangeData(rangeList);
    setDHCPRangeData2(rangeList2);
    setSaveStatus(true);
    genTouches(staticList, resverList, rangeList);
  };

  // 提交后 的首次 detail for 审核；
  const dataProcessorSubmitStatus = () => {
    const itemsList = ipRequestDetailsList;
    // console.log('ipRequestDetailsList', ipRequestDetailsList);
    let tempList = [];
    let staticList = [];
    let resverList = [];
    let rangeList = [];
    itemsList?.forEach((item, index) => {
      if (item?.ipType === 'STATIC') {
        const newArr = new Array(item?.ipNumber || 0)
          .fill('')
          .map(() => ({ index, type: 'STATIC' }));
        tempList = [...tempList, ...newArr];
      } else if (item?.ipType === 'DHCP RESERVED') {
        tempList = [...tempList, { index, type: 'DHCP RESERVED' }];
      } else if (item?.ipType === 'DHCP RANGE') {
        // console.log('DHCP RANGE ', item);
        rangeList = [
          // ...rangeList,
          {
            ...item,
            rangeFrom: '',
            rangeTo: '',
            rangeIpList: itemsList[index]?.rangeIpList || [],
            subnetSelected: itemsList[index]?.subnetListAndOneDetail?.[0]?.newSubnet || '',
            bit: itemsList[index]?.subnetListAndOneDetail?.[0]?.bit || '',
            saveStatus: ipRequest?.saveStatus
          }
        ];
        // console.log('DHCP RANGE', rangeList);
      }
    });
    tempList = _.sortBy(tempList, 'type')?.reverse();
    let idx = 0;
    // 当前的类别
    let cunrentType;
    if (tempList.length > 0) {
      cunrentType = `${tempList[0].index + tempList[0].type}`;
    }
    tempList.forEach((item) => {
      const tempType = `${item.index + item.type}`;
      // 不同类型，从0开始
      if (tempType !== cunrentType) {
        idx = 0;
        cunrentType = tempType;
      }
      const curData = itemsList?.[item.index];
      let subnet = curData?.staticIpVoList[0]?.subnet?.split('.') || [];
      subnet.pop();
      subnet = subnet?.join('.') || '';
      if (item?.type === 'STATIC') {
        staticList = [
          ...staticList,
          {
            ...curData,
            ipaddressLast: curData?.staticIpVoList?.[idx]?.canUseIp?.split('.')?.[3] || '',
            subnetSelected: curData?.staticIpVoList[0]?.subnet || '',
            bit: curData?.subnetListAndOneDetail?.[0]?.bit || '',
            ipAddress: subnet ? `${subnet}.` : '',
            subnetMask: curData?.subnetListAndOneDetail?.[0]?.mask || '',
            gateway: subnet ? `${subnet}.254` : ''
          }
        ];
      } else if (item?.type === 'DHCP RESERVED') {
        resverList = [
          ...resverList,
          {
            ...curData,
            ipaddressLast: curData?.staticIpVoList?.[idx]?.canUseIp?.split('.')?.[3] || '',
            subnetSelected: curData?.staticIpVoList[0]?.subnet || '',
            bit: curData?.subnetListAndOneDetail?.[0]?.bit || '',
            ipAddress: subnet ? `${subnet}.` : '',
            subnetMask: curData?.subnetListAndOneDetail?.[0]?.mask || '',
            gateway: subnet ? `${subnet}.254` : ''
          }
        ];
      }
      idx += 1;
    });
    dispatch(setBaseData({ staticIPData: staticList }));
    dispatch(setBaseData({ DHCPReservedData: resverList }));
    dispatch(setBaseData({ DHCPRangeData: resverList }));
    setDHCPRangeData(rangeList);
    setSaveStatus(true);
    genTouches(staticList, resverList, rangeList);
  };

  const genTouches = (staticList, reserverList, rangeList) => {
    const staticTouches = staticList.map(() => staticItemTouch(false));
    const reserverTouches = reserverList.map(() => reserverItemTouch(false));
    const rangeTouches = rangeList.map(() => rangeItemTouch(false));
    dispatch(setBaseData({ staticTouches }));
    dispatch(setBaseData({ reserverTouches }));
    dispatch(setBaseData({ rangeTouches }));
  };

  return (
    <>
      <Backdrop open={isLoading} style={{ zIndex: 999 }} invisible>
        <CircularProgress />
      </Backdrop>
      <div style={{ width: '100%' }}>
        {staticIPData?.length > 0 && <StaticIP isStatic {...{ DHCPRangeData, setIsLoading }} />}

        {DHCPReservedData?.length > 0 && (
          <StaticIP {...{ DHCPRangeData, setIsLoading, isStatic: false }} />
        )}

        {DHCPRangeData.length > 0 && formStatus !== 30 ? (
          <>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                paddingLeft: 5,
                paddingRight: 5,
                background: '#abe1fb',
                border: '2px solid #fff'
              }}
            >
              <div
                style={{
                  marginRight: 15,
                  fontWeight: 'bold',
                  height: 35,
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                DHCP Range{' '}
              </div>
            </div>
            <DHCPRange
              formStatus={formStatus}
              DHCPRangeData={formStatus === 0 ? DHCPRangeData : DHCPRangeData2}
              setDHCPRangeData={setDHCPRangeData}
              setWrong={setWrong}
            />
          </>
        ) : (
          <></>
        )}

        <HandleRequestBTN DHCPRangeData={DHCPRangeData} wrong={wrong} saveStatus={saveStatus} />
      </div>
    </>
  );
};
export default memo(HandleRequest);
