import envPrefix from '../../utils/prefix';
import envUrl from '../../utils/baseUrl';
import http from '../../utils/request';

const path = envUrl.sync + envPrefix.sync;

class Sync {
  oneClickSync() {
    return http(`${path}/syncData/oneClickSync`, {
      method: 'GET'
    });
  }
}

export default new Sync();
