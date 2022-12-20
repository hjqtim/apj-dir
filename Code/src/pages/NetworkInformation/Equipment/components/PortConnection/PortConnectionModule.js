import React, { memo, useState, useEffect } from 'react';
import { makeStyles, Select, MenuItem, IconButton, Button } from '@material-ui/core';
import { useSelector, useDispatch } from 'react-redux';
import { GridToolbarContainer, GridToolbarColumnsButton } from '@material-ui/data-grid';
import { RestoreOutlined, UndoOutlined } from '@material-ui/icons';
import { textFieldProps } from '../../../../../utils/tools';
import ConnectTable from './ConnectTable';
import dataGridTooltip from '../../../../../utils/dataGridTooltip';
import { CommonTip } from '../../../../../components';
import webdpAPI from '../../../../../api/webdp/webdp';
import {
  setConnectPortHistory,
  setConnectPortSelectItem,
  setOutletSelectItem
} from '../../../../../redux/networkCloset/network-closet-actions';

const useStyles = makeStyles(() => ({
  main: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%'
  },
  table: {
    width: '100%',
    height: '100%'
  }
}));

const PortConnectionModule = (props) => {
  const {
    setFieldValue,
    baseData,
    connectPortList,
    outletStatusList,
    duplexList,
    vlanList,
    portSecurityList,
    polarityStatusList,
    portTypeList,
    equipmentIpList,
    portUsageList,
    portAssignStatusList,
    connectPsuList,
    connectTypeList,
    isRefresh
  } = props;

  const classes = useStyles();
  const dispatch = useDispatch();
  const [updateObj, SetUpdateObj] = useState({});
  const connectPortHistory = useSelector((state) => state.networkCloset.connectPortHistory);
  const portCheckbox = useSelector((state) => state.networkCloset.connectPortSelectItem);
  const outletSelectItem = useSelector((state) => state.networkCloset.outletSelectItem);
  useEffect(() => {
    if (updateObj.id) {
      const newConnectPortList = [...connectPortList];
      const index = newConnectPortList.findIndex((item) => item.id === updateObj.id);
      if (index !== -1) {
        newConnectPortList[index] = updateObj;
      }
      setFieldValue('connectPortList', newConnectPortList);
    }
  }, [updateObj]);

  const columns = [
    {
      field: 'slotId',
      headerName: 'Slot',
      flex: 1,
      minWidth: 80,
      hideSortIcons: true
    },
    {
      field: 'portid',
      headerName: 'Port',
      flex: 1,
      minWidth: 80,
      hideSortIcons: true
    },
    {
      field: 'porttype',
      headerName: 'Port Type',
      flex: 1,
      minWidth: 100,
      editable: true,
      hideSortIcons: true,
      renderEditCell: (record) => {
        const { api, id, value, field } = record;
        return (
          <Select
            {...textFieldProps}
            value={value || ''}
            onChange={(e) => {
              api.setEditCellValue({ id, field, value: e.target.value }, e);
            }}
          >
            {portTypeList.map((item) => (
              <MenuItem key={item.id} value={item.optionValue}>
                {item.optionValue}
              </MenuItem>
            ))}
          </Select>
        );
      }
    },
    {
      field: 'outletid',
      headerName: 'Outlet ID',
      flex: 1,
      minWidth: 210,
      hideSortIcons: true,
      renderCell: dataGridTooltip
    },
    {
      field: 'status',
      headerName: 'Outlet Status',
      flex: 1,
      minWidth: 120,
      editable: true,
      hideSortIcons: true,
      renderEditCell: (record) => {
        const { api, id, value, field, row } = record;
        return (
          <Select
            disabled={!row.outletid}
            {...textFieldProps}
            value={value || ''}
            onChange={(e) => {
              api.setEditCellValue({ id, field, value: e.target.value }, e);
            }}
          >
            {outletStatusList.map((item) => (
              <MenuItem key={item.id} value={item.optionValue}>
                {item.optionValue}
              </MenuItem>
            ))}
          </Select>
        );
      }
    },
    {
      field: 'remark',
      headerName: 'Remark of Equipment Port',
      editable: true,
      flex: 1,
      minWidth: 200,
      hideSortIcons: true,
      renderCell: dataGridTooltip
    },
    {
      field: 'connectedequipip',
      headerName: 'IP Addr Stacked',
      editable: true,
      flex: 1,
      minWidth: 200,
      hideSortIcons: true,
      renderEditCell: (record) => {
        const { api, id, value, field } = record;
        return (
          <Select
            {...textFieldProps}
            value={value || ''}
            onChange={(e) => {
              api.setEditCellValue({ id, field, value: e.target.value }, e);
            }}
          >
            {equipmentIpList.map((item, index) => {
              const formatIp = `${item.ipaddress} ${item.unitno ? `U${item.unitno}` : ''}`;
              return (
                <MenuItem key={index} value={item.ipaddress}>
                  {formatIp}
                </MenuItem>
              );
            })}
          </Select>
        );
      }
    },
    {
      field: 'project',
      headerName: 'Project',
      flex: 1,
      minWidth: 120,
      hideSortIcons: true,
      editable: true
    },
    {
      field: 'olocRm',
      headerName: 'Room',
      flex: 1,
      minWidth: 120,
      hideSortIcons: true
    },
    {
      field: 'olocFl',
      headerName: 'Floor',
      flex: 1,
      minWidth: 90,
      hideSortIcons: true
    },
    {
      field: 'olocBlk',
      headerName: 'Block',
      flex: 1,
      minWidth: 90,
      hideSortIcons: true
    },
    {
      field: 'vlanid',
      headerName: 'Port VLAN',
      editable: true,
      flex: 1,
      minWidth: 130,
      hideSortIcons: true,
      renderEditCell: (record) => {
        const { api, id, value, field } = record;
        return (
          <Select
            {...textFieldProps}
            value={value || ''}
            onChange={(e) => {
              api.setEditCellValue({ id, field, value: e.target.value }, e);
            }}
          >
            {vlanList.map((item) => (
              <MenuItem key={item.id} value={item.optionValue}>
                {item.optionValue}
              </MenuItem>
            ))}
          </Select>
        );
      }
    },
    {
      field: 'polarity',
      headerName: 'Port Polarity/Fibre Interface',
      editable: true,
      flex: 1,
      minWidth: 250,
      hideSortIcons: true,
      renderEditCell: (record) => {
        const { api, id, value, field } = record;
        return (
          <Select
            {...textFieldProps}
            value={value || ''}
            onChange={(e) => {
              api.setEditCellValue({ id, field, value: e.target.value }, e);
            }}
          >
            {polarityStatusList.map((item) => (
              <MenuItem key={item.id} value={item.optionValue}>
                {item.optionValue}
              </MenuItem>
            ))}
          </Select>
        );
      }
    },
    {
      field: 'portspeed',
      headerName: 'Port Speed',
      editable: true,
      flex: 1,
      minWidth: 110,
      hideSortIcons: true,
      renderEditCell: (record) => {
        const { api, id, value, field } = record;
        return (
          <Select
            {...textFieldProps}
            value={value || ''}
            onChange={(e) => {
              api.setEditCellValue({ id, field, value: e.target.value }, e);
            }}
          >
            <MenuItem value="Auto">Auto</MenuItem>
            <MenuItem value="100">100</MenuItem>
            <MenuItem value="1G">1G</MenuItem>
            <MenuItem value="10">10</MenuItem>
            <MenuItem value="10G">10G</MenuItem>
          </Select>
        );
      }
    },
    {
      field: 'duplex',
      headerName: 'Port Duplex',
      editable: true,
      flex: 1,
      minWidth: 110,
      hideSortIcons: true,
      renderEditCell: (record) => {
        const { api, id, value, field } = record;
        return (
          <Select
            {...textFieldProps}
            value={value || ''}
            onChange={(e) => {
              api.setEditCellValue({ id, field, value: e.target.value }, e);
            }}
          >
            {duplexList.map((item) => (
              <MenuItem key={item.id} value={item.optionValue}>
                {item.optionValue}
              </MenuItem>
            ))}
          </Select>
        );
      }
    },
    {
      field: 'connectedtohostname',
      headerName: 'FlConnect-Hostname',
      editable: true,
      flex: 1,
      minWidth: 180,
      hideSortIcons: true
    },
    {
      field: 'connectedtoip',
      headerName: 'Connect-IP',
      editable: true,
      flex: 1,
      minWidth: 150,
      hideSortIcons: true
    },
    {
      field: 'connectedtopsu',
      headerName: 'Connect-PSU',
      editable: true,
      minWidth: 120,
      hideSortIcons: true,
      renderEditCell: (record) => {
        const { api, id, value, field } = record;
        return (
          <Select
            {...textFieldProps}
            value={value || ''}
            onChange={(e) => {
              api.setEditCellValue({ id, field, value: e.target.value }, e);
            }}
          >
            {connectPsuList.map((item, index) => (
              <MenuItem key={index} value={item}>
                {item}
              </MenuItem>
            ))}
          </Select>
        );
      }
    },
    {
      field: 'connectedtocontactpoint',
      headerName: 'Connect-Type',
      editable: true,
      minWidth: 120,
      hideSortIcons: true,
      renderEditCell: (record) => {
        const { api, id, value, field } = record;
        return (
          <Select
            {...textFieldProps}
            value={value || ''}
            onChange={(e) => {
              api.setEditCellValue({ id, field, value: e.target.value }, e);
            }}
          >
            {connectTypeList.map((item, index) => (
              <MenuItem key={index} value={item}>
                {item}
              </MenuItem>
            ))}
          </Select>
        );
      }
    },
    {
      field: 'portsecurity',
      headerName: 'Port Security',
      editable: true,
      flex: 1,
      minWidth: 120,
      hideSortIcons: true,
      renderEditCell: (record) => {
        const { api, id, value, field } = record;
        return (
          <Select
            {...textFieldProps}
            value={value || ''}
            onChange={(e) => {
              api.setEditCellValue({ id, field, value: e.target.value }, e);
            }}
          >
            {portSecurityList.map((item) => (
              <MenuItem key={item.id} value={item.optionValue}>
                {item.optionValue}
              </MenuItem>
            ))}
          </Select>
        );
      }
    },
    {
      field: 'moveInRef',
      headerName: 'Move-in Ref',
      editable: true,
      flex: 1,
      minWidth: 120,
      hideSortIcons: true
    },
    {
      field: 'ipaddRef',
      headerName: 'IP Request Ref',
      editable: true,
      flex: 1,
      minWidth: 120,
      hideSortIcons: true
    },
    {
      field: 'machineHostName',
      headerName: 'Machine Host Name',
      editable: true,
      flex: 1,
      minWidth: 180,
      hideSortIcons: true
    },
    {
      field: 'portUsage',
      headerName: 'Port Usage',
      editable: true,
      flex: 1,
      minWidth: 160,
      hideSortIcons: true,
      renderEditCell: (record) => {
        const { api, id, value, field } = record;
        return (
          <Select
            {...textFieldProps}
            value={value || ''}
            onChange={(e) => {
              api.setEditCellValue({ id, field, value: e.target.value }, e);
            }}
          >
            {portUsageList.map((item) => (
              <MenuItem key={item.id} value={item.optionValue}>
                {item.optionValue}
              </MenuItem>
            ))}
          </Select>
        );
      }
    },
    {
      field: 'portAssignStatus',
      headerName: 'Assignment Status',
      editable: true,
      flex: 1,
      minWidth: 140,
      hideSortIcons: true,
      renderEditCell: (record) => {
        const { api, id, value, field } = record;
        return (
          <Select
            {...textFieldProps}
            value={value || ''}
            onChange={(e) => {
              api.setEditCellValue({ id, field, value: e.target.value }, e);
            }}
          >
            {portAssignStatusList.map((item) => (
              <MenuItem key={item.id} value={item.optionValue}>
                {item.optionValue}
              </MenuItem>
            ))}
          </Select>
        );
      }
    },
    {
      field: 'portTeamingEquip',
      headerName: 'Teaming Equipment',
      editable: true,
      flex: 1,
      minWidth: 140,
      hideSortIcons: true
    },
    {
      field: 'portTeamingEquipPort',
      headerName: 'Teaming Port',
      editable: true,
      flex: 1,
      minWidth: 120,
      hideSortIcons: true
    },
    {
      field: 'machineIP',
      headerName: "Machine's IP",
      editable: true,
      flex: 1,
      minWidth: 120,
      hideSortIcons: true
    },
    {
      field: 'requesterTeam',
      headerName: "Requester's Team",
      editable: true,
      flex: 1,
      minWidth: 140,
      hideSortIcons: true
    },
    {
      field: 'portAssignmentRemarks',
      headerName: 'Remark of Port Assignment',
      editable: true,
      flex: 1,
      minWidth: 200,
      hideSortIcons: true,
      renderCell: dataGridTooltip
    }
  ];

  const Toolbar = () => (
    <GridToolbarContainer>
      <GridToolbarColumnsButton />

      <Button color="primary" startIcon={<RestoreOutlined />} size="small" disabled>
        Undo All
      </Button>

      <Button color="primary" startIcon={<UndoOutlined />} size="small" disabled>
        Undo Last
      </Button>
    </GridToolbarContainer>
  );

  const editFieldByOutletid = ['status', 'project'];
  let newPortCheckbox = portCheckbox.length ? [...portCheckbox] : [];
  const onRowClick = (record) => {
    const { row } = record;

    const hasSelect = portCheckbox.find((item) => item.id === row.id);
    if (!hasSelect) {
      newPortCheckbox.push(row);
    } else {
      newPortCheckbox = portCheckbox.filter((item) => item.id !== row.id);
    }

    dispatch(setConnectPortSelectItem(newPortCheckbox));
  };

  // 强制更新视图
  const updateView = () => {
    setFieldValue('isRefresh', !isRefresh);
  };

  // 通用的修改事件请求api
  const commonEdit = async (record) => {
    const { id, field, value, row } = record;
    const oldValue = row[field] ?? ''; // 修改前的值
    let editRes = null;
    try {
      const editParams = {
        id,
        [field]: value,
        sourceData: oldValue
      };
      if (editFieldByOutletid.includes(field)) {
        editParams.oid = row.oid;
      }
      editRes = await webdpAPI.updateConnectPort(editParams);
    } catch (error) {
      console.log(error);
    }

    // 修改成功
    const newData = { ...row };
    newData[field] = value;
    if (editRes?.data?.data?.result === true) {
      SetUpdateObj(newData);
      CommonTip.success('Success', 1000);
      const historyObj = {
        ...row,
        field, // 修改的字段
        oldValue,
        newValue: value // 要修改的值
      };
      dispatch(setConnectPortHistory(historyObj));
    } else {
      // 强制刷新视图
      updateView();
      SetUpdateObj({});
    }
  };

  // 编辑提交事件
  const onCellEditCommit = (record) => {
    const { field, value, id } = record;

    if (!record.row) {
      record.row = connectPortList.find((item) => id === item.id) || {};
    }
    const { row } = record;

    // 如果内容没有变化直接退出
    if (value !== row[field]) {
      commonEdit(record);
    }
  };

  // 双击事件
  const onCellDoubleClick = (params) => {
    const { field, row } = params;
    if (field === 'outletid' && row.outletid) {
      const deleteParam = [{ id: row.id, outletid: row.outletid }];
      deletePort(deleteParam);
    }
    if (field === 'outletid' && !row.outletid && outletSelectItem[0]?.outletId) {
      const addParam = { id: row.id, outletid: outletSelectItem[0].outletId };
      updatePort(addParam);
    }
  };

  // 删除port connection
  const deletePort = (params) => {
    webdpAPI
      .deleteConnectPort(params)
      .then((res) => {
        const result = res?.data?.data?.result || false;
        if (result) {
          updateView();
          CommonTip.success('Success', 1000);
        }
      })
      .finally(() => {
        // console.log('outlet');
      });
  };

  const updatePort = (params) => {
    webdpAPI
      .updateConnectPort(params)
      .then((res) => {
        const result = res?.data?.data?.result || false;
        if (result) {
          setFieldValue('isRefresh', !isRefresh);
          dispatch(setOutletSelectItem([]));
          CommonTip.success('Success', 1000);
        }
      })
      .finally(() => {});
  };

  const clearSelected = () => {
    dispatch(setConnectPortSelectItem([]));
  };

  return (
    <div className={classes.main}>
      <div style={{ color: '#078080', fontSize: '16px', paddingLeft: '4px', marginBottom: '3px' }}>
        <strong>Port Connection: {baseData?.ipAddress}</strong>
        <IconButton
          onClick={clearSelected}
          style={{ padding: '0px', marginLeft: '10px' }}
          disabled={portCheckbox.length === 0}
        >
          <svg
            t="1664428945190"
            className="icon"
            viewBox="0 0 1037 1024"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            p-id="3342"
            width="15"
            height="15"
          >
            <path
              d="M1033.11891 495.639602a156.630697 156.630697 0 0 0-73.487689-99.771608L813.192247 311.115767l47.740178-83.143006a153.412258 153.412258 0 0 0 12.33735-127.12834A153.948664 153.948664 0 0 0 783.153483 9.11891a156.630697 156.630697 0 0 0-187.742273 70.805658L549.816658 160.921949l-150.193819-89.579885a154.485071 154.485071 0 0 0-173.795704 11.800943 122.300681 122.300681 0 0 0-48.812991 107.281299 155.557884 155.557884 0 0 0 46.667365 93.871137c-34.330016 53.64065-96.016763 155.557884-136.783657 225.290728a400.159246 400.159246 0 0 1-67.050812 69.196438 60.077528 60.077528 0 0 0-19.310634 50.42221l5.364065 31.111577 613.112625 355.637507a57.931902 57.931902 0 0 0 29.502357 8.046097 64.368779 64.368779 0 0 0 24.138292-4.827658l27.893138-15.019382 5.900472-26.820325a444.144578 444.144578 0 0 1 28.96595-94.94395l131.419592-226.899947a160.921949 160.921949 0 0 0 44.521739 6.973284 119.618649 119.618649 0 0 0 102.453641-53.64065 142.147721 142.147721 0 0 0 19.310633-113.18177zM643.687795 828.748036a268.203248 268.203248 0 0 0-24.674699 62.223153l-101.917234-57.931901 91.72551-158.239917a53.64065 53.64065 0 0 0-18.774227-73.487689 53.64065 53.64065 0 0 0-73.48769 19.84704l-92.261917 157.70351-92.798324-53.64065 92.261917-157.70351a53.64065 53.64065 0 0 0-19.310633-73.48769 53.64065 53.64065 0 0 0-73.48769 19.310634l-92.261917 158.239916-100.308015-58.468308a277.322158 277.322158 0 0 0 41.3033-53.640649c39.157674-67.050812 98.698795-160.921949 133.028811-218.85385l458.627554 263.911995c-33.257203 58.468308-89.579885 156.09429-127.664746 224.217916z m281.61341-281.077004c-8.582504 13.410162-28.429544 5.900471-43.448926-2.682033L321.843897 223.681509a73.48769 73.48769 0 0 1-37.548454-43.985333s0-5.900471 8.582504-13.410162A43.985333 43.985333 0 0 1 321.843897 157.167103a53.64065 53.64065 0 0 1 25.747512 6.973285L536.406496 275.176532a60.077528 60.077528 0 0 0 45.058145 6.436878l24.674699-8.046097 80.997381-140.002096A48.812991 48.812991 0 0 1 745.068622 107.281299a46.130959 46.130959 0 0 1 26.820325 27.356731 44.521739 44.521739 0 0 1-3.218439 37.012049L697.328444 299.314825a59.004715 59.004715 0 0 0 21.45626 80.460974l188.27868 107.281299a49.885804 49.885804 0 0 1 23.065479 31.647983 34.866422 34.866422 0 0 1-5.900471 28.965951z"
              fill={portCheckbox.length ? '#229FFA' : '#ddd'}
              p-id="3343"
            />
          </svg>
        </IconButton>
      </div>
      <ConnectTable
        style={{ width: '100%', height: '100%' }}
        rows={connectPortList}
        columns={columns}
        onRowClick={onRowClick}
        onCellEditCommit={onCellEditCommit}
        onCellDoubleClick={onCellDoubleClick}
        selectItem={portCheckbox}
        isCellEditable={(params) => {
          const { row, field } = params;
          if (editFieldByOutletid.includes(field) && !row.outletid) {
            return false;
          }
          return true;
        }}
        getCellClassName={(params) => {
          const hasEdit = connectPortHistory.find(
            (item) => item.id === params.id && item.field === params.field
          );
          if (hasEdit) {
            return 'closet-cell-edit';
          }
          return '';
        }}
        pageSize={100}
        hideFooter
        autoHeight={false}
        components={{ Toolbar }}
      />
    </div>
  );
};
export default memo(PortConnectionModule);
