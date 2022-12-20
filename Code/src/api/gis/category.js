import baseUrl from '../../utils/baseUrl';
import prefix from '../../utils/prefix';
import http from '../../utils/request';

const path = `${baseUrl.gis}${prefix.gis}`;

class Category {
  create(id, data) {
    return http(`${path}/categories/${id}`, { method: 'POST', data });
  }

  getAll() {
    return http(`${path}/categories`, { method: 'GET' });
  }

  getById(id) {
    return http(`${path}/categories/${id}`, { method: 'GET' });
  }

  update(id, data) {
    return http(`${path}/categories/${id}`, { method: 'PUT', data });
  }
}

export default new Category();
