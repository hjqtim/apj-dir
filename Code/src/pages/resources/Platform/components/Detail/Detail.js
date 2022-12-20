import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { L } from '../../../../../utils/lang';

import DetailPage from '../../../../../components/DetailPage';
import API from '../../../../../api/platform';
import formatDateTime from '../../../../../utils/formatDateTime';

function Detail() {
  const { id } = useParams();
  const [formFieldList, setFormFieldList] = useState([]);

  useEffect(() => {
    API.detail(id).then(({ data }) => {
      if (data && data.data) {
        const defaultValue = data.data;
        const list = [
          {
            id: 'name',
            label: L('Name'),
            type: 'text',
            disabled: true,
            readOnly: true,
            value: defaultValue.name
          },
          // {
          //   id: 'typeId', label: L('Type'), type: 'text',
          //   disabled: true, readOnly: true, value: defaultValue["vm_platform_type.name"],
          // },
          {
            id: 'createdAt',
            label: L('Created At'),
            type: 'text',
            disabled: true,
            readOnly: true,
            value: formatDateTime(defaultValue.createdAt)
          },
          {
            id: 'updatedAt',
            label: L('Updated At'),
            type: 'text',
            disabled: true,
            readOnly: true,
            value: formatDateTime(defaultValue.updatedAt)
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
