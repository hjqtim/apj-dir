import { Button } from '@material-ui/core';
import React from 'react';
import { Common } from '../Common';
import Api from '../../../../api/diyForm';
import { object2map } from '../../../map2object';
import {
  DetailActions,
  UpdateActions
} from '../../../../components/HADynamicForm/Components/Actions';
import { L } from '../../../lang';
import { CREATE, UPDATE } from '../../../variable/stepName';
import { fieldCheck } from '../utils';
import ContractItems from '../../../../components/ContractItems/ContractItems';

class ClosingAccount extends Common {
  // 特殊字段验证(异步)
  async asyncCheck(field) {
    const emailFieldNameList = [
      // 'supervisoremailaccount'
    ];
    const fieldNameList = {
      emailFieldNameList
    };
    return fieldCheck(this, field, fieldNameList);
  }

  static getContractList() {
    return [ContractItems.get('Closing Account')];
  }

  getParentTitle() {
    if (this.stepName === CREATE) return null;
    return 'Closing Account';
  }
}

class ClosingAccountDetail extends ClosingAccount {
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

class ClosingAccountUpdate extends ClosingAccount {
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
}

export default async function getClosingLogic(props) {
  const { stepName } = props;
  switch (stepName) {
    case CREATE:
      return new ClosingAccount(props);
    case UPDATE:
      return new ClosingAccountUpdate(props);
    default:
      return new ClosingAccountDetail(props);
  }
}
