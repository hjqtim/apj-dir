import envPrefix from '../../utils/prefix';
import envUrl from '../../utils/baseUrl';
import http from '../../utils/request';

const path = envUrl.message + envPrefix.message;

class Message {
  getMessageList(params) {
    return http(`${path}/message/getMessageList`, {
      method: 'GET',
      params
    });
  }

  getMessagePage(params) {
    return http(`${path}/message/getPage`, {
      method: 'GET',
      params
    });
  }

  saveMessage(data) {
    return http(`${path}/message/saveMessage`, {
      method: 'POST',
      data
    });
  }

  getMessageDetail(messageId) {
    return http(`${path}/message/getDetail/${messageId}`, {
      method: 'GET'
    });
  }

  updateMessage(data) {
    return http(`${path}/message/updateMessage`, {
      method: 'POST',
      data
    });
  }

  deleteMessage(id) {
    return http(`${path}/message/deleteMessage/${id}`, {
      method: 'DELETE'
    });
  }

  getMessage4user(params) {
    return http(`${path}/message/getMessage4User`, {
      method: 'GET',
      params
    });
  }

  hasReadMessage(messageId) {
    return http(`${path}/message/readMessage/${messageId}`, {
      method: 'POST'
    });
  }
}
export default new Message();
