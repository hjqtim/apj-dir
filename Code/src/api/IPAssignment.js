import envPrefix from '../utils/prefix';
import envUrl from '../utils/baseUrl';
import http from '../utils/request';

const newPath = envUrl.resource + envPrefix.resource;

class IPAssignment {
  list(params) {
    return http(`${newPath}/ipAssign/list`, {
      method: 'GET',
      params
    });
  }

  create(data) {
    return http(`${newPath}/ipAssign/create`, {
      method: 'POST',
      data
    });
  }

  detail(params) {
    return http(`${newPath}/ipAssign/detail`, {
      method: 'GET',
      params
    });
  }

  update(id, data) {
    return http(`${newPath}/ipAssign/update`, {
      method: 'PUT',
      params: {
        id
      },
      data
    });
  }

  deleteMany(data) {
    return http(`${newPath}/ipAssign/deleteMany`, {
      method: 'DELETE',
      data
    });
  }

  checkIpExist(params) {
    return http(`${newPath}/ipAssign/checkIpExist`, {
      method: 'GET',
      params
    });
  }
}

export default new IPAssignment();
