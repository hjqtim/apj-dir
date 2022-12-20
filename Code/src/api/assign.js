import envPrefix from '../utils/prefix';
import envUrl from '../utils/baseUrl';
import http from '../utils/request';

const path = envUrl.aaa + envPrefix.aaa;

class assign {
  list(params) {
    return http(`${path}/assign/list`, {
      method: 'GET',
      params
    });
  }

  detail(id) {
    const params = { id };
    return http(`${path}/assign/detail`, {
      method: 'GET',
      params
    });
  }

  update(id, data) {
    const params = { id };
    return http(`${path}/assign/update`, {
      method: 'PUT',
      params,
      data
    });
  }

  create(data) {
    return http(`${path}/assign/create`, {
      method: 'POST',
      data
    });
  }

  deleteMany(data) {
    return http(`${path}/assign/deleteMany`, {
      method: 'DELETE',
      data
    });
  }

  checkExist(id, params) {
    return http(`${path}/assign/checkExist`, {
      method: 'GET',
      params: {
        ...params,
        id
      }
    });
  }

  handledList() {
    return http(`${path}/assign/handledList`, {
      method: 'GET'
    });
  }
}

export default new assign();
