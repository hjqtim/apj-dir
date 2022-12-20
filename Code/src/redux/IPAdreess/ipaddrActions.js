import TYPES from './ipaddr-action-types';

export function setBaseData(payload) {
  return {
    type: TYPES.SET_BASE_DATA,
    payload
  };
}
export function setRequest(payload) {
  return {
    type: TYPES.SET_REQUESTER,
    payload
  };
}

export function setDetailItems(payload) {
  return {
    type: TYPES.SET_DETAIL_ITEMS,
    payload
  };
}

export function setDeleteItem(payload) {
  return {
    type: TYPES.SET_DELETE_ITEM,
    payload
  };
}

export function setCopyItem(payload) {
  return {
    type: TYPES.SET_COPY_ITEM,
    payload
  };
}

export function setAddItem() {
  return {
    type: TYPES.SET_ADD_ITEM
  };
}

export function setProjectInfo(payload) {
  return {
    type: TYPES.SET_PROJECT_INFO,
    payload
  };
}

export function setContractPerson(payload) {
  return {
    type: TYPES.SET_CONTRACT_PERSON,
    payload
  };
}

export function setTouch(payload) {
  return {
    type: TYPES.SET_TOUCH,
    payload
  };
}

export function setItemTouch(payload) {
  return {
    type: TYPES.SET_ITEM_TOUCH,
    payload
  };
}

export function setAllFormData(payload) {
  return {
    type: TYPES.SET_ALL_FROM_DATA,
    payload
  };
}

export function setClearData() {
  return {
    type: TYPES.SET_CLEAR_DATA
  };
}

export function setApproveTouch(payload) {
  return {
    type: TYPES.SET_APPROVE_TOUCH,
    payload
  };
}

export function setApproveListData(payload) {
  return {
    type: TYPES.SET_APPROVE_LIST_DATA,
    payload
  };
}

export function setRestData(payload) {
  return {
    type: TYPES.SET_RESET,
    payload
  };
}
