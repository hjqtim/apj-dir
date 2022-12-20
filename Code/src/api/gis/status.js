import baseUrl from '../../utils/baseUrl';
import prefix from '../../utils/prefix';
import http from '../../utils/request';

const path = `${baseUrl.gis}${prefix.gis}`;

class Status {
  create(id, data) {
    return http(`${path}/statuses/${id}`, { method: 'POST', data });
  }

  getAll() {
    return http(`${path}/statuses`, { method: 'GET' });
  }

  getById(id) {
    return http(`${path}/statuses/${id}`, { method: 'GET' });
  }

  update(id, data) {
    return http(`${path}/statuses/${id}`, { method: 'PUT', data });
  }
}

export default new Status();
