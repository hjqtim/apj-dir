import axios from 'axios';
// import { getToken, signOut, getUserFromLocalStorage } from './auth';
// import { hasIsSwitch } from './switchRose';
// import CommonTip from '../components/CommonTip';

const http = axios.create({
  timeout: 1000 * 600,
  headers: {
    'Content-Type': 'application/json; charset=utf-8'
  }
});

// http.interceptors.request.use(
//   (config) => {
//     config.headers.Authorization = `Bearer ${localStorage.getItem('token')}`;
//     if (hasIsSwitch()) {
//       config.headers.anotherCorpId = getUserFromLocalStorage().username;
//     }
//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// http.interceptors.response.use(
//   (res) => {
//     const newToken = res?.data?.newToken;
//     // 没有扮演角色并且有newToken才会替换token
//     if (newToken && !res.config.headers.anotherCorpId) {
//       window.localStorage.setItem('token', newToken);
//     }
//     return res;
//   },
//   (error) => {
//     if (!error?.config?.noHandleError) {
//       handleError(error);
//     }
//     return Promise.reject(error.response);
//   }
// );

export default http;
