import envPrefix from '../utils/prefix';
import envUrl from '../utils/baseUrl';
import http from '../utils/request';

const newPath = envUrl.resource + envPrefix.resource;

class Platform {
  list(params) {
    return http(`${newPath}/platform/list`, {
      method: 'GET',
      params
    });
  }

  listType(params) {
    return http(`${newPath}/platform/listType`, {
      method: 'GET',
      params
    });
  }

  create(data) {
    return http(`${newPath}/platform/create`, {
      method: 'POST',
      data
    });
  }

  detail(id) {
    return http(`${newPath}/platform/detail`, {
      method: 'GET',
      params: {
        id
      }
    });
  }

  update(id, data) {
    return http(`${newPath}/platform/update`, {
      method: 'PUT',
      params: {
        id
      },
      data
    });
  }

  deleteMany(data) {
    return http(`${newPath}/platform/deleteMany`, {
      method: 'DELETE',
      data
    });
  }

  checkName(id, name) {
    return http(`${newPath}/platform/checkName`, {
      method: 'GET',
      params: {
        id,
        name
      }
    });
  }
}

export default new Platform();
