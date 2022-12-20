import TYPES from './ipaddr-action-types';
import DefaultValue from './DefaultValue';
import IPAddrItem from '../../models/ipaddr/IPAddrItem';
import { itemTouch } from '../../models/ipaddr/TouchModel';

const INITIAL_STATE = new DefaultValue();

export default function IPAdreessReducers(state = INITIAL_STATE, actions) {
  const { type, payload } = actions || {};
  switch (type) {
    case TYPES.SET_BASE_DATA: {
      return { ...state, ...payload };
    }
    case TYPES.SET_REQUESTER: {
      const newData = { [payload?.field]: payload?.data };
      return { ...state, requester: { ...state.requester, ...newData } };
    }
    case TYPES.SET_DETAIL_ITEMS: {
      const { field, data } = payload || {};
      const newObj = { ...state.items[data.index], [field]: data.value };
      state.items[data.index] = newObj;
      return { ...state, items: [...state.items] };
    }
    case TYPES.SET_ADD_ITEM: {
      return {
        ...state,
        items: [...state.items, new IPAddrItem()],
        touches: { ...state.touches, items: [...state.touches.items, itemTouch(false)] }
      };
    }
    case TYPES.SET_COPY_ITEM: {
      const { index } = payload;
      const key = Date.now().toString(36) + Math.random().toString(36).substr(2);
      const copyItem = { ...JSON.parse(JSON.stringify(state.items[index] || {})), key };
      const copyItemTouch = JSON.parse(JSON.stringify(state.touches.items[index] || {}));
      return {
        ...state,
        items: [...state.items, { ...copyItem }],
        touches: { ...state.touches, items: [...state.touches.items, copyItemTouch] }
      };
    }
    case TYPES.SET_DELETE_ITEM: {
      const { index } = payload;
      const removedItem = state.items.filter((item, idx) => idx !== index);
      const filteredTouch = state.touches.items.filter((item, idx) => idx !== index);

      return {
        ...state,
        items: [...removedItem],
        touches: { ...state.touches, items: filteredTouch }
      };
    }
    case TYPES.SET_CONTRACT_PERSON: {
      const { field, data } = payload || {};
      return { ...state, contactPerson: { ...state.contactPerson, [field]: data } };
    }
    case TYPES.SET_PROJECT_INFO: {
      const { field, data } = payload || {};
      return { ...state, projectInfo: { ...state.projectInfo, [field]: data } };
    }
    case TYPES.SET_TOUCH: {
      const { field, data } = payload || {};
      let touches = {};

      if (field === '') {
        touches = data;
      } else {
        touches = { ...state.touches, [field]: { ...state.touches[field], ...data } };
      }
      return { ...state, touches };
    }
    case TYPES.SET_ITEM_TOUCH: {
      const { field, index } = payload || {};
      const items = JSON.parse(JSON.stringify(state.touches.items));
      items[index][field] = true;
      return { ...state, touches: { ...state.touches, items } };
    }
    case TYPES.SET_ALL_TOUCH: {
      const { touches } = payload || {};
      return { ...state, touches };
    }
    case TYPES.SET_ALL_FROM_DATA: {
      return { ...state, ...payload };
    }
    case TYPES.SET_CLEAR_DATA: {
      return { ...new DefaultValue() };
    }
    case TYPES.SET_APPROVE_TOUCH: {
      const { attr, field, index } = payload || {};
      const touches = JSON.parse(JSON.stringify(state[attr]));
      touches[index][field] = true;
      return { ...state, [attr]: touches };
    }

    case TYPES.SET_APPROVE_LIST_DATA: {
      const { attr, field, index, value } = payload || {};
      const data = JSON.parse(JSON.stringify(state[attr]));
      data[index][field] = value;
      return { ...state, [attr]: [...data] };
    }
    case TYPES.SET_RESET: {
      return INITIAL_STATE;
    }
    default:
      return state;
  }
}
