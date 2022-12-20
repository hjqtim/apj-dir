import axios from 'axios';
import { getToken, signOut, getUserFromLocalStorage } from './auth';
import { hasIsSwitch } from './switchRose';
import CommonTip from '../components/CommonTip';

const http = axios.create({
  timeout: 1000 * 600,
  headers: {
    'Content-Type': 'application/json; charset=utf-8'
  }
});

http.interceptors.request.use(
  (config) => {
    config.headers.Authorization = `Bearer ${localStorage.getItem('token')}`;
    if (hasIsSwitch()) {
      config.headers.anotherCorpId = getUserFromLocalStorage().username;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

http.interceptors.response.use(
  (res) => {
    const newToken = res?.data?.newToken;
    // 没有扮演角色并且有newToken才会替换token
    if (newToken && !res.config.headers.anotherCorpId) {
      window.localStorage.setItem('token', newToken);
    }
    return res;
  },
  (error) => {
    if (!error?.config?.noHandleError) {
      handleError(error);
    }
    return Promise.reject(error.response);
  }
);

export default http;

function handleError(error) {
  if (!error.response) {
    showTip('System Busy');
    return;
  }
  const { status, message, data } = error.response;
  switch (status) {
    case 400:
      showTip(message || (data && data.message ? data.message : 'Bad Request'));
      break;
    case 401:
      showTip('Unauthorized');
      signOut(true);
      break;
    case 500:
      if (!getToken()) {
        showTip('Unauthorized');
        signOut(true);
      } else {
        showTip('System Busy');
      }
      break;
    default:
      showTip('System Busy');
  }
}

function showTip(message, autoHideDuration) {
  CommonTip.error(message, autoHideDuration);
}
