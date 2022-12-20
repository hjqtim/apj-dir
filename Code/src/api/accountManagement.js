import http from '../utils/request';
import envPrefix from '../utils/prefix';
import envUrl from '../utils/baseUrl';

const path = envUrl.aaa + envPrefix.aaa;

class AccountManagement {
  userExistsMany(data) {
    return http(`${path}/accountManagement/userExistsMany`, {
      method: 'POST',
      data
    });
  }

  checkUsers(data) {
    return http(`${path}/accountManagement/checkUsers`, {
      method: 'POST',
      data
    });
  }

  findUsers(data) {
    return http(`${path}/accountManagement/findUsers`, {
      method: 'POST',
      data
    });
  }

  getUsersByEmails(data) {
    return http(`${path}/accountManagement/getUsersByEmails`, {
      method: 'POST',
      data
    });
  }

  getPublicKey() {
    return http(`${path}/accountManagement/getPublicKey`, {
      method: 'GET'
    });
  }

  getDisplayName(data) {
    return http(`${path}/accountManagement/getDisplayName`, {
      method: 'POST',
      data
    });
  }
}

export default new AccountManagement();
