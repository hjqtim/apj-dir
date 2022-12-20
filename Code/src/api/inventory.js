import envPrefix from '../utils/prefix';
import envUrl from '../utils/baseUrl';
import http from '../utils/request';

const newPath = envUrl.resource + envPrefix.resource;

class Inventory {
  list(params) {
    return http(`${newPath}/inventory/list`, {
      method: 'GET',
      params
    });
  }

  listStatus(params) {
    return http(`${newPath}/inventory/listStatus`, {
      method: 'GET',
      params
    });
  }

  listEquipType(params) {
    return http(`${newPath}/inventory/listEquipType`, {
      method: 'GET',
      params
    });
  }

  create(data) {
    return http(`${newPath}/inventory/create`, {
      method: 'POST',
      data
    });
  }

  detail(id) {
    return http(`${newPath}/inventory/detail`, {
      method: 'GET',
      params: {
        id
      }
    });
  }

  update(id, data) {
    return http(`${newPath}/inventory/update`, {
      method: 'PUT',
      params: {
        id
      },
      data
    });
  }

  deleteMany(data) {
    return http(`${newPath}/inventory/deleteMany`, {
      method: 'DELETE',
      data
    });
  }

  checkIDExist(id, _ID) {
    return http(`${newPath}/inventory/checkIDExist`, {
      method: 'GET',
      params: {
        id,
        _ID
      }
    });
  }
}

export default new Inventory();
