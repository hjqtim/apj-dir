import { CommonTip } from '../../components';
// Verify mailbox
const validEmail = (emailStr) => /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(emailStr);

// formatter money
const formatterMoney = (value) => {
  const data = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(parseFloat(value || 0));

  let str;
  if (value < 0) {
    str = `-HK$ ${data.split('').slice(2).join('')}`;
  } else {
    str = `HK$ ${data.split('').slice(1).join('')}`;
  }
  return str;
};

// Calculate the sum of a set of attributes
const countTotal = (arr, keyName) => {
  let total = 0;
  total = arr?.reduce(
    (total, currentValue) => (currentValue[keyName] ? total + currentValue[keyName] : total),
    0
  );
  return total;
};

// 验证不通过的提示
const handleValidation = () => {
  CommonTip.warning('Please complete the required field first.');
};

const dateFormat = 'YYYY-MM-DD HH:mm:ss'; // 保存数据时日期格式

const dateFormatShow = 'DD-MMM-YYYY HH:mm:ss'; // 显示在页面的日期格式

const shortDateFormat = 'DD-MMM-YYYY';

const textFieldProps = { variant: 'outlined', fullWidth: true, size: 'small' };

const validIp = (ip) =>
  /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/.test(
    ip
  );

const validSubnet = (ip) =>
  /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(0)$/.test(
    ip
  );
const validSubnet2 = (ip) =>
  /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{0}[0])$/.test(
    ip
  );

const validMacAddress = (mac) => {
  const macReg = /^[0-9a-f]{2}(:[0-9a-f]{2}){5}$/i;
  const macReg2 = /^[0-9a-f]{2}(-[0-9a-f]{2}){5}$/i;
  return macReg.test(mac) || macReg2.test(mac);
};

const bitForSubnet = {
  16: [255, 255, 0, 0],
  17: [255, 255, 128, 0],
  18: [255, 255, 192, 0],
  19: [255, 255, 224, 0],
  20: [255, 255, 240, 0],
  21: [255, 255, 248, 0],
  22: [255, 255, 252, 0],
  23: [255, 255, 254, 0],
  24: [255, 255, 255, 0],
  25: [255, 255, 255, 128],
  26: [255, 255, 255, 192],
  27: [255, 255, 255, 224],
  28: [255, 255, 255, 240],
  29: [255, 255, 255, 248],
  30: [255, 255, 255, 252],
  31: [255, 255, 255, 254],
  32: [255, 255, 255, 255]
};

// 排序医院
const handleSortHospital = (list = []) => {
  const newHospitalList = [...list];
  // 去除特殊符号后排序
  newHospitalList.sort((a, b) =>
    `${a.hospital}${a.hospitalName}`
      .replace(/[() /-]/g, '')
      ?.localeCompare(`${b.hospital}${b.hospitalName}`.replace(/[() /-]/g, ''))
  );
  return newHospitalList;
};

export {
  validEmail,
  formatterMoney,
  countTotal,
  dateFormat,
  dateFormatShow,
  handleValidation,
  textFieldProps,
  shortDateFormat,
  validMacAddress,
  validSubnet,
  validSubnet2,
  validIp,
  bitForSubnet,
  handleSortHospital
};
