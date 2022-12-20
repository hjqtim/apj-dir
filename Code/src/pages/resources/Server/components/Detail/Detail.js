import React, { useEffect, useState } from 'react';

import { useParams } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import DetailPage from '../../../../../components/DetailPage';
import ExpandTable from '../../../../../components/ExpandTable';
import API from '../../../../../api/server';
import { L } from '../../../../../utils/lang';
import formatDateTime from '../../../../../utils/formatDateTime';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    width: '70%',
    backgroundColor: theme.palette.background.paper,
    margin: '0 auto'
  }
}));

const showPolicy = {
  index: 4,
  list: [
    'id',
    'oldID',
    'InventoryID',
    'IPAddress',
    'DefGateway',
    'SubnetMask',
    'ConfigFile',
    'CurVer',
    'NxBtVer',
    'BlockDHCP',
    'MedicalNW',
    'NetworkApplied',
    'Group'
  ],
  labels: [
    L('id'),
    L('oldID'),
    L('InventoryID'),
    L('IP Address'),
    L('Gateway'),
    L('Subnet'),
    L('Config File'),
    L('Current Firmware Version'),
    L('Next Boot Firmware Version'),
    L('DHCP Snooping'),
    L('MedicalNW'),
    L('Network Applied'),
    L('Group')
  ]
};

const showPowerInput = {
  index: 4,
  list: ['id', 'oldID', 'PowerID', 'InputType', 'InventoryID'],
  labels: [L('id'), L('oldID'), L('Power ID'), L('Inlet Type'), L('InventoryID')]
};

function Detail() {
  const { id } = useParams();

  const [inventory, setInventory] = useState([]);
  const [policys, setPolicys] = useState([]);
  const [powerInputs, setPowerInputs] = useState([]);

  const classes = useStyles();

  useEffect(() => {
    API.detail(id).then(({ data }) => {
      if (data && data.data) {
        const {
          oldID,
          UnitCode,
          AssetID,
          ModelCode,
          ModelDesc,
          ClosetID,
          Rack,
          RLU,
          ItemOwner,
          ServiceStatus,
          Remark,
          equipTypePo,
          UnitNo,
          PortQty,
          ReqNo,
          DOB,
          DeliveryDate,
          DeliveryNoteReceivedDate,
          MaintID,
          createdAt,
          updatedAt,
          policy,
          powerInput
        } = data.data;

        if (policy && policy.length > 0) {
          setPolicys(policy);
        }
        if (powerInput && powerInput.length > 0) {
          setPowerInputs(powerInput);
        }
        const inventoryList = [
          {
            id: 'oldID',
            label: L('Ref. ID'),
            type: 'text',
            disabled: true,
            readOnly: true,
            value: oldID
          },
          {
            id: 'UnitCode',
            label: L('New'),
            type: 'text',
            disabled: true,
            readOnly: true,
            value: UnitCode
          },
          {
            id: 'AssetID',
            label: L('Asset No'),
            type: 'text',
            disabled: true,
            readOnly: true,
            value: AssetID
          },
          {
            id: 'ModelCode',
            label: L('Model Code'),
            type: 'text',
            disabled: true,
            readOnly: true,
            value: ModelCode
          },
          {
            id: 'ModelDesc',
            label: L('Description'),
            type: 'text',
            disabled: true,
            readOnly: true,
            value: ModelDesc
          },
          {
            id: 'ClosetID',
            label: L('Closet ID'),
            type: 'text',
            disabled: true,
            readOnly: true,
            value: ClosetID
          },
          {
            id: 'Rack',
            label: L('Cabinet'),
            type: 'text',
            disabled: true,
            readOnly: true,
            value: Rack
          },
          {
            id: 'RLU',
            label: L('Pos. (U)'),
            type: 'text',
            disabled: true,
            readOnly: true,
            value: RLU
          },
          {
            id: 'ItemOwner',
            label: L('Item Owner'),
            type: 'text',
            disabled: true,
            readOnly: true,
            value: ItemOwner
          },
          {
            id: 'ServiceStatus',
            label: L('Status'),
            type: 'text',
            disabled: true,
            readOnly: true,
            value: ServiceStatus
          },
          {
            id: 'Remark',
            label: L('Remark'),
            type: 'text',
            disabled: true,
            readOnly: true,
            value: Remark
          },
          {
            id: 'EquipType',
            label: L('EquipType'),
            type: 'text',
            disabled: true,
            readOnly: true,
            value: equipTypePo.EquipType
          },
          {
            id: 'UnitNo',
            label: L('Unit No'),
            type: 'text',
            disabled: true,
            readOnly: true,
            value: UnitNo
          },
          {
            id: 'PortQty',
            label: L('Built-in Port'),
            type: 'text',
            disabled: true,
            readOnly: true,
            value: PortQty
          },
          {
            id: 'ReqNo',
            label: L('Req. Form'),
            type: 'text',
            disabled: true,
            readOnly: true,
            value: ReqNo
          },
          {
            id: 'DOB',
            label: L('DOB'),
            type: 'text',
            disabled: true,
            readOnly: true,
            value: DOB ? formatDateTime(DOB) : ''
          },
          {
            id: 'DeliveryDate',
            label: L('Delivery Date'),
            type: 'text',
            disabled: true,
            readOnly: true,
            value: DeliveryDate ? formatDateTime(DeliveryDate) : ''
          },
          {
            id: 'DeliveryNoteReceivedDate',
            label: L('Delivery Note Received Date'),
            type: 'text',
            disabled: true,
            readOnly: true,
            value: DeliveryNoteReceivedDate ? formatDateTime(DeliveryNoteReceivedDate) : ''
          },
          {
            id: 'MaintID',
            label: L('MaintID'),
            type: 'text',
            disabled: true,
            readOnly: true,
            value: MaintID
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
        setInventory(inventoryList);
      }
    });
  }, [id]);

  return (
    <>
      <DetailPage formFieldList={inventory} />
      <div className={classes.root}>
        <ExpandTable label={L('Policy')} rows={policys} show={showPolicy} />
        <ExpandTable label={L('PowerInput')} rows={powerInputs} show={showPowerInput} />
      </div>
    </>
  );
}

export default Detail;
