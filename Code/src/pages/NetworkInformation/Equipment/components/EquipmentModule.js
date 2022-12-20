import React, { memo, useMemo } from 'react';
import { makeStyles, Tooltip, Select, MenuItem } from '@material-ui/core';
import dayjs from 'dayjs';
import { CommonDataGrid, CommonTip } from '../../../../components';
import dataGridTooltip from '../../../../utils/dataGridTooltip';
import { shortDateFormat, textFieldProps } from '../../../../utils/tools';
import webdpAPI from '../../../../api/webdp/webdp';

const useStyles = makeStyles(() => ({
  root: {
    '& .MuiDataGrid-iconSeparator': {
      display: 'none'
    },
    '& .MuiDataGrid-columnHeaderTitleContainer': {
      padding: 0
    },
    '& .MuiDataGrid-columnsContainer .data-grid-edit-class': {
      color: '#229FFA'
    }
  }
}));

const EquipmentModule = (props) => {
  const classes = useStyles();
  const { modules = [], setFieldValue, getDetailByOne, statusList = [] } = props;

  const moduleStatusList = useMemo(
    () => statusList.filter((item) => item.optionType === 'EquipStatus'),
    [statusList]
  );

  const pageSize = 20;

  const columns = [
    {
      field: 'slotId',
      headerName: 'Slot',
      align: 'center',
      headerAlign: 'center',
      width: 70,
      hideSortIcons: true,
      editable: true,
      headerClassName: 'data-grid-edit-class'
    },
    {
      field: 'ownEquipId',
      headerName: 'Module Ref. ID',
      flex: 1,
      minWidth: 160,
      hideSortIcons: true,
      renderCell: dataGridTooltip
    },
    {
      field: 'moduleDesc',
      headerName: 'Module Description',
      flex: 2,
      minWidth: 200,
      hideSortIcons: true,
      renderCell: dataGridTooltip
    },
    {
      field: 'serialNo',
      headerName: 'Serial No',
      flex: 1,
      minWidth: 140,
      hideSortIcons: true,
      renderCell: dataGridTooltip
    },
    {
      field: 'portQty',
      headerName: 'Port',
      align: 'center',
      headerAlign: 'center',
      width: 60,
      hideSortIcons: true
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 110,
      hideSortIcons: true,
      editable: true,
      headerClassName: 'data-grid-edit-class',
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
            {moduleStatusList.map((item) => (
              <MenuItem key={item.id} value={item.optionValue}>
                {item.optionValue}
              </MenuItem>
            ))}
          </Select>
        );
      }
    },
    {
      field: 'acceptanceDate',
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
      field: 'reqNo',
      headerName: 'Req Form',
      // editable: true,
      flex: 1,
      minWidth: 140,
      hideSortIcons: true,
      renderCell: dataGridTooltip
    },
    {
      field: 'itemOwner',
      headerName: 'Owner',
      align: 'center',
      headerAlign: 'center',
      flex: 1,
      minWidth: 100,
      hideSortIcons: true
    },
    {
      field: 'maintId',
      headerName: 'Maint. ID',
      minWidth: 190,
      flex: 1,
      hideSortIcons: true
    },
    {
      field: 'maint.maintVendor',
      headerName: 'Maintenance Vendor',
      minWidth: 190,
      flex: 1,
      hideSortIcons: true,
      renderCell: (record) => {
        const { row } = record;
        return (
          <Tooltip title={row.maint?.maintVendor || ''} placement="top">
            <span>{row.maint?.maintVendor || ''}</span>
          </Tooltip>
        );
      }
    },
    {
      field: 'serviceHour',
      headerName: 'Service Hour',
      minWidth: 190,
      flex: 1,
      hideSortIcons: true,
      renderCell: (record) => {
        const { row } = record;
        return row.maint?.serviceHour || '';
      }
    },
    {
      field: 'telNo',
      headerName: 'Tel No',
      minWidth: 190,
      flex: 1,
      hideSortIcons: true,
      renderCell: (record) => {
        const { row } = record;
        return (
          <Tooltip title={row.maint?.telNo || ''} placement="top">
            <span>{row.maint?.telNo || ''}</span>
          </Tooltip>
        );
      }
    },
    {
      field: 'expiryDate',
      headerName: 'Expiry Date',
      minWidth: 190,
      flex: 1,
      hideSortIcons: true,
      renderCell: (record) => {
        const { row } = record;
        return row.maint?.expiryDate || '';
      }
    }
  ];

  // 强制刷新视图
  const updateView = () => {
    setFieldValue('modules', [...modules]);
  };

  // 通用的修改事件请求api
  const commonEdit = async (record) => {
    const { id, field, value } = record;
    let editRes = null;
    try {
      const editParams = {
        id,
        [field]: value ?? ''
      };
      editRes = await webdpAPI.equipUpdateModule(editParams);
    } catch (error) {
      console.log(error);
    }

    if (editRes?.data?.code === 200) {
      getDetailByOne({ isShowSuccess: true });
    } else {
      // 强制刷新视图
      updateView();
    }
  };

  // 编辑提交事件
  const onCellEditCommit = (record) => {
    const { field, value, id } = record;

    if (!record.row) {
      record.row = modules.find((item) => id === item.id) || {};
    }
    const { row } = record;

    // 如果内容没有变化直接退出
    if (value === row[field]) {
      return;
    }

    if (field === 'slotId' && value?.length > 5) {
      CommonTip.warning('The length cannot be greater than 5');
      setTimeout(() => {
        updateView();
      }, 0);
      return;
    }

    commonEdit(record);
  };

  return (
    <div className={classes.root}>
      <div style={{ color: '#078080', fontSize: '16px', paddingLeft: '4px', paddingBottom: '5px' }}>
        <strong>Module</strong>
      </div>

      <div>
        <CommonDataGrid
          headerHeight={25}
          rowHeight={25}
          rows={modules}
          columns={columns}
          pageSize={pageSize}
          filterMode="server"
          rowsPerPageOptions={[pageSize]}
          sortingMode="server"
          isRowSelectable={() => false}
          onCellEditCommit={onCellEditCommit}
        />
      </div>
    </div>
  );
};

export default memo(EquipmentModule);
