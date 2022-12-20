import * as types from '../constants';

export default function reducer(state = { toListPage: false }, actions) {
  switch (actions.type) {
    case types.SET_PAGE:
      return {
        ...state,
        currentPage: actions.payload
      };

    case types.SET_NEWROUTES:
      return {
        ...state,
        newRoutes: actions.payload
      };

    default:
      return state;
  }
}
