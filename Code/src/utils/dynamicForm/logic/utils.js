import { JSEncrypt } from 'jsencrypt';
import { isEmail, isHKID, isHKPhone, isFirstAndLastName } from '../../regex';
// import accountManagementAPI from "../../../api/accountManagement"
import procedureAPI from '../../../api/procedure';

export function itemIsChecked(self, fieldName, itemName) {
  const itemID = getItemIDByItemName(self, fieldName, itemName);
  if (!itemID) return false;
  const fieldValue = self.parentData.get(fieldName);
  return fieldValue.size && fieldValue.has(itemID);
}

export function getItemIDByItemName(self, fieldName, itemName) {
  const field = getFieldByFieldName(self, fieldName);
  if (!field || !field.itemList) return 0;
  const targetList = field.itemList.filter((el) => el.type === itemName);
  if (!targetList || !targetList.length) return 0;
  const [item] = targetList;
  return item.id;
}

export function getItemNameByItemID(self, fieldName, ID) {
  const field = getFieldByFieldName(self, fieldName);
  if (!field || !field.itemList) return null;
  const targetList = field.itemList.filter((el) => el.id === ID);
  if (!targetList || !targetList.length) return null;
  const [item] = targetList;
  return item.type;
}

export function getCheckedItemList(self, fieldName, value) {
  const checkedItemList = [];
  value &&
    value.forEach((id) => {
      const type = getItemNameByItemID(self, fieldName, id);
      type && checkedItemList.push(type);
    });
  return checkedItemList;
}

export function getUncheckItemList(self, fieldName, value) {
  const field = getFieldByFieldName(self, fieldName);
  if (!field || !field.itemList) return [];
  const unCheckItemList = [];
  field.itemList.forEach((item) => {
    if (!value.has(item.id)) {
      unCheckItemList.push(item.type);
    }
  });
  return unCheckItemList;
}

export function getHideFieldList(self, remarkList) {
  return self.parentInitDetail.filter((el) => {
    let flag = false;
    if (remarkList.indexOf(el.remark) !== -1) flag = true;
    if (flag) {
      el.show = false;
    }
    return flag;
  });
}

export function getFieldByFieldName(self, fieldName) {
  const target = self && self.parentInitDetail.filter((e) => e.fieldName === fieldName);
  if (target) return target[0];
  return false;
}

export function getFieldByFieldNameBeforeMix(self, fieldName) {
  const target = self && self.parentFormDetail.filter((e) => e.fieldName === fieldName);
  if (target) return target[0];
  return false;
}

export async function getNewItemList(arg) {
  const { data } = await procedureAPI.call({ arg });
  return data?.data;
}

export async function changeItemList(self, fieldName) {
  const field = getFieldByFieldNameBeforeMix(self, fieldName);
  const remoteItemList = await getNewItemList(self.workflowName);
  const newItemList = [];
  remoteItemList.forEach((remoteItem) => {
    newItemList.push({
      id: remoteItem.locationName,
      type: remoteItem.locationName
    });
  });
  field.itemList = newItemList;
}

export function hideItem(self, remark) {
  const hiddenFieldList = [];
  self.parentInitDetail.forEach((field) => {
    if (field.remark === remark) {
      const element = document.getElementById(`element_${field.fieldName}`);
      element && (element.style.display = 'none');
      field.show = false;
      hiddenFieldList.push(field.fieldName);
      if (field.type === 'checkbox') {
        field.itemList.forEach((item) => {
          hideItem(self, item.type);
        });
      }
      clearItemValueByRemark(self, field);
    }
  });
  return hiddenFieldList;
}

export function showItem(self, remark) {
  const shownFieldList = [];
  self.parentInitDetail.forEach((field) => {
    if (field.remark === remark) {
      const element = document.getElementById(`element_${field.fieldName}`);
      element && (element.style.display = 'block');
      field.show = true;
      shownFieldList.push(field.fieldName);
      if (field.type === 'checkbox') {
        const checkedItemList = getCheckedItemList(
          self,
          'apply_for_internet',
          self.parentData.get('apply_for_internet')
        );
        checkedItemList.forEach((checkedItem) => {
          showItem(self, checkedItem);
        });
      }
    }
  });
  return shownFieldList;
}

export function insertHeadLine(fieldName, text, style) {
  const id = `element_${fieldName}`;
  const el = document.getElementById(id);
  if (!el) return '';
  let headline = document.getElementById(`headline_${text}`);
  if (headline) {
    headline.style.display = 'block';
  } else {
    headline = createElement(text, style);
    el.parentElement.insertBefore(headline, el);
  }
  return headline;
}

