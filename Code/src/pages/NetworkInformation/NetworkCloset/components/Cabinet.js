import React, { memo, useMemo, useState, useEffect } from 'react';
import { Select, MenuItem, Tooltip, Button } from '@material-ui/core';
import { GridToolbarColumnsButton, GridToolbarContainer } from '@material-ui/data-grid';
import { useSelector, useDispatch } from 'react-redux';
import {
  DeleteOutlineOutlined,
  VisibilityOutlined,
  BackupOutlined,
  RestoreOutlined,
  UndoOutlined
} from '@material-ui/icons';
import dayjs from 'dayjs';
import NCSTable from './NCSTable';
import NCSTitle from './NCSTitle';
import styleProps from './styleProps';
import dataGridTooltip from '../../../../utils/dataGridTooltip';
import { textFieldProps, shortDateFormat } from '../../../../utils/tools';
import webdpAPI from '../../../../api/webdp/webdp';
import { CommonTip } from '../../../../components/index';
import {
  setCabinetSelectItem,
  setCabinetTableData,
  setCabinetPowerList,
  setEquipmentList,
  setOutletList,
  setBackboneList,
  setModuleList,
  setCabinetPowerItem,
  setEquipmentSelectItem,
  setCabinettHistory,
  cabinetRollbackOne,
  cabinetRollbackAll,
  clearCabinetPowerHistory,
  clearEquipmentHistory,
  clearOutletHistory,
  clearBackboneHistory
} from '../../../../redux/networkCloset/network-closet-actions';
import fileAPI from '../../../../api/file/file';

