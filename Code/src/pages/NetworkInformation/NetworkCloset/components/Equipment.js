import React, { memo, useState, useEffect } from 'react';
import { Select, MenuItem, Button } from '@material-ui/core';
import { RestoreOutlined, UndoOutlined } from '@material-ui/icons';
import { GridToolbarColumnsButton, GridToolbarContainer } from '@material-ui/data-grid';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import NCSTable from './NCSTable';
import dataGridTooltip from '../../../../utils/dataGridTooltip';
import {
  setEquipmentSelectItem,
  setModuleList,
  setEquipmentList,
  setEquipmentHistory,
  equipmentRollbackOne,
  equipmentRollbackAll
} from '../../../../redux/networkCloset/network-closet-actions';
import webdpAPI from '../../../../api/webdp/webdp';
import { CommonTip } from '../../../../components';
import { textFieldProps } from '../../../../utils/tools';

const Equipment = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const equipmentList = useSelector((state) => state.networkCloset.equipmentList); // 表格数据
  const equipmentSelectItem = useSelector((state) => state.networkCloset.equipmentSelectItem); // 选中的对象
  const cabinetList = useSelector((state) => state.networkCloset.cabinetList); // cabinet表格数据
  const [updateObj, setUpdateObj] = useState({});
  const equipmentHistory = useSelector((state) => state.networkCloset.equipmentHistory);
  const [rollbacking, setRollbacking] = useState(false); // 是否正在回滚中

  // 撤回上一次修改
  const undoLast = () => {
    if (rollbacking) {
      return;
    }
    setRollbacking(true);

    const rollbackItem = equipmentHistory[equipmentHistory.length - 1]; // 从后面数据回滚
    const rollbackObj = {
      id: rollbackItem.id,
      [rollbackItem.field]: rollbackItem.oldValue,
      sourceData: rollbackItem.newValue
    };

    const rollbackParams = {
      equipments: [rollbackObj]
    };

    let result = null;
    webdpAPI
      .networkClosetRollback(rollbackParams)
      .then((res) => {
        result = res;
      })
      .finally(() => {
        setRollbacking(false);
        if (result?.data?.code === 200) {
          CommonTip.success('Roll back the success', 1500);
          dispatch(equipmentRollbackOne());
        }
      });
  };

  // 撤回所有修改
  const undoAll = () => {
    if (rollbacking) {
      return;
    }
    setRollbacking(true);

    const rollbackMap = equipmentHistory.map((item) => ({
      id: item.id,
      [item.field]: item.oldValue,
      sourceData: item.newValue
    }));

    const rollbackParams = {
      equipments: rollbackMap.reverse()
    };
    let result = null;
    webdpAPI
      .networkClosetRollback(rollbackParams)
      .then((res) => {
        result = res;
      })
      .finally(() => {
        setRollbacking(false);
        if (result?.data?.code === 200) {
          CommonTip.success('All the rollback is successful', 1500);
          dispatch(equipmentRollbackAll());
        }
      });
  };

  const Toolbar = () => (
    <GridToolbarContainer>
      <GridToolbarColumnsButton />

      <Button
        color="primary"
        startIcon={<RestoreOutlined />}
        size="small"
        onClick={undoAll}
        disabled={!equipmentHistory.length}
      >
        Undo All
      </Button>

      <Button
        color="primary"
        startIcon={<UndoOutlined />}
        size="small"
        onClick={undoLast}
        disabled={!equipmentHistory.length}
      >
        Undo Last
      </Button>
    </GridToolbarContainer>
  );

  useEffect(() => {
    if (updateObj.id) {
      const newEquipmentList = [...equipmentList];
      const index = newEquipmentList.findIndex((item) => item.id === updateObj.id);
      if (index !== -1) {
        newEquipmentList[index] = updateObj;
      }
      dispatch(setEquipmentList(newEquipmentList));
    }
  }, [updateObj]);

  const columns = [
    {
      field: 'equipid',
      headerName: 'Ref. ID',
      flex: 1,
      minWidth: 150,
      hideSortIcons: true,
      renderCell: dataGridTooltip
    },
    {
      field: 'cabinetid',
      headerName: 'CabinetID',
      align: 'center',
      headerAlign: 'center',
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
            {cabinetList.map((item) => (
              <MenuItem key={item.id} value={item.cabinetId}>
                {item.cabinetId}
              </MenuItem>
            ))}
          </Select>
        );
      }
    },
    {
      field: 'sequence',
      headerName: 'U',
      align: 'center',
      headerAlign: 'center',
      editable: true,
      flex: 1,
      minWidth: 60,
      hideSortIcons: true
    },
    {
      field: 'panelid',
      headerName: 'Panel',
      align: 'center',
      headerAlign: 'center',
      editable: true,
      flex: 1,
      minWidth: 80,
      hideSortIcons: true
    },
    {
      field: 'modeldesc',
      headerName: 'Description',
      flex: 1,
      minWidth: 120,
      hideSortIcons: true,
      renderCell: dataGridTooltip
    },
    {
      field: 'group',
      headerName: 'Group',
      align: 'center',
      headerAlign: 'center',
      flex: 1,
      minWidth: 80,
      hideSortIcons: true
    },
    {
      field: 'portqty',
      headerName: 'Port',
      align: 'center',
      headerAlign: 'center',
      flex: 1,
      minWidth: 60,
      hideSortIcons: true
    },
    {
      field: 'powerbarid',
      headerName: 'Pw Unit',
      align: 'center',
      headerAlign: 'center',
      editable: true,
      flex: 1,
      minWidth: 120,
      hideSortIcons: true
    },
    {
      field: 'status',
      headerName: 'Status',
      flex: 1,
      minWidth: 120,
      hideSortIcons: true,
      renderCell: dataGridTooltip
    },
    {
      field: 'networkApplied',
      headerName: 'NW Applied',
      flex: 1,
      minWidth: 120,
      hideSortIcons: true,
      renderCell: dataGridTooltip
    },
    {
      field: 'ipaddress',
      headerName: 'IP Address',
      flex: 1,
      minWidth: 140,
      hideSortIcons: true
    },
    {
      field: 'unitno',
      headerName: 'Unit',
      align: 'center',
      headerAlign: 'center',
      flex: 1,
      minWidth: 80,
      hideSortIcons: true
    },
    {
      field: 'defgateway',
      headerName: 'Gateway',
      flex: 1,
      minWidth: 140,
      hideSortIcons: true
    },
    {
      field: 'subnetmask',
      headerName: 'Subnet Mask',
      flex: 1,
      minWidth: 140,
      hideSortIcons: true
    },
    {
      field: 'itemowner',
      headerName: 'Owner',
      align: 'center',
      headerAlign: 'center',
      flex: 1,
      minWidth: 100,
      hideSortIcons: true
    },
    {
      field: 'serialno',
      headerName: 'Serial No',
      flex: 1,
      minWidth: 150,
      hideSortIcons: true,
      renderCell: dataGridTooltip
    },
    {
      field: 'remark',
      headerName: 'Remark',
      editable: true,
      flex: 1,
      minWidth: 120,
      hideSortIcons: true,
      renderCell: dataGridTooltip
    },
    {
      field: 'curver',
      headerName: 'Cur. Ver.',
      editable: true,
      flex: 1,
      minWidth: 120,
      hideSortIcons: true,
      renderCell: dataGridTooltip
    },
    {
      field: 'nxbtver',
      headerName: 'Next Boot Ver.',
      editable: true,
      flex: 1,
      minWidth: 140,
      hideSortIcons: true,
      renderCell: dataGridTooltip
    }
  ];

  const onRowClick = (record) => {
    const { row } = record;
    if (row.id === equipmentSelectItem?.id) {
      return;
    }
    dispatch(setEquipmentSelectItem(row));
    webdpAPI.getEquipmentModels({ equipmentId: row.equipid }).then((res) => {
      dispatch(setModuleList(res?.data?.data?.equipList || []));
    });
  };

  // 强制更新视图
  const updateView = () => {
    dispatch(setEquipmentList([...equipmentList]));
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
      editRes = await webdpAPI.updateEquipment(editParams);
    } catch (error) {
      console.log(error);
    }
    // 修改成功
    const newData = editRes?.data?.data?.data;
    if (newData && editRes.data.data.result === true) {
      CommonTip.success('Success', 1000);
      setUpdateObj(newData);
      const historyObj = {
        ...row,
        field, // 修改的字段
        oldValue,
        newValue: value // 要修改的值
      };
      dispatch(setEquipmentHistory(historyObj));
    } else {
      // 强制刷新视图
      updateView();
      setUpdateObj({});
    }
  };

  // 编辑提交事件
  const onCellEditCommit = (record) => {
    const { field, value, id } = record;

    if (field === 'sequence' && !/^\d*$/.test(value)) {
      CommonTip.warning('Please enter a number');
      updateView();
      return;
    }

    if (!record.row) {
      record.row = equipmentList.find((item) => id === item.id) || {};
    }
    const { row } = record;

    // 如果内容没有变化直接退出
    if (value === row[field]) {
      return;
    }
    commonEdit(record);
  };

  // 双击事件
  const onCellDoubleClick = (params) => {
    const { field, value } = params;
    if (field === 'equipid') {
      history.push(`/NetworkInformation/Equipment?equipId=${value}`);
    }
  };

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <NCSTable
        columns={columns}
        rows={equipmentList}
        onRowClick={onRowClick}
        onCellEditCommit={onCellEditCommit}
        onCellDoubleClick={onCellDoubleClick}
        selectItem={equipmentSelectItem}
        getCellClassName={(params) => {
          const hasEdit = equipmentHistory.find(
            (item) => item.id === params.id && item.field === params.field
          );
          if (hasEdit) {
            return 'closet-cell-edit';
          }
          return '';
        }}
        components={{
          Toolbar
        }}
      />
    </div>
  );
};

export default memo(Equipment);
