import envPrefix from '../utils/prefix';
import envUrl from '../utils/baseUrl';
import http from '../utils/request';

const path = envUrl.aaa + envPrefix.aaa;

class role {
  list(params) {
    return http(`${path}/tenant_group_mapping/list`, {
      method: 'GET',
      params
    });
  }

  create(data) {
    return http(`${path}/tenant_group_mapping/create`, {
      method: 'POST',
      data
    });
  }

  detail(id) {
    return http(`${path}/tenant_group_mapping/detail`, {
      method: 'GET',
      params: {
        id
      }
    });
  }

  update(id, data) {
    return http(`${path}/tenant_group_mapping/update`, {
      method: 'PUT',
      params: {
        id
      },
      data
    });
  }

  deleteMany(data) {
    return http(`${path}/tenant_group_mapping/deleteMany`, {
      method: 'DELETE',
      data
    });
  }

  checkExist(id, tenantId, groupId) {
    return http(`${path}/tenant_group_mapping/checkExist`, {
      method: 'GET',
      params: {
        id,
        tenantId,
        groupId
      }
    });
  }

  handledList() {
    return http(`${path}/tenant_group_mapping/handledList`, {
      method: 'GET'
    });
  }
}

export default new role();
