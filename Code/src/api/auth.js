import envPrefix from '../utils/prefix';
import envUrl from '../utils/baseUrl';
import http from '../utils/request';

const path = envUrl.aaa + envPrefix.aaa;

class Auth {
  login(data) {
    return http(`${path}/user/login`, {
      method: 'POST',
      data
    });
  }
}

export default new Auth();
