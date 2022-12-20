import React, { memo, useState, useEffect, useMemo } from 'react';
import { GridToolbarColumnsButton, GridToolbarContainer } from '@material-ui/data-grid';
import { useSelector, useDispatch } from 'react-redux';
import { Select, MenuItem, Button } from '@material-ui/core';
import { RestoreOutlined, UndoOutlined } from '@material-ui/icons';
import dayjs from 'dayjs';
import NCSTable from './NCSTable';
import dataGridTooltip from '../../../../utils/dataGridTooltip';
import { shortDateFormat, textFieldProps } from '../../../../utils/tools';
import {
  setBackboneList,
  setBackboneHistory,
  backboneRollbackOne,
  backboneRollbackAll
} from '../../../../redux/networkCloset/network-closet-actions';
import webdpAPI from '../../../../api/webdp/webdp';
import { CommonTip } from '../../../../components/index';

const Backbone = () => {
  const dispatch = useDispatch();
  const backboneList = useSelector((state) => state.networkCloset.backboneList); // 表格数据
  const [updateObj, setUpdateObj] = useState({});
  const statusList = useSelector((state) => state.networkCloset.statusList);
  const cabinetList = useSelector((state) => state.networkCloset.cabinetList); // cabinet表格数据
  const backboneHistory = useSelector((state) => state.networkCloset.backboneHistory);
  const [rollbacking, setRollbacking] = useState(false); // 是否正在回滚中

  const backboneStatusList = useMemo(
    () => statusList.filter((item) => item.optionType === 'OutletStatus'),
    [statusList]
  );

  // 撤回上一次修改
  const undoLast = () => {
    if (rollbacking) {
      return;
    }
    setRollbacking(true);

    const rollbackItem = backboneHistory[backboneHistory.length - 1]; // 从后面数据回滚
    const rollbackObj = {
      id: rollbackItem.id,
      [rollbackItem.field]: rollbackItem.oldValue,
      sourceData: rollbackItem.newValue
    };

    const rollbackParams = {
      backbones: [rollbackObj]
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
          dispatch(backboneRollbackOne());
        }
      });
  };

  // 撤回所有修改
  const undoAll = () => {
    if (rollbacking) {
      return;
    }
    setRollbacking(true);

    const rollbackMap = backboneHistory.map((item) => ({
      id: item.id,
      [item.field]: item.oldValue,
      sourceData: item.newValue
    }));

    const rollbackParams = {
      backbones: rollbackMap.reverse()
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
          dispatch(backboneRollbackAll());
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
        disabled={!backboneHistory.length}
      >
        Undo All
      </Button>

      <Button
        color="primary"
        startIcon={<UndoOutlined />}
        size="small"
        onClick={undoLast}
        disabled={!backboneHistory.length}
      >
        Undo Last
      </Button>
    </GridToolbarContainer>
  );

  useEffect(() => {
    if (updateObj.id) {
      const newBackboneList = [...backboneList];
      const index = newBackboneList.findIndex((item) => item.id === updateObj.id);
      if (index !== -1) {
        newBackboneList[index] = updateObj;
      }
      dispatch(setBackboneList(newBackboneList));
    }
  }, [updateObj]);

  const columns = [
    {
      field: 'cabinetID',
      headerName: 'Cabinet',
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
      field: 'patchPanelID',
      headerName: 'Panel',
      align: 'center',
      headerAlign: 'center',
      editable: true,
      flex: 1,
      minWidth: 120,
      hideSortIcons: true
    },
    {
      field: 'patchPanelPort',
      headerName: 'Port',
      align: 'center',
      headerAlign: 'center',
      editable: true,
      flex: 1,
      minWidth: 80,
      hideSortIcons: true
    },
    {
      field: 'outletId',
      headerName: 'Backbone ID',
      // editable: true,
      flex: 1,
      minWidth: 270,
      hideSortIcons: true,
      renderCell: dataGridTooltip
    },
    {
      field: 'olocRm',
      headerName: 'Another End Closet ID',
      // editable: true,
      flex: 1,
      minWidth: 200,
      hideSortIcons: true,
      renderCell: dataGridTooltip
    },
    {
      field: 'status',
      headerName: 'Status',
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
            {backboneStatusList.map((item) => (
              <MenuItem key={item.id} value={item.optionValue}>
                {item.optionValue}
              </MenuItem>
            ))}
          </Select>
        );
      }
    },
    {
      field: 'cableType',
      headerName: 'Cable Type',
      // editable: true,
      flex: 1,
      minWidth: 120,
      hideSortIcons: true,
      renderCell: dataGridTooltip
    },
    {
      field: 'facePlate',
      headerName: 'Face Plate',
      // editable: true,
      flex: 1,
      minWidth: 120,
      hideSortIcons: true,
      renderCell: dataGridTooltip
    },
    {
      field: 'reqNo',
      headerName: 'Req Form',
      // editable: true,
      flex: 1,
      minWidth: 140,
      hideSortIcons: true,
      renderCell: dataGridTooltip
    },
    {
      field: 'acceptDate',
      headerName: 'DOB',
      align: 'center',
      headerAlign: 'center',
      // editable: true,
      flex: 1,
      minWidth: 120,
      hideSortIcons: true,
      valueGetter: (record) => {
        const { value } = record;
        return value ? dayjs(value).format(shortDateFormat) : '';
      }
    },
    {
      field: 'remark',
      headerName: 'Remark',
      editable: true,
      flex: 1,
      minWidth: 140,
      hideSortIcons: true,
      renderCell: dataGridTooltip
    }
  ];

  // 强制更新视图
  const updateView = () => {
    dispatch(setBackboneList([...backboneList]));
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
      editRes = await webdpAPI.updateOutlet(editParams);
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
      dispatch(setBackboneHistory(historyObj));
    } else {
      // 强制刷新视图
      updateView();
      setUpdateObj({});
    }
  };

  // 编辑提交事件
  const onCellEditCommit = (record) => {
    const { field, value, id } = record;

    if (field === 'patchPanelPort' && !/^\d*$/.test(value)) {
      CommonTip.warning('Please enter a number');
      updateView();
      return;
    }

    if (!record.row) {
      record.row = backboneList.find((item) => id === item.id) || {};
    }
    const { row } = record;

    // 如果内容没有变化直接退出
    if (value === row[field]) {
      return;
    }
    commonEdit(record);
  };

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <NCSTable
        columns={columns}
        rows={backboneList}
        onCellEditCommit={onCellEditCommit}
        getCellClassName={(params) => {
          const hasEdit = backboneHistory.find(
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

export default memo(Backbone);
