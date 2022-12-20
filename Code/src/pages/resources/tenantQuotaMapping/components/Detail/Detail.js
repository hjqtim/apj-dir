import React, { useEffect, useState } from 'react';

import { useParams } from 'react-router-dom';
import DetailPage from '../../../../../components/DetailPage';
import API from '../../../../../api/tenantQuotaMapping';
import { L } from '../../../../../utils/lang';
import formatDateTime from '../../../../../utils/formatDateTime';

function Detail() {
  const { id } = useParams();
  const [formFieldList, setFormFieldList] = useState([]);

  useEffect(() => {
    API.detail(id).then(({ data }) => {
      if (data && data.data) {
        const { tenant, type, year, quota, createdAt, updatedAt } = data.data;

        const list = [
          {
            id: 'tenant',
            label: L('Tenant'),
            type: 'text',
            disabled: true,
            readOnly: true,
            value: tenant ? tenant.name : ''
          },
          {
            id: 'type',
            label: L('Type'),
            type: 'text',
            disabled: true,
            readOnly: true,
            value: type
          },
          {
            id: 'quota',
            label: L('Quota'),
            type: 'text',
            disabled: true,
            readOnly: true,
            value: quota
          },
          {
            id: 'year',
            label: L('Year'),
            type: 'text',
            disabled: true,
            readOnly: true,
            value: year
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
      }
    });
  }, [id]);

  return (
    <>
      <DetailPage formFieldList={formFieldList} />
    </>
  );
}

export default Detail;
