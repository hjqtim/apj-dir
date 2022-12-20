import TYPES from './webDP-action-types';

export const setForm = (formType) => ({
  type: TYPES.SET_FORM_TYPE,
  payload: formType
});

export const setViewOnly = (condition) => ({
  type: TYPES.SET_VIEW_ONLY,
  payload: condition
});

export const updateAttachments = (data) => ({
  type: TYPES.UPDATE_ATTACHEDMENTS,
  payload: data
});

export const removeAttachment = (e) => {
  console.log('called action');
  return {
    type: TYPES.REMOVE_ATTACHMENT,
    payload: e.currentTarget.id
  };
};

export const addFloorPlan = (key, file) => ({
  type: TYPES.ADD_FLOOR_PLAN,
  payload: {
    key,
    file
  }
});

export const removeFloorPlan = (key) => ({
  type: TYPES.REMOVE_FLOOR_PLAN,
  payload: key
});

export const updateRequester = (e) => ({
  type: TYPES.UPDATE_REQUESTER,
  payload: {
    id: e.target.id,
    value: e.target.value
  }
});

export const updateServiceRequired = (e) => ({
  type: TYPES.UPDATE_SERVICE_REQUIRED,
  payload: {
    id: e.target.id,
    value: e.target.value
  }
});

export const updateApDpDetails = (e, row) => ({
  type: TYPES.UPDATE_AP_DP_DETAILS,
  payload: {
    id: e.currentTarget.id,
    value: e.currentTarget.value,
    row
  }
});

export const updateExternalNetwork = (e) => ({
  type: TYPES.UPDATE_EXTERNAL_NETWORK,
  payload: {
    id: e.currentTarget.id,
    value: e.currentTarget.value
  }
});

export const updateAttitionalInformation = (e) => ({
  type: TYPES.UPDATE_ADDITIONAL_INFORMATION,
  payload: {
    id: e.currentTarget.id,
    value: e.currentTarget.value
  }
});

export const updateDateTime = (id, datetime) => ({
  type: TYPES.UPDATE_DATE_TIME,
  payload: {
    id,
    value: datetime
  }
});

// 保存医院下拉框列表数据
export const setHospitalList = (data) => ({
  type: TYPES.SET_HOSPITAL_LIST,
  payload: data || []
});

// 保存选中的医院的Block街道信息
export const setHospitalBlock = (data) => ({
  type: TYPES.SET_HOSPITAL_BLOCK,
  payload: data || []
});

// 清除block和floor
export const selectHospitalEffect = () => ({
  type: TYPES.CLEAR_BLOCK_AND_FLOOR
});

// 修改Floor下拉列表数据
export const setFloorOption = (data) => ({
  type: TYPES.SET_FLOOR_OPTION,
  payload: data
});

// 清空Block
export const clearBlock = (index) => ({
  type: TYPES.CLEAR_BLOCK,
  index
});

// 清空floor
export const clearFloor = (index) => ({
  type: TYPES.CLEAR_FLOOR,
  index
});

// 保存Site Contact
export const setContact = (payload) => ({
  type: TYPES.SET_CONTACT_PERSON,
  payload: payload || {}
});

// 保存project下拉框数据
export const setProjectList = (payload) => ({
  type: TYPES.SET_PROJECT_LIST,
  payload
});

export const restoreEditData = (webdpState) => ({
  type: TYPES.RESTORE_EDIT_DATE,
  payload: webdpState
});

export const copyForm = () => ({
  type: TYPES.COPY_FORM
});

// 修改admin名和电话
export const setAdmin = (payload) => ({
  type: TYPES.SET_ADMIN,
  payload
});

// 修改IT名和电话
export const setIT = (payload) => ({
  type: TYPES.SET_IT,
  payload
});

// 保存service type 和 conduit type 下拉框数据
export const setServiceConduits = (payload) => ({
  type: TYPES.SET_SERVICE_CONDUIT_OPTION,
  payload
});

// redux恢复webdp
export const resetWebdp = () => ({
  type: TYPES.RESET_WEBDP
});

export const setWebdp = (payload) => ({
  type: TYPES.SET_WEBDP,
  payload
});

// set files
export const setFiles = (payload) => ({
  type: TYPES.SET_FILES,
  payload
});

// set webdpRequestForm
export const setWebdpRequestForm = (payload) => ({
  type: TYPES.SET_WEBDP_REQUEST_FORM,
  payload
});

export const setError = (payload) => ({
  type: TYPES.SET_ERROR,
  payload
});

export const setContactObj = (payload) => ({
  type: TYPES.SET_CONTACT_OBJ,
  payload
});

// set Requester Manager
export const setRequesterManager = (data) =>
  // console.log('setRequesterManager', data);
  ({
    type: TYPES.SET_REQUESTER_MANAGER,
    payload: data
  });

export const setBudgetHolder = (data) => {
  console.log(data);
  return {
    type: TYPES.SET_BUDGET_HOLDER,
    payload: data
  };
};

export const setFundParty = (data) => ({
  type: TYPES.SET_FUND_PARTY,
  payload: data
});

export const setSelectedItem = (data) => ({
  type: TYPES.SET_SELECTED_ITEM,
  payload: data
});

export const setPaymentMethod = (data) => ({
  type: TYPES.SET_PAYMENT_METHOD,
  payload: data
});

export const setOtherPayment = (data) => ({
  type: TYPES.SET_OTHER_PAYMENT_METHOD,
  payload: data
});

export const setBudgetHolderContact = (data) => ({
  type: TYPES.SET_BH_CONTACT,
  payload: data
});

export const setExternalCompany = (data) => ({
  type: TYPES.SET_EXTERNAL_COMPANY,
  payload: data
});

export const setCOA = (data) => ({
  type: TYPES.SET_COA,
  payload: data
});

export const setCOAoptions = (payload) => ({
  type: TYPES.SET_COA_OPTIONS,
  payload
});

export const setMyBudgetHolder = (payload) => ({
  type: TYPES.SET_MY_BUDGET_HOLDER,
  payload
});

export const setApplyReqManBudTouch = (payload) => ({
  type: TYPES.SET_APPLYREQMANBUDTOUCH,
  payload
});

export const setCancelRemark = (payload) => ({
  type: TYPES.SET_CANCEL_REMARK,
  payload
});

export const setPendingRemark = (payload) => ({
  type: TYPES.SET_PENDING_REMARK,
  payload
});
