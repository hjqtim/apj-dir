import * as types from './constants';

export function setRequest(value) {
  return {
    type: types.SET_REQUESTER,
    payload: value
  };
}

export function setBindAppForm(value) {
  return {
    type: types.SET_BIND_APPFORM,
    payload: value
  };
}

export function setJobType(value) {
  return {
    type: types.SET_JOB_TYPE,
    payload: value
  };
}

export function setServiceForm(value) {
  return {
    type: types.SET_SERIVCE_FORM,
    payload: value
  };
}

export function setMoreInfo(value) {
  return {
    type: types.SET_MORE_INFO,
    payload: value
  };
}

export function setStatusInfo(value) {
  return {
    type: types.SET_STATUS_INFO,
    payload: value
  };
}

export function setTouch(payload) {
  return {
    type: types.SET_TOUCH,
    payload
  };
}
export function setTemp(payload) {
  return {
    type: types.SET_TEMP,
    payload
  };
}

export function setRestData(payload) {
  return {
    type: types.SET_RESET,
    payload
  };
}
export function setRestserviceForm(payload) {
  return {
    type: types.SET_RESET_FORM,
    payload
  };
}
export function setRestDataTouch(payload) {
  return {
    type: types.SET_RESET_Touch,
    payload
  };
}

// upload files
export const updateAttachments = (data) =>
  // console.log('updateAttachments', data);
  ({
    type: types.UPDATE_ATTACHEDMENTS,
    payload: data
  });
// remove files
export const removeAttachment = (e) => {
  console.log('removeAttachment', e.currentTarget.id);
  return {
    type: types.REMOVE_ATTACHMENT,
    payload: e.currentTarget.id
  };
};
// set files
export const setFiles = (payload) => ({
  type: types.SET_FILES,
  payload
});
export function setDetail(payload) {
  return {
    type: types.SET_DETAIL,
    payload
  };
}
