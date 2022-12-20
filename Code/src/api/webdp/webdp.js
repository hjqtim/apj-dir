import envPrefix from '../../utils/prefix';
import envUrl from '../../utils/baseUrl';
import http from '../../utils/request';

const path = envUrl.webdp + envPrefix.webdp;

class Webdp {
  // 医院列表
  getHospitalList() {
    return http(`${path}/hospital/getHospitalList`, {
      method: 'GET'
    });
  }

  // 获取某间医院街道信息
  getBlockByHospCodeList(data) {
    return http(`${path}/hospital/getBlockByHospCodeList`, {
      method: 'GET',
      params: {
        hospCode: data
      }
    });
  }

  // 获取医院floor
  getBlockAndFloorByHospCodeList(params) {
    return http(`${path}/hospital/getBlockAndFloorByHospCodeList`, {
      method: 'GET',
      params
    });
  }

  // get rooms info
  getRoomInfo(params) {
    return http(`${path}/hospital/getRoomInfo`, {
      method: 'GET',
      params
    });
  }

  //   check AD
  getSiteContactByDP(type, data) {
    return http(`${path}/hospital/getSiteContact/${type}/${data}`, {
      method: 'GET'
    });
  }

  // getProjectNameList
  getProjectNameList(type) {
    return http(`${path}/projectName/getProjectNameList/${type}/active`, {
      method: 'GET'
    });
  }

  // getRequestList
  getRequestList(data) {
    return http(`${path}/dpRequest/getRequestList`, {
      method: 'POST',
      data
    });
  }

  // getDprequeststatusList
  getDprequeststatusList(data) {
    return http(`${path}/dpRequest/draft/dt`, {
      method: 'POST',
      data
    });
  }

  // getApprovalList
  getApprovalList(data) {
    return http(`${path}/dpRequest/camundaMyApproval`, {
      method: 'POST',
      data
    });
  }

  // DP save data
  saveDPRequest(data) {
    return http(`${path}/dpRequest/saveDPRequest`, { method: 'POST', data });
  }

  // AP save data
  saveAPRequest(data) {
    return http(`${path}/dpRequest/saveAPRequest`, { method: 'POST', data });
  }

  // service type 下拉框列表数据
  getOptionList(params) {
    return http(`${path}/optionType/getOptionList`, { method: 'GET', params });
  }

  getRequestForm(params) {
    // console.log(params);
    return http(`${path}/dpRequest/getRequest`, { method: 'GET', params });
  }

  // get AD Info
  checkADInfo(data) {
    return http(`${path}/ad/findUser`, {
      method: 'POST',
      data
    });
  }

  // get Corp Info
  getCorpInfo(data) {
    return http(`${path}/ad/getCorpInfo/${data.username}`, {
      method: 'GET'
    });
  }

  // get AD User List %like%
  getADUserList(data) {
    return http(`${path}/ad/findUserList?username=${data.username}`, {
      method: 'GET'
    });
  }

  // D/E submit
  deRequestSubmit(data) {
    return http(`${path}/dpDisableEnable/saveDisableEnable`, {
      method: 'POST',
      data
    });
  }

  // D/E detail
  deRequestDetail(data) {
    return http(
      `${path}/dpDisableEnable/getdeRequest?requestNo=${data.requestNo}&requestId=${data.requestId}`,
      {
        method: 'GET'
      }
    );
  }

  // N3 Save Back
  deRequestN3SaveBack(data) {
    return http(`${path}/dpDisableEnable/saveDisableEnable`, {
      method: 'POST',
      data
    });
  }

  // D/E DataPortID Chick Like
  deRequestCheckLikeID(data) {
    return http(
      `${path}/dpDisableEnable/ChecklikedataportID?outletID=${data.outletID}&hospital=${data.hospital}`,
      {
        method: 'GET'
      }
    );
  }

