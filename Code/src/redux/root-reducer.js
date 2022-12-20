import { combineReducers } from 'redux';

import themeReducer from './theme/themeReducers';
import userReducer from './user/userReducers';
import pageReducer from './page/pageReducers';
import webDP from './webDP';
import myAction from './myAction';
import networkCloset from './networkCloset';
import IPAdreess from './IPAdreess/ipaddrReducers';
import resourceMX from './ResourceMX/resourceReduces';
import networkMeeting from './NetworkMeeting/Reduces';
import global from './global';

export default combineReducers({
  themeReducer,
  userReducer,
  pageReducer,
  webDP,
  myAction,
  networkCloset,
  IPAdreess,
  resourceMX,
  networkMeeting,
  global
});
