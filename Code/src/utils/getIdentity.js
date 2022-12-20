import {
  // SENSE_UR,
  SENSE_RF,
  SENSE_PO,
  SENSE_DP,
  SENSE_ND,
  SENSE_AP,
  SENSE_EN,
  // SENSE_VM,
  SENSE_ODC,
  SENSE_ADM
} from './constant';

// const G_SENSE_UR = SENSE_UR.split(','); // 0 SENSE User
const G_SENSE_RF = SENSE_RF.split(','); // 1 N3 Request Form Admin
const G_SENSE_PO = SENSE_PO.split(','); // 2 N3 Procurement Admin
const G_SENSE_DP = SENSE_DP.split(','); // 3 N3 DP Admin
const G_SENSE_ND = SENSE_ND.split(','); // 4 N3 Network Designer
const G_SENSE_AP = SENSE_AP.split(','); // 5 N4 AP support
const G_SENSE_EN = SENSE_EN.split(','); // 6 N5 External Network Support
// const G_SENSE_VM = SENSE_VM.split(','); // 7 T2 Linux VM Provisionning Support
const G_SENSE_ODC = SENSE_ODC.split(','); // 8 For APJ developer
const G_SENSE_ADM = SENSE_ADM.split(','); // 9 SENSE Admin
// console.log(
//   'Identity',
//   G_SENSE_UR,
//   G_SENSE_RF,
//   G_SENSE_PO,
//   G_SENSE_DP,
//   G_SENSE_ND,
//   G_SENSE_AP,
//   G_SENSE_EN,
//   G_SENSE_VM,
//   G_SENSE_ODC,
//   G_SENSE_ADM
// );

export const getIdentity = (data = {}) => {
  // console.log(
  //   'Identity',
  //   G_SENSE_UR,
  //   G_SENSE_RF,
  //   G_SENSE_PO,
  //   G_SENSE_DP,
  //   G_SENSE_ND,
  //   G_SENSE_AP,
  //   G_SENSE_EN,
  //   G_SENSE_VM,
  //   G_SENSE_ODC,
  //   G_SENSE_ADM
  // );

  let N3GROUP = [];
  N3GROUP = [...N3GROUP, ...G_SENSE_RF];
  N3GROUP = [...N3GROUP, ...G_SENSE_PO];
  N3GROUP = [...N3GROUP, ...G_SENSE_DP];
  N3GROUP = [...N3GROUP, ...G_SENSE_ND];
  N3GROUP = [...N3GROUP, ...G_SENSE_AP];
  N3GROUP = [...N3GROUP, ...G_SENSE_EN];
  // console.log('N3GROUP', N3GROUP);

  const identity = {
    isN3: false,
    isN4: false,
    isN5: false,
    isRF: false,
    isODC: false
  };

  data.groupList?.forEach((item) => {
    // if (['sense_admin', 'HO IT&HI ISD SENSE Support'].includes(item.name)) {
    if (G_SENSE_ADM.includes(item.name)) {
      identity.isN3 = true;
      identity.isN4 = true;
      identity.isN5 = true;
      identity.isRF = true;
      identity.isODC = true;
    }

    // if (
    //   [
    //     'sense_RF-support',
    //     'HO IT&HI ISD SENSE - RF Support',
    //     'sense_PO-support',
    //     'HO IT&HI ISD SENSE - PO Support',
    //     'sense_DP-support',
    //     'HO IT&HI ISD SENSE - DP Support',
    //     'sense_ND-support',
    //     'HO IT&HI ISD SENSE - ND Support'
    //   ].includes(item.name)
    // ) {
    if (N3GROUP.includes(item.name)) {
      identity.isN3 = true;
    }

    // if (['sense_EN-support', 'HO IT&HI ISD SENSE - EN Support'].includes(item.name)) {
    if (G_SENSE_EN.includes(item.name)) {
      identity.isN5 = true;
    }

    // if (['sense_AP-support', 'HO IT&HI ISD SENSE - AP Support'].includes(item.name)) {
    if (G_SENSE_AP.includes(item.name)) {
      identity.isN4 = true;
    }

    // if (['sense_RF-support', 'HO IT&HI ISD SENSE - RF Support'].includes(item.name)) {
    if (G_SENSE_RF.includes(item.name)) {
      identity.isRF = true;
    }

    // if (['senseodc', 'HO IT&HI ISD SENSE Developers'].includes(item.name)) {
    if (G_SENSE_ODC.includes(item.name)) {
      identity.isODC = true;
    }
  });

  return identity;
};
