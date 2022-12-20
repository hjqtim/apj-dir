import envPrefix from '../../utils/prefix';
import envUrl from '../../utils/baseUrl';
import http from '../../utils/request';

const path = envUrl.email + envPrefix.email;

class Template {
  // 邮件模板列表
  getEmailLists(data) {
    return http(`${path}/system/template/list`, {
      method: 'POST',
      data
    });
  }

  //   删除模板
  deleteTemplates(data) {
    return http(`${path}/system/template/remove`, {
      method: 'DELETE',
      data
    });
  }
}

export default new Template();
