import envPrefix from '../utils/prefix';
import envUrl from '../utils/baseUrl';
import http from '../utils/request';

const path = envUrl.aaa + envPrefix.aaa;

class Tenant {
  list(params) {
    return http(`${path}/tenant/list`, {
      method: 'GET',
      params
    });
  }

  listGroup(params) {
    return http(`${path}/group/list`, {
      method: 'GET',
      params
    });
  }

  create(data) {
    return http(`${path}/tenant/create`, {
      method: 'POST',
      data
    });
  }

  detail(id) {
    return http(`${path}/tenant/detail`, {
      method: 'GET',
      params: {
        id
      }
    });
  }

  update(id, data) {
    return http(`${path}/tenant/update`, {
      method: 'PUT',
      params: {
        id
      },
      data
    });
  }

  deleteMany(data) {
    return http(`${path}/tenant/deleteMany`, {
      method: 'DELETE',
      data
    });
  }

  checkExist(id, code) {
    return http(`${path}/tenant/checkExist`, {
      method: 'GET',
      params: {
        id,
        code
      }
    });
  }

  getCps(cpsId) {
    return http(`${path}/tenant/getCps`, {
      method: 'GET',
      params: {
        cpsId
      }
    });
  }
}

export default new Tenant();