  // D/E DataPortID Check
  deRequestCheckIDStatus(params) {
    return http(
      // `${path}/dpDisableEnable/CheckdataportID?outletID=${data.outletID}&type=${data.type}&userId=${data.userId}`,
      `${path}/dpDisableEnable/CheckdataportID`,
      {
        method: 'GET',
        params
      }
    );
  }

  // get AddressBook of hostital
  getAddressBookHospital(data) {
    return http(`${path}/Contact_Point_of_HospitalController/getContactPointofHospital`, {
      method: 'POST',
      data
    });
  }

  // delete my application
  deleteApplication(requestNo) {
    return http(`${path}/dpRequest/deleteByRequestId/${requestNo}`, {
      method: 'DELETE'
    });
  }

  camundaMyRequest(data) {
    return http(`${path}/dpRequest/camundaMyRequest`, {
      method: 'POST',
      data
    });
  }

  camundaMyApproval(data) {
    return http(`${path}/dpRequest/camundaMyApproval`, {
      method: 'POST',
      data
    });
  }

  getRequester() {
    return http(`${path}/dpRequest/getRequesterList`, {
      method: 'POST'
    });
  }

  getStatusList() {
    return http(`${path}/rms/statusOfRequestForm/getStatusList`, {
      method: 'GET'
    });
  }

  getStaffNameList() {
    return http(`${path}/rms/staffName/getStaffNameList`, {
      method: 'GET'
    });
  }

  getOrderSummary(params) {
    return http(`${path}/rms/requestForm/getOrderSummary`, {
      method: 'GET',
      params
    });
  }

  getOrderList(requestNo, type) {
    return http(`${path}/rms/requestForm/getOrderList?requestNo=${requestNo}&type=${type}`, {
      method: 'GET'
    });
  }

  getREQForm(requestNo) {
    return http(`${path}/rms/DpReq/getREQ`, {
      method: 'GET',
      params: {
        dpNo: requestNo
      }
    });
  }

  getContractList(params) {
    return http(`${path}/rms/contract/getContractList`, {
      method: 'GET',
      params
    });
  }

  getProcurementContractList(params) {
    return http(`${path}/rms/contract/getProcurementContractList`, {
      method: 'GET',
      params
    });
  }

  getReqPartInfo(dpReqNo) {
    return http(`${path}/rms/DpReq/getReqPartInfo?dpReqNo=${dpReqNo}`, {
      method: 'GET'
    });
  }

  getFundingFXSummaryByTxCode(txCode) {
    return http(`${path}/allFundingTxMemoSummary/getFundingFXSummaryByTxCode?txCode=${txCode}`, {
      method: 'GET'
    });
  }

  checkBillReceivedDate(params) {
    return http(`${path}/allFundingTxMemoSummary/checkBillReceivedDate`, {
      method: 'GET',
      params
    });
  }

  saveOrderFrom(data) {
    return http(`${path}/rms/requestForm/saveOrderFrom`, {
      method: 'POST',
      data
    });
  }

  removeOrder(ids) {
    return http(`${path}/rms/requestForm/removeOrder/${ids}`, {
      method: 'DELETE'
    });
  }

  getOrderFromDetail(reqNo) {
    return http(`${path}/rms/requestForm/getOrderFrom?reqNo=${reqNo}`, {
      method: 'GET'
    });
  }

  getContractItemList({ contract, reqSubForm }) {
    return http(
      `${path}/rms/contract/getContractItemList?contract=${contract}&reqSubForm=${reqSubForm}`,
      {
        method: 'GET'
      }
    );
  }

  getAllStepName() {
    return http(`${path}/dpRequest/getAllStepName`, { method: 'GET' });
  }

  setBudgetHolder(data) {
    return http(`${path}/dpRequest/camundaSetBudgetHolder`, {
      method: 'POST',
      data
    });
  }

  getPRPreparation(params) {
    return http(`${path}/rms/requestForm/getPRPreparation`, {
      method: 'GET',
      params
    });
  }

  findUserList(params) {
    return http(`${path}/ad/findUserList`, {
      method: 'GET',
      params
    });
  }

