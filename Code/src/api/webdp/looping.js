import envPrefix from '../../utils/prefix';
import envUrl from '../../utils/baseUrl';
import http from '../../utils/request';

const path = envUrl.webdp + envPrefix.webdp;

class Looping {
  // save looping request form
  saveLoop(data) {
    return http(`${path}/dpLoopingProtection/saveLoop`, {
      method: 'POST',
      data
    });
  }

  getLoopDetail(params) {
    return http(`${path}/dpLoopingProtection/getLoopDetail`, {
      method: 'GET',
      params
    });
  }

  findUserList(params) {
    return http(`${path}/ad/findUserList`, {
      method: 'GET',
      params
    });
  }
}

export default new Looping();
