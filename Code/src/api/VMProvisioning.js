import envPrefix from '../utils/prefix';
import envUrl from '../utils/baseUrl';
import http from '../utils/request';

const path = envUrl.workflow + envPrefix.workflow;

class VMProvisioning {
  list(params) {
    return http(`${path}/VmProvisioningRequest/getVmProvisioningRequest`, {
      method: 'GET',
      params
    });
  }

  create(data) {
    return http(`${path}/VmProvisioningRequest/createVmProvisioningRequest`, {
      method: 'POST',
      data
    });
  }

  detail(id) {
    return http(`${path}/VmProvisioningRequest/getVmProvisioningRequestById`, {
      method: 'GET',
      params: {
        id
      }
    });
  }

  update(id, data) {
    return http(`${path}/VmProvisioningRequest/updateVmProvisioningRequest`, {
      method: 'PUT',
      params: {
        id
      },
      data
    });
  }

  deleteMany(data) {
    return http(`${path}/VmProvisioningRequest/deleteVmProvisioningRequest`, {
      method: 'DELETE',
      data
    });
  }
}

export default new VMProvisioning();
