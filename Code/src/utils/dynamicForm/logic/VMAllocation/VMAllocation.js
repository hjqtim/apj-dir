import ReactDOM from 'react-dom';
import React from 'react';
import { Button } from '@material-ui/core';
import { Common } from '../Common';
import tenantAPI from '../../../../api/tenant';
import ParentSubInfoTemplate from './ParentSubInfoTemplate';
import { CREATE, DETAIL, T3 } from '../../../variable/stepName';
import API from '../../../../api/diyForm';
import { map2object, object2map } from '../../../map2object';
import { L } from '../../../lang';
import {
  VMT3Actions,
  UpdateActions,
  DetailActions
} from '../../../../components/HADynamicForm/Components/Actions';
import Loading from '../../../../components/Loading';
import CommonTip from '../../../../components/CommonTip';
import { CHECKED, SKIP, SUCCESS } from '../../../variable/VMStatus';
import color from '../../../theme/color';
import { isNonNegativeInteger } from '../../../regex';
import sleep from '../../../sleep';

class VM extends Common {
  //  =====================================
  //                  整体
  //  =====================================

  // 插入 Dom
  async insertDom() {
    const { data } = await tenantAPI.detail(this.parentData.get('tenant'));
    const elId = 'vmAllocation_parent_sub_info';
    const tenant = data.data;
    const parentEl = document.getElementById('dynamic_form_parent');
    let nodeContainer = document.getElementById('nodeContainer');
    if (!nodeContainer) {
      nodeContainer = document.createElement('div');
      nodeContainer.id = 'nodeContainer';
      nodeContainer.style.width = '50%';
      nodeContainer.style.height = '100%';
      nodeContainer.style.margin = '0';
      nodeContainer.style.borderTopRightRadius = '0.8em';
      nodeContainer.style.borderBottomRightRadius = '0.8em';
      nodeContainer.style.padding = '1em 2% 1em 2%';
      nodeContainer.style.display = 'flex';
      nodeContainer.style.justifyContent = 'flex-between';
      nodeContainer.style.alignItems = 'center';
      parentEl.appendChild(nodeContainer);
    }
    const oldEl = document.getElementById('vmAllocation_parent_sub_info');
    if (oldEl) {
      ReactDOM.unmountComponentAtNode(nodeContainer);
    }
    if (tenant) {
      const node = <ParentSubInfoTemplate {...tenant} id={elId} />;
      ReactDOM.render(node, nodeContainer);
    }
  }

  // 异步字段验证
  asyncCheck(field) {
    let message = '';
    const { fieldName, required, fieldDisplayName, show, isParent } = field;
    if (!show) {
      this.parentFieldError.set(fieldName, null);
      return { error: false, message: '' };
    }
    if (required && this.isEmpty(fieldName, isParent)) {
      message = `${fieldDisplayName} is required`;
      isParent
        ? this.parentFieldError.set(fieldName, message)
        : this.childFieldError.set(fieldName, message);
      return { error: true, message };
    }
    if (!required && this.isEmpty(fieldName, isParent)) {
      isParent
        ? this.parentFieldError.set(fieldName, null)
        : this.childFieldError.set(fieldName, null);
      return { error: false, message: '' };
    }
    const value = isParent
      ? this.parentData.get(fieldName)
      : this.currentChildrenData.get(fieldName);
    if (
      (fieldName === 'CPURequestNumber' || fieldName === 'RAMRequestNumber') &&
      !isNonNegativeInteger(value)
    ) {
      message = 'Only receive non-negative integer';
      this.childFieldError.set(fieldName, message);
      return { error: true, message };
    }
    this.parentFieldError.set(fieldName, null);
    return { error: false, message: '' };
  }

  //  =====================================
  //                 parent
  //  =====================================
  async onParentFieldChange(fieldName, value) {
    switch (fieldName) {
      case 'tenant':
        this.parentData.set(fieldName, value);
        this.insertDom();
        return value;
      default:
        this.parentData.set(fieldName, value);
        return value;
    }
  }

  getParentTitle() {
    if (this.stepName === CREATE) return null;
    return 'VM Allocation';
  }

  //  =====================================
  //                 child
  //  =====================================

  // 获取子表表格标题
  getChildTableTitle() {
    return 'VM List';
  }

