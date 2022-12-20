import baseUrl from '../../utils/baseUrl';
import prefix from '../../utils/prefix';
import http from '../../utils/request';

const path = `${baseUrl.gis}${prefix.gis}`;

class Api {
  locationQuery(params) {
    return http(`${path}/locationQuery`, { method: 'GET', params });
  }
}

export default new Api();
