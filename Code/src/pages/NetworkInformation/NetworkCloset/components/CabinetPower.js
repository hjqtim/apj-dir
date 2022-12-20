import React, { memo, useState, useEffect, useMemo } from 'react';
import { Button, Select, MenuItem } from '@material-ui/core';
import { GridToolbarColumnsButton, GridToolbarContainer } from '@material-ui/data-grid';
import { useSelector, useDispatch } from 'react-redux';
import {
  RestoreOutlined,
  UndoOutlined,
  AddOutlined,
  DeleteOutlineOutlined
} from '@material-ui/icons';
import NCSTable from './NCSTable';
import NCSTitle from './NCSTitle';
import AddCabinetPower from './AddCabinetPower';
import styleProps from './styleProps';
import dataGridTooltip from '../../../../utils/dataGridTooltip';
import {
  setCabinetPowerItem,
  setEquipmentList,
  setEquipmentSelectItem,
  setOutletList,
  setBackboneList,
  setModuleList,
  setCabinetPowerList,
  setCabinettPowerHistory,
  cabinetPowerRollbackOne,
  cabinetPowerRollbackAll,
  clearEquipmentHistory,
  clearOutletHistory,
  clearBackboneHistory
} from '../../../../redux/networkCloset/network-closet-actions';
import webdpAPI from '../../../../api/webdp/webdp';
import { CommonTip, WarningDialog, Loading } from '../../../../components';
import { textFieldProps } from '../../../../utils/tools';

