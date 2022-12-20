import envPrefix from '../../utils/prefix';
import envUrl from '../../utils/baseUrl';
import http from '../../utils/request';

const path = envUrl.email + envPrefix.email;
const filepath = envUrl.file + envPrefix.file;

class TemplateManage {
  // 保存邮件模板
  addTemplate(data) {
    return http(`${path}/system/template/add`, {
      method: 'POST',
      data
    });
  }

  // 保存邮件模板
  updateTemplate(data) {
    return http(`${path}/system/template/edit`, {
      method: 'POST',
      data
    });
  }

  //  根据模板ID查询模板
  searchTemplateById(templateId) {
    return http(`${path}/system/template/view/${templateId}`, {
      method: 'GET'
    });
  }

  //  查询模板名是否存在
  templateIsExit(mouldName) {
    return http(`${path}/system/template/isRepetition/${mouldName}`, {
      method: 'GET'
    });
  }

  //   删除模板附件
  deleteFile(id) {
    return http(`${filepath}/resumeFile/delete_file/${id}`, {
      method: 'DELETE'
    });
  }

  //  上传附件文件
  uploadFile(data) {
    return http(`${filepath}/resumeFile/upload_file`, {
      method: 'POST',
      data
    });
  }
}
export default new TemplateManage();
