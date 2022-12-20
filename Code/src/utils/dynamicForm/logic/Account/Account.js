import { Button } from '@material-ui/core';
import React from 'react';
import { Common } from '../Common';
import Api from '../../../../api/diyForm';
import UserApi from '../../../../api/user';
import { object2map } from '../../../map2object';
import {
  DetailActions,
  UpdateActions
} from '../../../../components/HADynamicForm/Components/Actions';
import { L } from '../../../lang';
import { CREATE, HA4, UPDATE } from '../../../variable/stepName';
import ContractItems from '../../../../components/ContractItems/ContractItems';
import { getUser } from '../../../auth';
import accountAPI from '../../../../api/accountManagement';
import {
  changeDisplayNameToHeadLine,
  changeItemList,
  checkField,
  checkItem,
  clearItemValueByRemark,
  encryption,
  fieldCheck,
  getCheckedItemList,
  getFieldByFieldName,
  getFieldByFieldNameBeforeMix,
  getItemIDByItemName,
  getUncheckItemList,
  hideItem,
  insertHeadLine,
  itemIsChecked,
  removeHeadline,
  showItem
} from '../utils';
import array2set from '../../../array2set';

class Account extends Common {
  constructor(props) {
    super(props);
    const corpId = getFieldByFieldNameBeforeMix(this, 'corpid');
    this.shouldContinueMap = new Map();
    this.shouldContinueMap.set('hkid', {
      show: new Set([CREATE]),
      hide: new Set([])
    });
    if (corpId) {
      this.shouldContinueMap.set('corpid', {
        show: new Set(corpId.showOnRequest ? [HA4, CREATE] : [HA4]),
        hide: new Set([])
      });
    }
    this.shouldContinueMap.set('position_ranking', {
      show: new Set([HA4]),
      hide: new Set([])
    });
  }

  async insertHeadLine() {
    changeDisplayNameToHeadLine('account_type');
    changeDisplayNameToHeadLine('apply_for_internet');
    changeDisplayNameToHeadLine('apply_for');
    insertHeadLine('surname', "Applicant's Particulars");
    insertHeadLine('supervisoremailaccount', "Manager's Information");
  }

  async changeItemList() {
    await changeItemList(this, 'stafftype');
  }

  hideItem() {
    if (!itemIsChecked(this, 'account_type', 'CORP Account Application'))
      hideItem(this, 'CORP Account Application');
    if (!itemIsChecked(this, 'account_type', 'Internet Account Application'))
      hideItem(this, 'Internet Account Application');
    if (!itemIsChecked(this, 'account_type', 'IBRA Account Application'))
      hideItem(this, 'IBRA Account Application');
    if (!itemIsChecked(this, 'apply_for', 'Intranet email account'))
      hideItem(this, 'Intranet email account');
  }

  getContractList() {
    const res = [ContractItems.get('CORP Account (Personal) Application')];
    const atValueList = this.parentData.get('account_type');
    const [atItem] = this.parentInitDetail.filter((e) => e.fieldName === 'account_type');
    if (!atItem || !atItem.itemList) return res;

    atValueList.forEach((el) => {
      const [item] = atItem.itemList.filter((e) => e.id === el);
      if (item && item.type) {
        const contract = ContractItems.get(item.type);
        contract && res.push(contract);
      }
    });
    return res;
  }

  async getInitData() {
    const parentInitData = new Map();
    parentInitData.set('apply_for', 'CORP ID (Login ID)!@#Intranet email account');
    parentInitData.set('account_type', 'CORP Account Application');
    // parentInitData.set('owa_hospital_web', 'OWA Webmail + Hospital home page')
    // parentInitData.set('authenticationmethod', 'HA Chat')
    const response = await accountAPI.getPublicKey();
    this.publicKey = response?.data?.data || '';
    return { parentInitData };
  }

  // 获取 checkBox 联动状态
  getCheckBoxStatus({ type, status }) {
    const res = new Map();
    if (!type) return res;
    res.set(type, status);
    if (type === 'Internet Account Application' && status === -1) {
      res.set('IBRA Account Application', -1);
    }
    if (type === 'IBRA Account Application' && status === 1) {
      res.set('Internet Account Application', 1);
    }
    return res;
  }

  shouldContinue(item) {
    if (this.stepName && this.stepName === CREATE && !item.showOnRequest) return true;
    const itemContinueMap = this.shouldContinueMap.get(item.fieldName);
    if (
      itemContinueMap &&
      (!itemContinueMap.show.has(this.stepName) || itemContinueMap.hide.has(this.stepName))
    ) {
      return true;
    }
    return false;
    // return this.stepName && this.stepName !== CREATE && item.fieldName === 'hkid'
  }

