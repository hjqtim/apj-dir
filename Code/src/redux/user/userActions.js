import * as types from '../constants';

export function setUser(value) {
  return {
    type: types.SET_USER,
    payload: value
  };
}

export function setUserGroupStatus(value) {
  return {
    type: types.SET_USER_GROUP_STATUS,
    payload: value
  };
}

export function setUserMessageList(value) {
  return {
    type: types.SET_USER_MESSAGE_LIST,
    payload: value
  };
}
