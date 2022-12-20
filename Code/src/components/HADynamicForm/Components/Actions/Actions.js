import React, { useState } from 'react';
import { Button } from '@material-ui/core';
import CommonTip from '../../../CommonTip';
import Loading from '../../../Loading';
import API from '../../../../api/diyForm';
import { L } from '../../../../utils/lang';
import RejectReason from '../RejectReason/RejectReason';
import { UNHANDLED } from '../../../../utils/variable/VMStatus';
import Contract from '../../../Contract';

export function CommonActions(props) {
  const { logic, history } = props;

  const [contractOpen, setContractOpen] = useState(false);
  const [contractList, setContractList] = useState([]);

  const handleClose = (argee) => {
    setContractOpen(false);
    // eslint-disable-next-line no-const-assign,no-undef
    if (argee) {
      handleSave();
    }
  };

  const handleCheck = async () => {
    const checkRes = await logic.checkAllParentField();
    if (!checkRes) {
      const messageList = logic.getParentErrorMessageList();
      CommonTip.error(messageList.length ? messageList[0] : 'Please check your data');
      return;
    }
    const childRes = logic.checkChildLength();
    if (!childRes) {
      const title = logic.getChildTableTitle();
      CommonTip.error(`${title || 'Child table'} can not be null`);
      return;
    }
    handleContract();
  };

  const handleContract = () => {
    const contractList = logic.getContractList();
    if (contractList) {
      setContractList(contractList);
      setContractOpen(true);
    } else {
      handleSave();
    }
  };

  const handleSave = () => {
    Loading.show();
    try {
      logic.childrenDataList &&
        logic.childrenDataList.forEach((el) => {
          el.set('status', UNHANDLED.value);
        });
      const form = logic.getFormData();
      API.create(form)
        .then(() => {
          CommonTip.success(L('Success'));
          history.push({ pathname: '/' });
        })
        .finally(() => {
          Loading.hide();
        })
        .catch((e) => {
          console.log(e);
          Loading.hide();
        });
    } catch (e) {
      Loading.hide();
    }
  };
  const onClose = () => history.push({ pathname: '/' });
  return (
    <>
      <Button
        // color='primary'
        variant="contained"
        style={{
          width: '5vw',
          marginLeft: '1vw',
          marginRight: '1vw',
          color: '#fff',
          backgroundColor: '#4CAF50'
        }}
        onClick={handleCheck}
      >
        {L('Submit')}
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
        {L('Cancel')}
      </Button>
      <Contract open={contractOpen} onClose={handleClose} contractList={contractList} />
    </>
  );
}

export function DetailActions(props) {
  const { history } = props;
  const onClose = () => history.push({ pathname: '/' });
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

export function UpdateActions(props) {
  const { logic, history } = props;
  const [openReject, setOpenReject] = useState(false);
  const handleUpdate = async () => {
    const res = await logic.checkAllParentField();
    if (!res) {
      const messageList = logic.getParentErrorMessageList();
      CommonTip.error(messageList.length ? messageList[0] : 'Please check your data');
      return;
    }
    Loading.show();
    const form = logic.getFormData();
    API.update(form)
      .then(() => {
        CommonTip.success(L('Success'));
        history.push({ pathname: '/MyApproval' });
      })
      .finally(() => {
        Loading.hide();
      })
      .catch((e) => {
        console.log(e);
        Loading.hide();
      });
  };
  const handleRejectOpen = () => {
    setOpenReject(true);
  };
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
        onClick={handleUpdate}
      >
        {L('Approval')}
      </Button>
      <Button
        variant="contained"
        style={{
          width: '5vw',
          marginLeft: '1vw',
          marginRight: '1vw',
          color: '#fff',
          backgroundColor: '#f44336'
        }}
        onClick={handleRejectOpen}
      >
        {L('Reject')}
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
        onClick={() => history.push({ pathname: '/' })}
      >
        {L('Cancel')}
      </Button>
      <RejectReason
        open={openReject}
        onClose={() => setOpenReject(false)}
        taskId={logic ? logic.taskId : 0}
      />
    </>
  );
}

export function VMT3Actions(props) {
  const { logic, history } = props;
  const handleSave = async () => {
    const res = await logic.checkAllParentField();
    if (!res) {
      const messageList = logic.getParentErrorMessageList();
      CommonTip.error(messageList.length ? messageList[0] : 'Please check your data');
      return;
    }
    console.log(logic.childrenDataList);
    logic.childrenDataList.forEach((childData) => {
      if (!childData.get('$handled')) {
        CommonTip.warning('Please handle all VM first!');
      }
    });
    const hostnameSet = new Set();
    logic.childrenDataList.forEach((childData) => {
      const hostname = childData.get('hostname');
      if (hostnameSet.has(hostname)) {
        CommonTip.warning('The hostname in requested VM list cannot be duplicate.');
        return;
      }
      hostnameSet.add(hostname);
    });
    const form = logic.getFormData();
    Loading.show();
    API.update(form)
      .then(() => {
        CommonTip.success(L('Success'));
        history.push({ pathname: '/' });
      })
      .finally(() => {
        Loading.hide();
      })
      .catch((e) => {
        console.log(e);
        Loading.hide();
      });
  };
  const onClose = () => history.push({ pathname: '/' });
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
        onClick={handleSave}
      >
        {L('Submit')}
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
        {L('Cancel')}
      </Button>
    </>
  );
}
