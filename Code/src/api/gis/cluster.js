import baseUrl from '../../utils/baseUrl';
import prefix from '../../utils/prefix';
import http from '../../utils/request';

const path = `${baseUrl.gis}${prefix.gis}`;

class Cluster {
  create(id, data) {
    return http(`${path}/clusters/${id}`, { method: 'POST', data });
  }

  getAll() {
    return http(`${path}/clusters`, { method: 'GET' });
  }

  getById(id) {
    return http(`${path}/clusters/${id}`, { method: 'GET' });
  }

  update(id, data) {
    return http(`${path}/clusters/${id}`, { method: 'PUT', data });
  }
}

export default new Cluster();
