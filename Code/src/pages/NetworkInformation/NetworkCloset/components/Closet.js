import React, { memo, useState, useEffect, useMemo } from 'react';
import { makeStyles, Button, TextField, Select, MenuItem, Tooltip } from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';
import { GridToolbarColumnsButton, GridToolbarContainer } from '@material-ui/data-grid';
import { useSelector, useDispatch } from 'react-redux';
import {
  DeleteOutlineOutlined,
  VisibilityOutlined,
  BackupOutlined,
  RestoreOutlined,
  UndoOutlined,
  AddOutlined
} from '@material-ui/icons';
import NCSTable from './NCSTable';
import NCSTitle from './NCSTitle';
import AddCloset from './AddCloset';
import fileAPI from '../../../../api/file/file';
import getIcons from '../../../../utils/getIcons';
import dataGridTooltip from '../../../../utils/dataGridTooltip';
import { textFieldProps, handleValidation } from '../../../../utils/tools';
import {
  setSelectHospital,
  setFilterClosetId,
  setHospital,
  setClosetList,
  setCabinetTableData,
  setClosetSelectItem,
  setCabinetPowerList,
  setEquipmentList,
  setOutletList,
  setBackboneList,
  setModuleList,
  setCabinetSelectItem,
  setCabinetPowerItem,
  setEquipmentSelectItem,
  setNCSBlockList,
  setClosetHistory,
  closetRollbackOne,
  closetRollbackAll,
  clearClosetHistory,
  clearCabinetHistory,
  clearCabinetPowerHistory,
  clearEquipmentHistory,
  clearOutletHistory,
  clearBackboneHistory
} from '../../../../redux/networkCloset/network-closet-actions';
import webdpAPI from '../../../../api/webdp/webdp';
import { Loading, CommonTip } from '../../../../components/index';

const useStyles = makeStyles(() => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%'
  }
}));