export function removeHeadline(headlineText) {
  const headline = document.getElementById(`headline_${headlineText}`);
  if (headline) {
    headline.style.display = 'none';
  }
}

export function getFieldListByRemark(self, remark) {
  const list = [];
  self.parentInitDetail.forEach((field) => {
    if (field.remark === remark) {
      list.push(field);
    }
  });
  return list;
}

export function clearItemValueByRemark(self, remark) {
  const fieldList = getFieldListByRemark(self, remark);
  fieldList.forEach((field) => {
    self.parentData.delete(field.fieldName);
    self.parentFieldError.delete(field.fieldName);
    if (field.type === 'text' || field.type === 'inputCheck') {
      clearField(field);
    }
    if (field.type === 'list') {
      clearList(field);
      clearField(field);
    }
    if (field.type === 'checkbox') {
      field.itemList.forEach((item) => {
        hideItem(self, item.type);
      });
      uncheckField(field);
    }
  });
}

export function uncheckField(field) {
  const id = `checkbox_${field.fieldName}`;
  const checkboxList = document.querySelectorAll(`input[id^=${id}]`);
  checkboxList.forEach((checkbox) => {
    checkbox.checked = false;
  });
}

export function clearField(field) {
  const id = field.fieldName;
  const inputList = document.querySelectorAll(`input[id^=${id}]`);
  inputList.forEach((input) => {
    input.value = null;
  });
}

export function clearList(field) {
  const id = `${field.fieldName}_dataList`;
  const [dataAreaList] = document.querySelectorAll(`div[id^=${id}]`);
  while (dataAreaList && dataAreaList.hasChildNodes()) {
    dataAreaList.removeChild(dataAreaList.firstChild);
  }
}

export function checkField(fieldName, itemName) {
  const id = `checkbox_${fieldName}_${itemName}`;
  // const selectors = "input[id^=" + "'" + id + "'" + "]"
  const selectors = `input[id^='${id}']`;
  const checkboxList = document.querySelectorAll(selectors);
  checkboxList.forEach((checkbox) => {
    checkbox.checked = true;
  });
}

/**
 *
 * @param {String} text
 * @param { Object | undefined } style
 * @return {Node} element
 */
export function createElement(text, style) {
  const el = document.createElement('div');
  el.id = `headline_${text}`;
  el.innerText = `${text}:`;
  Object.assign(el.style, headlineStyle, style || undefined);
  return el;
}

const headlineStyle = {
  width: '100%',
  marginBottom: '1em',
  fontSize: '1.8em',
  userSelect: 'none'
};

// ======================================================
//                        字段验证
// ======================================================

export function commonCheck(self, field) {
  const { fieldName, required, show } = field;
  let done = false;
  let error = false;
  let message = '';
  if (!show) {
    done = true;
    self.parentFieldError.set(fieldName, null);
    return { error, message, done };
  }
  if (required && self.isEmpty(fieldName)) {
    message = getRequiredMessage(field);
    error = true;
    done = true;
    self.parentFieldError.set(fieldName, message);
    return { error, message, done };
  }
  if (!required && self.isEmpty(fieldName)) {
    self.parentFieldError.set(fieldName, null);
    done = true;
    return { error, message, done };
  }
  return { error, message, done };
}

export function emailCheck(self, field) {
  const { fieldName } = field;
  let done = false;
  let error = false;
  let message = '';
  const value = self.parentData.get(fieldName);
  if (!isEmail(value)) {
    error = true;
    done = true;
    message = 'Incorrect Email Address';
    self.parentFieldError.set(fieldName, message);
    return { error, message, done };
  }
  return { error, message, done };
}

export function emailCheckByFieldNameList(self, field, fieldNameList) {
  if (fieldNameList.indexOf(field.fieldName) !== -1) {
    return emailCheck(self, field);
  }
  return { error: false, message: '', done: false };
}

export function phoneCheck(self, field) {
  return HKNumberCheck(self, field, 'phone');
}

export function phoneCheckByFieldNameList(self, field, fieldNameList) {
  if (fieldNameList.indexOf(field.fieldName) !== -1) {
    return phoneCheck(self, field);
  }
  return { error: false, message: '', done: false };
}

export function faxCheck(self, field) {
  return HKNumberCheck(self, field, 'fax');
}

export function faxCheckByFieldNameList(self, field, fieldNameList) {
  if (fieldNameList.indexOf(field.fieldName) !== -1) {
    return faxCheck(self, field);
  }
  return { error: false, message: '', done: false };
}

export function HKIDCheck(self, field) {
  const { fieldName } = field;
  let done = false;
  let error = false;
  let message = '';
  const value = self.parentData.get(fieldName);
  if (!isHKID(value)) {
    error = true;
    done = true;
    message = 'Incorrect HK ID. Example: A1234567';
    self.parentFieldError.set(fieldName, message);
    return { error, message, done };
  }
  return { error, message, done };
}

