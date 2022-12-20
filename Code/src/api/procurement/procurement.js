import envPrefix from '../../utils/prefix';
import envUrl from '../../utils/baseUrl';
import http from '../../utils/request';

const path = envUrl.webdp + envPrefix.webdp;

class Procurement {
  // 医院列表
  getPrpoSummaryList() {
    console.log('run code');
    return http(`${path}/poMaster/getPRPOSummary`, {
      method: 'GET',
      params: {
        // fiscalYear: '',
        lanPool: 2
      }
    });
  }

  getGoodReceiptDnList() {
    return http(`${path}/rms/goodReceiptDn/getGoodReceiptDnList`, {
      method: 'GET'
    });
  }

  getPoLineItem() {
    return http(`${path}/poLineItem/getPoLineItem`, {
      method: 'GET'
    });
  }
}
export default new Procurement();