  getParentTitle() {
    if (this.stepName === CREATE) return null;
    return 'Account Management';
  }

  // 整合父表初始数据和结构
  getParentInitDetail(parentInitData) {
    if (!this.parentFormDetail || !this.parentFormDetail.length || !parentInitData) return [];
    const res = [];
    const remarkedItem = new Map();
    this.parentFormDetail.forEach((item) => {
      if (this.shouldContinue(item)) return;
      const disabled = this.getDisabled(item, true);
      if (item.fieldName === 'account_type') {
        const [target] = item.itemList.filter((el) => el.type === 'CORP Account Application');
        target.disabled = true;
      }
      if (item.fieldName === 'apply_for') {
        const [target] = item.itemList.filter((el) => el.type === 'CORP ID (Login ID)');
        target.disabled = true;
      }
      if (item.fieldName === 'surname') {
        item.placeholder = 'Example: CHAN';
      }
      if (item.fieldName === 'firstname') {
        item.placeholder = 'Example : Tai Man';
      }
      if (item.fieldName === 'hkid') {
        item.placeholder = 'Example : A1234567';
      }
      if (item.fieldName === 'distribution_list') {
        item.buttonText = 'Add';
      }
      let defaultValue;
      if (item && item.type === 'checkbox') {
        defaultValue =
          parentInitData.get(item.fieldName) && parentInitData.get(item.fieldName).split('!@#');
        const initData = new Set();
        const { itemList } = item;
        defaultValue &&
          defaultValue.forEach((el) => {
            const [target] = itemList.filter((e) => e.type === el);
            target && target.id && initData.add(target.id);
          });
        parentInitData.set(item.fieldName, initData);
      } else if (item && item.type === 'list') {
        defaultValue =
          parentInitData.get(item.fieldName) && parentInitData.get(item.fieldName).split('!@#');
      } else {
        defaultValue = parentInitData.get(item.fieldName);
      }
      const newItem = {
        ...item,
        show: true,
        defaultValue,
        disabled
      };
      if (newItem.remark) {
        if (remarkedItem.has(newItem.remark)) {
          remarkedItem.get(newItem.remark).push(newItem.fieldName);
        } else {
          remarkedItem.set(item.remark, [newItem.fieldName]);
        }
      }
      res.push(newItem);
    });
    this.parentInitDetail = res;
    this.remarkedItem = remarkedItem;
    return res;
  }

