import React, { useEffect, useState } from 'react';

import { useParams } from 'react-router-dom';
import DetailPage from '../../../../../components/DetailPage';
import API from '../../../../../api/tenant';
import { L } from '../../../../../utils/lang';
import formatDateTime from '../../../../../utils/formatDateTime';
import returnType from '../../../../../utils/variable/returnType';

function Detail() {
  const { id } = useParams();
  const [formFieldList, setFormFieldList] = useState([]);

  // 获取详情
  useEffect(() => {
    API.detail(id).then(({ data }) => {
      if (data && data.data) {
        const defaultValue = data.data;
        const managerGroup =
          defaultValue.manager_group && defaultValue.manager_group.name
            ? defaultValue.manager_group.name
            : '';
        const supporterGroup =
          defaultValue.supporter_group && defaultValue.supporter_group.name
            ? defaultValue.supporter_group.name
            : '';
        const group = defaultValue.group && defaultValue.group.name ? defaultValue.group.name : '';
        const mappingGroup = defaultValue?.mapping_group?.name || '';
        const role = defaultValue?.role?.right || '';

        const list = [
          {
            id: 'code',
            label: L('Code'),
            type: 'text',
            disabled: true,
            readOnly: true,
            value: defaultValue.code
          },
          {
            id: 'name',
            label: L('Name'),
            type: 'text',
            disabled: true,
            readOnly: true,
            value: defaultValue.name
          },
          {
            id: 'mappingGroup',
            label: L('Mapping Group'),
            type: 'text',
            disabled: true,
            readOnly: true,
            value: mappingGroup
          },
          {
            id: 'managerGroup',
            label: L('Manager Group'),
            type: 'text',
            disabled: true,
            readOnly: true,
            value: managerGroup
          },
          {
            id: 'role',
            label: L('Role'),
            type: 'text',
            disabled: true,
            readOnly: true,
            value: role
          },
          {
            id: 'supporterGroup',
            label: L('SupporterGroup'),
            type: 'text',
            disabled: true,
            readOnly: true,
            value: supporterGroup
          },
          {
            id: 'group',
            label: L('Group'),
            type: 'text',
            disabled: true,
            readOnly: true,
            value: group
          },
          {
            id: 'justification',
            label: L('Justification'),
            type: 'text',
            disabled: true,
            readOnly: true,
            value: defaultValue.justification
          },
          {
            id: 'budget_type',
            label: L('Budget Type'),
            type: 'text',
            disabled: true,
            readOnly: true,
            value: defaultValue.budget_type
          },
          {
            id: 'project_owner',
            label: L('Project Owner'),
            type: 'text',
            disabled: true,
            readOnly: true,
            value: defaultValue.project_owner
          },
          {
            id: 'contact_person',
            label: L('Contact Person'),
            type: 'searchInput',
            apiValue: { returnType: returnType.U },
            disabled: true,
            readOnly: true,
            value: defaultValue.contact_person
          },
          {
            id: 'project_estimation',
            label: L('Project Estimation'),
            type: 'text',
            disabled: true,
            readOnly: true,
            value: defaultValue.project_estimation
          },
          {
            id: 'methodology_text',
            label: L('Methodology Text'),
            type: 'text',
            disabled: true,
            readOnly: true,
            value: defaultValue.methodology_text
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
      }
    });
    // eslint-disable-next-line
  }, [id]);

  return (
    <>
      <DetailPage formFieldList={formFieldList} />
    </>
  );
}

export default Detail;
