import React, { useEffect, useState } from 'react';

import { useParams } from 'react-router-dom';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import { Box, Tab, Tabs, Typography } from '@material-ui/core';
import DetailPage from '../../../../../components/DetailPage';
import ExpandTable from '../../../../../components/ExpandTable';
import API from '../../../../../api/inventory';
import { L } from '../../../../../utils/lang';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired
};

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
    L('_ID'),
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
  labels: [L('id'), L('_ID'), L('Power ID'), L('Inlet Type'), L('InventoryID')]
};

const showEquipmentPort = {
  index: 4,
  list: [
    'id',
    'oldID',
    'InventoryID',
    'SlotID',
    'PortID',
    'PortType',
    'OutletID',
    'Remark',
    'PortStatus',
    'PortSecurity',
    'Polarity',
    'PortSpeed',
    'Duplex',
    'VLanID',
    'PortPolicyType',
    'PortPolicy',
    'ConnectingInventory'
  ],
  labels: [
    L('id'),
    L('_ID'),
    L('Unit Code'),
    L('Slot'),
    L('Port'),
    L('Port Type'),
    L('Outlet ID'),
    L('Remark of Equipment Port'),
    L('Outlet Status'),
    L('Port Security'),
    L('Port Polarity'),
    L('Port Speed'),
    L('Duplex'),
    L('VLAN'),
    L('Port Policy Type'),
    L('Port Policy'),
    L('Connecting Inventory')
  ]
};

const showPortAssignment = {
  index: 4,
  list: [
    'id',
    'oldID',
    'EquipPortID',
    'Slot',
    'Port',
    'RequesterTeam',
    'PortUsage',
    'PortAssignStatus',
    'PortAssignDate',
    'PortAssignerID',
    'PortAssignerDisplayName',
    'PortTeamingEquip',
    'PortTeamingEquipPort',
    'MoveInRef',
    'MachineIP',
    'MachineHostName',
    'PortAssignmentRemarks',
    'IPAddRef'
  ],
  labels: [
    L('id'),
    L('_ID'),
    L('EquipPortID'),
    L('Slot'),
    L('Port'),
    L('Requester Team'),
    L('Port Usage'),
    L('Port Assign Status'),
    L('Port Assign Date'),
    L('Port Assigner ID'),
    L('Port Assigner Display Name'),
    L('Port Teaming Equip'),
    L('PortTeaming Equip Port'),
    L('Move In Ref'),
    L('Machine IP'),
    L('Machine Host Name'),
    L('Port Assignment Remarks'),
    L('IP Add Ref')
  ]
};

const showPowerOutput = {
  index: 4,
  list: ['id', 'oldID', 'PowerID', 'OutletType', 'InventoryID'],
  labels: [L('id'), L('_ID'), L('Power ID'), L('Outlet Type'), L('Inventory ID')]
};

