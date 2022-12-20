import ApDpDetailModel from '../../models/webdp/request-form-models/ApDpDetailModel';
import ErrorModel from '../../models/webdp/request-form-models/ErrorModel';
import ExternalNetworkModel from '../../models/webdp/request-form-models/ExternalNetworkModel';
import { getUserFromLocalStorage } from '../../utils/auth';

export default class DefaultValue {
  user = getUserFromLocalStorage() || {};

  getUserName = () => {
    const arr = this.user?.displayName?.split?.(',') || [];
    if (arr?.[0]) {
      return arr[0];
    }
    return '';
  };

  formType = 'AP';

  viewOnly = false; // for form detail

  submittable = false;

  error = new ErrorModel(); // data store in model

  requestId = '';

  delIds = []; // location delete ids

  dpId = 0;

  requestNo = 0;

  status = ''; // the request form status

  requester = {
    hospital: this.user.department || '',
    name: this.getUserName(),
    title: this.user.displayName?.split(',')?.[1]?.trim() || '',
    phone: this.user.phone || '',
    adPhone: this.user.adPhone || '',
    requesterid: ''
  };

  rManager = {
    name: '',
    title: '',
    phone: '',
    email: '',
    corp: '',
    options: []
  };

  budgetHolder = {
    fundParty: '',
    fundTransferredTohSteam: null,
    paymentMethod: null,
    contact: {
      data: {
        email: '',
        name: '',
        title: '',
        phone: ''
      },
      error: {
        contact: false,
        title: false,
        phone: false,
        email: false
      }
    },
    externalCompany: {
      address: '',
      name: '',
      contactName: '',
      phone: ''
    },
    COA: [
      { id: 1, length: 3, label: 'Institution', value: '' },
      { id: 2, length: 1, value: '-', error: false },
      { id: 3, length: 2, label: 'Fund', value: '' },
      { id: 4, length: 1, value: '-', error: false },
      { id: 5, length: 6, label: 'Account', value: '' },
      { id: 6, length: 1, value: '-', error: false },
      { id: 7, length: 7, value: '', label: 'Section' },
      { id: 8, length: 1, value: '-', error: false },
      { id: 9, length: 2, value: '', label: 'Type' },
      { id: 10, length: 1, value: '-', error: false },
      { id: 11, length: 5, value: '', label: 'Analytical' }
    ],
    otherPaymentMethod: ''
  };

  myBudgetHolder = {
    fundtransferredtohsteam: '', // Source of funding  1-2-0
    fundparty: '', // select department
    paymentmethod: '', // Payment Method 1-3-2
    cardNo: ['', '', '', '', '', ''],
    budgetholdername: '',
    budgetholdertitle: '',
    budgetholderemail: '',
    budgetholderphone: '',
    budgetholderid: '',
    extbillcompanyname: '',
    extbillcontactname: '',
    extbillcontactphone: '',
    extbillcompanyadd: '',
    otherpaymentmethod: '',
    options: [],
    COAoptions: []
  };

  serviceRequired = {
    hospitalRef: '',
    hospitalLocation: {}, // 选中医院的对象
    hospitalList: [] // 医院下拉框列表
  };

  apDpDetails = new ApDpDetailModel(); // data store in model

  externalNetwork = new ExternalNetworkModel(); // data store in model

  fileAttachment = [];

  requestAll = {};

  // requester、manager、budget holder form touch
  applyReqManBudTouch = {
    rmanagerid: false,
    rmanageremail: false,
    rmanagerphone: false,
    fundtransferredtohsteam: false,
    fundconfirmed: false,
    fundparty: false,
    paymentmethod: false,
    chartofaccount: false,
    budgetholderid: false,
    budgetholderemail: false,
    budgetholderphone: false,
    extbillcompanyname: false,
    extbillcontactname: false,
    extbillcontactphone: false,
    extbillcompanyadd: false,
    otherpaymentmethod: false
  };

  // Cancel Reason
  cancelRemark = {
    remark: '',
    reason: ''
  };

  // Pending Reason
  pendingRemark = {
    remark: '',
    reason: ''
  };
}
