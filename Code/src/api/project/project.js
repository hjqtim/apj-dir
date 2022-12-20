import envPrefix from '../../utils/prefix';
import envUrl from '../../utils/baseUrl';
import http from '../../utils/request';

const path = envUrl.project + envPrefix.project;

class Project {
  // 查询列表
  getProjectList(data) {
    return http(`${path}/project/list`, {
      method: 'POST',
      data
    });
  }

  // 修改数据
  modifyProject(data) {
    return http(`${path}/project/modifyProject`, {
      method: 'PUT',
      data
    });
  }

  // 新增数据
  insertProject(data) {
    return http(`${path}/project/insertProject`, {
      method: 'POST',
      data
    });
  }

  // 检查数 Project 是否存在
  checkProject(params) {
    return http(`${path}/project/checkProject`, {
      method: 'GET',
      params
    });
  }

  // 同步数据
  getProjectByAPI(params) {
    return http(`${path}/project/getProjectByAPI`, {
      method: 'GET',
      params
    });
  }

  //  根据ID查询数据
  searchDetailById(params) {
    return http(`${path}/project/getProject`, {
      params,
      method: 'GET'
    });
  }
}
export default new Project();