function Detail() {
  const { id } = useParams();
  const [EquipType, setEquipType] = useState('');

  const [inventory, setInventory] = useState([]);
  const [policys, setPolicys] = useState([]);
  const [equipmentPorts, setEquipmentPorts] = useState([]);
  const [portAssignments, setPortAssignments] = useState([]);
  const [powerInputs, setPowerInputs] = useState([]);
  const [powerOutputs, setPowerOutputs] = useState([]);
  const [showProps, setShowProps] = useState([]);

  const classes = useStyles();
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  useEffect(() => {
    API.listStatus({ limit: 999, page: 1 })
      .then(({ data }) => {
        if (data && data.data) {
          return data.data;
        }
        return [];
      })
      .then((returnObj) => {
        API.listEquipType({ limit: 999, page: 1 })
          .then(({ data }) => {
            if (data && data.data) {
              setEquipType(data.data.filter((_) => _.EquipType !== 'EqServer'));
              return {
                InventoryStatus: returnObj,
                EquipTypes: data.data
              };
            }
            return {
              InventoryStatus: returnObj,
              EquipTypes: []
            };
          })
          .then((returnObj) => {
            API.detail(id).then(({ data }) => {
              const { EquipType, policy, equipPort, powerInput, powerOutput, equipTypePo } =
                data.data;
              setEquipType(EquipType);
              if (policy && policy.length > 0) {
                setPolicys(policy);
              }
              if (powerInput && powerInput.length > 0) {
                setPowerInputs(powerInput);
              }
              if (equipPort && equipPort.length > 0) {
                setEquipmentPorts(equipPort);
                const tempPortAssignments = [];
                equipPort.map((_) => {
                  tempPortAssignments.push(_.portAssignment);
                  return _;
                });
                setPortAssignments(tempPortAssignments);
              }
              if (powerOutput && powerOutput.length > 0) {
                setPowerOutputs(powerOutput);
              }
              if (equipTypePo && equipTypePo.EquipType === 'EqNetwork') {
                setShowProps([
                  {
                    label: L('Network'),
                    id: 'simple-tab-0',
                    'aria-controls': 'simple-tabpanel-0'
                  },
                  {
                    label: L('Assigment'),
                    id: 'simple-tab-1',
                    'aria-controls': 'simple-tabpanel-1'
                  }
                ]);
              } else if (
                equipTypePo &&
                (equipTypePo.EquipType === 'EqUPS' ||
                  equipTypePo.EquipType === 'EqPDU' ||
                  equipTypePo.EquipType === 'EqATS')
              ) {
                setShowProps([
                  {
                    label: L('Assigment'),
                    id: 'simple-tab-0',
                    'aria-controls': 'simple-tabpanel-0'
                  }
                ]);
              }
              const defaultValue = data.data;
              const inventoryList = [
                {
                  id: 'oldID',
                  label: L('Ref. ID'),
                  type: 'text',
                  disabled: true,
                  value: defaultValue.oldID
                },
                {
                  id: 'UnitCode',
                  label: L('New'),
                  type: 'text',
                  disabled: true,
                  value: defaultValue.UnitCode
                },
                {
                  id: 'AssetID',
                  label: L('Asset No'),
                  type: 'text',
                  disabled: true,
                  value: defaultValue.AssetID
                },
                {
                  id: 'ModelCode',
                  label: L('Model Code'),
                  type: 'text',
                  disabled: true,
                  value: defaultValue.ModelCode
                },
                {
                  id: 'ModelDesc',
                  label: L('Description'),
                  type: 'text',
                  disabled: true,
                  value: defaultValue.ModelDesc
                },
                {
                  id: 'ClosetID',
                  label: L('Closet ID'),
                  type: 'text',
                  disabled: true,
                  value: defaultValue.ClosetID
                },
                {
                  id: 'Rack',
                  label: L('Cabinet'),
                  type: 'text',
                  disabled: true,
                  value: defaultValue.Rack
                },
                {
                  id: 'RLU',
                  label: L('Pos. (U)'),
                  type: 'text',
                  disabled: true,
                  value: defaultValue.RLU
                },
                {
                  id: 'ItemOwner',
                  label: L('Item Owner'),
                  type: 'text',
                  disabled: true,
                  value: defaultValue.ItemOwner
                },
                {
                  id: 'Status',
                  label: L('Status'),
                  type: 'select',
                  disabled: true,
                  value: defaultValue.Status,
                  itemList: returnObj.InventoryStatus,
                  labelField: 'ServiceStatus',
                  valueField: 'id'
                },
                {
                  id: 'Remark',
                  label: L('Remark'),
                  type: 'text',
                  disabled: true,
                  value: defaultValue.Remark
                },
                {
                  id: 'EquipType',
                  label: L('EquipType'),
                  type: 'select',
                  value: defaultValue.EquipType,
                  itemList: returnObj.EquipTypes,
                  disabled: true,
                  labelField: 'EquipType',
                  valueField: 'id'
                },
                {
                  id: 'UnitNo',
                  label: L('Unit No'),
                  type: 'text',
                  disabled: true,
                  value: defaultValue.UnitNo
                },
                {
                  id: 'PortQty',
                  label: L('Built-in Port'),
                  type: 'text',
                  disabled: true,
                  value: defaultValue.PortQty
                },
                {
                  id: 'ReqNo',
                  label: L('Req. Form'),
                  type: 'text',
                  disabled: true,
                  value: defaultValue.ReqNo
                },
                {
                  id: 'DOB',
                  label: L('DOB'),
                  type: 'date',
                  disabled: true,
                  value: defaultValue.DOB
                },
                {
                  id: 'DeliveryDate',
                  label: L('Delivery Date'),
                  type: 'date',
                  disabled: true,
                  value: defaultValue.DeliveryDate
                },
                {
                  id: 'DeliveryNoteReceivedDate',
                  label: L('Delivery Note Received Date'),
                  type: 'date',
                  disabled: true,
                  value: defaultValue.DeliveryNoteReceivedDate
                },
                {
                  id: 'MaintID',
                  label: L('MaintID'),
                  type: 'text',
                  disabled: true,
                  value: defaultValue.MaintID
                }
              ];
              setInventory(inventoryList);
            });
          });
      });
    // eslint-disable-next-line
  }, [id]);

  return (
    <>
      <DetailPage formFieldList={inventory} />
      <div className={classes.root}>
        <Tabs value={value} onChange={handleChange} aria-label="ant example">
          {showProps.map((_) => (
            <Tab key={_.id} {..._} />
          ))}
        </Tabs>
        <TabPanel value={value} index={0}>
          <ExpandTable label={L('Policy')} rows={policys} show={showPolicy} />
          <ExpandTable label={L('PowerInput')} rows={powerInputs} show={showPowerInput} />
          {EquipType === 'EqUPS' || EquipType === 'EqPDU' || EquipType === 'EqATS' ? (
            <ExpandTable label={L('PowerOutput')} rows={powerOutputs} show={showPowerOutput} />
          ) : null}
        </TabPanel>
        <TabPanel value={value} index={1}>
          <ExpandTable label={L('Equipment Port')} rows={equipmentPorts} show={showEquipmentPort} />
          <ExpandTable label="Port Assignment" rows={portAssignments} show={showPortAssignment} />
          <ExpandTable label="PowerOutput" rows={powerOutputs} show={showPowerOutput} />
        </TabPanel>
      </div>
    </>
  );
}

export default Detail;
