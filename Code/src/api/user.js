import envPrefix from '../utils/prefix';
import envUrl from '../utils/baseUrl';
import http from '../utils/request';

const path = envUrl.aaa + envPrefix.aaa;

class User {
  list(params) {
    return http(`${path}/user/list`, {
      method: 'GET',
      params
    });
  }

  detail(id) {
    return http(`${path}/user/detail`, {
      method: 'GET',
      params: {
        id
      }
    });
  }

  findUser(data) {
    return http(`${path}/user/findUser`, {
      method: 'POST',
      data
    });
  }

  findUserByTenant(params) {
    return http(`${path}/user/findUserByTenant`, {
      method: 'GET',
      params
    });
  }
}

export default new User();
