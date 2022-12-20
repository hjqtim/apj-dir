import envPrefix from '../utils/prefix';
import envUrl from '../utils/baseUrl';
import http from '../utils/request';

const path = envUrl.aaa + envPrefix.aaa;
const newPath = envUrl.resource + envPrefix.resource;

class VMGuest {
  listCluster(params) {
    return http(`${path}/vmCluster/list`, {
      method: 'GET',
      params
    });
  }

  list(params) {
    return http(`${newPath}/vmGuest/list`, {
      method: 'GET',
      params
    });
  }

  create(data) {
    return http(`${newPath}/vmGuest/create`, {
      method: 'POST',
      data
    });
  }

  detail(id) {
    return http(`${newPath}/vmGuest/detail`, {
      method: 'GET',
      params: {
        id
      }
    });
  }

  update(id, data) {
    return http(`${newPath}/vmGuest/update`, {
      method: 'PUT',
      params: {
        id
      },
      data
    });
  }

  deleteMany(data) {
    return http(`${newPath}/vmGuest/deleteMany`, {
      method: 'DELETE',
      data
    });
  }

  checkSerialNumber(id, serialNumber) {
    return http(`${newPath}/vmGuest/checkSerialNumber`, {
      method: 'GET',
      params: {
        id,
        serialNumber
      }
    });
  }

  download(data) {
    return http(`${newPath}/vmGuest/export`, {
      method: 'POST',
      responseType: 'blob',
      data
    });
  }
}

export default new VMGuest();