  updatePRPreparation(data) {
    return http(`${path}/rms/requestForm/updatePRPreparation`, {
      method: 'POST',
      data
    });
  }

  exportExcelPRPreparation(params) {
    return http(`${path}/rms/requestForm/exportExcel`, {
      method: 'GET',
      params,
      responseType: 'blob'
    });
  }

  getPRPOSummary(params) {
    return http(`${path}/poMaster/getPRPOSummary`, {
      method: 'GET',
      params
    });
  }

  exportExcelPRPOSummary(params) {
    return http(`${path}/poMaster/exportExcel`, {
      method: 'GET',
      params,
      responseType: 'blob'
    });
  }

  savePRPOSummary(data) {
    return http(`${path}/poMaster/savePRPOSummary`, {
      method: 'POST',
      data
    });
  }

  // delete  PRPOSummary
  deletePRPOSummary(ids) {
    return http(`${path}/poMaster/deletePRPOSummary/${ids}`, {
      method: 'DELETE'
    });
  }

  getPoLineItem() {
    return http(`${path}/poLineItem/getPoLineItem`, {
      method: 'GET'
    });
  }

  savePoLineItem(data) {
    return http(`${path}/poLineItem/savePoLineItem`, {
      method: 'POST',
      data
    });
  }

  deletePoLineItem(ids) {
    return http(`${path}/poLineItem/deletePoLineItem/${ids}`, {
      method: 'DELETE'
    });
  }

  getGoodReceiptDnList() {
    return http(`${path}/rms/goodReceiptDn/getGoodReceiptDnList`, {
      method: 'GET'
    });
  }

  saveGoodReceiptDn(data) {
    return http(`${path}/rms/goodReceiptDn/saveGoodReceiptDn`, {
      method: 'POST',
      data
    });
  }

  deleteGoodReceiptDn(ids) {
    return http(`${path}/rms/goodReceiptDn/deleteGoodReceiptDn/${ids}`, {
      method: 'DELETE'
    });
  }

  getProblemLogList(params) {
    return http(`${path}/problemLog/getProblemLogList`, {
      method: 'GET',
      params
    });
  }

  saveProblemLog(data) {
    return http(`${path}/problemLog/saveProblemLog`, {
      method: 'POST',
      data
    });
  }

  deleteProblemLog(ids) {
    return http(`${path}/problemLog/deleteProblemLog/${ids}`, {
      method: 'DELETE'
    });
  }

  getFundTXSummaryList(params) {
    return http(`${path}/allFundingTxMemoSummary/getFundingTxSummaryList`, {
      method: 'GET',
      params
    });
  }

  saveFundTXSumarry(data) {
    return http(`${path}/allFundingTxMemoSummary/saveFundingTxSummary`, {
      method: 'POST',
      data
    });
  }

  deleteFundTXSummary(ids) {
    return http(`${path}/allFundingTxMemoSummary/deleteFundingTxSummary/${ids}`, {
      method: 'DELETE'
    });
  }

  getFundSummaryList({ status, txCode }) {
    return http(`${path}/fundingTransfer/getFundingTransferList?status=${status}`, {
      method: 'GET',
      params: {
        txCode
      }
    });
  }

  getSearchEndPointList(ipOrHostName) {
    return http(`${path}/networkInformation/getSearchEndPoint`, {
      method: 'GET',
      params: {
        ipOrHostName
      }
    });
  }

  saveUserInfo(data) {
    return http(`${path}/ad/saveUserInfo`, { method: 'POST', data });
  }

  queryDataPortList(data) {
    return http(`${path}/enable/queryDataPortIds`, { method: 'POST', data });
  }

  getProductDescription(poNo) {
    return http(`${path}/shortFormEquip/getProductDescription`, {
      method: 'GET',
      params: {
        poNo
      }
    });
  }

  updateFundingTransfer(data) {
    return http(`${path}/fundingTransfer/updateFundingTransfer`, {
      method: 'POST',
      data
    });
  }

