import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import formatDateTime from '../../../../../utils/formatDateTime';
import { L } from '../../../../../utils/lang';
import DetailPage from '../../../../../components/DetailPage';
import UserApi from '../../../../../api/user';

function Detail() {
  const { id } = useParams();
  const [formFieldList, setFormFieldList] = useState([]);

  useEffect(() => {
    UserApi.detail(id).then(({ data }) => {
      const defaultValue = data.data;
      const list = [
        {
          id: 'corpId',
          label: L('CORP ID'),
          type: 'text',
          disabled: true,
          readOnly: true,
          value: defaultValue.corpId
        },
        {
          id: 'alias',
          label: L('Alias'),
          type: 'text',
          disabled: true,
          readOnly: true,
          value: defaultValue.alias
        },
        {
          id: 'surname',
          label: L('Surname'),
          type: 'text',
          disabled: true,
          readOnly: true,
          value: defaultValue.surname
        },
        {
          id: 'givenname',
          label: L('Given Name'),
          type: 'text',
          disabled: true,
          readOnly: true,
          value: defaultValue.givenname
        },
        {
          id: 'title',
          label: L('Title'),
          type: 'text',
          disabled: true,
          readOnly: true,
          value: defaultValue.title
        },
        {
          id: 'displayname',
          label: L('Display Name'),
          type: 'text',
          disabled: true,
          readOnly: true,
          value: defaultValue.displayname
        },
        {
          id: 'email',
          label: L('Email'),
          type: 'text',
          disabled: true,
          readOnly: true,
          value: defaultValue.email
        },
        {
          id: 'proxyAddresses',
          label: L('Proxy Addresses'),
          type: 'text',
          disabled: true,
          readOnly: true,
          value: defaultValue.proxyAddresses
        },
        {
          id: 'cluster',
          label: L('Cluster'),
          type: 'text',
          disabled: true,
          readOnly: true,
          value: defaultValue.cluster
        },
        {
          id: 'hospital',
          label: 'Institution',
          type: 'text',
          disabled: true,
          readOnly: true,
          value: defaultValue.hospital
        },
        {
          id: 'department',
          label: L('Department'),
          type: 'text',
          disabled: true,
          readOnly: true,
          value: defaultValue.department
        },
        {
          id: 'passwordLastSet',
          label: L('Password Last Set'),
          type: 'text',
          disabled: true,
          readOnly: true,
          value: defaultValue.passwordLastSet
        },
        {
          id: 'UACCode',
          label: L('UAC Code'),
          type: 'text',
          disabled: true,
          readOnly: true,
          value: defaultValue.UACCode
        },
        {
          id: 'UACDesc',
          label: L('UAC Desc'),
          type: 'text',
          disabled: true,
          readOnly: true,
          value: defaultValue.UACDesc
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
