import envPrefix from '../utils/prefix';
import envUrl from '../utils/baseUrl';
import http from '../utils/request';

const path = envUrl.aaa + envPrefix.aaa;

class DynamicForm {
  list(params) {
    return http(`${path}/dc/list`, {
      method: 'GET',
      params
    });
  }
}

export default new DynamicForm();