  getFundingTransferList(params) {
    return http(`${path}/fundingTransfer/getFundingTransferList`, {
      method: 'GET',
      params
    });
  }

  exportExcel(data) {
    console.log('data: ', data);
    return http(`${path}/fundingTransfer/exportExcel`, {
      method: 'POST',
      data,
      responseType: 'blob'
    });
  }

  checkLoopDataPortID(params) {
    return http(`${path}/dpLoopingProtection/checkLoopDataPortID`, {
      method: 'GET',
      params
    });
  }

  getCOAInstitutionList() {
    return http(`${path}/dpCOAInstitution/getCOAInstitutionList`, {
      method: 'GET'
    });
  }

  getOperLogPage(params) {
    return http(`${path}/operLog/getOperLogPage`, {
      method: 'GET',
      params
    });
  }

  getNetworkCoverage(params) {
    return http(`${path}/networkCoverage/getNetworkCoverage`, {
      method: 'GET',
      params
    });
  }

  saveNmsExpenditure(data) {
    return http(`${path}/dpRequest/nmsExpenditure`, {
      method: 'POST',
      data
    });
  }

  getProcurementActionLog(params) {
    return http(`${path}/procurementActionLog/getPage`, {
      method: 'GET',
      params
    });
  }

  getGrantPermission(data) {
    return http(`${path}/grantPermission/dt`, {
      method: 'POST',
      data
    });
  }

  addGrantPermission(data) {
    return http(`${path}/grantPermission/add`, {
      method: 'POST',
      data
    });
  }

  deleteGrantPermission(id) {
    return http(`${path}/grantPermission/${id}/delete`, {
      method: 'DELETE'
    });
  }

  getInfoToPDF(params) {
    return http(`${path}/fundingTransfer/getInfoToPDF`, {
      method: 'GET',
      params
    });
  }

  getMyAcitionList(data) {
    return http(`${path}/camunda/queryActionPage`, {
      method: 'POST',
      data
    });
  }

  getMyRequestList(data) {
    return http(`${path}/camunda/queryRequestPage`, {
      method: 'POST',
      data
    });
  }

  myActionPrintPDF(params) {
    return http(`${path}/fundingTransfer/myActionPrintPDF`, {
      method: 'GET',
      params
    });
  }

  deleteContract(requestNo) {
    return http(`${path}/rms/contract/deleteContract/${requestNo}`, {
      method: 'DELETE'
    });
  }

  fundingTransferSendEmail(data) {
    return http(`${path}/fundingTransfer/sendEmail`, {
      method: 'POST',
      data
    });
  }

  saveFeedback(data) {
    return http(`${path}/network/feedBack/saveFeedback`, {
      method: 'POST',
      data
    });
  }

  getFeedbackList(params) {
    return http(`${path}/network/feedBack/getPage`, {
      method: 'GET',
      params
    });
  }

  getFeedbackDetailList(params) {
    return http(`${path}/network/feedBack/getActionLogPage`, {
      method: 'GET',
      params
    });
  }

  saveFeedbackTaken(data) {
    return http(`${path}/network/feedBack/saveFeedbackActionLog`, {
      method: 'POST',
      data
    });
  }

  saveContract(data) {
    return http(`${path}/rms/contract/saveContract`, {
      method: 'POST',
      data
    });
  }

  checkContract(params) {
    return http(`${path}/rms/contract/checkContract`, {
      method: 'GET',
      params
    });
  }

  detailContract(params) {
    return http(`${path}/rms/contract/detailContract`, {
      method: 'GET',
      params
    });
  }

  getRequestFormByDpReq(params) {
    return http(`${path}/fundingTransfer/getRequestFormByDpReq`, {
      method: 'GET',
      params
    });
  }

  updateCommentState(data) {
    return http(`${path}/network/feedBack/updateCommentState`, {
      method: 'POST',
      data
    });
  }

  sendFeedbackEmail(data) {
    return http(`${path}/network/feedBack/sendEmail`, {
      method: 'POST',
      data
    });
  }

