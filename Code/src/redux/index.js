import { createStore } from 'redux';
import rootReducer from './root-reducer';
import { getCurrentPage } from '../utils/url';
import { getUserFromLocalStorage } from '../utils/auth';
import { hasIsSwitch, getLoginUser } from '../utils/switchRose';

const loadState = () => {
  const user = getUserFromLocalStorage();
  const { moduleName } = getCurrentPage();
  return {
    userReducer: {
      currentUser: user, // 如果有扮演角色（A扮演B），存储的就是B的用户信息，否则取当前登录者的用户信息
      loginUser: getLoginUser(), // 当前登录的用户，无论有没有扮演角色，都是登录的那个用户
      isSwitch: hasIsSwitch() // 是否正在扮演角色
    },
    pageReducer: { currentPage: { toListPage: moduleName === 'List' } }
  };
};

const store = createStore(rootReducer, loadState());

export default store;
