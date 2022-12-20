import TYPES from './network-closet-action-types';

// 修改医院下拉列表
export const setHospital = (payload) => ({
  type: TYPES.SET_HOSPITAL,
  payload
});

// 修改选中的医院
export const setSelectHospital = (payload) => ({
  type: TYPES.SET_SELECT_HOSPITAL,
  payload
});

// 修改closet id
export const setFilterClosetId = (payload) => ({
  type: TYPES.SET_FILTER_CLOSET_ID,
  payload
});

export const setCloseMenu = (payload) => ({
  type: TYPES.SET_CLOSE_MENU,
  payload
});

// redux恢复默认值
export const recoverRedux = () => ({
  type: TYPES.RECOVER_REDUX
});

export const setTabValue = (payload) => ({
  type: TYPES.SET_TAB_VALUE,
  payload
});

export const setClosetList = (payload) => ({
  type: TYPES.SET_CLOSET_LIST,
  payload
});

export const setStatusList = (payload) => ({
  type: TYPES.SET_STATUS_LIST,
  payload
});

export const setCabinetTableData = (payload) => ({
  type: TYPES.SET_CABINET_TABLE_LIST,
  payload
});

export const setClosetSelectItem = (payload) => ({
  type: TYPES.SET_CLOSET_SELECT_ITEM,
  payload
});

export const setCabinetSelectItem = (payload) => ({
  type: TYPES.SET_CABINET_SELECT_ITEM,
  payload
});

export const setCabinetPowerList = (payload) => ({
  type: TYPES.SET_CABINET_POWER_LIST,
  payload
});

export const setEquipmentList = (payload) => ({
  type: TYPES.SET_EQUIPMENT_LIST,
  payload
});

export const setOutletList = (payload) => ({
  type: TYPES.SET_OUTLET_LIST,
  payload
});

export const setBackboneList = (payload) => ({
  type: TYPES.SET_BACKBONE_LIST,
  payload
});

export const setModuleList = (payload) => ({
  type: TYPES.SET_MODULE_LIST,
  payload
});

export const setCabinetPowerItem = (payload) => ({
  type: TYPES.SET_CABINET_POWER_ITEM,
  payload
});

export const setEquipmentSelectItem = (payload) => ({
  type: TYPES.SET_EQUIPMENT_SELECT_ITEM,
  payload
});

export const setNCSBlockList = (payload) => ({
  type: TYPES.SET_NCS_BLOCK_LIST,
  payload
});

export const setClosetHistory = (payload) => ({
  type: TYPES.SET_CLOSET_HISTORY,
  payload
});

export const closetRollbackOne = (payload) => ({
  type: TYPES.CLOSET_ROLLBACK_ONE,
  payload
});

export const closetRollbackAll = (payload) => ({
  type: TYPES.CLOSET_ROLLBACK_All,
  payload
});

export const clearClosetHistory = (payload) => ({
  type: TYPES.CLEAR_CLOSET_HISTORY,
  payload
});

export const setCabinettHistory = (payload) => ({
  type: TYPES.SET_CABINET_HISTORY,
  payload
});

export const cabinetRollbackOne = (payload) => ({
  type: TYPES.CABINET_ROLLBACK_ONE,
  payload
});

export const clearCabinetHistory = (payload) => ({
  type: TYPES.CLEAR_CABINET_HISTORY,
  payload
});

export const cabinetRollbackAll = (payload) => ({
  type: TYPES.CABINET_ROLLBACK_All,
  payload
});

export const setCabinettPowerHistory = (payload) => ({
  type: TYPES.SET_CABINET_POWER_HISTORY,
  payload
});

export const cabinetPowerRollbackOne = (payload) => ({
  type: TYPES.CABINET_POWER_ROLLBACK_ONE,
  payload
});

export const cabinetPowerRollbackAll = (payload) => ({
  type: TYPES.CABINET_POWER_ROLLBACK_All,
  payload
});

export const setEquipmentHistory = (payload) => ({
  type: TYPES.SET_EQUIPMENT_HISTORY,
  payload
});

export const equipmentRollbackOne = (payload) => ({
  type: TYPES.EQUIPMENT_ROLLBACK_ONE,
  payload
});

export const equipmentRollbackAll = (payload) => ({
  type: TYPES.EQUIPMENT_ROLLBACK_All,
  payload
});

export const setOutletHistory = (payload) => ({
  type: TYPES.SET_OUTLET_HISTORY,
  payload
});

export const outletRollbackOne = (payload) => ({
  type: TYPES.OUTLET_ROLLBACK_ONE,
  payload
});

export const outletRollbackAll = (payload) => ({
  type: TYPES.OUTLET_ROLLBACK_All,
  payload
});

export const setBackboneHistory = (payload) => ({
  type: TYPES.SET_BACKBONE_HISTORY,
  payload
});

export const backboneRollbackOne = (payload) => ({
  type: TYPES.BACKBONE_ROLLBACK_ONE,
  payload
});

export const backboneRollbackAll = (payload) => ({
  type: TYPES.BACKBONE_ROLLBACK_All,
  payload
});

export const clearCabinetPowerHistory = (payload) => ({
  type: TYPES.CLEAR_CABINET_POWER_HISTORY,
  payload
});

export const clearEquipmentHistory = (payload) => ({
  type: TYPES.CLEAR_EQUIPMENT_HISTORY,
  payload
});

export const clearOutletHistory = (payload) => ({
  type: TYPES.CLEAR_OUTLET_HISTORY,
  payload
});

export const clearBackboneHistory = (payload) => ({
  type: TYPES.CLEAR_BACKBONE_HISTORY,
  payload
});

export const setConnectPortHistory = (payload) => ({
  type: TYPES.SET_CONNECT_PORT_HISTORY,
  payload
});

export const setConnectPortSelectItem = (payload) => ({
  type: TYPES.SET_CONNECT_PORT_SELECT_ITEM,
  payload
});

export const setOutletSelectItem = (payload) => ({
  type: TYPES.SET_OUTLET_SELECT_ITEM,
  payload
});
