import envPrefix from '../../utils/prefix';
import envUrl from '../../utils/baseUrl';
import http from '../../utils/request';

const path = envUrl.timer + envPrefix.timer;

class Timer {
  getJobList(params) {
    return http(`${path}/job/list`, {
      method: 'GET',
      params
    });
  }

  updateState(data) {
    return http(`${path}/job/updateState`, {
      method: 'POST',
      data
    });
  }

  saveJob(data) {
    return http(`${path}/job/add`, {
      method: 'POST',
      data
    });
  }

  removeJob(data) {
    return http(`${path}/job/remove`, {
      method: 'POST',
      data
    });
  }

  getLogList(params) {
    return http(`${path}/job/getLogList`, {
      method: 'GET',
      params
    });
  }
}

export default new Timer();
