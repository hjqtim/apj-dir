import axios from 'axios';

export default function ajax(url, data = {}, type = 'GET') {
  const baseUrl = 'http://www.mylaravel.com';
  const $axios = axios.create({
    baseURL: `${baseUrl}/index.php`,
    timeout: 10000,
    responseType: 'json',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8'
    }
  });

  return new Promise((resolve, reject) => {
    let promise;
    // 1. 执行异步ajax请求
    if (type === 'GET') {
      // 发GET请求
      promise = $axios.get(url, {
        // 配置对象
        params: data // 指定请求参数
      });
    } else {
      // 发POST请求
      promise = $axios.post(url, data);
    }
    // 2. 如果成功了, 调用resolve(value)
    promise
      .then((response) => {
        resolve(response.data);
        // 3. 如果失败了, 不调用reject(reason), 而是提示异常信息
      })
      .catch((error) => {
        reject(error);
      });
  });
}

export function $ajax(url, data = {}, type = 'GET') {
  return new Promise((resolve, reject) => {
    let promise;
    // 1. 执行异步ajax请求
    if (type === 'GET') {
      // 发GET请求
      promise = axios.get(url, {
        // 配置对象
        params: data // 指定请求参数
      });
    } else {
      // 发POST请求
      promise = axios.post(url, data);
    }
    // 2. 如果成功了, 调用resolve(value)
    promise
      .then((response) => {
        resolve(response.data);
        // 3. 如果失败了, 不调用reject(reason), 而是提示异常信息
      })
      .catch((error) => {
        reject(error);
      });
  });
}