  // 父表字段变更
  onParentFieldChange(fieldName, value) {
    const field = getFieldByFieldName(this, fieldName);
    if (field.type === 'checkbox') {
      const checkedItemList = getCheckedItemList(this, fieldName, value);
      checkedItemList.forEach((remark) => {
        const shownFieldList = showItem(this, remark);
        if (shownFieldList.indexOf('owa_hospital_web') !== -1) {
          insertHeadLine('owa_hospital_web', 'Profile Required', {
            fontSize: '1.2em'
          });
          checkItem(this, 'owa_hospital_web', 'OWA Webmail + Hospital home page');
        }
        if (shownFieldList.indexOf('authenticationmethod') !== -1) {
          checkItem(this, 'authenticationmethod', 'HA Chat');
        }
        if (shownFieldList.indexOf('apply_for_internet') !== -1) {
          const applyForInternet = getFieldByFieldName(this, 'apply_for_internet');
          if (applyForInternet && applyForInternet.show && applyForInternet.itemList) {
            const itemIDList = [];
            applyForInternet.itemList.forEach((item) => {
              const itemId = getItemIDByItemName(this, applyForInternet.fieldName, item.type);
              itemId && itemIDList.push(itemId);
            });
            this.onParentFieldChange('apply_for_internet', array2set(itemIDList));
            checkField('apply_for_internet', 'Internet web access');
            checkField('apply_for_internet', 'Internet Email address');
            if (value && this.parentData.get('apply_for_internet')) {
              value = new Set([...value, ...this.parentData.get('apply_for_internet')]);
            }
          }
        }
        if (shownFieldList.indexOf('existing_ibra_account') !== -1) {
          insertHeadLine('existing_ibra_account', 'IBRA Account');
        }
      });

      const uncheckItemList = getUncheckItemList(this, fieldName, value);
      uncheckItemList.forEach((remark) => {
        const hiddenFieldList = hideItem(this, remark);
        if (hiddenFieldList.indexOf('owa_hospital_web') !== -1) {
          removeHeadline('Profile Required');
        }
        if (hiddenFieldList.indexOf('apply_for') !== -1) {
          removeHeadline('CORP Account');
        }
        if (hiddenFieldList.indexOf('existing_ibra_account') !== -1) {
          removeHeadline('IBRA Account');
        }
        // clear hidden item’s value
        clearItemValueByRemark(this, remark);
      });
    }
    let result = value;
    if ((fieldName === 'surname' || fieldName === 'firstname') && value) {
      result = value.trim().replace(/\s+/g, ' ');
      result = result.replace(/'+/g, "\\'");
    }
    if (fieldName === 'account_type') {
      let flag = false;
      if (value && (value.has(2) || value.has(3) || value.has(4))) {
        flag = true;
      }
      const newParentInitDetail = [];
      this.parentInitDetail.forEach((item) => {
        const newItem = {
          ...item
        };
        if (newItem.fieldName === 'apply_for') {
          console.log(newItem.required);
          newItem.required = flag;
          console.log(newItem.required);
        }
        newParentInitDetail.push(newItem);
      });
      this.parentInitDetail = newParentInitDetail;
    }
    this.parentData.set(fieldName, result);
    return result;
  }

  // 特殊字段验证(异步)
  async asyncCheck(field) {
    const emailFieldNameList = [
      // 'supervisoremailaccount'
    ];
    const idFieldNameList = ['hkid'];
    const phoneFieldNameList = ['contact_phone_no', 'mobile_phone_no_for_receipt_of_sms_otp'];
    const faxFieldNameList = ['officefax'];
    const nameFieldNameList = ['surname', 'firstname'];
    const fieldNameList = {
      emailFieldNameList,
      idFieldNameList,
      phoneFieldNameList,
      faxFieldNameList,
      nameFieldNameList
    };
    return fieldCheck(this, field, fieldNameList);
  }

  encryptionData(data) {
    data.forEach((key) => {
      if (key === 'hkid') {
        const encryptedValue = encryption(data[key].value, this.publicKey);
        data[key].value = encryptedValue;
        data[key].label = encryptedValue;
      }
    });
  }
}

class AccountWithCuID extends Account {
  async getInitData() {
    const { cuId } = this.startData;
    const { data } = await UserApi.findUser({ username: cuId });
    const parentInitData = new Map();
    if (data.data) {
      this.user = data.data;
      if (!data.data.mail) {
        parentInitData.set('apply_for', 'CORP ID (Login ID)!@#Intranet email account');
      } else {
        parentInitData.set('apply_for', 'CORP ID (Login ID)');
      }
      parentInitData.set('account_type', 'CORP Account Application');
      parentInitData.set('owa_hospital_web', 'OWA Webmail + Hospital home page');
      parentInitData.set('authenticationmethod', 'HA Chat');
      parentInitData.set('firstname', data.data.givenName);
      parentInitData.set('surname', data.data.sn);
      parentInitData.set('existing_corp_account', cuId);
    } else {
      this.user = getUser();
      parentInitData.set('apply_for', 'CORP ID (Login ID)!@#Intranet email account');
      parentInitData.set('account_type', 'CORP Account Application');
      parentInitData.set('owa_hospital_web', 'OWA Webmail + Hospital home page');
      parentInitData.set('authenticationmethod', 'HA Chat');
    }
    return { parentInitData };
  }

  // 整合父表初始数据和结构
  getParentInitDetail(parentInitData) {
    if (!this.parentFormDetail || !this.parentFormDetail.length || !parentInitData) return [];
    const res = [];
    const remarkedItem = new Map();
    this.parentFormDetail.forEach((item) => {
      if (this.shouldContinue(item)) return;
      const disabled = this.getDisabled(item, true);
      if (item.fieldName === 'account_type') {
        const index = findItemIndex(item, 'CORP Account Application');
        if (this.user.mail) {
          item.itemList.splice(index, 1);
        } else {
          item.itemList[index].disabled = true;
        }
      }
      if (item.fieldName === 'apply_for') {
        if (!this.user.mail) {
          const index = findItemIndex(item, 'CORP ID (Login ID)');
          item.itemList.splice(index, 1);
        }
      }
      if (item.fieldName === 'surname') {
        item.placeholder = 'Example: CHAN';
      }
      if (item.fieldName === 'firstname') {
        item.placeholder = 'Example : Tai Man';
      }
      if (item.fieldName === 'hkid') {
        item.placeholder = 'Example : A1234567';
      }
      if (item.fieldName === 'distribution_list') {
        item.buttonText = 'Add';
      }
      let defaultValue;
      if (item && item.type === 'checkbox') {
        defaultValue =
          parentInitData.get(item.fieldName) && parentInitData.get(item.fieldName).split('!@#');
        // if (item.fieldName === 'apply_for') {
        //   console.log('parentInitData.get(item.fieldName)=========================parentInitData.get(item.fieldName)')
        //   console.log(parentInitData.get(item.fieldName))
        //   console.log('parentInitData.get(item.fieldName)=========================parentInitData.get(item.fieldName)')
        // }
        const initData = new Set();
        const { itemList } = item;
        defaultValue &&
          defaultValue.forEach((el) => {
            const [target] = itemList.filter((e) => e.type === el);
            target && target.id && initData.add(target.id);
          });
        parentInitData.set(item.fieldName, initData);
      } else if (item && item.type === 'list') {
        defaultValue =
          parentInitData.get(item.fieldName) && parentInitData.get(item.fieldName).split('!@#');
      } else {
        defaultValue = parentInitData.get(item.fieldName);
      }
      const newItem = {
        ...item,
        show: true,
        defaultValue,
        disabled
      };
      if (newItem.remark) {
        if (remarkedItem.has(newItem.remark)) {
          remarkedItem.get(newItem.remark).push(newItem.fieldName);
        } else {
          remarkedItem.set(item.remark, [newItem.fieldName]);
        }
      }
      res.push(newItem);
    });
    this.parentInitDetail = res;
    this.remarkedItem = remarkedItem;
    return res;
  }

