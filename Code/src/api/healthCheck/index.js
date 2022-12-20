import envPrefix from '../../utils/prefix';
import envUrl from '../../utils/baseUrl';
import http from '../../utils/request2';

class HealthCheck {
  // webdp
  checkWebdp() {
    const path = envUrl.webdp + envPrefix.webdp;
    return http(`${path}/healthCheck `, {
      method: 'GET'
    });
  }

  checkCamunda() {
    const path = envUrl.camunda + envPrefix.camunda;
    return http(`${path}/healthCheck `, {
      method: 'GET'
    });
  }

  checkEmail() {
    const path = envUrl.email + envPrefix.email;
    return http(`${path}/healthCheck `, {
      method: 'GET'
    });
  }

  checkFile() {
    const path = envUrl.file + envPrefix.file;
    return http(`${path}/healthCheck `, {
      method: 'GET'
    });
  }

  checkProject() {
    const path = envUrl.project + envPrefix.project;
    return http(`${path}/healthCheck `, {
      method: 'GET'
    });
  }

  checkQuartz() {
    const path = envUrl.timer + envPrefix.timer;
    return http(`${path}/healthCheck `, {
      method: 'GET'
    });
  }

  checkDatasync() {
    const path = envUrl.sync + envPrefix.sync;
    return http(`${path}/healthCheck `, {
      method: 'GET'
    });
  }

  checkAaa() {
    const path = envUrl.aaa + envPrefix.aaa;
    return http(`${path}/healthCheck `, {
      method: 'GET'
    });
  }

  checkWorkflow() {
    const path = envUrl.workflow + envPrefix.workflow;
    return http(`${path}/healthCheck `, {
      method: 'GET'
    });
  }

  checkLogging() {
    const path = envUrl.logging + envPrefix.logging;
    return http(`${path}/healthCheck `, {
      method: 'GET'
    });
  }

  checkResource() {
    const path = envUrl.resource + envPrefix.resource;
    return http(`${path}/healthCheck `, {
      method: 'GET'
    });
  }
}
export default new HealthCheck();
