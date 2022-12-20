import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import formatDateTime from '../../../../../utils/formatDateTime';

import DetailPage from '../../../../../components/DetailPage';
import API from '../../../../../api/adGroup';
import { L } from '../../../../../utils/lang';

function Detail() {
  const { id } = useParams();
  const [formFieldList, setFormFieldList] = useState([]);

  useEffect(() => {
    API.detail(id).then(({ data }) => {
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
    });
  }, [id]);

  return (
    <>
      <DetailPage formFieldList={formFieldList} />
    </>
  );
}

export default Detail;