  // 验证子表是否为空
  checkChildLength() {
    if (this.childInitDetail && this.childInitDetail.length) {
      return this.childrenDataList.length !== 0;
    }
    return true;
  }

  // 获取子表标题
  getChildFormTitle(index) {
    switch (this.stepName) {
      case CREATE:
        return index === -1 ? 'Add VM' : 'VM Info';
      case T3:
        return index === -1 ? 'Add VM' : 'VM Info';
      default:
        return 'VM Info';
    }
  }

  onChildFieldChange(fieldName, value) {
    switch (fieldName) {
      case 'CPURequestNumber':
        onCPUChange(value, this.currentChildrenData);
        this.currentChildrenData.set(fieldName, value);
        break;
      default:
        this.currentChildrenData.set(fieldName, value);
    }
  }

  // 获取子表表头字段
  getChildHeaderCellList() {
    const res = [
      { id: 'platform', label: 'Platform', alignment: 'left' },
      {
        id: 'CPURequestNumber',
        label: 'CPU Request Number',
        alignment: 'left'
      },
      {
        id: 'RAMRequestNumber',
        label: 'RAM Request Number',
        alignment: 'left'
      },
      {
        id: 'DataStorageRequestNumber',
        label: 'Data Storage Request Number',
        alignment: 'left'
      }
    ];
    if (this.childFormDetail && this.childFormDetail.length > 0) {
      const platform = this.childFormDetail.filter((_) => _.fieldName === 'platform');
      const CPURequestNumber = this.childFormDetail.filter(
        (_) => _.fieldName === 'CPURequestNumber'
      );
      const RAMRequestNumber = this.childFormDetail.filter(
        (_) => _.fieldName === 'RAMRequestNumber'
      );
      const DataStorageRequestNumber = this.childFormDetail.filter(
        (_) => _.fieldName === 'DataStorageRequestNumber'
      );
      res[0].label =
        platform && platform[0] && platform[0].fieldDisplayName
          ? platform[0].fieldDisplayName
          : res[0].label;
      res[1].label =
        CPURequestNumber && CPURequestNumber[0] && CPURequestNumber[0].fieldDisplayName
          ? CPURequestNumber[0].fieldDisplayName
          : res[1].label;
      res[2].label =
        RAMRequestNumber && RAMRequestNumber[0] && RAMRequestNumber[0].fieldDisplayName
          ? RAMRequestNumber[0].fieldDisplayName
          : res[2].label;
      res[3].label =
        DataStorageRequestNumber &&
        DataStorageRequestNumber[0] &&
        DataStorageRequestNumber[0].fieldDisplayName
          ? DataStorageRequestNumber[0].fieldDisplayName
          : res[3].label;
    }
    if (this.stepName !== CREATE) {
      res.push({ id: 'status', label: 'Status', alignment: 'left' });
    }
    res.push({ id: 'action', label: 'Actions', alignment: 'left' });
    return res;
  }
}

// class VMCreate extends VM {
//   // 整体
//   async getInitData() {
//     const { cpsId } = this.startData;
//     if (!cpsId) return {};
//     const { data } = await tenantAPI.getCps(cpsId);
//     let parentInitData = new Map();
//     const childInitDatas = [];
//     if (data.data && data.data.tenant && data.data.vms) {
//       const { tenant, vms } = data.data;
//       if (tenant && tenant.tenant) {
//         tenant.cpsid = cpsId;
//         parentInitData = object2map(tenant);
//       }
//       if (vms && vms.length > 0) {
//         vms.forEach((_) => {
//           childInitDatas.push(object2map(_));
//         });
//       }
//     }

//     return {
//       parentInitData,
//       childInitData: childInitDatas,
//       callback: this.insertDom.bind(this)
//     };
//   }

//   // parent

//   // child
// }

