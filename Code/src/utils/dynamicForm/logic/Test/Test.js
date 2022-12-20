import React from 'react';
import { Button } from '@material-ui/core';
import { CREATE, UPDATE } from '../../../variable/stepName';
import { cloneMap1 } from '../../../clone';
import { map2object, object2map } from '../../../map2object';
import {
  CommonActions,
  DetailActions,
  UpdateActions
} from '../../../../components/HADynamicForm/Components/NewActions';
import VMStatus, { SUCCESS } from '../../../variable/VMStatus';
import Api from '../../../../api/diyForm';
import { L } from '../../../lang';
import CommonTip from '../../../../components/CommonTip';
import { isNonNegativeInteger } from '../../../regex';
import { commonCheck } from '../utils';

export class Common {
  // 构造函数
  constructor(props) {
    this.onParentFieldChange = this.onParentFieldChange.bind(this);
    this.onChildFieldChange = this.onChildFieldChange.bind(this);
    this.checkAllParentField = this.checkAllParentField.bind(this);
    this.checkParentField = this.checkParentField.bind(this);
    this.checkAllChildField = this.checkAllChildField.bind(this);
    this.checkChildField = this.checkChildField.bind(this);
    this.getCurrentChild = this.getCurrentChild.bind(this);
    this.saveChildForm = this.saveChildForm.bind(this);
    this.isEmpty = this.isEmpty.bind(this);
    this.deleteChild = this.deleteChild.bind(this);
    this.deleteAllChild = this.deleteAllChild.bind(this);
    this.asyncCheck = this.asyncCheck.bind(this);
    this.getParentErrorMessageList = this.getParentErrorMessageList.bind(this);
    this.getChildFormErrorMessageList = this.getChildFormErrorMessageList.bind(this);
    this.getCurrentValue = this.getCurrentValue.bind(this);
    this.getCurrentValueAll = this.getCurrentValueAll.bind(this);
    const {
      processDefinitionId,
      workflowName,
      version,
      stepName,
      formKey,
      childFormKey,
      parentFormDetail,
      childFormDetail,
      childHeaderLength,
      deploymentId,
      startData,
      pid,
      taskId
    } = props;
    this.parentChangedFidleList = [];
    this.childChangedFidleList = [];
    this.pid = pid;
    this.taskId = taskId;
    this.processDefinitionId = processDefinitionId;
    this.deploymentId = deploymentId;
    this.workflowName = workflowName;
    this.version = version;
    this.stepName = stepName;
    this.parentFormKey = formKey;
    this.childFormKey = childFormKey;
    this.parentFormDetail = parentFormDetail;
    this.childFormDetail = childFormDetail;
    this.parentData = new Map();
    this.currentChildrenData = new Map();
    this.parentFieldError = new Map();
    this.childFieldError = new Map();
    this.childrenDataList = [];
    this.startData = startData || {};
    this.childInitDetail = this.getChildInitDetail(-1);
    this.childHeaderCellList = this.getChildHeaderCellList(childHeaderLength);
    this.disabledAllParent = false;
    this.disabledAllChild = false;
    this.hideCheckBox = false;
    this.hideDelete = false;
    this.hideCreate = false;
    this.remarkedItem = new Map();
    this.parentInitDetail = [];
    this.publicKey = '';
    this.enableFileList = new Set();
    this.shouldContinueMap = new Set();
  }

  //  =====================================
  //                common
  //  =====================================

  // 获取初始化数据
  async getInitData() {
    return {};
  }

  async changeItemList() {
    return {};
  }

  insertHeadLine() {
    return {};
  }

  // 插入 Dom
  insertDom() {}

  // 获取 checkBox 联动状态
  getCheckBoxStatus() {
    return new Map();
  }

  getFormData() {
    const parentData = map2object(this.parentData);
    this.formatFormData(parentData, true);
    this.encryptionData(parentData);
    const childDataList = [];
    this.childrenDataList.forEach((el) => {
      const childData = map2object(el);
      this.formatFormData(childData);
      delete childData.$handled;
      this.encryptionData(childData);
      childDataList.push(childData);
    });
    return {
      pid: this.pid,
      taskId: this.taskId,
      processDefinitionId: this.processDefinitionId,
      formKey: this.parentFormKey,
      childFormKey: this.childFormKey,
      workflowName: this.workflowName,
      parentData,
      childDataList,
      version: this.version,
      deploymentId: this.deploymentId
    };
  }

  encryptionData() {}

  getActions(history) {
    return <CommonActions history={history} logic={this} />;
  }

  // 异步字段验证
  asyncCheck(field) {
    const { error, message } = commonCheck(this, field);
    if (!error) {
      this.parentFieldError.set(field.fieldName, null);
    }
    return { error, message };
  }

