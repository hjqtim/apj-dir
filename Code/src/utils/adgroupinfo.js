import {
  SENSE_UR,
  SENSE_RF,
  SENSE_PO,
  SENSE_DP,
  SENSE_ND,
  SENSE_AP,
  SENSE_EN,
  SENSE_VM,
  SENSE_ODC,
  SENSE_ADM
} from './constant';

const G_SENSE_UR = SENSE_UR.split(','); // 0 SENSE User
const G_SENSE_RF = SENSE_RF.split(','); // 1 N3 Request Form Admin
const G_SENSE_PO = SENSE_PO.split(','); // 2 N3 Procurement Admin
const G_SENSE_DP = SENSE_DP.split(','); // 3 N3 DP Admin
const G_SENSE_ND = SENSE_ND.split(','); // 4 N3 Network Designer
const G_SENSE_AP = SENSE_AP.split(','); // 5 N4 AP support
const G_SENSE_EN = SENSE_EN.split(','); // 6 N5 External Network Support
const G_SENSE_VM = SENSE_VM.split(','); // 7 T2 Linux VM Provisionning Support
const G_SENSE_ODC = SENSE_ODC.split(','); // 8 For APJ developer
const G_SENSE_ADM = SENSE_ADM.split(','); // 9 SENSE Admin

const adGroupinfo = (groupList) => {
  let groupNameArr = [];
  if (groupList?.length > 0) {
    for (let i = 0; i < groupList.length; i += 1) {
      const groupName = groupList[i].name;
      const groupNameArr1 = G_SENSE_UR.filter((item) => item === groupName);
      const groupNameArr2 = G_SENSE_RF.filter((item) => item === groupName);
      const groupNameArr3 = G_SENSE_PO.filter((item) => item === groupName);
      const groupNameArr4 = G_SENSE_DP.filter((item) => item === groupName);
      const groupNameArr5 = G_SENSE_ND.filter((item) => item === groupName);
      const groupNameArr6 = G_SENSE_AP.filter((item) => item === groupName);
      const groupNameArr7 = G_SENSE_EN.filter((item) => item === groupName);
      const groupNameArr8 = G_SENSE_VM.filter((item) => item === groupName);
      const groupNameArr9 = G_SENSE_ODC.filter((item) => item === groupName);
      const groupNameArr10 = G_SENSE_ADM.filter((item) => item === groupName);

      if (groupNameArr1.length > 0) {
        groupNameArr = groupNameArr1;
        break;
      }
      if (groupNameArr2.length > 0) {
        groupNameArr = groupNameArr2;
        break;
      }
      if (groupNameArr3.length > 0) {
        groupNameArr = groupNameArr3;
        break;
      }
      if (groupNameArr4.length > 0) {
        groupNameArr = groupNameArr4;
        break;
      }
      if (groupNameArr5.length > 0) {
        groupNameArr = groupNameArr5;
        break;
      }
      if (groupNameArr6.length > 0) {
        groupNameArr = groupNameArr6;
        break;
      }
      if (groupNameArr7.length > 0) {
        groupNameArr = groupNameArr7;
        break;
      }
      if (groupNameArr8.length > 0) {
        groupNameArr = groupNameArr8;
        break;
      }
      if (groupNameArr9.length > 0) {
        groupNameArr = groupNameArr9;
        break;
      }
      if (groupNameArr10.length > 0) {
        groupNameArr = groupNameArr10;
        break;
      }
    }
    return groupNameArr;
  }
  return groupNameArr;
};

export { adGroupinfo };