export function HKIDCheckByFileNameList(self, field, fieldNameList) {
  if (fieldNameList.indexOf(field.fieldName) !== -1) {
    return HKIDCheck(self, field);
  }
  return { error: false, message: '', done: false };
}

export async function fieldCheck(self, field, fieldNameList) {
  const {
    emailFieldNameList,
    idFieldNameList,
    phoneFieldNameList,
    faxFieldNameList,
    nameFieldNameList
  } = fieldNameList;
  const commonRes = commonCheck(self, field);
  if (commonRes.done) {
    return { error: commonRes.error, message: commonRes.message };
  }
  const emailRes =
    emailFieldNameList &&
    emailFieldNameList.length &&
    emailCheckByFieldNameList(self, field, emailFieldNameList);
  if (emailRes && emailRes.done) {
    return { error: emailRes.error, message: emailRes.message };
  }
  const idRes =
    idFieldNameList &&
    idFieldNameList.length &&
    HKIDCheckByFileNameList(self, field, idFieldNameList);
  if (idRes && idRes.done) {
    return { error: idRes.error, message: idRes.message };
  }
  const phoneRes =
    phoneFieldNameList &&
    phoneFieldNameList.length &&
    phoneCheckByFieldNameList(self, field, phoneFieldNameList);
  if (phoneRes && phoneRes.done) {
    return { error: phoneRes.error, message: phoneRes.message };
  }
  const faxRes =
    faxFieldNameList &&
    faxFieldNameList.length &&
    faxCheckByFieldNameList(self, field, faxFieldNameList);
  if (faxRes && faxRes.done) {
    return { error: faxRes.error, message: faxRes.message };
  }
  const nameRes =
    nameFieldNameList &&
    nameFieldNameList.length &&
    nameCheckByFieldNameList(self, field, nameFieldNameList);
  if (nameRes && nameRes.done) {
    return { error: nameRes.error, message: nameRes.message };
  }
  self.parentFieldError.set(field.fieldName, null);
  return { error: false, message: '' };
}

function HKNumberCheck(self, field, type = 'phone') {
  const { fieldName } = field;
  let done = false;
  let error = false;
  let message = '';
  const value = self.parentData.get(fieldName);
  if (!isHKPhone(value)) {
    message = `Incorrect ${type} No. `;
    const example = type === 'phone' ? 'Example: 21955500' : 'Example: 35426044';
    message += example;
    error = true;
    done = true;
    self.parentFieldError.set(fieldName, message);
    return { error, message, done };
  }
}

export function nameCheckByFieldNameList(self, field, fieldNameList) {
  if (fieldNameList.indexOf(field.fieldName) !== -1) {
    return nameCheck(self, field);
  }
  return { error: false, message: '', done: false };
}

function nameCheck(self, field) {
  const { fieldName, fieldDisplayName } = field;
  let done = false;
  let error = false;
  let message = '';
  const value = self.parentData.get(fieldName);
  if (
    value.indexOf(',') !== -1 ||
    value.indexOf('+') !== -1 ||
    !isFirstAndLastName(value.replace(/\s/g, ''))
  ) {
    message = ` ${fieldDisplayName} contains disallowed special character(s). `;
    error = true;
    done = true;
    self.parentFieldError.set(fieldName, message);
    return { error, message, done };
  }
  return {};
}

function getRequiredMessage(field) {
  return `${getFieldDisplayName(field)} is required`;
}

function getFieldDisplayName(field) {
  return field.fieldDisplayName.length > 40
    ? field.fieldDisplayName.slice(0, 37)
    : field.fieldDisplayName;
}

export function encryption(value, publicKey) {
  const jsencrypt = new JSEncrypt();
  jsencrypt.setPublicKey(publicKey);
  return jsencrypt.encrypt(value);
}

export function changeDisplayNameToHeadLine(fieldName) {
  const id = `element_${fieldName}`;
  const el = document.getElementById(id);
  const label = el?.firstChild;
  if (label) {
    Object.assign(label.style, headlineStyle, {
      marginLeft: '-1.15em'
    });
  }
}

export function checkItem(self, fieldName, itemType) {
  const itemId = getItemIDByItemName(self, fieldName, itemType);
  const valueSet = self.parentData.get(fieldName);
  if (valueSet) {
    valueSet.add(itemId);
  } else {
    const newSet = new Set();
    newSet.add(itemId);
    self.parentData.set(fieldName, newSet);
  }
  checkField(fieldName, itemType);
}
