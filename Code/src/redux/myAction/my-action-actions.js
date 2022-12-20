import TYPES from './my-action-action-types';

export const setFormData = (data) => ({
  type: TYPES.SET_DATA,
  payload: data
});

export const setSiteVisitArrangement = (data) => ({
  type: TYPES.SET_SITE_VISIT_ARRANGEMENT,
  payload: data
});

export const setSVAError = (id, error) => ({
  type: TYPES.SET_SVA_ERROR,
  payload: { id, error }
});

export const setAck = (data) => ({
  type: TYPES.SET_ACK,
  payload: data
});

export const setBudgetHolder = (data) => ({
  type: TYPES.SET_BUDGET_HOLDER,
  payload: data
});

export const setExpenditure = (data) => ({
  type: TYPES.SET_EXPENDITURE,
  payload: data
});

export const setFundConfirm = (data) => ({
  type: TYPES.SET_FUND_CONFIRM,
  payload: data
});

export const setManagerApproval = (data) => ({
  type: TYPES.SET_MANAGER_APPROVAL,
  payload: data
});

export const setPaymentInfo = (data) => ({
  type: TYPES.SET_PAYMENT_INFO,
  payload: data
});

export const setQoutationApproval = (data) => ({
  type: TYPES.SET_QUOTATION_APPROVAL,
  payload: data
});

export const setRequesterManager = (data) => ({
  type: TYPES.SET_REQUESTER_MANAGER,
  payload: data
});

export const setResposibleStaff = (data) => ({
  type: TYPES.SET_RESPONSIBLE_STAFF,
  payload: data
});

export const setNetworkDesign = (data) => ({
  type: TYPES.SET_NETWORKDESIGN,
  payload: data
});

export const setNetworkDesignItem = (field, value) => ({
  type: TYPES.SET_NETWORKDESIGN_ITEM,
  payload: {
    field,
    value
  }
});

export const setDetail = (data) => ({
  type: TYPES.SET_DETAIL,
  payload: data
});

export const setNMSResponsible = (data) => ({
  type: TYPES.SET_NMSRESPONSIBLE,
  payload: data
});

export const setAssignmentdate = (data) => ({
  type: TYPES.SET_NMSIGNMENTDATE,
  payload: data
});

export const setLocationList = (data) => ({
  type: TYPES.SET_LOCATIONLIST,
  payload: data
});

export const setProjectCostTotal = (payload) => ({
  type: TYPES.SET_PROJECTCOSTTOTAL,
  payload
});

export const setDpRequestStatus = (data) => ({
  type: TYPES.SET_DETAIL_DP_REQUEST_STATUS,
  payload: data
});

export const setNetworkDesignFiles = (files) => ({
  type: TYPES.SET_NETWORK_DESIGN_FILES,
  payload: files
});

export const readOnly = (condition) => ({
  type: TYPES.SET_READ_ONLY,
  payload: condition
});

export const setDataToMyAction = (payload) => ({
  type: TYPES.SET_REQUEST_FORM,
  payload
});

export const setMyBudgetHolderByMyAction = (payload) => ({
  type: TYPES.SET_MY_BUDGET_HOLDER_BY_MYACTION,
  payload
});

export const setManagerRemark = (payload) => ({
  type: TYPES.SET_MANAGER_REMARK,
  payload
});

export const setBudgetHolderRemark = (payload) => ({
  type: TYPES.SET_BUDGET_HOLDER_REMARK,
  payload
});

export const setEndorsement = (payload) => ({
  type: TYPES.SET_ENDORSEMENT,
  payload
});

export const setEndorsementTouch = (payload) => ({
  type: TYPES.SET_ENDORSEMENT_TOUCH,
  payload
});

export const setEndorsementApproval = (payload) => ({
  type: TYPES.SET_ENDORSEMENT_APPROVAL,
  payload
});

export const setMyDprequeststatusno = (payload) => ({
  type: TYPES.SET_MY_DPREQUESTSTATUSNO,
  payload
});

export const setSentDocumentRemark = (payload) => ({
  type: TYPES.SET_SENTDOCUMENTRRMARK,
  payload
});

export const setAllMyAction = (payload) => ({
  type: TYPES.SET_ALL_MY_ACTION,
  payload
});

export const setManagerInformation = (payload) => ({
  type: TYPES.SET_MANAGER_INFORMATION,
  payload
});

export const setReqManBudTouch = (payload) => ({
  type: TYPES.SET_REQMANBUDTOUCH,
  payload
});

export const setCostEstimation = (payload) => ({
  type: TYPES.SET_COSTESTIMATION,
  payload
});

export const setMyActionProject = (payload) => ({
  type: TYPES.SET_MY_ACTION_PROJECT,
  payload
});
