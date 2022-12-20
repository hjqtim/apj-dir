import { decodeString, encryptString } from './encryption';
import { getUserFromLocalStorage, signOut, setUserFromLocalStorage } from './auth';

const LOGINUSER = 'loginUser';

export const getLoginUser = () => {
  let result = {};
  try {
    const stringValue = window.localStorage.getItem(LOGINUSER);
    if (stringValue) {
      result = JSON.parse(decodeString(stringValue));
    }
  } catch (error) {
    console.log(error);
  }

  return result;
};

export const setLoginUser = (value) => {
  localStorage.setItem(LOGINUSER, encryptString(JSON.stringify(value || {})));
};

// 判断是否正在角色扮演
export const hasIsSwitch = () => {
  const currentUserId = getUserFromLocalStorage()?.sAMAccountName?.toLowerCase();
  const loginUserId = getLoginUser()?.sAMAccountName?.toLowerCase();

  if (currentUserId && loginUserId && currentUserId !== loginUserId) {
    return true;
  }

  return false;
};

export const SWITCHTIME = 'switchTime';

export const setSwitchTime = (value) => {
  localStorage.setItem(SWITCHTIME, encryptString(value));
};

export const getSwitchTime = () => {
  try {
    return decodeString(window.localStorage.getItem(SWITCHTIME));
  } catch (error) {
    return null;
  }
};

export const removeSwitchTime = () => {
  window.localStorage.removeItem(SWITCHTIME);
};

export const maxSwitchTime = 6 * 60; // 扮演角色最大时间6分钟 (单位要求秒)

// 退出扮演角色
export const quictSwitch = () => {
  const loginUser = getLoginUser();

  if (loginUser.username) {
    setUserFromLocalStorage(loginUser);
    removeSwitchTime();
    setTimeout(() => {
      window.location.href = '/';
    }, 1500);
  } else {
    signOut(true);
  }
};