class VMDetail extends VM {
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
    const { data } = await API.detail({
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

class VMUpdate extends VM {
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
    const { data } = await API.detail({
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

class VMT3 extends VMUpdate {
  // 构造函数
  constructor(props) {
    super(props);
    this.disabledAllParent = false;
    this.disabledAllChild = false;
    this.hideCheckBox = false;
    this.hideDelete = false;
    this.hideCreate = false;
  }

  // 整体
  async getInitData() {
    const { data } = await API.detail({
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
      // let res = [],
      //   failedRes = [],
      //   failed = false
      childDataList.forEach((childData) => {
        if (childData.status === SUCCESS.value) {
          childData.$handled = true;
        }
        childInitData.push(object2map(childData));
      });
    }
    return {
      parentInitData,
      childInitData,
      callback: this.insertDom.bind(this)
    };
  }

  // 整体
  getActions(history) {
    return <VMT3Actions history={history} logic={this} />;
  }

  // parent
  // 父表字段数据变更

  // child
  getChildFormActions(props) {
    const { onClose, currentIndex } = props;
    const currentChild = this.getCurrentChild(currentIndex);
    const handleCheck = async () => {
      // await handleSave()
      const childData = map2object(currentChild);
      this.formatFormData(childData);
      const form = {
        ...this.getFormData(),
        childData
      };
      Loading.show();
      const {
        data: { data: jobData }
      } = await API.getJobId(form);
      const { success, message, jobId } = jobData;
      if (!success) {
        Loading.hide();
        CommonTip.error(message);
      } else {
        let count = 0;
        let checkMessage = '';
        let checkSuccess = false;
        while (count < 6) {
          count += 1;
          const {
            data: { data: ResourceData }
          } = await API.getResource({ form, jobId });
          const { done, message, success } = ResourceData;
          checkMessage = message;
          checkSuccess = success;
          if (done) {
            break;
          }
          await sleep(6000);
        }
        if (checkSuccess) {
          currentChild.set('$handled', true);
          currentChild.set('status', CHECKED.value);
          CommonTip.success(L('Check successfully'));
          onClose();
        } else {
          currentChild.set('$handled', false);
          CommonTip.error(checkMessage);
        }
        Loading.hide();
      }
    };
    const handleSkip = async (name) => {
      const currentChild = this.getCurrentChild(currentIndex);
      console.log(this.getCurrentValueAll());
      const { data } = await API.getGrouptoEmail({ checkName: name });
      if (data.success) {
        currentChild.set('$handled', true);
        currentChild.set('status', SKIP.value);
        currentChild.set('checkName', name);
        CommonTip.success(L(`${name} Follow Up Success`));
        onClose && onClose();
      }
    };
    return (
      <>
        {currentChild.get('status') !== SUCCESS.value && (
          <>
            <Button
              variant="contained"
              style={{
                width: '5vw',
                marginLeft: '1vw',
                marginRight: '1vw',
                color: '#fff',
                backgroundColor: `${color.main.link}`
              }}
              onClick={handleCheck}
            >
              {L('Check')}
            </Button>
            <Button
              variant="contained"
              style={{
                width: '5vw',
                marginLeft: '1vw',
                marginRight: '1vw',
                color: '#fff',
                backgroundColor: '#2196f3'
              }}
              onClick={() => handleSkip(L('T1'))}
            >
              {L('T1')}
            </Button>
            <Button
              variant="contained"
              style={{
                width: '5vw',
                marginLeft: '1vw',
                marginRight: '1vw',
                color: '#fff',
                backgroundColor: '#2196f3'
              }}
              onClick={() => handleSkip(L('T2'))}
            >
              {L('T2')}
            </Button>
            <Button
              variant="contained"
              style={{
                width: '5vw',
                marginLeft: '1vw',
                marginRight: '1vw',
                color: '#fff',
                backgroundColor: '#2196f3'
              }}
              onClick={() => handleSkip(L('T6'))}
            >
              {L('T6')}
            </Button>
          </>
        )}
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
          {L('Cancel')}
        </Button>
      </>
    );
  }
}

function onCPUChange(value, currentChildrenData) {
  const ramEl = document.getElementById('RAMRequestNumber');
  if (ramEl) {
    ramEl.value = isNonNegativeInteger(value) ? parseInt(value, 10) * 8 : ramEl.value;
    currentChildrenData.set('RAMRequestNumber', ramEl.value);
  }
  currentChildrenData.set('CPURequestNumber', value);
}

export default async function getVMLogic(props) {
  const { stepName } = props;
  switch (stepName) {
    case CREATE:
      // return new VMCreate(props);
      return '';
    case DETAIL:
      return new VMDetail(props);
    case T3:
      return new VMT3(props);
    default:
      return new VMUpdate(props);
  }
}
