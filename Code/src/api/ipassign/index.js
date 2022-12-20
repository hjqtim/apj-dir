import envPrefix from '../../utils/prefix';
import envUrl from '../../utils/baseUrl';
import http from '../../utils/request';

const path = envUrl.ipassign + envPrefix.ipassign;

class Ipassign {
  saveIpReqeust(data) {
    return http(`${path}/ipRequest/saveIpRequest`, {
      method: 'POST',
      data
    });
  }

  getInfoByOutLetID(params) {
    return http(`${path}/ipRequest/getInfoByOutLetID`, {
      method: 'GET',
      params
    });
  }

  getEqupmentTypeList() {
    return http(`${path}/ipEquipmentList/getEquipmentTypeList`, {
      method: 'GET'
    });
  }

  getIpReqeust(params) {
    return http(`${path}/ipRequest/getIpRequest`, {
      method: 'GET',
      params
    });
  }

  AwaitingConfiguration(data) {
    return http(`${path}/ipRequest/AwaitingConfiguration`, {
      method: 'POST',
      data
    });
  }

  AwaitingConfirm(data) {
    return http(`${path}/ipRequest/AwaitingConfirm`, {
      method: 'POST',
      data
    });
  }

  checkIp(params) {
    return http(`${path}/ipRequest/checkIp`, {
      method: 'GET',
      params
    });
  }

  getRangeIp(params) {
    return http(`${path}/ipSubnetList/getRangeIp`, {
      method: 'GET',
      params
    });
  }

  getBit(params) {
    return http(`${path}/ipBit/getBit`, {
      method: 'GET',
      params
    });
  }

  applyRequest(data) {
    return http(`${path}/ipRelease/applyRequest`, {
      method: 'POST',
      data
    });
  }

  examine(data) {
    return http(`${path}/ipRelease/examine`, {
      method: 'POST',
      data
    });
  }

  getDetails(requestNo) {
    return http(`${path}/ipRelease/getDetails/${requestNo}`, {
      method: 'GET'
    });
  }

  getSubnetList(params) {
    return http(`${path}/ipSubnetList/getSubnetList`, {
      method: 'GET',
      params
    });
  }

  getIpAdminList(params) {
    return http(`${path}/ipRequest/getIpAdminList`, {
      method: 'GET',
      params
    });
  }

  ipAdminListUpdate(data) {
    return http(`${path}/ipRequest/ipAdminListUpdate`, {
      method: 'POST',
      data
    });
  }

  copyIpAddress(data) {
    return http(`${path}/ipRequest/copyIpAddress`, {
      method: 'POST',
      data
    });
  }

  updateListData(data) {
    return http(`${path}/ipSubnetList/updateListData`, {
      method: 'POST',
      data
    });
  }

  getActionsList(params) {
    return http(`${path}/procurementActionLog/getPage`, {
      method: 'GET',
      params
    });
  }

  getListPage(params) {
    return http(`${path}/ipSubnetList/getListPage`, {
      method: 'GET',
      params
    });
  }

  addSubnet(data) {
    return http(`${path}/ipSubnetList/addSubnet`, {
      method: 'POST',
      data
    });
  }

  getIpListUpdateMac(params) {
    return http(`${path}/ipUpdate/getIpList`, {
      method: 'GET',
      params
    });
  }

  ipUpdateRequest(data) {
    return http(`${path}/ipUpdate/applyIpUpdateRequest`, {
      method: 'POST',
      data
    });
  }

  getIpUpdateMacDetail(params) {
    return http(`${path}/ipUpdate/getDetail/${params}`, {
      method: 'GET'
    });
  }

  ipUpdateApproval(data) {
    return http(`${path}/ipUpdate/examine`, {
      method: 'POST',
      data
    });
  }

  getIpBySubnetAndBit(params) {
    return http(`${path}/ipRequest/getIpBySubnetAndBit`, {
      method: 'GET',
      params
    });
  }

  ipUpdateN3Save(data) {
    return http(`${path}/ipUpdate/updateIpList`, {
      method: 'POST',
      data
    });
  }

  getSubnetGateway(params) {
    return http(`${path}/ipSubnetList/getSubnetGateway`, {
      method: 'GET',
      params
    });
  }

  getOnlySubnetFirstTwo(params) {
    return http(`${path}/ipSubnetList/getOnlySubnetFirstTwo`, {
      method: 'GET',
      params
    });
  }

  importCSV2IPList(data) {
    return http(`${path}/ipRequest/excelInputIpAdmin`, {
      method: 'POST',
      data
    });
  }

  exportExcelIPList(data) {
    return http(`${path}/ipRequest/exportExcel`, {
      method: 'POST',
      data
      // responseType: 'blob'
    });
  }

  getSiteCode(params) {
    return http(`${path}/ipSubnetList/getSiteCode`, {
      method: 'GET',
      params
    });
  }
}
export default new Ipassign();
