import React, { useEffect, useState } from 'react';

import { useParams } from 'react-router-dom';
import DetailPage from '../../../../../components/DetailPage';
import API from '../../../../../api/IPAssignment';
import { L } from '../../../../../utils/lang';

function Detail() {
  const { id } = useParams();
  const [ip, setIP] = useState('');
  const [dc, setDC] = useState('');
  const [hostname, setHostname] = useState('');
  const [projectTeam, setProjectTeam] = useState('');
  const [networkType, setNetworkType] = useState('');
  const [ipPool, setIpPool] = useState('');
  const [vlanId, setVlanId] = useState('');
  const [remark, setRemark] = useState('');
  const [formFieldList, setFormFieldList] = useState([]);

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
    });
  }, [id]);

  useEffect(() => {
    const list = [
      {
        id: 'ip',
        label: L('IP'),
        type: 'text',
        required: false,
        readOnly: true,
        value: ip
      },
      {
        id: 'dc',
        label: L('DC'),
        type: 'text',
        required: false,
        readOnly: true,
        value: dc
      },
      {
        id: 'hostname',
        label: L('Hostname'),
        type: 'text',
        required: false,
        readOnly: true,
        value: hostname
      },
      {
        id: 'projectTeam',
        label: L('Project Team'),
        type: 'text',
        required: false,
        readOnly: true,
        value: projectTeam
      },
      {
        id: 'networkType',
        label: L('Network Type'),
        type: 'text',
        required: false,
        readOnly: true,
        value: networkType
      },
      {
        id: 'ipPool',
        label: L('IP Pool'),
        type: 'text',
        required: false,
        readOnly: true,
        value: ipPool
      },
      {
        id: 'vlanId',
        label: L('VLan ID'),
        type: 'text',
        required: false,
        readOnly: true,
        value: vlanId
      },
      {
        id: 'remark',
        label: L('Remark'),
        type: 'text',
        required: false,
        readOnly: true,
        value: remark
      }
    ];
    setFormFieldList(list);
  }, [ip, dc, hostname, projectTeam, networkType, ipPool, vlanId, remark]);

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

  return (
    <>
      <DetailPage
        formTitle={L('Detail')}
        onFormFieldChange={onFormFieldChange}
        formFieldList={formFieldList}
      />
    </>
  );
}

export default Detail;