  formatFormData(data, isParent = false) {
    Object.getOwnPropertyNames(data).forEach((key) => {
      let value = data[key];
      let type = 'text';
      const [target] = this.parentInitDetail.filter((el) => el.fieldName === key);
      if (target) {
        type = target.type;
      }
      if (type === 'checkbox') {
        const { itemList } = target;
        const typeList = [];
        if (value && value instanceof Set) {
          value.forEach((el) => {
            const [target] = itemList.filter((e) => e.id === el);
            if (target) {
              typeList.push(target.type);
            }
          });
          let str = '';
          typeList.forEach((s) => {
            str += `!@#${s}`;
          });
          value = str.slice(3);
        }
      }
      if (type === 'list') {
        let str = '';
        value &&
          value.length &&
          value.forEach((el) => {
            str += `!@#${el}`;
          });
        value = str.slice(3);
      }
      data[key] = {
        id: key,
        value,
        label: isParent ? this.getParentLabelValue(key, value) : this.getChildLabelValue(key, value)
      };
    });
  }

  //  =====================================
  //                 parent
  //  =====================================

  getParentErrorMessageList() {
    const messageList = [];
    this.parentFieldError &&
      this.parentFieldError.forEach((message) => {
        message && messageList.push(message);
      });
    return messageList;
  }

  getCurrentValue(fieldName) {
    return this.parentData.get(fieldName);
  }

  getCurrentValueAll() {
    return this.parentData;
  }

  getContractList() {
    return null;
  }

  // 获取父表标题
  getParentTitle() {
    if (this.stepName === CREATE) return null;
    return this.parentFormKey;
  }

  // 父表字段数据变更
  onParentFieldChange(fieldName, value) {
    this.parentData.set(fieldName, value);
    return value;
  }

