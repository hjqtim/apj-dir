import React, { useEffect, useState } from 'react';

import { useParams } from 'react-router-dom';
import DetailPage from '../../../../../components/DetailPage';
import API from '../../../../../api/inventoryLifeCycle';
import { L } from '../../../../../utils/lang';
import formatDateTime from '../../../../../utils/formatDateTime';
import actionType from '../../untils/actionType';

function Detail() {
  const { id } = useParams();
  const [LifeCycles, setLifeCycles] = useState([]);
  const format = 'DD-MMM-YYYY';

  useEffect(() => {
    API.detail(id).then(({ data }) => {
      if (data && data.data) {
        const defaultValue = data.data;
        const lifeCycleList = [
          {
            id: 'oldID',
            label: L('Ref. ID'),
            type: 'text',
            disabled: true,
            readOnly: true,
            value: defaultValue._ID
          },
          {
            id: 'InventoryID',
            label: L('Inventory'),
            type: 'text',
            disabled: true,
            readOnly: true,
            value: defaultValue.InventoryID
          },
          {
            id: 'AssetID',
            label: L('Asset No'),
            type: 'text',
            disabled: true,
            readOnly: true,
            value: defaultValue.AssetID
          },
          {
            id: 'RecordCreatedOn',
            label: L('Record Created Date'),
            type: 'text',
            disabled: true,
            readOnly: true,
            value: defaultValue.RecordCreatedOn
              ? formatDateTime(defaultValue.RecordCreatedOn, format)
              : ''
          },
          {
            id: 'ActionType',
            label: L('Action Type'),
            type: 'select',
            itemList: actionType,
            labelField: 'label',
            valueField: 'value',
            disabled: true,
            readOnly: true,
            value: defaultValue.ActionType
          },
          {
            id: 'ActionDetails',
            label: L('Action Details'),
            type: 'text',
            disabled: true,
            readOnly: true,
            value: defaultValue.ActionDetails
          },
          {
            id: 'SuccessorInventoryID',
            label: L('Successor Inventory ID'),
            type: 'text',
            disabled: true,
            readOnly: true,
            value: defaultValue.SuccessorInventoryID
          },
          {
            id: 'ActionDate',
            label: L('Action Date'),
            type: 'text',
            disabled: true,
            readOnly: true,
            value: defaultValue.ActionDate ? formatDateTime(defaultValue.ActionDate, format) : ''
          },
          {
            id: 'RespStaff',
            label: L('Resp Staff'),
            type: 'text',
            disabled: true,
            readOnly: true,
            value: defaultValue.RespStaff
          },
          {
            id: 'RespStaffDisplayName',
            label: L('Resp Staff Display Name'),
            type: 'text',
            disabled: true,
            readOnly: true,
            value: defaultValue.RespStaffDisplayName
          },
          {
            id: 'Reason',
            label: L('Reason'),
            type: 'text',
            disabled: true,
            readOnly: true,
            value: defaultValue.Reason
          },
          {
            id: 'CaseRef',
            label: L('Case Ref'),
            type: 'text',
            disabled: true,
            readOnly: true,
            value: defaultValue.CaseRef
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
        setLifeCycles(lifeCycleList);
      }
    });
  }, [id]);

  return (
    <>
      <DetailPage formFieldList={LifeCycles} />
    </>
  );
}

export default Detail;
