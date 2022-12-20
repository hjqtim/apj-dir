import envPrefix from '../../utils/prefix';
import envUrl from '../../utils/baseUrl';
import http from '../../utils/request';

const path = envUrl.resourcem + envPrefix.resourcem;

class Resource {
  // 根据 DP AP IP IPR IPU DE LP 类型 获取 requestNo.
  searchApplicationType(params) {
    return http(`${path}/search/getRequestNo`, {
      method: 'GET',
      params
    });
  }

  // 只用在 首次 新增 数据
  saveApplication(data) {
    return http(`${path}/resource-management/save`, {
      method: 'POST',
      data
    });
  }

  getCalendarList(params) {
    return http(`${path}/resource-management/getCalendarList`, {
      method: 'GET',
      params
    });
  }

  getDetailData(requestNo) {
    return http(`${path}/resource-management/getDetail/${requestNo}`, {
      method: 'GET'
    });
  }

  // 只能用在详情 更新
  toUpdateData(data) {
    return http(`${path}/resource-management/update`, {
      method: 'POST',
      data
    });
  }

  // 拖动更新 日历
  updateStart8Target(data) {
    return http(`${path}/resource-management/updateStart8Target`, {
      method: 'POST',
      data
    });
  }

  // 下载 excel
  getExcelUrl(data) {
    return http(`${path}/search/exportExcel`, {
      method: 'POST',
      data
    });
  }

  // 提交 submit， 没Save ，直接 submit 那种
  toSubmitApply(data) {
    return http(`${path}/resource-management/apply`, {
      method: 'POST',
      data
    });
  }

  // 针对 save 那种 requestNo 再提交 用 的
  startProcess(data) {
    return http(`${path}/resource-management/startProcess/${data.requestNo}`, {
      method: 'POST',
      data
    });
  }

  // N3 审核
  doN3Examine(data) {
    return http(`${path}/resource-management/N3Examine`, {
      method: 'POST',
      data
    });
  }

  // 审核流程 done
  doApprovalTask(data) {
    return http(`${path}/resource-management/doTask`, {
      method: 'POST',
      data
    });
  }

  // 逻辑删除
  doDeleteResource(requestNo) {
    return http(`${path}/resource-management/deleteRequest/${requestNo}`, {
      method: 'DELETE'
    });
  }

  // 获取 Actionlog
  getActionLog(params) {
    return http(`${path}/resource-management/getPageByActionLog`, {
      method: 'GET',
      params
    });
  }
}

export default new Resource();
