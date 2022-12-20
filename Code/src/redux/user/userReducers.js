import * as types from '../constants';

const defaultValue = {
  currentUser: {},
  groupInfo: {},
  myActionGroup: {
    // G_SENSE_ADM: false,
    // G_SENSE_RF: false,
    // G_SENSE_DP: true,
    // G_SENSE_EN: false,
    // G_SENSE_AP: false,
    // G_SENSE_ND: false,
    // Guest: true
  }
};

export default function reducer(state = defaultValue, actions) {
  switch (actions.type) {
    case types.SET_USER:
      return {
        ...state,
        currentUser: actions.payload
      };

    case types.SET_USER_GROUP_STATUS:
      return {
        ...state,
        groupInfo: actions.payload,
        myActionGroup: actions.payload
      };

    case types.SET_USER_MESSAGE_LIST:
      return {
        ...state,
        messageList: actions.payload
      };

    default:
      return state;
  }
}