  // 整合父表初始数据和结构
  getParentInitDetail(parentInitData) {
    if (!this.parentFormDetail || !this.parentFormDetail.length || !parentInitData) return [];
    const res = [];
    const remarkedItem = new Map();
    this.parentFormDetail.forEach((item) => {
      if (this.shouldContinue(item)) return;
      const disabled = this.getDisabled(item, true);
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

  hideItem() {}

  shouldContinue(item) {
    if (this.stepName && this.stepName === CREATE && !item.showOnRequest) return true;
    return false;
  }
  // shouldContinue(item) {
  //   if (this.stepName && this.stepName === CREATE && !item.showOnRequest) return true
  //   const itemContinueMap = this.shouldContinueMap.get(item.fieldName)
  //   itemContinueMap && console.log(itemContinueMap)
  //   if (itemContinueMap && (!itemContinueMap.show.has(this.stepName) || itemContinueMap.hide.has(this.stepName))) {
  //     return true
  //   }
  //   return false
  // }

  getDisabled(item, isParent = false) {
    return isParent
      ? this.disabledAllParent && !this.enableFileList.has(item.fieldName)
      : this.disabledAllChild && !this.enableFileList.has(item.fieldName);
  }

  // 验证父表字段是否为空
  isEmpty(fieldName, isParent = true) {
    const value = isParent
      ? this.parentData.get(fieldName)
      : this.currentChildrenData.get(fieldName);
    if (!value) return true;
    if (value instanceof Set && value.size === 0) return true;
    if (value instanceof Map && value.size === 0) return true;
    if (value instanceof Array && value.length === 0) return true;
    return false;
  }

  // 验证父表字段
  checkParentField(field) {
    const { fieldName, required, fieldDisplayName, show } = field;
    if (show && required && this.isEmpty(fieldName)) {
      const message = `${fieldDisplayName} is required`;
      this.parentFieldError.set(fieldName, message);
      return { error: true, message };
    }
    this.parentFieldError.set(fieldName, null);
    return { error: false, message: '' };
  }

  // 验证父表所有字段
  async checkAllParentField() {
    for (let i = 0; i < this.parentInitDetail.length; i += 1) {
      const field = this.parentInitDetail[i];
      let { error } = this.checkParentField(field);
      const asyncErrorResult = await this.asyncCheck(field);
      error = error || asyncErrorResult.error;
      if (error) {
        return false;
      }
    }
    return true;
  }

  // 获取父表显示用数据
  getParentLabelValue(fieldName, value) {
    if (!value) return value;
    const [field] = this.parentFormDetail.filter((item) => item.fieldName === fieldName);
    if (!field) return value;
    const { valueField, labelField, itemList } = field;
    if (!valueField || !labelField || !itemList) {
      return value;
    }
    const [targetItem] = itemList.filter((el) => `${el[valueField]}` === `${value}`);
    if (!targetItem) return value;
    return targetItem[labelField];
  }

  //  =====================================
  //                 child
  //  =====================================

  // 获取子表标题
  getChildFormTitle() {
    return 'child';
  }

  getChildFormErrorMessageList() {
    const messageList = [];
    this.childFieldError &&
      this.childFieldError.forEach((message) => {
        message && messageList.push(message);
      });
    return messageList;
  }

  // 获取子表显示用数据
  getChildLabelValue(fieldName, value) {
    if (!value) return value;
    const [field] = this.childFormDetail.filter((item) => item.fieldName === fieldName);
    if (!field) return value;
    if (fieldName === 'status') {
      const status = VMStatus[value];
      if (!status) return value;
      return status.label;
    }
    const { valueField, labelField, itemList } = field;
    if (!valueField || !labelField || !itemList) {
      return value;
    }
    const [targetItem] = itemList.filter((el) => `${el[valueField]}` === `${value}`);
    if (!targetItem) return value;
    return targetItem[labelField];
  }

  // 获取子表表头字段
  getChildHeaderCellList(len = 5) {
    if (!this.childFormDetail || !this.childFormDetail.length) return [];
    const res = [];
    for (let i = 0; i <= len; i += 1) {
      const { fieldName, fieldDisplayName } = this.childFormDetail[i];
      res.push({
        id: fieldName,
        label: fieldDisplayName,
        alignment: 'left'
      });
    }
    res.push({ id: 'action', label: 'Actions', alignment: 'left' });
    return res;
  }

  // 整合子表初始数据和结构
  getChildInitDetail(index) {
    const initData = this.getCurrentChild(index);
    this.currentChildrenData = initData;
    const res = [];
    const success = initData.get('status') === SUCCESS.value;
    if (this.childFormDetail) {
      this.childFormDetail.forEach((item) => {
        if (this.shouldContinue(item)) return;
        this.getDisabled(item);
        const defaultValue = initData.get(item.fieldName);
        const newItem = {
          ...item,
          show: true,
          defaultValue,
          disabled: success || this.disabledAllChild
        };
        res.push(newItem);
      });
    }
    return res;
  }

  // 子表字段数据变更
  onChildFieldChange(fieldName, value) {
    this.currentChildrenData.set(fieldName, value);
  }

  // 验证子表字段
  checkChildField(field) {
    const { fieldName, required, fieldDisplayName, show } = field;
    if (show && required && this.isEmpty(fieldName, false)) {
      const message =
        fieldDisplayName.length > 40 ? 'This field is required' : `${fieldDisplayName} is required`;
      this.childFieldError.set(fieldName, message);
      return { error: true, message };
    }
    const value = this.currentChildrenData.get(fieldName);
    if (
      show &&
      (fieldName === 'cpu_request_number' || fieldName === 'ram_request_number') &&
      !isNonNegativeInteger(value)
    ) {
      const message = `${fieldDisplayName} Only receive non-negative integer`;
      this.childFieldError.set(fieldName, message);
      return { error: true, message };
    }
    this.childFieldError.set(fieldName, null);
    return { error: false, message: '' };
  }

  // 验证子表是否为空
  checkChildLength() {
    return true;
  }

  // 验证子表所有字段
  checkAllChildField() {
    for (let i = 0; i < this.childInitDetail.length; i += 1) {
      const { error } = this.checkChildField(this.childInitDetail[i]);
      if (error) {
        return false;
      }
    }
    return true;
  }

  // 保存当前子表
  saveChildForm(index) {
    if (index < 0 || index >= this.childrenDataList.length) {
      this.childrenDataList.push(cloneMap1(this.currentChildrenData));
    } else {
      this.childrenDataList[index] = cloneMap1(this.currentChildrenData);
    }
    this.currentChildrenData.clear();
  }

  // 从子表列表获取子表数据
  getCurrentChild(index) {
    if (index < 0 || index >= this.childrenDataList.length) {
      return new Map();
    }
    return this.childrenDataList[index];
  }

  // 清空子表
  deleteAllChild() {
    this.childrenDataList = [];
  }

  // 删除子表指定数据
  deleteChild(selected) {
    this.childrenDataList = this.childrenDataList.filter((_, i) => selected.indexOf(i) === -1);
  }

  // 获取子表表格标题
  getChildTableTitle() {
    return this.childFormKey;
  }

  // 获取子表按钮
  getChildFormActions(props) {
    const { currentIndex, onClose } = props;
    const handleSave = () => {
      const pass = this.checkAllChildField();
      if (!pass) {
        const messageList = this.getChildFormErrorMessageList();
        CommonTip.error(messageList.length ? messageList[0] : 'Please check your data');
        return;
      }
      this.saveChildForm(currentIndex);
      onClose();
    };
    return (
      <>
        <Button
          color="primary"
          variant="contained"
          style={{
            width: '5vw',
            marginLeft: '1vw',
            marginRight: '1vw',
            color: '#fff'
          }}
          onClick={handleSave}
        >
          Save
        </Button>
        <Button
          variant="contained"
          style={{
            width: '5vw',
            marginLeft: '1vw',
            marginRight: '1vw',
            color: '#333',
            backgroundColor: '#eee'
          }}
          onClick={onClose}
        >
          Cancel
        </Button>
      </>
    );
  }
}

export class CommonDetail extends Common {
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

export class CommonUpdate extends Common {
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
    return <UpdateActions history={history} logic={this} />;
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

export default function getTest(props) {
  const { stepName } = props;
  switch (stepName) {
    case CREATE:
      return new Common(props);
    case UPDATE:
      return new CommonUpdate(props);
    default:
      return new CommonDetail(props);
  }
}
