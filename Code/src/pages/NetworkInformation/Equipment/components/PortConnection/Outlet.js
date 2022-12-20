import React, { memo } from 'react';
import { makeStyles, Select, MenuItem, Button } from '@material-ui/core';
import { GridToolbarContainer, GridToolbarColumnsButton } from '@material-ui/data-grid';
import { RestoreOutlined, UndoOutlined } from '@material-ui/icons';
import { useSelector, useDispatch } from 'react-redux';
import dataGridTooltip from '../../../../../utils/dataGridTooltip';
import ConnectTable from './ConnectTable';
import { textFieldProps } from '../../../../../utils/tools';
import { CommonTip } from '../../../../../components';
import webdpAPI from '../../../../../api/webdp/webdp';
import { setOutletSelectItem } from '../../../../../redux/networkCloset/network-closet-actions';

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

const Outlet = (props) => {
  const {
    setFieldValue,
    outletList,
    backboneList,
    outletStatusList,
    duplexList,
    vlanList,
    polarityStatusList,
    isRefresh,
    type
  } = props;

  const commonList = type === 'outlet' ? outletList : backboneList;
  const outletIdWidth = type === 'outlet' ? 210 : 260;
  const classes = useStyles();
  const outletSelectItem = useSelector((state) => state.networkCloset.outletSelectItem);
  const dispatch = useDispatch();
  // const [updateObj, SetUpdateObj] = useState({});
  const columns = [
    {
      field: 'patchPanelID',
      headerName: 'Panel',
      flex: 1,
      minWidth: 80,
      hideSortIcons: true
    },
    {
      field: 'patchPanelPort',
      headerName: 'Port',
      flex: 1,
      minWidth: 80,
      hideSortIcons: true
    },
    {
      field: 'outletId',
      headerName: 'Outlet ID',
      flex: 1,
      minWidth: outletIdWidth,
      hideSortIcons: true
    },
    {
      field: 'status',
      headerName: 'Outlet Status',
      flex: 1,
      minWidth: 150,
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
      minWidth: 140,
      editable: true,
      hideSortIcons: true,
      renderCell: dataGridTooltip
    },
    {
      field: 'olocRm',
      headerName: 'Room',
      minWidth: 120,
      hideSortIcons: true,
      renderCell: dataGridTooltip
    },

    {
      field: 'olocFl',
      headerName: 'Floor',
      minWidth: 90,
      hideSortIcons: true,
      renderCell: dataGridTooltip
    },
    {
      field: 'olocBlk',
      headerName: 'Block',
      minWidth: 90,
      hideSortIcons: true,
      renderCell: dataGridTooltip
    },
    {
      field: 'cableType',
      headerName: 'Cable Type',
      flex: 1,
      minWidth: 120,
      hideSortIcons: true,
      renderCell: dataGridTooltip
    },
    {
      field: 'facePlate',
      headerName: 'Face Plate',
      flex: 1,
      minWidth: 120,
      hideSortIcons: true,
      renderCell: dataGridTooltip
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
      field: 'portSpeed',
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
      field: 'vlanID',
      headerName: 'VLanID',
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
      field: 'remark',
      headerName: 'Remark of Equipment Port',
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

      editRes = await webdpAPI.updateOutletForConnection(editParams);
    } catch (error) {
      console.log(error);
    }

    // 修改成功
    const newData = { ...row };
    newData[field] = value;
    if (editRes?.data?.data?.result === true) {
      CommonTip.success('Success', 1000);
      // SetUpdateObj(newData);

      // const historyObj = {
      //   ...row,
      //   field, // 修改的字段
      //   oldValue,
      //   newValue: value // 要修改的值
      // };
      // dispatch(setConnectPortHistory(historyObj));
    } else {
      // 强制刷新视图
      updateView();
      // SetUpdateObj({});
    }
  };
  const onRowClick = (record) => {
    const { row } = record;
    if (row.id === outletSelectItem[0]?.id) {
      return;
    }
    dispatch(setOutletSelectItem([row]));
  };

  // 编辑提交事件
  const onCellEditCommit = (record) => {
    const { field, value, id } = record;

    if (!record.row) {
      record.row = commonList.find((item) => id === item.id) || {};
    }
    const { row } = record;

    // 如果内容没有变化直接退出
    if (value !== row[field]) {
      commonEdit(record);
    }
  };

  return (
    <div className={classes.main}>
      <ConnectTable
        style={{ width: '100%', height: '100%' }}
        rows={commonList}
        columns={columns}
        onRowClick={onRowClick}
        onCellEditCommit={onCellEditCommit}
        selectItem={outletSelectItem}
        pageSize={100}
        hideFooter
        autoHeight={false}
        components={{ Toolbar }}
      />
    </div>
  );
};
export default memo(Outlet);
