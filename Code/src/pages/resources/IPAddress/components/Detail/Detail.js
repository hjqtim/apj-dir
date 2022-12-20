import React, { useEffect, useState } from 'react';

import { useParams } from 'react-router-dom';
import DetailPage from '../../../../../components/DetailPage';
import API from '../../../../../api/IPAssignment';
import { L } from '../../../../../utils/lang';
import formatDateTime from '../../../../../utils/formatDateTime';

function Detail() {
  const { id } = useParams();
  const [formFieldList, setFormFieldList] = useState([]);

  useEffect(() => {
    API.detail({ id }).then(({ data }) => {
      const { IP, DC, hostname, projectTeam, networkType, IPPool, vlanId, remark, assignedDate } =
        data.data;

      const list = [
        {
          id: 'ip',
          label: L('IP'),
          type: 'text',
          required: true,
          disabled: true,
          readOnly: true,
          value: IP
        },
        {
          id: 'dc',
          label: L('DC'),
          type: 'text',
          required: true,
          disabled: true,
          readOnly: true,
          value: DC ? DC.name : ''
        },
        {
          id: 'hostname',
          label: L('Hostname'),
          type: 'text',
          required: false,
          disabled: true,
          readOnly: true,
          value: hostname
        },
        {
          id: 'projectTeam',
          label: L('Project Team'),
          type: 'text',
          required: false,
          disabled: true,
          readOnly: true,
          value: projectTeam
        },
        {
          id: 'networkType',
          label: L('Network Type'),
          type: 'text',
          required: false,
          disabled: true,
          readOnly: true,
          value: networkType
        },
        {
          id: 'ipPool',
          label: L('IP Pool'),
          type: 'text',
          required: false,
          disabled: true,
          readOnly: true,
          value: IPPool
        },
        {
          id: 'vlanId',
          label: L('VLan ID'),
          type: 'text',
          required: false,
          disabled: true,
          readOnly: true,
          value: vlanId
        },
        {
          id: 'remark',
          label: L('Remark'),
          type: 'text',
          required: false,
          disabled: true,
          readOnly: true,
          value: remark
        },
        {
          id: 'assignedDate',
          label: L('Assigned Date'),
          type: 'date',
          required: false,
          disabled: true,
          readOnly: true,
          value: assignedDate ? formatDateTime(assignedDate) : undefined
        }
      ];
      setFormFieldList(list);
    });
  }, [id]);

  return (
    <>
      <DetailPage formFieldList={formFieldList} />
    </>
  );
}

export default Detail;