const CabinetPower = () => {
  const dispatch = useDispatch();

  const cabinetPowerList = useSelector((state) => state.networkCloset.cabinetPowerList); // 表格数据
  const cabinetPowerSelectItem = useSelector((state) => state.networkCloset.cabinetPowerSelectItem); // 选中的对象
  const [updateObj, setUpdateObj] = useState({});
  const cabinetPowerHistory = useSelector((state) => state.networkCloset.cabinetPowerHistory);
  const [rollbacking, setRollbacking] = useState(false); // 是否正在回滚中
  const [open, setOpen] = useState(false);
  const closetSelectItem = useSelector((state) => state.networkCloset.closetSelectItem);
  const cabinetSelectItem = useSelector((state) => state.networkCloset.cabinetSelectItem);
  const statusList = useSelector((state) => state.networkCloset.statusList);

  useEffect(() => {
    if (updateObj.id) {
      const newCabinetPowerList = [...cabinetPowerList];
      const index = newCabinetPowerList.findIndex((item) => item.id === updateObj.id);
      if (index !== -1) {
        newCabinetPowerList[index] = updateObj;
      }
      dispatch(setCabinetPowerList(newCabinetPowerList));
    }
  }, [updateObj]);

  // 清空修改记录列表
  const handleClearHistory = () => {
    dispatch(clearEquipmentHistory());
    dispatch(clearOutletHistory());
    dispatch(clearBackboneHistory());
  };

  // 撤回上一次修改
  const undoLast = () => {
    if (rollbacking) {
      return;
    }
    setRollbacking(true);

    const rollbackItem = cabinetPowerHistory[cabinetPowerHistory.length - 1]; // 从后面数据回滚
    const rollbackObj = {
      id: rollbackItem.id,
      [rollbackItem.field]: rollbackItem.oldValue,
      sourceData: rollbackItem.newValue
    };

    const rollbackParams = {
      cabinetPowerSources: [rollbackObj]
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
          dispatch(cabinetPowerRollbackOne());
        }
      });
  };

  // 撤回所有修改
  const undoAll = () => {
    if (rollbacking) {
      return;
    }
    setRollbacking(true);

    const rollbackMap = cabinetPowerHistory.map((item) => ({
      id: item.id,
      [item.field]: item.oldValue,
      sourceData: item.newValue
    }));

    const rollbackParams = {
      cabinetPowerSources: rollbackMap.reverse()
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
          dispatch(cabinetPowerRollbackAll());
        }
      });
  };

  const Toolbar = () => (
    <GridToolbarContainer>
      <GridToolbarColumnsButton />

      <Button
        color="primary"
        startIcon={<AddOutlined />}
        size="small"
        onClick={() => {
          const action = {
            type: 'networkCloset/setIsOpenAddPower',
            payload: true
          };
          dispatch(action);
        }}
      >
        Add
      </Button>

      <Button
        color="primary"
        disabled={!cabinetPowerSelectItem?.id}
        startIcon={<DeleteOutlineOutlined />}
        size="small"
        onClick={() => setOpen(true)}
      >
        Delete
      </Button>

      <Button
        color="primary"
        startIcon={<RestoreOutlined />}
        size="small"
        onClick={undoAll}
        disabled={!cabinetPowerHistory.length}
      >
        Undo All
      </Button>

      <Button
        color="primary"
        startIcon={<UndoOutlined />}
        size="small"
        onClick={undoLast}
        disabled={!cabinetPowerHistory.length}
      >
        Undo Last
      </Button>
    </GridToolbarContainer>
  );

  const cabinetPowerStatusList = useMemo(
    () => statusList.filter((item) => item.optionType === 'CabinetPower'),
    [statusList]
  );

  const columns = [
    {
      field: 'cabinetId',
      headerName: 'CabinetID',
      align: 'center',
      headerAlign: 'center',
      minWidth: 120,
      flex: 1,
      hideSortIcons: true,
      renderCell: dataGridTooltip
    },
    {
      field: 'powerBarId',
      headerName: 'Pw Unit',
      align: 'center',
      headerAlign: 'center',
      editable: true,
      minWidth: 120,
      flex: 1,
      hideSortIcons: true,
      renderCell: dataGridTooltip
    },
    {
      field: 'status',
      headerName: 'Status',
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
            {cabinetPowerStatusList.map((item) => (
              <MenuItem key={item.id} value={item.optionValue}>
                {item.optionValue}
              </MenuItem>
            ))}
          </Select>
        );
      }
    },
    {
      field: 'upsid',
      headerName: 'Power Eqt. Ref. ID',
      editable: true,
      flex: 1,
      minWidth: 155,
      hideSortIcons: true,
      renderCell: dataGridTooltip
    },
    {
      field: 'sourceMCB',
      headerName: 'E/N: MCB# (Pw Source)',
      editable: true,
      flex: 1,
      minWidth: 190,
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
    }
  ];

  const onRowClick = (record) => {
    const { row } = record;
    if (row.id === cabinetPowerSelectItem?.id) {
      return;
    }
    dispatch(setCabinetPowerItem(row));
    const params = {
      closetId: row.closetId,
      cabinetId: row.cabinetId,
      powerBarId: row.powerBarId
    };
    handleClearHistory();
    webdpAPI.getCabinetPowerAndSub(params).then((res) => {
      const { backbones = [], equipments = [], outlets = [] } = res?.data?.data?.data || {};

      dispatch(setEquipmentList(equipments));
      dispatch(setEquipmentSelectItem({}));

      dispatch(setOutletList(outlets));

      dispatch(setBackboneList(backbones));

      dispatch(setModuleList([]));
    });
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
      editRes = await webdpAPI.updateCabinetPower(editParams);
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
      dispatch(setCabinettPowerHistory(historyObj));
    } else {
      // 强制刷新视图
      dispatch(setCabinetPowerList([...cabinetPowerList]));
      setUpdateObj({});
    }
  };

  // 编辑提交事件
  const onCellEditCommit = (record) => {
    const { field, value, id } = record;

    if (!record.row) {
      record.row = cabinetPowerList.find((item) => id === item.id) || {};
    }
    const { row } = record;

    // 如果内容没有变化直接退出
    if (value === row[field]) {
      return;
    }
    commonEdit(record);
  };

  // 删除取消事件
  const handleClose = () => {
    setOpen(false);
  };

  // 删除确认事件
  const handleConfirm = () => {
    if (!cabinetPowerSelectItem?.id) {
      return;
    }

    Loading.show();
    webdpAPI
      .deleteCabinetPower({ id: cabinetPowerSelectItem.id })
      .then((res) => {
        if (res?.data?.data?.result) {
          CommonTip.success('Success', 2000);
          handleClose();
          dispatch(setCabinetPowerItem({}));
          const params = {
            closetId: closetSelectItem?.closetid,
            cabinetId: cabinetSelectItem?.cabinetId
          };
          webdpAPI
            .getCabinetPowerList(params)
            .then((res) => {
              dispatch(setCabinetPowerList(res?.data?.data?.list || []));
            })
            .finally(() => {
              Loading.hide();
            });
        } else {
          Loading.hide();
        }
      })
      .catch(() => {
        Loading.hide();
      });
  };

  return (
    <div style={styleProps}>
      <NCSTitle title="Cabinet Power Connection" />
      <div style={{ flex: 1 }}>
        <NCSTable
          columns={columns}
          rows={cabinetPowerList}
          onRowClick={onRowClick}
          onCellEditCommit={onCellEditCommit}
          selectItem={cabinetPowerSelectItem}
          getCellClassName={(params) => {
            const hasEdit = cabinetPowerHistory.find(
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

      {/* 新增模态框 */}
      <AddCabinetPower />

      {/* 删除对话框 */}
      <WarningDialog
        title="Deletion"
        open={open}
        handleConfirm={handleConfirm}
        handleClose={handleClose}
        content={`Are you sure you want to permanently delete ${cabinetPowerSelectItem?.powerBarId}?`}
      />
    </div>
  );
};

export default memo(CabinetPower);
