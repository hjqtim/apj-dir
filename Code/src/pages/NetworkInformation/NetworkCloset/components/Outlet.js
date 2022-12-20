import React, { memo, useState, useEffect } from 'react';
import { Select, MenuItem, Button } from '@material-ui/core';
import { GridToolbarColumnsButton, GridToolbarContainer } from '@material-ui/data-grid';
import { useSelector, useDispatch } from 'react-redux';
import dayjs from 'dayjs';
import { RestoreOutlined, UndoOutlined } from '@material-ui/icons';
import dataGridTooltip from '../../../../utils/dataGridTooltip';
import NCSTable from './NCSTable';
import { shortDateFormat, textFieldProps } from '../../../../utils/tools';
import webdpAPI from '../../../../api/webdp/webdp';
import { CommonTip } from '../../../../components/index';
import {
  setOutletList,
  setOutletHistory,
  outletRollbackOne,
  outletRollbackAll
} from '../../../../redux/networkCloset/network-closet-actions';

const Outlet = () => {
  const dispatch = useDispatch();
  const outletList = useSelector((state) => state.networkCloset.outletList); // 表格数据
  const statusList = useSelector((state) => state.networkCloset.statusList);
  const cabinetList = useSelector((state) => state.networkCloset.cabinetList); // cabinet表格数据
  const [updateObj, setUpdateObj] = useState({});
  const [outletStatusList, setOutletStatusList] = useState([]);
  const [polarityStatusList, setPolarityStatusList] = useState([]);
  const [outletTypeList, setOutletTypeList] = useState([]);
  const [duplexList, setDuplexList] = useState([]);
  const [vlanList, setVlanList] = useState([]);
  const [portSecurityList, setPortSecurityList] = useState([]);
  const outletHistory = useSelector((state) => state.networkCloset.outletHistory);
  const [rollbacking, setRollbacking] = useState(false); // 是否正在回滚中

  // 撤回上一次修改
  const undoLast = () => {
    if (rollbacking) {
      return;
    }
    setRollbacking(true);

    const rollbackItem = outletHistory[outletHistory.length - 1]; // 从后面数据回滚
    const rollbackObj = {
      id: rollbackItem.id,
      [rollbackItem.field]: rollbackItem.oldValue,
      sourceData: rollbackItem.newValue
    };

    const rollbackParams = {
      outlets: [rollbackObj]
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
          dispatch(outletRollbackOne());
        }
      });
  };

  // 撤回所有修改
  const undoAll = () => {
    if (rollbacking) {
      return;
    }
    setRollbacking(true);

    const rollbackMap = outletHistory.map((item) => ({
      id: item.id,
      [item.field]: item.oldValue,
      sourceData: item.newValue
    }));

    const rollbackParams = {
      outlets: rollbackMap.reverse()
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
          dispatch(outletRollbackAll());
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
        disabled={!outletHistory.length}
      >
        Undo All
      </Button>

      <Button
        color="primary"
        startIcon={<UndoOutlined />}
        size="small"
        onClick={undoLast}
        disabled={!outletHistory.length}
      >
        Undo Last
      </Button>
    </GridToolbarContainer>
  );

  useEffect(() => {
    if (!statusList.length) {
      return;
    }

    const tempOutletStatusList = [];
    const tempPolarityStatusList = [];
    const tempOutletTypeList = [];
    const tempDuplexList = [];
    const tempVlanList = [];
    const tempPortSecurityList = [];
    statusList.forEach((item) => {
      if (item.optionType === 'OutletStatus') {
        tempOutletStatusList.push(item);
      } else if (item.optionType === 'OutletPolarity') {
        tempPolarityStatusList.push(item);
      } else if (item.optionType === 'OutletType') {
        tempOutletTypeList.push(item);
      } else if (item.optionType === 'OutletDuplex') {
        tempDuplexList.push(item);
      } else if (item.optionType === 'OutletVLAN') {
        tempVlanList.push(item);
      } else if (item.optionType === 'PortSecurity') {
        tempPortSecurityList.push(item);
      }
    });

    setOutletStatusList(tempOutletStatusList);
    setPolarityStatusList(tempPolarityStatusList);
    setOutletTypeList(tempOutletTypeList);
    setDuplexList(tempDuplexList);
    setVlanList(tempVlanList);
    setPortSecurityList(tempPortSecurityList);
  }, [statusList]);

  useEffect(() => {
    if (updateObj.id) {
      const newOutletList = [...outletList];
      const index = newOutletList.findIndex((item) => item.id === updateObj.id);
      if (index !== -1) {
        newOutletList[index] = updateObj;
      }
      dispatch(setOutletList(newOutletList));
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
      headerName: 'Outlet ID',
      // editable: true,
      flex: 1,
      minWidth: 210,
      hideSortIcons: true,
      renderCell: dataGridTooltip
    },
    {
      field: 'olocRm',
      headerName: 'Room',
      editable: true,
      flex: 1,
      minWidth: 180,
      hideSortIcons: true,
      renderCell: dataGridTooltip
    },
    {
      field: 'olocFl',
      headerName: 'Floor',
      align: 'center',
      headerAlign: 'center',
      // editable: true,
      flex: 1,
      minWidth: 100,
      hideSortIcons: true,
      renderCell: dataGridTooltip
    },
    {
      field: 'olocBlk',
      headerName: 'Block',
      align: 'center',
      headerAlign: 'center',
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
      field: 'project',
      headerName: 'Project',
      editable: true,
      flex: 1,
      minWidth: 140,
      hideSortIcons: true,
      renderCell: dataGridTooltip
    },
    {
      field: 'outletType',
      headerName: 'DP Type',
      editable: true,
      flex: 1,
      minWidth: 120,
      hideSortIcons: true,
      renderCell: dataGridTooltip,
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
            {outletTypeList.map((item) => (
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
      align: 'center',
      headerAlign: 'center',
      // editable: true,
      flex: 1,
      minWidth: 120,
      hideSortIcons: true,
      renderCell: dataGridTooltip
    },
    {
      field: 'facePlate',
      headerName: 'Face Plate',
      align: 'center',
      headerAlign: 'center',
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
      field: 'polarity',
      headerName: 'Polarity',
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
      field: 'portSpeed',
      headerName: 'Port Speed',
      align: 'center',
      headerAlign: 'center',
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
      headerName: 'Duplex',
      align: 'center',
      headerAlign: 'center',
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
      field: 'vlanID',
      headerName: 'VLan ID',
      align: 'center',
      headerAlign: 'center',
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
      field: 'portSecurity',
      headerName: 'Port Security',
      align: 'center',
      headerAlign: 'center',
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
    dispatch(setOutletList([...outletList]));
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
      dispatch(setOutletHistory(historyObj));
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
      record.row = outletList.find((item) => id === item.id) || {};
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
        rows={outletList}
        onCellEditCommit={onCellEditCommit}
        getCellClassName={(params) => {
          const hasEdit = outletHistory.find(
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

export default memo(Outlet);
