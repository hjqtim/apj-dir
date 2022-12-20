import envPrefix from '../utils/prefix';
import envUrl from '../utils/baseUrl';
import http from '../utils/request';

const newPath = envUrl.resource + envPrefix.resource;

class IinventoryLifeCycle {
  list(params) {
    return http(`${newPath}/inventoryLifeCycle/list`, {
      method: 'GET',
      params
    });
  }

  listInventorys(params) {
    return http(`${newPath}/inventoryLifeCycle/listInventorys`, {
      method: 'GET',
      params
    });
  }

  create(data) {
    return http(`${newPath}/inventoryLifeCycle/create`, {
      method: 'POST',
      data
    });
  }

  detail(id) {
    return http(`${newPath}/inventoryLifeCycle/detail`, {
      method: 'GET',
      params: {
        id
      }
    });
  }

  update(id, data) {
    return http(`${newPath}/inventoryLifeCycle/update`, {
      method: 'PUT',
      params: {
        id
      },
      data
    });
  }

  deleteMany(data) {
    return http(`${newPath}/inventoryLifeCycle/deleteMany`, {
      method: 'DELETE',
      data
    });
  }

  checkIDExist(id, _ID) {
    return http(`${newPath}/inventoryLifeCycle/checkIDExist`, {
      method: 'GET',
      params: {
        id,
        _ID
      }
    });
  }
}

export default new IinventoryLifeCycle();
