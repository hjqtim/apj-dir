import envPrefix from '../utils/prefix';
import envUrl from '../utils/baseUrl';
import http from '../utils/request';

const path = envUrl.logging + envPrefix.logging;

class Log {
  list(params) {
    return http(`${path}/log/list`, {
      method: 'GET',
      params
    });
  }

  delete(data) {
    return http(`${path}/log/delete`, {
      method: 'DELETE',
      data
    });
  }

  deleteMany(data) {
    return http(`${path}/log/deleteMany`, {
      method: 'DELETE',
      data
    });
  }
}

export default new Log();
