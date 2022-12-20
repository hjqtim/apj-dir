import envPrefix from '../utils/prefix';
import envUrl from '../utils/baseUrl';
import http from '../utils/request';

const path = envUrl.aaa + envPrefix.aaa;

class diyForm {
  create(data) {
    return http(`${path}/diyForm/create`, {
      method: 'POST',
      data
    });
  }

  start(data) {
    return http(`${path}/camunda/start`, {
      method: 'POST',
      data
    });
  }

  detail(params) {
    return http(`${path}/diyForm/detail`, {
      method: 'GET',
      params
    });
  }

  update(data) {
    return http(`${path}/diyForm/update`, {
      method: 'POST',
      data
    });
  }

  getJobId(data) {
    return http(`${path}/vm/check`, {
      method: 'POST',
      data
    });
  }

  getResource(data) {
    return http(`${path}/vm/getResource`, {
      method: 'POST',
      data
    });
  }

  getGrouptoEmail(data) {
    return http(`${path}/mail/getGrouptoEmail`, {
      method: 'post',
      data
    });
  }
}

// eslint-disable-next-line new-cap
export default new diyForm();
