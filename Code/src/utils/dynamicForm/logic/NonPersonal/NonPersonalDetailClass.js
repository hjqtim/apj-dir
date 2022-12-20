import React from 'react';
import { Button } from '@material-ui/core';
import Api from '../../../../api/diyForm';
import { object2map } from '../../../map2object';
import { DetailActions } from '../../../../components/HADynamicForm/Components/Actions';
import { L } from '../../../lang';
import NonPersonal from './NonPersonalClass';

export default class NonPersonalDetail extends NonPersonal {
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
