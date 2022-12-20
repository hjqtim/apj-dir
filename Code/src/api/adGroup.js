import envPrefix from '../utils/prefix';
import envUrl from '../utils/baseUrl';
import http from '../utils/request';

const path = envUrl.aaa + envPrefix.aaa;

class AdGroup {
  list(params) {
    return http(`${path}/ad_group/list`, {
      method: 'GET',
      params
    });
  }

  create(data) {
    // return request.post(`${prefix}/ad_group/create`, params, {}, url)
    return http(`${path}/ad_group/create`, {
      method: 'POST',
      data
    });
  }

  detail(id) {
    return http(`${path}/ad_group/detail`, {
      method: 'GET',
      params: {
        id
      }
    });
  }

  update(id, data) {
    return http(`${path}/ad_group/update`, {
      method: 'PUT',
      params: {
        id
      },
      data
    });
  }

  deleteMany(data) {
    return http(`${path}/ad_group/deleteMany`, {
      method: 'DELETE',
      data
    });
  }

  checkName(id, name) {
    return http(`${path}/ad_group/checkName`, {
      method: 'GET',
      params: {
        id,
        name
      }
    });
  }

  getUsersForGroup(data) {
    return http(`${path}/user/getUsersForGroup`, {
      method: 'POST',
      data
    });
  }
}

export default new AdGroup();