const Closet = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const hospitalList = useSelector((state) => state.networkCloset.hospitalList); // 医院数据
  const selectHospital = useSelector((state) => state.networkCloset.selectHospital); // 选中的医院item
  const closetIdFilter = useSelector((state) => state.networkCloset.closetIdFilter);
  const closetList = useSelector((state) => state.networkCloset.closetList); // 表格数据
  const statusList = useSelector((state) => state.networkCloset.statusList); // status下拉列表数据
  const closetSelectItem = useSelector((state) => state.networkCloset.closetSelectItem); // 表格选中的对象
  const blockList = useSelector((state) => state.networkCloset.blockList); // 表格选中的对象
  const closetHistory = useSelector((state) => state.networkCloset.closetHistory);
  const [open, setOpen] = useState(true);
  const [tempHospital, setTempHospital] = useState({}); // 过滤器中临时选中的医院
  const [tempClosetId, setTempClosetId] = useState(''); // 过滤器中临时输入的closet id
  const [rollbacking, setRollbacking] = useState(false); // 是否正在回滚中
  const [updateObj, setUpdateObj] = useState({});

  useEffect(() => {
    if (updateObj.id) {
      const newClosetList = [...closetList];
      const index = newClosetList.findIndex((item) => item.id === updateObj.id);
      if (index !== -1) {
        newClosetList[index] = updateObj;
      }
      dispatch(setClosetList(newClosetList));
    }
  }, [updateObj]);

  const closetStatusList = useMemo(
    () => statusList.filter((item) => item.optionType === 'ClosetStatus'),
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
        {closetStatusList.map((item) => (
          <MenuItem key={item.id} value={item.optionValue}>
            {item.optionValue}
          </MenuItem>
        ))}
      </Select>
    );
  };

  const columns = [
    {
      field: 'closetid',
      headerName: 'ClosetID',
      minWidth: 190,
      flex: 1,
      hideSortIcons: true,
      renderCell: dataGridTooltip
    },
    {
      field: 'status',
      headerName: 'Status',
      editable: true,
      minWidth: 120,
      flex: 1,
      filterable: false,
      hideSortIcons: true,
      renderEditCell: statusRender
    },
    {
      field: 'photo',
      headerName: 'Photo',
      headerClassName: 'data-grid-edit-class',
      width: 120,
      filterable: false,
      hideSortIcons: true,
      renderCell: (record) => {
        const { row } = record;
        const fileId = `closet-${row.id}`;
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
      field: 'block',
      headerName: 'Block',
      editable: true,
      align: 'center',
      headerAlign: 'center',
      minWidth: 140,
      flex: 1,
      filterable: false,
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
            {blockList.map((item) => (
              <MenuItem key={item.id} value={item.block}>
                {item.block}
              </MenuItem>
            ))}
          </Select>
        );
      }
    },
    {
      field: 'floor',
      headerName: 'Floor',
      editable: true,
      align: 'center',
      headerAlign: 'center',
      minWidth: 140,
      flex: 1,
      filterable: false,
      hideSortIcons: true,
      renderCell: dataGridTooltip,
      renderEditCell: (record) => {
        const { api, id, value, field, row } = record;
        return (
          <Select
            {...textFieldProps}
            value={value || ''}
            onChange={(e) => {
              api.setEditCellValue({ id, field, value: e.target.value }, e);
            }}
          >
            {row?.floorList?.map((item) => (
              <MenuItem key={item.id} value={item.floor}>
                {item.floor}
              </MenuItem>
            ))}
          </Select>
        );
      }
    },
    {
      field: 'room',
      headerName: 'Room',
      editable: true,
      minWidth: 150,
      flex: 1,
      filterable: false,
      hideSortIcons: true,
      renderCell: dataGridTooltip
    },
    {
      field: 'criticalLocation',
      headerName: 'Critical Location',
      minWidth: 140,
      align: 'center',
      headerAlign: 'center',
      flex: 1,
      filterable: false,
      hideSortIcons: true,
      renderCell: ({ row }) => {
        let formatVal = row.criticallocation || '';
        if (row.criticallocationdesc) {
          formatVal = `${formatVal}(${row.criticallocationdesc})`;
        }
        return formatVal;
      }
    },
    {
      field: 'fc',
      headerName: 'FC',
      minWidth: 60,
      flex: 1,
      align: 'center',
      headerAlign: 'center',
      filterable: false,
      hideSortIcons: true
    },
    {
      field: 'pbc',
      headerName: 'PBC',
      minWidth: 65,
      align: 'center',
      headerAlign: 'center',
      flex: 1,
      filterable: false,
      hideSortIcons: true
    },
    {
      field: 'sbc',
      headerName: 'SBC',
      minWidth: 65,
      align: 'center',
      headerAlign: 'center',
      flex: 1,
      filterable: false,
      hideSortIcons: true
    },
    {
      field: 'pnl',
      headerName: 'PNL',
      minWidth: 65,
      align: 'center',
      headerAlign: 'center',
      flex: 1,
      filterable: false,
      hideSortIcons: true
    },
    {
      field: 'dnl',
      headerName: 'DNL',
      minWidth: 65,
      align: 'center',
      headerAlign: 'center',
      flex: 1,
      filterable: false,
      hideSortIcons: true
    },
    {
      field: 'server',
      headerName: 'Server',
      minWidth: 80,
      align: 'center',
      headerAlign: 'center',
      flex: 1,
      filterable: false,
      hideSortIcons: true
    },
    {
      field: 'patchingonly',
      headerName: 'Patching Only',
      minWidth: 130,
      align: 'center',
      headerAlign: 'center',
      flex: 1,
      filterable: false,
      hideSortIcons: true
    },
    {
      field: 'remark',
      headerName: 'Remark',
      editable: true,
      minWidth: 120,
      flex: 1,
      filterable: false,
      hideSortIcons: true,
      renderCell: dataGridTooltip
    }
  ];

  // 删除照片
  const clearPhoto = (record) => {
    record.value = '';
    commonEdit(record);
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

  // 撤回上一次修改
  const undoLast = () => {
    if (rollbacking) {
      return;
    }
    setRollbacking(true);

    const rollbackItem = closetHistory[closetHistory.length - 1]; // 从后面数据回滚
    const rollbackObj = {
      id: rollbackItem.id,
      [rollbackItem.field]: rollbackItem.oldValue,
      sourceData: rollbackItem.newValue
    };

    const rollbackParams = {
      closets: [rollbackObj]
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
          dispatch(closetRollbackOne());
        }
      });
  };

  // 撤回所有修改
  const undoAll = () => {
    if (rollbacking) {
      return;
    }
    setRollbacking(true);

    const rollbackMap = closetHistory.map((item) => ({
      id: item.id,
      [item.field]: item.oldValue,
      sourceData: item.newValue
    }));

    const rollbackParams = {
      closets: rollbackMap.reverse()
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
          dispatch(closetRollbackAll());
        }
      });
  };

  const Toolbar = () => (
    <GridToolbarContainer>
      <Button
        color="primary"
        startIcon={getIcons('filter')}
        size="small"
        onClick={() => {
          setOpen(true);
          setTempHospital(selectHospital);
          setTempClosetId(closetIdFilter);
        }}
      >
        Filters
      </Button>

      <GridToolbarColumnsButton />

      <Button
        color="primary"
        startIcon={<AddOutlined />}
        size="small"
        onClick={() => {
          const action = {
            type: 'networkCloset/setIsOpenAddCloset',
            payload: true
          };
          dispatch(action);
        }}
      >
        Add
      </Button>

      <Button
        color="primary"
        startIcon={<RestoreOutlined />}
        size="small"
        onClick={undoAll}
        disabled={!closetHistory.length}
      >
        Undo All
      </Button>

      <Button
        color="primary"
        startIcon={<UndoOutlined />}
        size="small"
        onClick={undoLast}
        disabled={!closetHistory.length}
      >
        Undo Last
      </Button>
    </GridToolbarContainer>
  );

  // 根据医院获取Block
  const getBlock = (hospCode) => {
    // getBlockByHospCodeList
    webdpAPI.getBlockByHospCodeList(hospCode).then((res) => {
      dispatch(setNCSBlockList(res?.data?.data?.blockByHospCodeList || []));
    });
  };

  // 清空修改记录列表
  const handleClearHistory = () => {
    dispatch(clearCabinetHistory());
    dispatch(clearCabinetPowerHistory());
    dispatch(clearEquipmentHistory());
    dispatch(clearOutletHistory());
    dispatch(clearBackboneHistory());
  };

  // 过滤器确认事件
  const handleFilter = () => {
    if (!tempHospital?.hospital) {
      handleValidation();
      return;
    }
    const newParams = {
      hospital: tempHospital.hospital,
      closetId: tempClosetId
    };
    dispatch(clearClosetHistory());
    handleClearHistory();
    dispatch(setSelectHospital(tempHospital));
    dispatch(setFilterClosetId(tempClosetId));
    Loading.show();
    getBlock(tempHospital.hospital);
    webdpAPI
      .getClosetsAndSub(newParams)
      .then((res) => {
        const {
          closets = [],
          cabinets = [],
          cabinetPowerSources = [],
          equipments = [],
          outlets = [],
          backbones = []
        } = res?.data?.data?.data || {};

        dispatch(setClosetList(closets));
        dispatch(setClosetSelectItem(closets[0] || {}));

        dispatch(setCabinetTableData(cabinets));
        dispatch(setCabinetSelectItem({}));

        dispatch(setCabinetPowerList(cabinetPowerSources));
        dispatch(setCabinetPowerItem({}));

        dispatch(setEquipmentList(equipments));
        dispatch(setEquipmentSelectItem({}));

        dispatch(setOutletList(outlets));

        dispatch(setBackboneList(backbones));

        dispatch(setModuleList([]));
      })
      .finally(() => {
        Loading.hide();
      });
    setOpen(false);
  };

  // 过滤器取消事件
  const handleCancel = () => {
    if (!selectHospital?.hospital) {
      handleValidation();
      return;
    }
    setOpen(false);
  };

  // 获取医院数据
  useEffect(() => {
    Loading.show();
    webdpAPI
      .getHospitalList()
      .then((res) => {
        const newHospitalList = res?.data?.data?.hospitalList || [];
        // 去除特殊符号后排序
        newHospitalList.sort((a, b) =>
          `${a.hospital}${a.hospitalName}`
            .replace(/[() /-]/g, '')
            ?.localeCompare(`${b.hospital}${b.hospitalName}`.replace(/[() /-]/g, ''))
        );

        dispatch(setHospital(newHospitalList));
      })
      .finally(() => {
        Loading.hide();
      });
  }, []);

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
      editRes = await webdpAPI.updateCloset(editParams);
    } catch (error) {
      console.log(error);
    }
    // 修改成功
    const newData = editRes?.data?.data?.data;
    if (newData && editRes?.data?.data?.result === true) {
      CommonTip.success('Success', 1000);
      setUpdateObj(newData);
      const historyObj = {
        id,
        field, // 修改的字段
        oldValue,
        newValue: value // 要修改的值
      };
      dispatch(setClosetHistory(historyObj));
    } else {
      // 强制刷新视图
      dispatch(setClosetList([...closetList]));
      setUpdateObj({});
    }
  };

  // 编辑提交事件
  const onCellEditCommit = (record) => {
    const { field, value, id } = record;
    if (!record.row) {
      record.row = closetList.find((item) => item.id === id) || {};
    }
    const { row } = record;

    // 如果内容没有变化直接退出
    if (value === row[field]) {
      return;
    }
    commonEdit(record);
  };

  // 单击每行触发的事件
  const onRowClick = (record) => {
    const { row } = record;
    if (row.id === closetSelectItem?.id) {
      return;
    }

    dispatch(setClosetSelectItem(row));
    const params = {
      hospital: selectHospital?.hospital,
      closetId: row.closetid
    };
    handleClearHistory();

    webdpAPI.getClosetsAndSub(params).then((res) => {
      const {
        cabinets = [],
        cabinetPowerSources = [],
        equipments = [],
        outlets = [],
        backbones = []
      } = res?.data?.data?.data || {};

      dispatch(setCabinetTableData(cabinets));
      dispatch(setCabinetSelectItem({}));

      dispatch(setCabinetPowerList(cabinetPowerSources));
      dispatch(setCabinetPowerItem({}));

      dispatch(setEquipmentList(equipments));
      dispatch(setEquipmentSelectItem({}));

      dispatch(setOutletList(outlets));

      dispatch(setBackboneList(backbones));

      dispatch(setModuleList([]));
    });
  };

  const onCellDoubleClick = (record) => {
    const { field, row = {} } = record;
    if (field === 'floor' && row.block && !row.floorList?.length) {
      webdpAPI
        .getBlockAndFloorByHospCodeList({
          hospCode: selectHospital.hospital,
          block: row.block
        })
        .then((res) => {
          const newClosetList = [...closetList];
          const index = newClosetList.findIndex((item) => item.id === row.id);
          if (index !== -1) {
            newClosetList[index].floorList = res?.data?.data?.blockAndFloorByHospCodeList || [];
            dispatch(setClosetList(newClosetList));
          }
        });
    }
  };

  return (
    <div className={classes.root}>
      <NCSTitle title="Closet" />
      {/* 过滤器弹框 */}
      <div style={{ position: 'relative' }}>
        {open && (
          <div
            style={{
              padding: '10px',
              position: 'absolute',
              left: 0,
              top: 0,
              width: '200px',
              backgroundColor: '#fff',
              zIndex: 2,
              boxShadow:
                '0px 5px 5px -3px rgba(0,0,0,0.2),0px 8px 10px 1px rgba(0,0,0,0.14),0px 3px 14px 2px rgba(0,0,0,0.12)'
            }}
          >
            <Autocomplete
              options={hospitalList}
              getOptionLabel={(option) => `${option.hospital}---${option.hospitalName}`}
              value={tempHospital?.hospitalName ? tempHospital : null}
              onChange={(e, value) => {
                setTempHospital(value || {});
              }}
              renderInput={(inputParams) => (
                <TextField {...inputParams} {...textFieldProps} label="Institution *" />
              )}
            />
            <TextField
              {...textFieldProps}
              label="Closet ID"
              style={{ margin: '10px 0' }}
              value={tempClosetId}
              onChange={(e) => {
                const { value } = e.target;
                setTempClosetId(value);
              }}
            />
            <div
              style={{
                textAlign: 'right',
                fontSize: '12px',
                color: 'rgb(7, 128, 128)',
                fontWeight: 700
              }}
            >
              <span
                style={{
                  cursor: 'pointer',
                  marginRight: '10px'
                }}
                onClick={handleCancel}
              >
                Cancel
              </span>
              <span
                style={{
                  cursor: 'pointer'
                }}
                onClick={handleFilter}
              >
                OK
              </span>
            </div>
          </div>
        )}
      </div>
      {/* 表格 */}
      <NCSTable
        columns={columns}
        rows={closetList}
        onCellEditCommit={onCellEditCommit}
        onRowClick={onRowClick}
        selectItem={closetSelectItem}
        onCellDoubleClick={onCellDoubleClick}
        getCellClassName={(params) => {
          const hasEdit = closetHistory.find(
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

      {/* 添加closet模态框 */}
      <AddCloset />
    </div>
  );
};

export default memo(Closet);
