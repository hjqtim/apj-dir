import envPrefix from '../utils/prefix';
import envUrl from '../utils/baseUrl';
import http from '../utils/request';

const path = envUrl.aaa + envPrefix.aaa;

class DynamicForm {
  save(data) {
    return http(`${path}/dynamicForm/save`, {
      method: 'POST',
      data
    });
  }

  create(data) {
    return http(`${path}/diyForm/create`, {
      method: 'POST',
      data
    });
  }

  createWorkFlow(data) {
    return http(`${path}/workflow/create`, {
      method: 'POST',
      data
    });
  }

  workFlowDetail(params) {
    return http(`${path}/workflow/detail`, {
      method: 'GET',
      params
    });
  }
}

export default new DynamicForm();
