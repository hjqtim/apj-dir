import _ from 'lodash';
import TYPES from './my-action-action-types';
import DefaultValue from './DefaultValue';

const INITIAL_STATE = new DefaultValue();

const myApproval = (state = INITIAL_STATE, action) => {
  const { type, payload } = action;
  switch (type) {
    case TYPES.SET_READ_ONLY: {
      return { ...state, readOnly: action.payload };
    }
    case TYPES.SET_DETAIL: {
      return { ...state, detail: { ...state.detail, ...payload } };
    }
    case TYPES.SET_SITE_VISIT_ARRANGEMENT: {
      console.log(payload);
      return { ...state, siteVisitArrangement: payload };
    }
    case TYPES.SET_DETAIL_DP_REQUEST_STATUS: {
      return { ...state, detail: { ...state.detail, dpRequestStatus: action.payload } };
    }
    case TYPES.SET_NETWORK_DESIGN_FILES: {
      return { ...state, networkDesignFiles: action.payload };
    }
    case TYPES.SET_SVA_ERROR: {
      switch (payload.id) {
        case 'contact': {
          return {
            ...state,
            siteVisitArrangement: {
              ...state.siteVisitArrangement,
              error: { ...state.siteVisitArrangement.error, contact: payload.error }
            }
          };
        }
        case 'phone': {
          return {
            ...state,
            siteVisitArrangement: {
              ...state.siteVisitArrangement,
              error: { ...state.siteVisitArrangement.error, phone: payload.error }
            }
          };
        }
        case 'email': {
          return {
            ...state,
            siteVisitArrangement: {
              ...state.siteVisitArrangement,
              error: { ...state.siteVisitArrangement.error, email: payload.error }
            }
          };
        }
        default: {
          return { ...state };
        }
      }
    }
    case TYPES.SET_DATA: {
      return { ...action.payload };
    }
    case TYPES.SET_ACK: {
      return { ...state, nmsAck: action.payload };
    }
    case TYPES.SET_BUDGET_HOLDER: {
      return { ...state, budgetHolderInfo: action.payload };
    }
    case TYPES.SET_EXPENDITURE: {
      return { ...state, expenditure: action.payload };
    }
    case TYPES.SET_FUND_CONFIRM: {
      return { ...state, fundConfirm: action.payload };
    }
    case TYPES.SET_MANAGER_APPROVAL: {
      return { ...state, managerApproval: action.payload };
    }
    case TYPES.SET_PAYMENT_INFO: {
      return { ...state, paymentInfo: action.payload };
    }
    case TYPES.SET_QUOTATION_APPROVAL: {
      return { ...state, quotationApproval: action.payload };
    }
    case TYPES.SET_REQUESTER_MANAGER: {
      // console.log('SET_REQUESTER_MANAGER', action.payload);
      return { ...state, requesterManager: action.payload };
    }
    case TYPES.SET_RESPONSIBLE_STAFF: {
      return { ...state, responsibleStaff: action.payload };
    }
    case TYPES.SET_NETWORKDESIGN: {
      return { ...state, networkDesign: action.payload };
    }
    case TYPES.SET_NETWORKDESIGN_ITEM: {
      const { field, value } = action.payload;
      return { ...state, networkDesign: { ...state.networkDesign, [field]: value } };
    }
    case TYPES.SET_NMSRESPONSIBLE: {
      return { ...state, NMSResponsible: { ...action.payload } };
    }
    case TYPES.SET_NMSIGNMENTDATE: {
      return {
        ...state,
        NMSResponsible: { ...state.NMSResponsible, assignmentdate: action.payload }
      };
    }
    case TYPES.SET_LOCATIONLIST: {
      const { apLocationList = [], dpLocationList = [] } = action.payload || {};
      return { ...state, apLocationList, dpLocationList };
    }
    case TYPES.SET_REQUEST_FORM: {
      const newNetworkDesignFiles =
        action.payload?.requestFileList?.netWorkDesignList?.map((item) => ({
          name: item.fileName,
          size: item.fileSize,
          fileUrl: item.fileUrl,
          id: item.id
        })) || [];

      const { username, phone, title } = action?.payload?.NMSResponsible || {};
      const { dpRequest = {} } = action?.payload || {};
      const newNMSResponsible = { ...state.NMSResponsible };
      newNMSResponsible.staffUserId = username;
      newNMSResponsible.staffPhone = phone;
      newNMSResponsible.staffTitle = title;

      const {
        rmanagerphone = '',
        rmanageremail = '',
        rmanagerid = '',
        rmanagername = '',
        rmanagertitle = '',
        requesterremark = '',
        primaryEe,
        primaryEefy,
        secondaryEe,
        secondaryEefy,
        internalremarks,
        rmanagerremark,
        fundtransferredtohsteam,
        fundparty,
        paymentmethod,
        chartofaccount,
        budgetholdername,
        budgetholdertitle,
        budgetholderemail,
        budgetholderphone,
        budgetholderid,
        extbillcompanyname,
        extbillcontactname,
        extbillcontactphone,
        extbillcompanyadd,
        otherpaymentmethod,
        fundconfirmed,
        budgetholderremark,
        endorsementId,
        endorsementName,
        endorsementPhone,
        endorsementStatus,
        endorsementTitle,
        endorsementDate,
        endorsementRemark,
        endorsementApprovalStatus,
        externalNetworkRemark
      } = dpRequest;

      // manager information ↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓
      const newManagerInformation = { ...state.managerInformation };
      newManagerInformation.rmanagerphone = rmanagerphone;
      newManagerInformation.rmanageremail = rmanageremail;
      newManagerInformation.rmanagerid = rmanagerid;
      newManagerInformation.rmanagername = rmanagername;
      newManagerInformation.rmanagertitle = rmanagertitle;
      newManagerInformation.requesterremark = requesterremark;
      if (rmanagerid) {
        newManagerInformation.isNeedManager = true;
        const newOptionItem = {
          phone: rmanagerphone,
          mail: rmanageremail,
          corp: rmanagerid,
          display: rmanagername
        };
        newManagerInformation.options = [newOptionItem];
      }
      // manager information ↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑

      const newExpenditure = {
        current: {
          amount: primaryEe ?? '',
          fiscalYear: primaryEefy || ''
        },
        next: {
          amount: secondaryEe ?? '',
          fiscalYear: secondaryEefy || ''
        },
        remark: internalremarks || ''
      };

      // budget holder ↓↓↓↓↓↓↓↓↓↓↓↓

      const newBudgetHolder = {
        ...state.myBudgetHolder,
        fundtransferredtohsteam,
        fundparty: parseInt(fundtransferredtohsteam) === 1 ? fundparty : '',
        paymentmethod: paymentmethod || '',
        budgetholdername: budgetholdername || '',
        budgetholdertitle: budgetholdertitle || '',
        budgetholderemail: budgetholderemail || '',
        budgetholderphone: budgetholderphone || '',
        budgetholderid: budgetholderid || '',
        extbillcompanyname: extbillcompanyname || '',
        extbillcontactname: extbillcontactname || '',
        extbillcontactphone: extbillcontactphone || '',
        extbillcompanyadd: extbillcompanyadd || '',
        otherpaymentmethod: otherpaymentmethod || '',
        fundconfirmed: fundconfirmed || 0
      };
      const chartofaccountArr = chartofaccount?.split?.('-') || [];

      newBudgetHolder.cardNo[0] = chartofaccountArr[0] || '';
      newBudgetHolder.cardNo[1] = chartofaccountArr[1] || '';
      newBudgetHolder.cardNo[2] = chartofaccountArr[2] || '';
      newBudgetHolder.cardNo[3] = chartofaccountArr[3] || '';
      newBudgetHolder.cardNo[4] = chartofaccountArr[4] || '';
      newBudgetHolder.cardNo[5] = chartofaccountArr[5] || '';

      if (budgetholderid) {
        const optionItem = {
          corp: budgetholderid,
          display: budgetholdername,
          mail: budgetholderemail || '',
          phone: budgetholderphone || ''
        };
        newBudgetHolder.options = [optionItem];
      }

      // budget holder ↑↑↑↑↑↑↑↑↑↑↑↑↑↑

      // endorsement ↓↓↓↓↓↓↓↓↓↓↓
      const newEndorsement = state.endorsement;
      newEndorsement.endorsementId = endorsementId || '';
      newEndorsement.endorsementName = endorsementName || '';
      newEndorsement.endorsementPhone = endorsementPhone || '';
      newEndorsement.endorsementStatus = endorsementStatus || '';
      newEndorsement.endorsementTitle = endorsementTitle || '';
      newEndorsement.endorsementDate = endorsementDate || '';
      if (endorsementStatus === 'E') {
        const optionsItem = {
          corp: endorsementId,
          display: endorsementName,
          phone: endorsementPhone
        };
        newEndorsement.options = [optionsItem];
      }

      // endorsement ↑↑↑↑↑↑↑↑↑↑↑↑↑↑

      const newEndorsementApproval = {
        ...state.endorsementApproval,
        endorsementRemark: endorsementRemark || '',
        endorsementApprovalStatus,
        externalNetworkRemark: externalNetworkRemark || ''
      };

      const newValue = {
        managerInformation: newManagerInformation,
        NMSResponsible: newNMSResponsible,
        networkDesignFiles: newNetworkDesignFiles,
        expenditure: { ...state.expenditure, ...newExpenditure },
        myDprequeststatusno: dpRequest.dprequeststatusno,
        sentDocumentRemark: dpRequest.sentDocumentRemark,
        myBudgetHolder: newBudgetHolder,
        managerRemark: rmanagerremark || '',
        budgetholderremark: budgetholderremark || '',
        endorsement: { ...newEndorsement },
        endorsementApproval: newEndorsementApproval,
        requestForm: {
          ...action.payload
          // readOnly: false
        }
      };

      return {
        ...state,
        ..._.cloneDeep(newValue)
      };
    }
    case TYPES.SET_MY_BUDGET_HOLDER_BY_MYACTION: {
      return {
        ...state,
        myBudgetHolder: { ...state.myBudgetHolder, ...action.payload }
      };
    }

    case TYPES.SET_MANAGER_REMARK: {
      return {
        ...state,
        managerRemark: action.payload
      };
    }

    case TYPES.SET_BUDGET_HOLDER_REMARK: {
      return {
        ...state,
        budgetholderremark: action.payload
      };
    }

    case TYPES.SET_ENDORSEMENT: {
      return {
        ...state,
        endorsement: { ...state.endorsement, ...action.payload }
      };
    }

    case TYPES.SET_ENDORSEMENT_TOUCH: {
      return {
        ...state,
        endorsementTouch: { ...action.payload }
      };
    }

    case TYPES.SET_ENDORSEMENT_APPROVAL: {
      return {
        ...state,
        endorsementApproval: { ...state.endorsementApproval, ...action.payload }
      };
    }

    case TYPES.SET_MY_DPREQUESTSTATUSNO: {
      return {
        ...state,
        myDprequeststatusno: action.payload
      };
    }

    case TYPES.SET_SENTDOCUMENTRRMARK: {
      return {
        ...state,
        sentDocumentRemark: action.payload
      };
    }

    case TYPES.SET_ALL_MY_ACTION: {
      return {
        ...new DefaultValue()
      };
    }

    case TYPES.SET_MANAGER_INFORMATION: {
      const { field, data } = action.payload || {};
      const newManagerInformation = state.managerInformation;
      newManagerInformation[field] = data;

      return {
        ...state,
        managerInformation: { ...newManagerInformation }
      };
    }

    case TYPES.SET_REQMANBUDTOUCH: {
      const newReqManBudTouch = { ...state.reqManBudTouch, ...action.payload };
      return {
        ...state,
        reqManBudTouch: newReqManBudTouch
      };
    }

    case TYPES.SET_COSTESTIMATION: {
      const { apptype, values, quotationtotal } = action.payload;
      let newAPCostEstimation = {};
      let newDPCostEstimation = {};
      if (apptype === 'DP') {
        newDPCostEstimation = { ...values, quotationtotal };
      } else if (apptype === 'AP') {
        newAPCostEstimation = { ...values, quotationtotal };
      }
      return {
        ...state,
        APCostEstimation: newAPCostEstimation,
        DPCostEstimation: newDPCostEstimation
      };
    }

    case TYPES.SET_MY_ACTION_PROJECT: {
      return {
        ...state,
        myactionProject: action.payload
      };
    }

    default:
      return state;
  }
};

export default myApproval;
