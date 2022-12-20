import * as types from '../constants';

export function setPage(value) {
  return {
    type: types.SET_PAGE,
    payload: value
  };
}

export function setNewRoutes(value) {
  return {
    type: types.SET_NEWROUTES,
    payload: value
  };
}
