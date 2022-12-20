import React, { useEffect, useState } from 'react';

import { useHistory, useParams } from 'react-router-dom';
import DetailPage from '../../../../../components/DetailPage';
import API from '../../../../../api/expiry';
import formatDateTime from '../../../../../utils/formatDateTime';
import { L } from '../../../../../utils/lang';
import CommonTip from '../../../../../components/CommonTip';
import message from '../../../../../utils/variable/message';

function AssignDetail() {
  const { id } = useParams();
  const history = useHistory();
  const [formFieldList, setFormFieldList] = useState([]);

  useEffect(() => {
    API.detail({ id }).then(({ data }) => {
      if (!data?.data) {
        CommonTip.error(message.VALUE_NOT_FOUND);
        history.push('/');
      }
      const { tenant, expiryDate, createdAt, updatedAt } = data.data;
      const tenantName = tenant?.name || '';
      const list = [
        {
          id: 'tenant',
          label: L('Tenant'),
          type: 'text',
          disabled: true,
          readOnly: true,
          value: tenantName
        },
        {
          id: 'expiryDate',
          label: L('Expiry Date'),
          type: 'text',
          disabled: true,
          readOnly: true,
          value: formatDateTime(expiryDate, 'DD-MMM-YYYY')
        },
        {
          id: 'createdAt',
          label: L('Created At'),
          type: 'text',
          disabled: true,
          readOnly: true,
          value: formatDateTime(createdAt)
        },
        {
          id: 'updatedAt',
          label: L('Updated At'),
          type: 'text',
          disabled: true,
          readOnly: true,
          value: formatDateTime(updatedAt)
        }
      ];
      setFormFieldList(list);
    });
  }, [id, history]);

  return (
    <>
      <DetailPage formFieldList={formFieldList} />
    </>
  );
}

export default AssignDetail;
