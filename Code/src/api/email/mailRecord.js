import envPrefix from '../../utils/prefix';
import envUrl from '../../utils/baseUrl';
import http from '../../utils/request';

const path = envUrl.email + envPrefix.email;

class MailRecord {
  // 查询邮件模板列表
  getEmailRecordList(data) {
    return http(`${path}/email/list`, {
      method: 'POST',
      data
    });
  }

  //  根据模板ID查询邮件记录
  searchRecordById(id) {
    return http(`${path}/email/list/${id}`, {
      method: 'POST'
    });
  }

  //  重新发送邮件
  resendEmail(data) {
    return http(`${path}/email/send`, {
      method: 'POST',
      data
    });
  }
}
export default new MailRecord();
