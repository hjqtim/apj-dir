import _ from 'lodash';
import { useSelector } from 'react-redux';
import { validIp } from '../../../../utils/tools';

const useValidationApprove = (staticIPData = [], DHCPReservedData = [], DHCPRangeData = []) => {
  const errors = {
    staticError: [],
    reserverError: [],
    rangeError: []
  };

  const ipListSet = useSelector((state) => state.IPAdreess.ipListSet) || {};

  // 所有的ipAdress
  const ipAddressList = [];

  staticIPData.forEach((item) => {
    let ipAddress = '';
    if (item.subnetSelected && _.isNumber(parseInt(item.ipaddressLast))) {
      ipAddress = `${item.subnetSelected}.${item.ipaddressLast}`;
    }
    if (ipAddress) ipAddressList.push(ipAddress);
  });
  DHCPReservedData.forEach((item) => {
    let ipAddress = '';
    if (item.subnetSelected && _.isNumber(parseInt(item.ipaddressLast))) {
      ipAddress = `${item.subnetSelected}.${item.ipaddressLast}`;
    }
    if (ipAddress) ipAddressList.push(ipAddress);
  });
  DHCPRangeData.forEach((item) => {
    let ipAddress = '';
    const { rangeFrom, rangeTo, subnetSelected } = item;
    if (rangeFrom <= rangeTo) {
      new Array(rangeTo - rangeFrom + 1).fill('').forEach((_, index) => {
        ipAddress = `${subnetSelected}.${rangeFrom + index}`;
        ipAddressList.push(ipAddress);
      });
    }
  });

  const isExitIp = (ip) => ipAddressList.filter((item) => item === ip).length > 1;

  //   static ↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓

  staticIPData.forEach((item) => {
    const errorObj = {};

    const ip = `${item.subnetSelected}.${item.ipaddressLast}`;

    const currentIPIsExit = ipListSet?.[ip];

    if (!item.subnetSelected) errorObj.subnetSelected = true;

    if (!item.bit) errorObj.bit = true;

    if (
      !item.ipaddressLast ||
      isExitIp(ip) ||
      (currentIPIsExit !== undefined && validIp(ip) && currentIPIsExit)
    )
      errorObj.ipaddressLast = true;

    if (!item.subnetMask || !validIp(item.subnetMask)) errorObj.subnetMask = true;

    if (!item.gateway || !validIp(item.gateway)) errorObj.gateway = true;

    errors.staticError.push(errorObj);
  });

  //   Reserved ↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓

  DHCPReservedData.forEach((item) => {
    const errorObj = {};

    const ip = `${item.subnetSelected}.${item.ipaddressLast}`;

    const currentIPIsExit = ipListSet?.[ip];

    if (!item.subnetSelected) errorObj.subnetSelected = true;

    if (!item.bit) errorObj.bit = true;

    if (
      !item.ipaddressLast ||
      isExitIp(ip) ||
      (currentIPIsExit !== undefined && validIp(ip) && currentIPIsExit)
    )
      errorObj.ipaddressLast = true;

    if (!item.subnetMask || !validIp(item.subnetMask)) errorObj.subnetMask = true;

    if (!item.gateway || !validIp(item.gateway)) errorObj.gateway = true;

    errors.reserverError.push(errorObj);
  });

  //   DHCPRange ↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓

  DHCPRangeData.forEach((item) => {
    const errorObj = {};

    const { rangeFrom, rangeTo, subnetSelected } = item;

    const currentIPList = [];

    let ipAddress = '';

    // 判断是否重复
    let isExit = false;

    if (rangeFrom <= rangeTo) {
      new Array(rangeTo - rangeFrom + 1).fill('').forEach((_, index) => {
        ipAddress = `${subnetSelected}.${rangeFrom + index}`;
        currentIPList.push(ipAddress);
      });
    }
    currentIPList?.find((item) => {
      isExit = isExitIp(item);
      return isExit;
    });

    if (!item.subnetSelected) errorObj.subnetSelected = true;

    if (!item.rangeFrom || !item.rangeTo || isExit) errorObj.rangeFrom = true;
    errors.rangeError.push(errorObj);
  });
  return errors;
};

export default useValidationApprove;
