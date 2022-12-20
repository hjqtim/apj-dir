// import request from '../utils/request'
import envPrefix from '../utils/prefix';
import envUrl from '../utils/baseUrl';
import http from '../utils/request';

const path = envUrl.aaa + envPrefix.aaa;

class HADynamicForm {
  getDynamicForm(params) {
    return http(`${path}/dynamicForm/getDynamicForm`, {
      method: 'GET',
      params
    });
  }

  getInitData(params) {
    return http(`${path}/haDynamicForm/getInitData`, {
      method: 'GET',
      params
    });
  }
}

export default new HADynamicForm();
