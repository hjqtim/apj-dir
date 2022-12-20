export default class DefaultValue {
  readOnly = false;

  siteVisitArrangement = {
    data: {
      name: '',
      phone: '',
      email: ''
    },
    error: {
      contact: false,
      phone: false,
      email: false
    }
  };

  quotationApproval = {
    status: '',
    respondedTime: '',
    remark: ''
  };

  requesterManager = {
    name: '',
    title: '',
    phone: ''
  };

  budgetHolderInfo = {
    selectedItem: '',
    enteredHolder: {
      name: '',
      title: '',
      phone: ''
    }
  };

  fundConfirm = {
    status: '',
    respondedTime: '',
    remark: ''
  };

  managerApproval = {
    status: '',
    approvedTime: '',
    remark: ''
  };

  paymentInfo = {
    commitCost: 0,
    paymentMethod: {
      account: '',
      externalCompany: {
        name: '',
        contactPeson: '',
        address: '',
        phone: ''
      },
      other: ''
    },
    fiscalYear: '',
    fundingSource: '',
    lanOrder: null
  };

  responsibleStaff = {
    name: '',
    title: '',
    phone: '',
    pager: '',
    assignedTime: ''
  };

  nmsAck = {
    ackPerson: '',
    ackTime: '',
    progressLog: ''
  };

  expenditure = {
    current: {
      amount: '',
      fiscalYear: ''
    },
    next: {
      amount: '',
      fiscalYear: ''
    },
    remark: ''
  };

  networkDesign = {
    ackSent: 0,
    ackSentDate: null,
    reqNetDesign: 0,
    reqNetDesignDate: null,
    netDesignRecd: 0,
    netDesignRecdDate: null,
    netDesignNbr: '',
    arrangeSiteVisit: 0,
    arrangeSiteVisitDate: null,
    quotationRecd: 0,
    quotationRecdDate: null,
    notifyCompStatus: 0,
    notifyCompDate: null,
    liveRunDate: null,
    expCompleteDate: null,
    targetCompletionDate: null,
    fundConfirmed: 0,
    fundConfirmDate: null,
    fundTxCode: null
  };

  detail = {
    id: '',
    procInstId: '',
    procDefId: '',
    startTime: '',
    endTime: null,
    requestNo: '',
    requester: '',
    hospital: '',
    stepName: '',
    status: '',
    rejectReason: null,
    requesterManager: null,
    dpRequestStatus: ''
  };

  NMSResponsible = {
    staffObj: {},
    staffName: '',
    staffTitle: '',
    staffPhone: '',
    assignmentdate: '',
    staffUserId: ''
  };

  apLocationList = [];

  dpLocationList = [];

  networkDesignFiles = [];

  requestForm = {}; // 整张form的全部数据，只有进入my action detail页面会修改该字段，请勿二次修改里面的某字段，这仅仅是一个回显数据的快照

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
    COAoptions: [],
    fundconfirmed: 0
  };

  managerRemark = '';

  budgetholderremark = '';

  endorsement = {
    endorsementId: '',
    endorsementName: '',
    endorsementPhone: '',
    endorsementStatus: '',
    endorsementTitle: '',
    endorsementDate: '',
    options: []
  };

  endorsementTouch = {
    endorsementId: false,
    endorsementPhone: false,
    endorsementStatus: false
  };

  endorsementApproval = {
    externalNetworkRemark: '',
    externalNetworkApprovalStatus: 'N',
    endorsementApprovalStatus: 'N',
    endorsementRemark: ''
  };

  sentDocumentRemark = '';

  managerInformation = {
    isNeedManager: false,
    rmanagerphone: '',
    rmanageremail: '',
    rmanagerid: '',
    rmanagername: '',
    rmanagertitle: '',
    options: [],
    requesterremark: ''
  };

  // requester、manager、budget holder form touch
  reqManBudTouch = {
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

  APCostEstimation = {};

  DPCostEstimation = {};

  myactionProject = [];
}
