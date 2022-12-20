import envPrefix from '../../utils/prefix';
import envUrl from '../../utils/baseUrl';
import http from '../../utils/request';

const path = envUrl.webdp + envPrefix.webdp;

class MyAction {
  setEndorsementPerson(data) {
    return http(`${path}/dpRequest/SetEndorsement`, {
      method: 'POST',
      data
    });
  }

  siteVisitArrangement(data) {
    return http(`${path}/dpRequest/siteApproval`, {
      method: 'POST',
      data
    });
  }

  siteVisitReport(data) {
    return http(`${path}/dpRequest/siteSurveyReport`, {
      method: 'GET',
      params: {
        requestNo: data
      }
    });
  }

  setResponsibleStaff(data) {
    return http(`${path}/dprequest/responsiblestaff`, {
      method: 'POST',
      data
    });
  }

  setBudgetHolder(data) {
    return http(`${path}/dpRequest/SetBudgetHolder`, {
      method: 'POST',
      data
    });
  }

  externalNetworkApproval(data) {
    return http(`${path}/dpRequest/ExternalNetworkApproval`, {
      method: 'POST',
      data
    });
  }

  requesterManagerApproval(data) {
    return http(`${path}/dpRequest/RManagerApproval`, {
      method: 'POST',
      data
    });
  }

  getMyActionDetail(data) {
    return http(`${path}/dpRequest/camundaMyApproval`, {
      method: 'POST',
      data
    });
  }

  fundConfirm(data) {
    return http(`${path}/dpRequest/fundConfirmApproval`, {
      method: 'POST',
      data
    });
  }

  finalizeNetworkDesign(requestId) {
    return http(`${path}/dpRequest/networkDesignFinalized/${requestId}`, {
      method: 'GET'
    });
  }

  getNmsFindUserList() {
    return http(`${path}/dpRequest/nmsFindUserList`, {
      method: 'GET'
    });
  }

  saveNmsResponsible(data) {
    return http(`${path}/dpRequest/nmsResponsible`, {
      method: 'POST',
      data
    });
  }

  getNewPrice(params) {
    return http(`${path}/dpRequest/getNewPrice`, {
      method: 'GET',
      params
    });
  }

  quotationEstimated(data) {
    return http(`${path}/dpRequest/quotationEstimated`, {
      method: 'POST',
      data
    });
  }

  requireNetworkDesign(data) {
    return http(`${path}/dpRequest/networkDesignApproval`, {
      method: 'POST',
      data
    });
  }

  sendDoc(data) {
    return http(`${path}/dpRequest/sentDocument`, {
      method: 'POST',
      data
    });
  }

  getRequestForm(params) {
    // console.log('getRequestForm', params);
    return http(`${path}/dpRequest/getRequest`, { method: 'GET', params });
  }

  saveConduitType(data) {
    return http(`${path}/apLocation/saveConduitType`, {
      method: 'POST',
      data
    });
  }

  setRequesterManager(data) {
    return http(`${path}/dpRequest/SetRManager`, { method: 'POST', data });
  }

  taskComplete(data) {
    return http(`${path}/dpRequest/taskCompleted`, { method: 'POST', data });
  }

  saveSiteVisit(data) {
    return http(`${path}/dpRequest/siteApproval`, { method: 'POST', data });
  }

  saveLanPool(data) {
    return http(`${path}/dpRequest/saveLanPool`, { method: 'POST', data });
  }

  endorsementApproval(data) {
    return http(`${path}/dpRequest/EndorsementApproval`, { method: 'POST', data });
  }

  generateDocument(data) {
    return http(`${path}/dpRequest/generateDocument`, { method: 'POST', data });
  }

  quoteByDP(data) {
    return http(`${path}/autoQuotation/valuation`, { method: 'POST', data });
  }

  quoteByAP(data) {
    return http(`${path}/autoQuotation/valuationAP`, { method: 'POST', data });
  }
}

export default new MyAction();
