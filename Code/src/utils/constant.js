const ACTIVITI_HOST =
  process.env.REACT_APP_ENV === 'production'
    ? process.env.REACT_APP_BASE_API
    : 'http://127.0.0.1:8888';

const API_HOST = process.env.REACT_APP_BASE_API;

const BASE_VER =
  process.env.REACT_APP_ENV === 'production' ? process.env.REACT_APP_BASE_VER : 'DEV';

const BASE_VES =
  process.env.REACT_APP_ENV === 'production'
    ? process.env.REACT_APP_BASE_VES
    : `${new Date().getFullYear()}${
        new Date().getMonth() + 1
      }${new Date().getDate()}${new Date().getHours()}${new Date().getMinutes()}`;

// NMS_Responsible staff
const SENSE_NMSRS =
  process.env.REACT_APP_ENV === 'production'
    ? process.env.REACT_APP_NMSRS
    : 'HO IT&HI ISD SENSE - Project Support,sense_Project-support';

// USER
const SENSE_UR =
  process.env.REACT_APP_ENV === 'production'
    ? process.env.REACT_APP_USER
    : 'HO IT&HI ISD SENSE - Testers,TEST';

// N3
const SENSE_RF =
  process.env.REACT_APP_ENV === 'production'
    ? process.env.REACT_APP_N3RF
    : 'sense_RF-support,RF-support';

const SENSE_PO =
  process.env.REACT_APP_ENV === 'production' ? process.env.REACT_APP_N3PO : 'sense_PO-support';

const SENSE_DP =
  process.env.REACT_APP_ENV === 'production' ? process.env.REACT_APP_N3DP : 'sense_DP-support';

const SENSE_ND =
  process.env.REACT_APP_ENV === 'production' ? process.env.REACT_APP_N3ND : 'sense_ND-support';

// N4
const SENSE_AP =
  process.env.REACT_APP_ENV === 'production' ? process.env.REACT_APP_N4AP : 'sense_AP-support';

// N5
const SENSE_EN =
  process.env.REACT_APP_ENV === 'production' ? process.env.REACT_APP_N5EN : 'sense_EN-support';

// VM
const SENSE_VM =
  process.env.REACT_APP_ENV === 'production' ? process.env.REACT_APP_T2VM : 'sense_VM-support';

// Admin
const SENSE_ADM =
  process.env.REACT_APP_ENV === 'production' ? process.env.REACT_APP_ADMIN : 'sense_admin';

// DEV
const SENSE_ODC =
  process.env.REACT_APP_ENV === 'production' ? process.env.REACT_APP_ODCV : 'senseodc';

// console.log('Yancy ENV', process.env);

export {
  ACTIVITI_HOST,
  API_HOST,
  BASE_VER,
  BASE_VES,
  SENSE_NMSRS,
  SENSE_UR,
  SENSE_RF,
  SENSE_PO,
  SENSE_DP,
  SENSE_ND,
  SENSE_AP,
  SENSE_EN,
  SENSE_VM,
  SENSE_ADM,
  SENSE_ODC
};
