import envPrefix from '../utils/prefix';
import envUrl from '../utils/baseUrl';
import http from '../utils/request';

const path = envUrl.camunda + envPrefix.camunda;

class Camunda {
  getProcessDefinition(url, params) {
    return http(`${path}${url}`, {
      method: 'GET',
      params
    });
  }

  saveModel(data) {
    return http(`${path}/model/save`, {
      method: 'POST',
      data
    });
  }

  getModelFile(modelId) {
    return http(`${path}/model/get/${modelId}`, {
      method: 'GET'
    });
  }

  startProcess(data) {
    return http(`${path}/process/startProcessTest`, {
      method: 'POST',
      data
    });
  }

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
    return http(`${path}/task/myApproval`, {
      method: 'POST',
      data
    });
  }

  actionTask(data) {
    return http(`${path}/task/actionTask`, {
      method: 'POST',
      data
    });
  }

  getProcessPoint(params) {
    return http(`${path}/task/getProcessPoint`, {
      method: 'GET',
      params
    });
  }

  addMessage(data) {
    return http(`${path}/task/addTaskMessage`, {
      method: 'POST',
      data
    });
  }

  getTaskMessage(params) {
    return http(`${path}/task/getTaskMessage`, {
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

  queryStepName() {
    return http(`${path}/task/getAllStepName`, {
      method: 'GET'
    });
  }
}

export default new Camunda();
