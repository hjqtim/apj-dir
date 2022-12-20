import _ from 'lodash';
import DefaultValue from './DefaultValue';
import TYPES from './network-closet-action-types';

const INITIAL_STATE = DefaultValue();

const networkCloset = (state = INITIAL_STATE, action) => {
  const { type, payload } = action;
  switch (type) {
    case TYPES.SET_HOSPITAL:
      return { ...state, hospitalList: payload };

    case TYPES.SET_SELECT_HOSPITAL:
      return { ...state, selectHospital: payload };

    case TYPES.SET_FILTER_CLOSET_ID:
      return { ...state, closetIdFilter: payload };

    case TYPES.SET_TAB_VALUE:
      return { ...state, tabValue: payload };

    case TYPES.SET_CLOSET_LIST:
      return { ...state, closetList: payload };

    case TYPES.SET_STATUS_LIST:
      return { ...state, statusList: payload };

    case TYPES.SET_CABINET_TABLE_LIST:
      return { ...state, cabinetList: payload };

    case TYPES.SET_CLOSET_SELECT_ITEM:
      return { ...state, closetSelectItem: payload };

    case TYPES.SET_CABINET_SELECT_ITEM:
      return { ...state, cabinetSelectItem: payload };

    case TYPES.SET_CABINET_POWER_LIST:
      return { ...state, cabinetPowerList: payload };

    case TYPES.SET_EQUIPMENT_LIST:
      return { ...state, equipmentList: payload };

    case TYPES.SET_OUTLET_LIST:
      return { ...state, outletList: payload };

    case TYPES.SET_BACKBONE_LIST:
      return { ...state, backboneList: payload };

    case TYPES.SET_MODULE_LIST:
      return { ...state, moduleList: payload };

    case TYPES.SET_CABINET_POWER_ITEM:
      return { ...state, cabinetPowerSelectItem: payload };

    case TYPES.SET_EQUIPMENT_SELECT_ITEM:
      return { ...state, equipmentSelectItem: payload };

    case TYPES.SET_NCS_BLOCK_LIST:
      return { ...state, blockList: payload };

    case TYPES.SET_CLOSET_HISTORY: {
      const newClosetHistory = [...state.closetHistory, payload];
      return { ...state, closetHistory: newClosetHistory };
    }

    case TYPES.CLOSET_ROLLBACK_ONE: {
      const newClosetHistory = [...state.closetHistory];
      const rollbackItem = newClosetHistory.pop(); // 从修改历史数组删除
      const newClosetList = [...state.closetList];
      const index = newClosetList.findIndex((item) => item.id === rollbackItem.id);
      if (index !== -1) {
        newClosetList[index][rollbackItem.field] = rollbackItem.oldValue;
      }

      let newClosetSelectItem = { ...state.closetSelectItem };
      if (newClosetSelectItem.id) {
        const selectItem = newClosetList.find((item) => item.id === newClosetSelectItem.id);
        newClosetSelectItem = selectItem || newClosetSelectItem;
      }

      return {
        ...state,
        closetHistory: newClosetHistory,
        closetSelectItem: newClosetSelectItem,
        closetList: newClosetList
      };
    }

    case TYPES.CLOSET_ROLLBACK_All: {
      const newClosetList = [...state.closetList];
      const newClosetHistory = _.unionBy(state.closetHistory, (item) => `${item.id}${item.field}`);

      newClosetHistory.forEach((item) => {
        const hasItem = newClosetList.find((closetItem) => item.id === closetItem.id);
        if (hasItem) {
          hasItem[item.field] = item.oldValue;
        }
      });

      let newClosetSelectItem = { ...state.closetSelectItem };
      if (newClosetSelectItem.id) {
        const selectItem = newClosetList.find((item) => item.id === newClosetSelectItem.id);
        newClosetSelectItem = selectItem || newClosetSelectItem;
      }

      return {
        ...state,
        closetHistory: [],
        closetSelectItem: newClosetSelectItem,
        closetList: newClosetList
      };
    }

    case TYPES.CLEAR_CLOSET_HISTORY:
      return { ...state, closetHistory: [] };

    case TYPES.SET_CABINET_HISTORY: {
      const newCabinetHistory = [...state.cabinetHistory, payload];
      return { ...state, cabinetHistory: newCabinetHistory };
    }

    case TYPES.CABINET_ROLLBACK_ONE: {
      const newCabinetHistory = [...state.cabinetHistory];
      const rollbackItem = newCabinetHistory.pop(); // 从修改历史数组删除
      const newCabinetList = [...state.cabinetList];
      const hasItem = newCabinetList.find((item) => item.id === rollbackItem.id);
      if (hasItem) {
        hasItem[rollbackItem.field] = rollbackItem.oldValue;
      }

      let newCabinetSelectItem = { ...state.cabinetSelectItem };
      if (newCabinetSelectItem.id) {
        newCabinetSelectItem =
          newCabinetList.find((item) => item.id === newCabinetSelectItem.id) ||
          newCabinetSelectItem;
      }

      return {
        ...state,
        cabinetHistory: newCabinetHistory,
        cabinetSelectItem: newCabinetSelectItem,
        cabinetList: newCabinetList
      };
    }

    case TYPES.CLEAR_CABINET_HISTORY: {
      return { ...state, cabinetHistory: [] };
    }

    case TYPES.CABINET_ROLLBACK_All: {
      const newCabinetList = [...state.cabinetList];

      const newCabinetHistory = _.unionBy(
        state.cabinetHistory,
        (item) => `${item.id}${item.field}`
      );

      newCabinetHistory.forEach((item) => {
        const hasItem = newCabinetList.find((closetItem) => item.id === closetItem.id);
        if (hasItem) {
          hasItem[item.field] = item.oldValue;
        }
      });

      let newCabinetSelectItem = { ...state.cabinetSelectItem };
      if (newCabinetSelectItem.id) {
        const selectItem = newCabinetList.find((item) => item.id === newCabinetSelectItem.id);
        newCabinetSelectItem = selectItem || newCabinetSelectItem;
      }

      return {
        ...state,
        cabinetHistory: [],
        cabinetSelectItem: newCabinetSelectItem,
        cabinetList: newCabinetList
      };
    }

    case TYPES.SET_CABINET_POWER_HISTORY: {
      const newCabinetPowerHistory = [...state.cabinetPowerHistory, payload];
      return { ...state, cabinetPowerHistory: newCabinetPowerHistory };
    }

    case TYPES.CABINET_POWER_ROLLBACK_ONE: {
      const newCabinetPowerHistory = [...state.cabinetPowerHistory];
      const rollbackItem = newCabinetPowerHistory.pop(); // 从修改历史数组删除
      const newCabinetPowerList = [...state.cabinetPowerList];
      const hasItem = newCabinetPowerList.find((item) => item.id === rollbackItem.id);
      if (hasItem) {
        hasItem[rollbackItem.field] = rollbackItem.oldValue;
      }

      let newCabinetPowerSelectItem = { ...state.cabinetPowerSelectItem };
      if (newCabinetPowerSelectItem.id) {
        newCabinetPowerSelectItem =
          newCabinetPowerList.find((item) => item.id === newCabinetPowerSelectItem.id) ||
          newCabinetPowerSelectItem;
      }

      return {
        ...state,
        cabinetPowerHistory: newCabinetPowerHistory,
        cabinetPowerSelectItem: newCabinetPowerSelectItem,
        cabinetPowerList: newCabinetPowerList
      };
    }

    case TYPES.CABINET_POWER_ROLLBACK_All: {
      const newCabinetPowerList = [...state.cabinetPowerList];

      const newCabinetPowerHistory = _.unionBy(
        state.cabinetPowerHistory,
        (item) => `${item.id}${item.field}`
      );

      newCabinetPowerHistory.forEach((item) => {
        const hasItem = newCabinetPowerList.find((closetItem) => item.id === closetItem.id);
        if (hasItem) {
          hasItem[item.field] = item.oldValue;
        }
      });

      let newCabinetPowerSelectItem = { ...state.cabinetPowerSelectItem };
      if (newCabinetPowerSelectItem.id) {
        const selectItem = newCabinetPowerList.find(
          (item) => item.id === newCabinetPowerSelectItem.id
        );
        newCabinetPowerSelectItem = selectItem || newCabinetPowerSelectItem;
      }

      return {
        ...state,
        cabinetPowerHistory: [],
        cabinetPowerSelectItem: newCabinetPowerSelectItem,
        cabinetPowerList: newCabinetPowerList
      };
    }

    case TYPES.SET_EQUIPMENT_HISTORY: {
      const newEquipmentHistory = [...state.equipmentHistory, payload];
      return { ...state, equipmentHistory: newEquipmentHistory };
    }

    case TYPES.EQUIPMENT_ROLLBACK_ONE: {
      const newEquipmentHistory = [...state.equipmentHistory];
      const rollbackItem = newEquipmentHistory.pop(); // 从修改历史数组删除
      const newEquipmentList = [...state.equipmentList];
      const hasItem = newEquipmentList.find((item) => item.id === rollbackItem.id);
      if (hasItem) {
        hasItem[rollbackItem.field] = rollbackItem.oldValue;
      }

      let newEquipmentSelectItem = { ...state.equipmentSelectItem };
      if (newEquipmentSelectItem.id) {
        newEquipmentSelectItem =
          newEquipmentList.find((item) => item.id === newEquipmentSelectItem.id) ||
          newEquipmentSelectItem;
      }

      return {
        ...state,
        equipmentHistory: newEquipmentHistory,
        equipmentSelectItem: newEquipmentSelectItem,
        equipmentList: newEquipmentList
      };
    }

    case TYPES.EQUIPMENT_ROLLBACK_All: {
      const newEquipmentList = [...state.equipmentList];

      const newEquipmentHistory = _.unionBy(
        state.equipmentHistory,
        (item) => `${item.id}${item.field}`
      );

      newEquipmentHistory.forEach((item) => {
        const hasItem = newEquipmentList.find((closetItem) => item.id === closetItem.id);
        if (hasItem) {
          hasItem[item.field] = item.oldValue;
        }
      });

      let newEquipmentSelectItem = { ...state.equipmentSelectItem };
      if (newEquipmentSelectItem.id) {
        const selectItem = newEquipmentList.find((item) => item.id === newEquipmentSelectItem.id);
        newEquipmentSelectItem = selectItem || newEquipmentSelectItem;
      }

      return {
        ...state,
        equipmentHistory: [],
        equipmentSelectItem: newEquipmentSelectItem,
        equipmentList: newEquipmentList
      };
    }

    case TYPES.SET_OUTLET_HISTORY: {
      const newOutletHistory = [...state.outletHistory, payload];
      return { ...state, outletHistory: newOutletHistory };
    }

    case TYPES.OUTLET_ROLLBACK_ONE: {
      const newOutletHistory = [...state.outletHistory];
      const rollbackItem = newOutletHistory.pop(); // 从修改历史数组删除
      const newOutletList = [...state.outletList];
      const hasItem = newOutletList.find((item) => item.id === rollbackItem.id);
      if (hasItem) {
        hasItem[rollbackItem.field] = rollbackItem.oldValue;
      }

      return {
        ...state,
        outletHistory: newOutletHistory,
        outletList: newOutletList
      };
    }

    case TYPES.OUTLET_ROLLBACK_All: {
      const newOutletList = [...state.outletList];

      const newOutletHistory = _.unionBy(state.outletHistory, (item) => `${item.id}${item.field}`);

      newOutletHistory.forEach((item) => {
        const hasItem = newOutletList.find((closetItem) => item.id === closetItem.id);
        if (hasItem) {
          hasItem[item.field] = item.oldValue;
        }
      });

      return {
        ...state,
        outletHistory: [],
        outletList: newOutletList
      };
    }

    case TYPES.SET_BACKBONE_HISTORY: {
      const newBackboneHistory = [...state.backboneHistory, payload];
      return { ...state, backboneHistory: newBackboneHistory };
    }

    case TYPES.BACKBONE_ROLLBACK_ONE: {
      const newBackboneHistory = [...state.backboneHistory];
      const rollbackItem = newBackboneHistory.pop(); // 从修改历史数组删除
      const newBackboneList = [...state.backboneList];
      const hasItem = newBackboneList.find((item) => item.id === rollbackItem.id);
      if (hasItem) {
        hasItem[rollbackItem.field] = rollbackItem.oldValue;
      }

      return {
        ...state,
        backboneHistory: newBackboneHistory,
        backboneList: newBackboneList
      };
    }

    case TYPES.BACKBONE_ROLLBACK_All: {
      const newBackboneList = [...state.backboneList];

      const newBackboneHistory = _.unionBy(
        state.backboneHistory,
        (item) => `${item.id}${item.field}`
      );

      newBackboneHistory.forEach((item) => {
        const hasItem = newBackboneList.find((closetItem) => item.id === closetItem.id);
        if (hasItem) {
          hasItem[item.field] = item.oldValue;
        }
      });

      return {
        ...state,
        backboneHistory: [],
        backboneList: newBackboneList
      };
    }

    case TYPES.CLEAR_CABINET_POWER_HISTORY: {
      return { ...state, cabinetPowerHistory: [] };
    }

    case TYPES.CLEAR_EQUIPMENT_HISTORY: {
      return { ...state, equipmentHistory: [] };
    }

    case TYPES.CLEAR_OUTLET_HISTORY: {
      return { ...state, outletHistory: [] };
    }

    case TYPES.CLEAR_BACKBONE_HISTORY: {
      return { ...state, backboneHistory: [] };
    }

    case 'networkCloset/setIsOpenAddCloset': {
      return { ...state, isOpenAddCloset: payload };
    }

    case 'networkCloset/setAddClosetByField': {
      const newAddCloset = { ...state.addCloset, [payload.field]: payload.value };
      return { ...state, addCloset: newAddCloset };
    }

    case 'networkCloset/setIsOpenAddPower': {
      return { ...state, isOpenAddPower: payload };
    }

    case TYPES.SET_CONNECT_PORT_HISTORY: {
      const newConnectPortHistory = [...state.connectPortHistory, payload];
      return { ...state, connectPortHistory: newConnectPortHistory };
    }

    case TYPES.SET_CONNECT_PORT_SELECT_ITEM:
      return { ...state, connectPortSelectItem: payload };

    case TYPES.SET_OUTLET_SELECT_ITEM:
      return { ...state, outletSelectItem: payload };

    // 清除redux，恢复默认值
    case TYPES.RECOVER_REDUX:
      return DefaultValue();

    default:
      return state;
  }
};

export default networkCloset;
