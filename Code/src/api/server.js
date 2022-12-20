import envPrefix from '../utils/prefix';
import envUrl from '../utils/baseUrl';
import http from '../utils/request';

// const path = envUrl.aaa + envPrefix.aaa
const newPath = envUrl.resource + envPrefix.resource;

class Server {
  list(params) {
    return http(`${newPath}/server/list`, {
      method: 'GET',
      params
    });
  }

  create(data) {
    return http(`${newPath}/server/create`, {
      method: 'POST',
      data
    });
  }

  detail(id) {
    return http(`${newPath}/server/detail`, {
      method: 'GET',
      params: {
        id
      }
    });
  }

  update(id, data) {
    return http(`${newPath}/server/update`, {
      method: 'PUT',
      params: {
        id
      },
      data
    });
  }

  deleteMany(data) {
    return http(`${newPath}/server/deleteMany`, {
      method: 'DELETE',
      data
    });
  }

  checkIDExist(id, _ID) {
    return http(`${newPath}/server/checkIDExist`, {
      method: 'GET',
      params: {
        id,
        _ID
      }
    });
  }
}

export default new Server();
