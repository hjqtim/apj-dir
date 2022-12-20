import { getUserFromLocalStorage } from '../../utils/auth';
import IPAddrItem from '../../models/ipaddr/IPAddrItem';
import TouchModel from '../../models/ipaddr/TouchModel';

export default class DefaultValue {
  user = getUserFromLocalStorage() || {};

  formStatus = '';

  requestNo = '';

  isMyRequest = false;

  isMyApproval = false;

  getUserName = () => {
    const arr = this.user?.displayName?.split?.(',') || [];
    if (arr?.[0]) {
      return arr[0];
    }
    return '';
  };

  requester = {
    logonDomain: this.user.department || '',
    name: this.getUserName(),
    title: this.user.displayName?.split(',')?.[1]?.trim() || '',
    userPhone: this.user.phone || '',
    logonName: this.user?.username?.toLowerCase?.(),
    userName: this.user?.displayName
  };

  contactPerson = {
    endUserName: '',
    endUserTitle: '',
    endUserPhone: '',
    endUserEmail: '',
    endUserCorp: ''
  };

  projectInfo = { hospital: '', remark: '' };

  projectList = [];

  equpTypeList = [];

  hospitalList = [];

  blockList = [];

  floorListMap = {};

  items = [new IPAddrItem()];

  touches = new TouchModel(false).genData();

  // ↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑---  基础表单申请 -----↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑

  // ↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓-----  审批详情 -------↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓

  ipRequest = '';

  ipRequestDetailsList = '';

  adminRemark = '';

  staticIPData = [];

  dHCPReservedData = [];

  DHCPRangeData = [];

  staticTouches = [];

  reserverTouches = [];

  rangeTouches = [];

  ipListSet = {};
}