  getCloset(params) {
    return http(`${path}/closet/getCloset`, {
      method: 'GET',
      params
    });
  }

  getEquipment(params) {
    return http(`${path}/closet/getEquipment`, {
      method: 'GET',
      params
    });
  }

  getEquipPort(params) {
    return http(`${path}/closet/getEquipPort`, {
      method: 'GET',
      params
    });
  }

  getDataPortList(params) {
    return http(`${path}/rms/requestForm/getDataPortList`, {
      method: 'GET',
      params
    });
  }

  generateOutletID(data) {
    return http(`${path}/closet/generateOutletID`, {
      method: 'POST',
      data
    });
  }

  getPoNo() {
    return http(`${path}/poLineItem/getPoNo`, {
      method: 'GET'
    });
  }

  getEquipModule(params) {
    return http(`${path}/closet/getEquipModule`, {
      method: 'GET',
      params
    });
  }

  getCableOrOutletType(params) {
    return http(`${path}/closet/getCableOrOutletType`, {
      method: 'GET',
      params
    });
  }

  getStatus(requesNo) {
    return http(`${path}/dpRequest/getAllWebdpStatus/${requesNo}`, { method: 'GET' });
  }

  getActionLogByRequestNo(requestNo) {
    return http(`${path}/dpRequestActionLog/getActionLogByRequestNo/${requestNo}`, {
      method: 'GET'
    });
  }

  closetSync(data) {
    return http(`${path}/dpLocation/closetSync`, {
      method: 'POST',
      data,
      noHandleError: true
    });
  }

  getInstitutionProfile() {
    return http(`${path}/institution/getInstitutionProfile`, {
      method: 'GET'
    });
  }

  getPRPOSummaryByPrCode(prCode) {
    return http(`${path}/poMaster/getPRPOSummaryByPrCode`, {
      method: 'GET',
      params: {
        prCode: prCode?.trim() || ''
      }
    });
  }

  getLoginByToken() {
    return http(`${path}/ad/getLoginByToken`, {
      method: 'POST'
    });
  }

  applyExamineCancelRequest(data) {
    return http(`${path}/dpRequest/applyExamineCancelRequest`, {
      method: 'POST',
      data
    });
  }

  examineCancelRequest(data) {
    return http(`${path}/dpRequest/examineCancelRequest`, {
      method: 'POST',
      data
    });
  }

  applyExaminePendingRequest(data) {
    return http(`${path}/dpRequest/applyExaminePendingRequest`, {
      method: 'POST',
      data
    });
  }

  examinePendingRequest(data) {
    return http(`${path}/dpRequest/examinePendingRequest`, {
      method: 'POST',
      data
    });
  }

  examinePendingRequestReally(data) {
    return http(`${path}/dpRequest/examinePendingRequestReally`, {
      method: 'POST',
      data
    });
  }

  getCompletedTXCode() {
    return http(`${path}/fundingTransfer/getCompletedTXCode`, {
      method: 'GET'
    });
  }

  getSwitchList(params) {
    return http(`${path}/switchToAnotherUser/getPage`, {
      method: 'GET',
      params
    });
  }

  saveSwitch(anotherCorpId) {
    return http(`${path}/switchToAnotherUser/saveSwitchToAnotherUser`, {
      method: 'POST',
      headers: {
        anotherCorpId
      }
    });
  }

  switchBack(anotherCorpId) {
    return http(`${path}/switchToAnotherUser/endPlayTheRole`, {
      method: 'POST',
      headers: {
        anotherCorpId
      }
    });
  }

  getClosetsAndSub(params) {
    return http(`${path}/ncs/getClosetsAndSub`, {
      method: 'GET',
      params: {
        hospital: params.hospital,
        closetId: params.closetId
      }
    });
  }

  getCabinetAndSub(params) {
    return http(`${path}/ncs/getCabinetAndSub`, {
      method: 'GET',
      params: {
        closetId: params.closetId,
        cabinetId: params.cabinetId
      }
    });
  }

