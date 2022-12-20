import CommonTip from '../components/CommonTip';
import { L } from './lang';
import store from '../redux';
import { setUser } from '../redux/user/userActions';

function getToken() {
  return window.localStorage.getItem('token');
}

function authRoute(path) {
  if (path === '/') {
    console.log('1. path');
    return true;
  }
  if (!getToken()) {
    // console.log('2. !getToken');
    return false;
  }
  const groupList = getUserGroupTypeList();
  switch (path) {
    case '/workflow/workflowSetting/':
      return groupList.includes('IT');
    default:
      // console.log('default switch');
      return true;
  }
}

function authMenu(path) {
  const groupList = getUserGroupTypeList();
  switch (path) {
    case '/workflow/workflowSetting/':
      return groupList.includes('IT');
    default:
      return true;
  }
}

function getUserObj(rawUser) {
  return {
    id: rawUser.id || '',
    groupList: rawUser.groups || [],
    displayName: rawUser.displayName || '',
    groupTypeList: rawUser.groupTypeList || [],
    cn: rawUser.cn || '',
    sn: rawUser.sn || '',
    givenName: rawUser.givenName || '',
    mail: rawUser.mail || '',
    title: rawUser.title || '',
    department: rawUser.department || '',
    name: rawUser.name || '',
    username: rawUser.username || '',
    adPhone: rawUser.telephoneNumber || '',
    phone: rawUser.phone || '',
    sAMAccountName: rawUser.sAMAccountName || ''
  };
}

function signIn(data) {
  if (data.token) {
    localStorage.setItem('token', data.token);
  }
  const rawUser = data.user;
  const user = getUserObj(rawUser);
  if (rawUser.cn === 'shenchengan') {
    user.mail = 'rexshen@apjcorp.com';
  }
  localStorage.setItem('user', JSON.stringify(user));
  store.dispatch(setUser(user));
}

function signOut(hideTip = false) {
  window.localStorage.clear();
  if (!hideTip) {
    CommonTip.success(L('Success'));
  }
  window.location.href = '/auth/sign-in';
}

function getUserFromLocalStorage() {
  return window.localStorage.getItem('user') ? JSON.parse(window.localStorage.getItem('user')) : {};
}

function setUserFromLocalStorage(data) {
  if (!data) return;
  const user = getUserFromLocalStorage();
  const newUser = { ...user, ...data };
  localStorage.setItem('user', JSON.stringify(newUser));
  store.dispatch(setUser(newUser));
}

function getUser() {
  return store.getState().userReducer.currentUser;
}

function getUserGroupList() {
  const user = getUser();
  if (!user) return [];
  const { groupList } = user;
  return groupList;
}

function getUserGroupTypeList() {
  const user = getUser();
  if (!user) return null;
  const { groupTypeList } = user;
  return groupTypeList || [];
}

const MaxFileSize = process.env.REACT_APP_BASE_FILESIZE || 1024 * 1024 * 10;
function uploadFileCheck(file) {
  const fileSize = file.size;
  if (fileSize > MaxFileSize) {
    CommonTip.error('File size cannot exceed 10 MB');
    return false;
  }
  if (/\.exe$/.test(file.name)) {
    CommonTip.error('This type of file cannot be uploaded');
    return false;
  }
  return true;
}

export {
  authRoute,
  authMenu,
  signIn,
  signOut,
  getUserGroupList,
  getUserGroupTypeList,
  setUserFromLocalStorage,
  getUserFromLocalStorage,
  getUser,
  getToken,
  uploadFileCheck,
  getUserObj
};
