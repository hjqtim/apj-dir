import { Common } from '../Common';
import { CREATE, HA4 } from '../../../variable/stepName';
import ContractItems from '../../../../components/ContractItems/ContractItems';
import { getUser } from '../../../auth';
import { fieldCheck, changeItemList } from '../utils';

const applicant = document.createElement('div');
applicant.id = "headline_applicant's_particulars";
applicant.innerText = "Applicant's Particulars:";
applicant.style.width = '100%';
applicant.style.marginBottom = '1em';
applicant.style.fontSize = '1.8em';

export default class Distribution extends Common {
  async insertHeadLine() {
    const surname = document.getElementById('element_surname');
    surname && surname.parentElement.insertBefore(applicant, surname);
  }

  async changeItemList() {
    await changeItemList(this, 'stafftype');
    await changeItemList(this, 'isowner_stafftype');
  }

  onParentFieldChange(fieldName, value) {
    if (fieldName === 'isowner') {
      const target = this.remarkedItem.get('isowner');
      target &&
        target.forEach((fn) => {
          const id = `element_${fn}`;
          const el = document.getElementById(id);
          el && (el.style.display = value.size ? 'none' : 'block');
        });
      const itemList = this.parentInitDetail.filter((e) => e.remark === fieldName);
      itemList &&
        itemList.forEach((item) => {
          item.show = !value.size;
        });
    }
    this.parentData.set(fieldName, value);
    return value;
  }

  getContractList() {
    return [ContractItems.get('Distribution List Application')];
  }

  shouldContinue(item) {
    if (
      item.remark === 'isowner' &&
      this.parentData.get('isowner') &&
      this.parentData.get('isowner').size
    ) {
      return true;
    }
    if (this.stepName && this.stepName === CREATE && !item.showOnRequest) return true;
    if (this.stepName && this.stepName !== HA4 && item.fieldName === 'distributionlistid')
      return true;
    return false;
  }

  async getInitData() {
    const user = getUser();
    const parentInitData = new Map();
    if (user) {
      parentInitData.set('christianname', user.cn);
    }
    return { parentInitData };
  }

  getParentTitle() {
    if (this.stepName === CREATE) return null;
    return 'Distribution List';
  }

  getDisabled(item, isParent = false) {
    if (this.stepName === HA4 && item.fieldName === 'distributionlistid') return false;
    return isParent ? this.disabledAllParent : this.disabledAllChild;
  }

  // 特殊字段验证(异步)
  async asyncCheck(field) {
    const emailFieldNameList = [
      // 'supervisoremailaccount'
    ];
    const phoneFieldNameList = ['phoneno', 'isowner_phoneno'];
    const faxFieldNameList = ['faxno'];
    const fieldNameList = {
      emailFieldNameList,
      phoneFieldNameList,
      faxFieldNameList
    };
    return fieldCheck(this, field, fieldNameList);
  }
}