  updateCloset(data) {
    return http(`${path}/ncs/updateCloset`, {
      method: 'POST',
      data
    });
  }

  updateCabinet(data) {
    return http(`${path}/ncs/updateCabinet`, {
      method: 'POST',
      data
    });
  }

  ncsUploadFile(data) {
    return http(`${path}/ncs/uploadFile`, {
      method: 'POST',
      data,
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  }

  ncsGetRequestList(data) {
    return http(`${path}/ncs/getRequestList`, {
      method: 'POST',
      data
    });
  }

  getEquipmentModels(params) {
    return http(`${path}/ncs/getEqumentModels`, {
      method: 'GET',
      params: {
        equipmentId: params.equipmentId
      }
    });
  }

  getCabinetPowerAndSub(params) {
    return http(`${path}/ncs/getCabinetPowerSourceAndSub`, {
      method: 'GET',
      params: {
        closetId: params.closetId,
        cabinetId: params.cabinetId,
        powerBarId: params.powerBarId
      }
    });
  }

  getRequestFormNCSInfo(params) {
    return http(`${path}/ncs/getRequestFormNCSInfo`, {
      method: 'GET',
      params
    });
  }

  updateCabinetPower(data) {
    return http(`${path}/ncs/cabinetPowerSource/update`, {
      method: 'POST',
      data
    });
  }

  updateEquipment(data) {
    return http(`${path}/ncs/updateEquipment`, {
      method: 'POST',
      data
    });
  }

  updateOutlet(data) {
    return http(`${path}/ncs/updateOutlet`, {
      method: 'POST',
      data
    });
  }

  updateOutletForConnection(data) {
    return http(`${path}/ncs/updateOutletForConnection`, {
      method: 'POST',
      data
    });
  }

  updateBackbone(data) {
    return http(`${path}/ncs/updateBackbone`, {
      method: 'POST',
      data
    });
  }

  getDataPortInfoList(params) {
    return http(`${path}/ncs/getDataPortInfoList`, {
      method: 'GET',
      params
    });
  }

  getDataPortSelect(params) {
    return http(`${path}/ncs/getDataPortSelect`, {
      method: 'GET',
      params
    });
  }

  getBackboneSelect(params) {
    return http(`${path}/ncs/getBackboneSelect`, {
      method: 'GET',
      params
    });
  }

  networkClosetRollback(data) {
    return http(`${path}/ncs/networkClosetRollback`, {
      method: 'POST',
      data
    });
  }

  getNetworkClosetActionLogs(params) {
    return http(`${path}/ncs/getNetworkClosetActionLogs`, {
      method: 'GET',
      params
    });
  }

  generateBackboneId(params) {
    return http(`${path}/ncs/generateBackboneId`, {
      method: 'GET',
      params
    });
  }

  getDEActionLogByRequestNo(requestNo) {
    return http(`${path}/dpDisableEnableActionLog/getDEActionLogByRequestNo/${requestNo}`, {
      method: 'GET'
    });
  }

  getProgressBarByRequestNo(requestNo) {
    return http(`${path}/dpDisableEnableActionLog/getProgressBarByRequestNo/${requestNo}`, {
      method: 'GET'
    });
  }

  saveCabinetPower(data) {
    return http(`${path}/ncs/cabinetPowerSource/insert`, {
      method: 'POST',
      data
    });
  }

  getCabinetPowerList(params) {
    return http(`${path}/ncs/getCabinetPowerSources`, {
      method: 'GET',
      params
    });
  }

  verifyBackboneId(params) {
    return http(`${path}/ncs/verifyBackboneId`, {
      method: 'GET',
      params
    });
  }

  getActionHistoryDetail(params) {
    return http(`${path}/ncs/getActionInfo`, {
      method: 'GET',
      params
    });
  }

  getEquipmentDetail(params) {
    return http(`${path}/ncs/getEquipmentDetail`, {
      method: 'GET',
      params
    });
  }

  getWoAPList(params) {
    return http(`${path}/ncs/getAPOutletList`, {
      method: 'GET',
      params
    });
  }

  getConnectPorts(params) {
    return http(`${path}/ncs/getConnectPorts`, {
      method: 'GET',
      params
    });
  }

  getWoOutlet(params) {
    return http(`${path}/ncs/getWoOutletList`, {
      method: 'GET',
      params
    });
  }

  getConnectPortActionLogs(params) {
    return http(`${path}/ncs/getEquipPortLogList`, {
      method: 'GET',
      params
    });
  }

  getEquipmentIp(params) {
    return http(`${path}/ncs/getEquipmentIPs`, {
      method: 'GET',
      params
    });
  }

  deleteConnectPort(data) {
    return http(`${path}/ncs/deleteConnectPort`, {
      method: 'POST',
      data
    });
  }

  updateConnectPort(data) {
    return http(`${path}/ncs/updateConnectPort`, {
      method: 'POST',
      data
    });
  }

  deleteCoupdateConnectPortnnectPort(data) {
    return http(`${path}/ncs/updateConnectPort`, {
      method: 'POST',
      data
    });
  }

  getCabinetSelect(params) {
    return http(`${path}/ncs/getCabinetSelect`, {
      method: 'GET',
      params
    });
  }

  getPanelSelect(params) {
    return http(`${path}/ncs/getPanelSelect`, {
      method: 'GET',
      params
    });
  }

  getCabinetIDList(params) {
    return http(`${path}/ncs/getCabinetIDList`, {
      method: 'GET',
      params
    });
  }

  getEquipmentFilterList(params) {
    return http(`${path}/ncs/getEquipmentFilterList`, {
      method: 'GET',
      params
    });
  }

  insertCloset(data) {
    return http(`${path}/ncs/insertCloset`, {
      method: 'POST',
      data
    });
  }

  saveActionInfo(data) {
    return http(`${path}/ncs/saveActionInfo`, {
      method: 'POST',
      data
    });
  }

  deleteCabinetPower(params) {
    return http(`${path}/ncs/cabinetPowerSource/delete`, {
      method: 'DELETE',
      params
    });
  }

  updateEquip(data) {
    return http(`${path}/ncs/updateEquip`, {
      method: 'POST',
      data
    });
  }

  equipUpdateModule(data) {
    return http(`${path}/ncs/equipUpdateModule`, {
      method: 'POST',
      data
    });
  }

  getHistoryEquip(params) {
    return http(`${path}/ncs/getHistoryEquip`, {
      method: 'GET',
      params
    });
  }

  insertHistoryEquip(data) {
    return http(`${path}/ncs/insertHistoryEquip`, {
      method: 'POST',
      data
    });
  }

  getShortFormEquipByEquip() {
    return http(`${path}/ncs/getShortFormEquipByEquip`, {
      method: 'GET'
    });
  }

  getItemList() {
    return http(`${path}/networkDesign/getItemList`, {
      method: 'GET'
    });
  }

  getPackageList() {
    return http(`${path}/networkDesign/getPackageList`, {
      method: 'GET'
    });
  }

  getPackageDetail() {
    return http(`${path}/networkDesign/getPackageDetails`, {
      method: 'GET'
    });
  }

  checkPackageName() {
    return http(`${path}/networkDesign/checkPackageName`, {
      method: 'GET'
    });
  }

  savePackage(data) {
    return http(`${path}/networkDesign/savePackage`, {
      method: 'POST',
      data
    });
  }

  generateCabinetId(params) {
    return http(`${path}/ncs/generateCabinetId`, {
      method: 'GET',
      params
    });
  }

  generateRefId(params) {
    return http(`${path}/ncs/generateRefId`, {
      method: 'GET',
      params
    });
  }

  verifyOutlet(params) {
    return http(`${path}/ncs/verifyOutlet`, {
      method: 'GET',
      params
    });
  }
}

export default new Webdp();