  shouldContinue(item) {
    if (this.stepName && this.stepName === CREATE && !item.showOnRequest) return true;
    if (item.fieldName === 'hkid') return true;
    return !!(
      this.user.mail &&
      (item.fieldName === 'existing_corp_account' ||
        item.fieldName === 'email_display_name' ||
        item.fieldName === 'distribution_list')
    );
  }
}

class AccountDetail extends Account {
  // 构造函数
  constructor(props) {
    super(props);
    this.disabledAllParent = true;
    this.disabledAllChild = true;
    this.hideCheckBox = true;
    this.hideDelete = true;
    this.hideCreate = true;
  }

  // 整体
  async getInitData() {
    const { data } = await Api.detail({
      deploymentId: this.deploymentId,
      pid: this.pid
    });
    const { parentData, childDataList } = data.data;
    let parentInitData;
    const childInitData = [];
    if (parentData) {
      parentInitData = object2map(parentData);
    }
    if (childDataList && childDataList.length) {
      childDataList.forEach((childData) => {
        childInitData.push(object2map(childData));
      });
    }
    return {
      parentInitData,
      childInitData,
      callback: this.insertDom.bind(this)
    };
  }

  getActions(history) {
    return <DetailActions history={history} logic={this} />;
  }
  // parent

  // child
  getChildFormActions(props) {
    const { onClose } = props;
    return (
      <>
        <Button
          variant="contained"
          style={{
            width: '5vw',
            marginLeft: '1vw',
            marginRight: '1vw',
            color: '#fff',
            backgroundColor: '#4CAF50'
          }}
          onClick={onClose}
        >
          {L('OK')}
        </Button>
      </>
    );
  }
}

class AccountUpdate extends Account {
  // 构造函数
  constructor(props) {
    super(props);
    this.disabledAllParent = true;
    this.disabledAllChild = true;
    this.hideCheckBox = true;
    this.hideDelete = true;
    this.hideCreate = true;
  }

  encryptionData() {}

  // 整体
  async getInitData() {
    const { data } = await Api.detail({
      deploymentId: this.deploymentId,
      pid: this.pid
    });
    const { parentData, childDataList } = data.data;
    let parentInitData;
    const childInitData = [];
    if (parentData) {
      parentInitData = object2map(parentData);
    }
    if (childDataList && childDataList.length) {
      childDataList.forEach((childData) => {
        childInitData.push(object2map(childData));
      });
    }
    return {
      parentInitData,
      childInitData,
      callback: this.insertDom.bind(this)
    };
  }

  getActions(history) {
    return <UpdateActions history={history} logic={this} />;
  }
}

class AccountHA4 extends AccountUpdate {
  constructor(props) {
    super(props);
    this.enableFileList = new Set(['corpid', 'position_ranking']);
  }
}

export default async function getAccountLogic(props) {
  const { stepName, startData } = props;
  switch (stepName) {
    case CREATE:
      if (startData && startData.cuId) {
        return new AccountWithCuID(props);
      }
      return new Account(props);
    case UPDATE:
      return new AccountUpdate(props);
    case HA4:
      return new AccountHA4(props);
    default:
      return new AccountDetail(props);
  }
}

function findItemIndex(item, type) {
  let index = -1;
  for (let i = 0; i < item.itemList.length; i += 1) {
    if (item.itemList[i].type === type) {
      index = i;
      break;
    }
  }
  return index;
}
