import envPrefix from '../utils/prefix';
import envUrl from '../utils/baseUrl';
import http from '../utils/request';

const path = envUrl.aaa + envPrefix.aaa;

class vmLocation {
  create(data) {
    return http(`${path}/vm_location/create`, {
      method: 'POST',
      data
    });
  }

  detail(id) {
    return http(`${path}/vm_location/detail`, {
      method: 'GET',
      params: {
        id
      }
    });
  }
}

export default new vmLocation();
