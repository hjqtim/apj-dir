import envPrefix from '../utils/prefix';
import envUrl from '../utils/baseUrl';
import http from '../utils/request';

const path = envUrl.aaa + envPrefix.aaa;

class Assign {
  list(params) {
    return http(`${path}/expiry/list`, {
      method: 'GET',
      params
    });
  }

  detail(params) {
    return http(`${path}/expiry/detail`, {
      method: 'GET',
      params
    });
  }

  update(id, data) {
    return http(`${path}/expiry/update`, {
      method: 'PUT',
      params: {
        id
      },
      data
    });
  }

  create(data) {
    return http(`${path}/expiry/create`, {
      method: 'POST',
      data
    });
  }

  deleteMany(data) {
    return http(`${path}/expiry/deleteMany`, {
      method: 'DELETE',
      data
    });
  }

  checkExist(params) {
    return http(`${path}/expiry/checkExist`, {
      method: 'GET',
      params
    });
  }
}

export default new Assign();
