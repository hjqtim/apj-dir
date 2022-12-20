import envPrefix from '../utils/prefix';
import envUrl from '../utils/baseUrl';
import http from '../utils/request';

const path = envUrl.workflow + envPrefix.workflow;

class WorkFlow {
  getProcessDefinitions(params) {
    return http(`${path}/repository/modelList`, {
      method: 'GET',
      params
    });
  }

  getMyRequest(params) {
    return http(`${path}/ReuqestTask/getMyRequest`, {
      method: 'GET',
      params
    });
  }

  getDiagram(id) {
    return http(`${path}/runtime/process-instances/${id}/diagram`, {
      method: 'GET',
      responseType: 'arraybuffer'
    });
  }

  getPublishModel(id) {
    return http(`${path}/publish/${id}`, {
      method: 'GET'
    });
  }

  getProcessList(params) {
    return http(`${path}/deployment/getProcessDefinitions`, {
      method: 'GET',
      params
    });
  }

  getTaskListByGroup(data) {
    return http(`${path}/runtime/getTaskListByGroup`, {
      method: 'POST',
      data
    });
  }

  actionTask(data) {
    return http(`${path}/runtime/actionTask`, {
      method: 'POST',
      data
    });
  }

  getProcessPoint(params) {
    return http(`${path}/tree/getProcessPoint`, {
      method: 'GET',
      params
    });
  }

  addMessage(data) {
    return http(`${path}/runtime/addTaskMessage`, {
      method: 'POST',
      data
    });
  }

  getTaskMessage(params) {
    return http(`${path}/runtime/getTaskMessage`, {
      method: 'GET',
      params
    });
  }

  download(data) {
    return http(`${path}/export/getAccountPdf`, {
      method: 'POST',
      data,
      responseType: 'blob'
    });
  }
}

export default new WorkFlow();
