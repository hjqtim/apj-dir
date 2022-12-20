import * as types from './constants';

export function setRequest(value) {
  return {
    type: types.SET_REQUESTER,
    payload: value
  };
}
export function setBaseEl(value) {
  return {
    type: types.SET_BASEEL,
    payload: value
  };
}
export function setParticipants(value) {
  return {
    type: types.SET_PARTICIPANTS,
    payload: value
  };
}

export function setSelector(value) {
  return {
    type: types.SET_SELECTOR,
    payload: value
  };
}

export function setMoreInfo(value) {
  return {
    type: types.SET_MORE_INFO,
    payload: value
  };
}

// upload files
export const updateAttachments = (data) => {
  console.log('updateAttachments', data);
  return {
    type: types.UPDATE_ATTACHEDMENTS,
    payload: data
  };
};
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
export function setRestData(payload) {
  return {
    type: types.SET_RESET,
    payload
  };
}
export function setRestDataTouch(payload) {
  return {
    type: types.SET_RESET_Touch,
    payload
  };
}
export function setDetail(payload) {
  return {
    type: types.SET_DETAIL,
    payload
  };
}
