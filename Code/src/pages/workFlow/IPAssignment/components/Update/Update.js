import React, { useEffect, useState } from 'react';
import { useParams, useHistory } from 'react-router-dom';

import DetailPage from '../../../../../components/DetailPage';
import CommonTip from '../../../../../components/CommonTip';
import API from '../../../../../api/IPAssignment';
import { checkEmpty } from '../../untils/IPAssignmentCheck';
import { L } from '../../untils/lang';

const listPath = '/resources/IPAddress';
const formTitle = 'Update';

function Update() {
  const { id } = useParams();
  const history = useHistory();
  const [ip, setIP] = useState('');
  const [dc, setDC] = useState('');
  const [hostname, setHostname] = useState('');
  const [projectTeam, setProjectTeam] = useState('');
  const [networkType, setNetworkType] = useState('');
  const [ipPool, setIpPool] = useState('');
  const [vlanId, setVlanId] = useState('');
  const [remark, setRemark] = useState('');
  const [formFieldList, setFormFieldList] = useState([]);
  const [saving, setSaving] = useState(true);
  const [nameError, setNameError] = useState(false);
  const [nameHelperText, setNameHelperText] = useState('');

  const hanleClick = async () => {
    const nameErr = await nameCheck();
    if (nameErr || saving) return;
    setSaving(true);
    API.update(id, { ip, dc, hostname })
      .then(() => {
        CommonTip.success(L('Success'));
        history.push({ pathname: listPath });
      })
      .catch(() => {
        setSaving(false);
      });
  };

  useEffect(() => {
    API.detail(id).then(({ data }) => {
      const { ip, dc, hostname, projectTeam, networkType, ipPool, vlanId, remark } = data.data;
      setIP(ip);
      setDC(dc);
      setHostname(hostname);
      setProjectTeam(projectTeam);
      setNetworkType(networkType);
      setIpPool(ipPool);
      setVlanId(vlanId);
      setRemark(remark);
      setSaving(false);
    });
  }, [id]);

  useEffect(() => {
    const list = [
      {
        id: 'ip',
        label: L('IP'),
        type: 'text',
        required: true,
        readOnly: false,
        value: ip,
        error: nameError,
        helperText: nameHelperText
      },
      {
        id: 'dc',
        label: L('DC'),
        type: 'text',
        required: false,
        readOnly: false,
        value: dc,
        error: nameError,
        helperText: nameHelperText
      },
      {
        id: 'hostname',
        label: L('Hostname'),
        type: 'text',
        required: false,
        readOnly: false,
        value: hostname,
        error: nameError,
        helperText: nameHelperText
      },
      {
        id: 'projectTeam',
        label: L('Project Team'),
        type: 'text',
        required: false,
        readOnly: false,
        value: projectTeam,
        error: nameError,
        helperText: nameHelperText
      },
      {
        id: 'networkType',
        label: L('Network Type'),
        type: 'text',
        required: false,
        readOnly: false,
        value: networkType,
        error: nameError,
        helperText: nameHelperText
      },
      {
        id: 'ipPool',
        label: L('Ip Pool'),
        type: 'text',
        required: false,
        readOnly: false,
        value: ipPool,
        error: nameError,
        helperText: nameHelperText
      },
      {
        id: 'vlanId',
        label: L('Vlan ID'),
        type: 'text',
        required: false,
        readOnly: false,
        value: vlanId,
        error: nameError,
        helperText: nameHelperText
      },
      {
        id: 'remark',
        label: L('Remark'),
        type: 'text',
        required: false,
        readOnly: false,
        value: remark,
        error: nameError,
        helperText: nameHelperText
      }
    ];
    setFormFieldList(list);
  }, [
    ip,
    dc,
    hostname,
    projectTeam,
    networkType,
    ipPool,
    vlanId,
    remark,
    nameError,
    nameHelperText
  ]);

  const onFormFieldChange = (e, id) => {
    const { value } = e.target;
    switch (id) {
      case 'ip':
        setIP(value);
        break;
      case 'dc':
        setDC(value);
        break;
      case 'hostname':
        setHostname(value);
        break;
      case 'projectTeam':
        setProjectTeam(value);
        break;
      case 'networkType':
        setNetworkType(value);
        break;
      case 'ipPool':
        setIpPool(value);
        break;
      case 'vlanId':
        setVlanId(value);
        break;
      case 'remark':
        setRemark(value);
        break;
      default:
        break;
    }
  };

  const nameCheck = async () => {
    const emptyCheck = checkEmpty('IP', ip);
    setNameError(emptyCheck.error);
    setNameHelperText(emptyCheck.msg);
    // if (!emptyCheck.error) {
    //   const checkExist = getCheckExist()
    //   const { error, msg } = await checkExist(id, name)
    //   setNameError(error)
    //   setNameHelperText(msg)
    //   return error
    // }
    return emptyCheck.error;
  };
  const onFormFieldBlur = (_, id) => {
    switch (id) {
      case 'ip':
        nameCheck();
        break;
      default:
        break;
    }
  };
  return (
    <>
      <DetailPage
        formTitle={formTitle}
        onFormFieldChange={onFormFieldChange}
        onFormFieldBlur={onFormFieldBlur}
        formFieldList={formFieldList}
        showBtn
        onBtnClick={hanleClick}
      />
    </>
  );
}

export default Update;
