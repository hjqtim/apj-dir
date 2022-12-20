import { Common } from '../Common';
import { CREATE, HA4 } from '../../../variable/stepName';
import { getUser } from '../../../auth';
import ContractItems from '../../../../components/ContractItems/ContractItems';
import { changeItemList, fieldCheck, getFieldByFieldNameBeforeMix } from '../utils';

const applicant = document.createElement('div');
applicant.id = "headline_applicant's_particulars";
applicant.innerText = "Applicant's Particulars:";
applicant.style.width = '100%';
applicant.style.marginBottom = '1em';
applicant.style.fontSize = '1.8em';

export default class NonPersonal extends Common {
  constructor(props) {
    super(props);
    this.shouldContinueMap = new Map();
    const corpId = getFieldByFieldNameBeforeMix(this, 'corpid');
    if (corpId) {
      this.shouldContinueMap.set('corpid', {
        show: new Set(corpId.showOnRequest ? [HA4, CREATE] : [HA4]),
        hide: new Set([])
      });
    }
    this.shouldContinueMap.set('emailid', {
      show: new Set([HA4]),
      hide: new Set([])
    });
  }

  async insertHeadLine() {
    const surname = document.getElementById('element_surname');
    surname && surname.parentElement.insertBefore(applicant, surname);
  }

  // 特殊字段验证(异步)
  async asyncCheck(field) {
    const emailFieldNameList = [
      // 'alternaterecipient',
      // 'owneremail',
      // 'supervisoremailaccount'
    ];
    const phoneFieldNameList = ['officetel'];
    const faxFieldNameList = ['officefax'];
    const fieldNameList = {
      emailFieldNameList,
      phoneFieldNameList,
      faxFieldNameList
    };
    return fieldCheck(this, field, fieldNameList);
  }

  async changeItemList() {
    await changeItemList(this, 'stafftype');
  }

  getContractList() {
    return [ContractItems.get('CORP Account (Non-Personal) Application')];
  }

  async getInitData() {
    const user = getUser();
    const parentInitData = new Map();
    if (user) {
      parentInitData.set('surname', user.sn);
      parentInitData.set('firstname', user.givenName);
      parentInitData.set('christianname', user.cn);
    }
    return { parentInitData };
  }

  getParentTitle() {
    if (this.stepName === CREATE) return null;
    return 'Non-Personal Account';
  }

  shouldContinue(item) {
    if (item.remark === 'issame' && this.parentData.get('issame').size) return true;
    if (this.stepName && this.stepName === CREATE && !item.showOnRequest) return true;
    const itemContinueMap = this.shouldContinueMap.get(item.fieldName);
    itemContinueMap && console.log(itemContinueMap);
    if (
      itemContinueMap &&
      (!itemContinueMap.show.has(this.stepName) || itemContinueMap.hide.has(this.stepName))
    ) {
      return true;
    }
    return false;
  }

  hideItem() {
    const issame = this.parentData.get('issame');
    if (issame && issame.size) return;
    const hideFieldList = this.remarkedItem.get('issame');
    hideFieldList.forEach((hideField) => {
      const id = `element_${hideField}`;
      const el = document.getElementById(id);
      el && (el.style.display = 'none');
      const [target] = this.parentInitDetail.filter((e) => e.fieldName === hideField);
      target.show = false;
    });
  }

  getDisabled(item, isParent = false) {
    if (this.stepName === HA4 && item.fieldName === 'emailid') return false;
    if (this.stepName === HA4 && item.fieldName === 'corpid') return false;
    return isParent ? this.disabledAllParent : this.disabledAllChild;
  }

  onParentFieldChange(fieldName, value) {
    if (fieldName === 'issame') {
      const remarkItemList = this.remarkedItem.get('issame');
      if (remarkItemList && remarkItemList.length) {
        remarkItemList.forEach((remarkItem) => {
          const id = `element_${remarkItem}`;
          const el = document.getElementById(id);
          el && (el.style.display = value.size ? 'block' : 'none');
          const [item] = this.parentInitDetail.filter((e) => e.remark === fieldName);
          item.show = !!value.size;
        });
      }
    }
    this.parentData.set(fieldName, value);
    return value;
  }
}
