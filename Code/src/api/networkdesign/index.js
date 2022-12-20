import envPrefix from '../../utils/prefix';
import envUrl from '../../utils/baseUrl';
import http from '../../utils/request';

const path = envUrl.webdp + envPrefix.webdp;

class NetWorkDesign {
  // 获取 需要 开会的 requestNo.
  getRequestNoList(params) {
    return http(`${path}/networkDesignMeeting/getRequestNo`, {
      method: 'GET',
      params
    });
  }

  // 保存 meeting ，利用 使用上传 文件方式 夹带 数据
  toSaveMeetingData(data) {
    return http(`${path}/networkDesignMeeting/saveMeeting`, {
      method: 'POST',
      data
    });
  }

  // 获取 会议 列表
  getMeetingList(params) {
    return http(`${path}/networkDesignMeeting/getMeetingList`, {
      method: 'GET',
      params
    });
  }

  // 获取 会议 detail
  getMeetingDetail(params) {
    return http(`${path}/networkDesignMeeting/getMeetingDetails`, {
      method: 'GET',
      params
    });
  }
}

export default new NetWorkDesign();