const Cabinet = () => {
  const dispatch = useDispatch();

  const cabinetList = useSelector((state) => state.networkCloset.cabinetList); // 表格数据
  const statusList = useSelector((state) => state.networkCloset.statusList); // status下拉列表数据
  const cabinetSelectItem = useSelector((state) => state.networkCloset.cabinetSelectItem);
  const cabinetHistory = useSelector((state) => state.networkCloset.cabinetHistory);
  const [rollbacking, setRollbacking] = useState(false); // 是否正在回滚中
  const [updateObj, setUpdateObj] = useState({});

  useEffect(() => {
    if (updateObj.id) {
      const newCabinetList = [...cabinetList];
      const index = newCabinetList.findIndex((item) => item.id === updateObj.id);
      if (index !== -1) {
        newCabinetList[index] = updateObj;
      }
      dispatch(setCabinetTableData(newCabinetList));
    }
  }, [updateObj]);

  // 清空修改记录列表
  const handleClearHistory = () => {
    dispatch(clearCabinetPowerHistory());
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

    const rollbackItem = cabinetHistory[cabinetHistory.length - 1]; // 从后面数据回滚
    const rollbackObj = {
      id: rollbackItem.id,
      [rollbackItem.field]: rollbackItem.oldValue,
      sourceData: rollbackItem.newValue
    };

    const rollbackParams = {
      cabinets: [rollbackObj]
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
          dispatch(cabinetRollbackOne());
        }
      });
  };

  // 撤回所有修改
  const undoAll = () => {
    if (rollbacking) {
      return;
    }
    setRollbacking(true);

    const rollbackMap = cabinetHistory.map((item) => ({
      id: item.id,
      [item.field]: item.oldValue,
      sourceData: item.newValue
    }));

    const rollbackParams = {
      cabinets: rollbackMap.reverse()
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
          dispatch(cabinetRollbackAll());
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
        disabled={!cabinetHistory.length}
      >
        Undo All
      </Button>

      <Button
        color="primary"
        startIcon={<UndoOutlined />}
        size="small"
        onClick={undoLast}
        disabled={!cabinetHistory.length}
      >
        Undo Last
      </Button>
    </GridToolbarContainer>
  );

  const cabinetStatusList = useMemo(
    () => statusList.filter((item) => item.optionType === 'EquipStatus'),
    [statusList]
  );

  const mountingMethodList = useMemo(
    () => statusList.filter((item) => item.optionType === 'CabMountMethod'),
    [statusList]
  );

  const statusRender = (props) => {
    const { api, id, value, field } = props;
    return (
      <Select
        {...textFieldProps}
        value={value || ''}
        onChange={(e) => {
          api.setEditCellValue({ id, field, value: e.target.value }, e);
        }}
      >
        {cabinetStatusList.map((item) => (
          <MenuItem key={item.id} value={item.optionValue}>
            {item.optionValue}
          </MenuItem>
        ))}
      </Select>
    );
  };

  // 上传照片
  const uploadFile = async (e, record) => {
    const file = e.target.files?.[0];

    if (!file) {
      return;
    }

    let result = null;
    try {
      const formData = new FormData();
      formData.append('file', file);
      result = await webdpAPI.ncsUploadFile(formData);
    } catch (error) {
      console.log(error);
    }

    const fileUrl = result?.data?.data?.result?.data?.[0]?.fileUrl;
    if (fileUrl) {
      // 上传成功;
      record.value = fileUrl;
      commonEdit(record);
    } else {
      CommonTip.error('Upload failed');
    }
  };

  // 删除照片
  const clearPhoto = (record) => {
    record.value = '';
    commonEdit(record);
  };

  const columns = [
    {
      field: 'cabinetId',
      headerName: 'CabinetID',
      align: 'center',
      headerAlign: 'center',
      flex: 1,
      minWidth: 120,
      hideSortIcons: true,
      renderCell: dataGridTooltip
    },
    {
      field: 'cabinetDesc',
      headerName: 'Description',
      flex: 1,
      minWidth: 120,
      hideSortIcons: true,
      renderCell: dataGridTooltip
    },
    {
      field: 'cabinetSize',
      headerName: 'Size (WxDxH)',
      flex: 1,
      minWidth: 130,
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
      renderEditCell: statusRender
    },
    {
      field: 'photo',
      headerName: 'Current Photo',
      headerClassName: 'data-grid-edit-class',
      flex: 1,
      minWidth: 130,
      hideSortIcons: true,
      renderCell: (record) => {
        const { row } = record;
        const fileId = `cabinet-current-photo-${row.id}`;
        return (
          <div style={{ width: '100%', display: 'flex', alignItems: 'center' }}>
            <Tooltip title="Upload" placement="top">
              <div>
                <input
                  accept="image/*"
                  style={{ display: 'none' }}
                  id={fileId}
                  type="file"
                  onChange={(e) => {
                    uploadFile(e, record);
                    e.target.value = '';
                  }}
                />
                <label
                  htmlFor={fileId}
                  style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                >
                  <BackupOutlined
                    style={{ fontSize: '16px', cursor: 'pointer', color: '#229FFA' }}
                  />
                </label>
              </div>
            </Tooltip>

            <Tooltip title="Preview" placement="top">
              <VisibilityOutlined
                style={{
                  fontSize: '16px',
                  cursor: 'pointer',
                  display: row.photo ? 'block' : 'none',
                  color: '#229FFA',
                  margin: '0 5px'
                }}
                onClick={() => {
                  fileAPI.previewFile(row.photo);
                }}
              />
            </Tooltip>

            <Tooltip title="Clear" placement="top">
              <DeleteOutlineOutlined
                onClick={() => clearPhoto(record)}
                style={{
                  fontSize: '16px',
                  cursor: 'pointer',
                  display: row.photo ? 'block' : 'none',
                  color: '#229FFA'
                }}
              />
            </Tooltip>
          </div>
        );
      }
    },
    {
      field: 'beforePhoto',
      headerName: 'Before Change Photo',
      headerClassName: 'data-grid-edit-class',
      flex: 1,
      minWidth: 180,
      hideSortIcons: true,
      renderCell: (record) => {
        const { row } = record;
        const fileId = `cabinet-before-photo-${row.id}`;
        return (
          <div style={{ width: '100%', display: 'flex', alignItems: 'center' }}>
            <Tooltip title="Upload" placement="top">
              <div>
                <input
                  accept="image/*"
                  style={{ display: 'none' }}
                  id={fileId}
                  type="file"
                  onChange={(e) => {
                    uploadFile(e, record);
                    e.target.value = '';
                  }}
                />
                <label
                  htmlFor={fileId}
                  style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                >
                  <BackupOutlined
                    style={{ fontSize: '16px', cursor: 'pointer', color: '#229FFA' }}
                  />
                </label>
              </div>
            </Tooltip>

            <Tooltip title="Preview" placement="top">
              <VisibilityOutlined
                style={{
                  fontSize: '16px',
                  cursor: 'pointer',
                  display: row.beforePhoto ? 'block' : 'none',
                  color: '#229FFA',
                  margin: '0 5px'
                }}
                onClick={() => {
                  fileAPI.previewFile(row.beforePhoto);
                }}
              />
            </Tooltip>

            <Tooltip title="Clear" placement="top">
              <DeleteOutlineOutlined
                onClick={() => clearPhoto(record)}
                style={{
                  fontSize: '16px',
                  cursor: 'pointer',
                  display: row.beforePhoto ? 'block' : 'none',
                  color: '#229FFA'
                }}
              />
            </Tooltip>
          </div>
        );
      }
    },
    {
      field: 'keyLabel',
      headerName: 'Key No.',
      editable: true,
      minWidth: 120,
      flex: 1,
      hideSortIcons: true
    },
    {
      field: 'keyIndex',
      headerName: 'Key Index',
      align: 'center',
      headerAlign: 'center',
      editable: true,
      minWidth: 120,
      flex: 1,
      hideSortIcons: true
    },
    {
      field: 'haequipId',
      headerName: 'Equip. ID',
      align: 'center',
      headerAlign: 'center',
      editable: true,
      minWidth: 120,
      flex: 1,
      hideSortIcons: true
    },
    {
      field: 'reqNo',
      headerName: 'Req. Form',
      flex: 1,
      minWidth: 120,
      hideSortIcons: true,
      renderCell: dataGridTooltip
    },
    {
      field: 'acceptDate',
      headerName: 'DOB',
      align: 'center',
      headerAlign: 'center',
      flex: 1,
      minWidth: 120,
      hideSortIcons: true,
      valueGetter: (record) => {
        const { value } = record;
        return value ? dayjs(value).format(shortDateFormat) : '';
      }
    },
    {
      field: 'mountMethod',
      headerName: 'Mounting Method',
      editable: true,
      flex: 1,
      minWidth: 160,
      hideSortIcons: true,
      renderCell: (record) => {
        const { value } = record;
        const hasFind = mountingMethodList.find((item) => item.optionValue === value);
        if (hasFind) {
          return hasFind.description;
        }
        return value;
      },
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
            {mountingMethodList.map((item) => (
              <MenuItem key={item.id} value={item.optionValue}>
                {item.description}
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
      editRes = await webdpAPI.updateCabinet(editParams);
    } catch (error) {
      console.log(error);
    }
    // 修改成功
    const newData = editRes?.data?.data?.data;
    if (newData && editRes?.data?.data?.result === true) {
      CommonTip.success('Success', 1000);
      setUpdateObj(newData);
      const historyObj = {
        ...row,
        field, // 修改的字段
        oldValue,
        newValue: value // 要修改的值
      };
      dispatch(setCabinettHistory(historyObj));
    } else {
      // 强制刷新视图
      dispatch(setCabinetTableData([...cabinetList]));
      setUpdateObj({});
    }
  };

  // 编辑提交事件
  const onCellEditCommit = (record) => {
    const { field, value, id } = record;

    if (!record.row) {
      record.row = cabinetList.find((item) => id === item.id) || {};
    }
    const { row } = record;

    // 如果内容没有变化直接退出
    if (value === row[field]) {
      return;
    }
    commonEdit(record);
  };

  // 选中单行
  const onRowClick = (record) => {
    const { row } = record;
    if (row.id === cabinetSelectItem?.id) {
      return;
    }
    dispatch(setCabinetSelectItem(row));

    const params = {
      closetId: row.closetId,
      cabinetId: row.cabinetId
    };
    handleClearHistory();
    webdpAPI.getCabinetAndSub(params).then((res) => {
      const {
        cabinetPowerSources = [],
        equipments = [],
        outlets = [],
        backbones = []
      } = res?.data?.data?.data || {};

      dispatch(setCabinetPowerList(cabinetPowerSources));
      dispatch(setCabinetPowerItem({}));

      dispatch(setEquipmentList(equipments));
      dispatch(setEquipmentSelectItem({}));

      dispatch(setOutletList(outlets));

      dispatch(setBackboneList(backbones));

      dispatch(setModuleList([]));
    });
  };

  return (
    <div style={styleProps}>
      <NCSTitle title="Cabinet" />
      <div style={{ flex: 1 }}>
        <NCSTable
          columns={columns}
          rows={cabinetList}
          onCellEditCommit={onCellEditCommit}
          onRowClick={onRowClick}
          selectItem={cabinetSelectItem}
          getCellClassName={(params) => {
            const hasEdit = cabinetHistory.find(
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
    </div>
  );
};

export default memo(Cabinet);
