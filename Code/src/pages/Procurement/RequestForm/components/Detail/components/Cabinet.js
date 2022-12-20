import React, { memo, useState, useEffect } from 'react';

import { GridToolbar } from '@material-ui/data-grid';
import { makeStyles } from '@material-ui/core';
import { CommonDataGrid } from '../../../../../../components';

const useStyles = makeStyles(() => ({
  root: {
    width: '100%',
    height: '100%',
    '& .MuiDataGrid-iconSeparator': {
      display: 'none'
    },
    '& .MuiDataGrid-root': {
      border: 'none',
      height: '100%'
    },
    '& .MuiDataGrid-columnHeaderWrapper': {
      backgroundColor: '#E6EBF1'
    },
    '& .MuiDataGrid-footerContainer': {
      minHeight: 'auto'
    },
    '& .MuiDataGrid-footerContainer .MuiIconButton-root': {
      padding: 0
    },
    '& .MuiTablePagination-root .MuiTablePagination-toolbar': {
      minHeight: '30px'
    },
    '& .MuiDataGrid-columnsContainer .data-grid-edit-class': {
      color: '#229FFA'
    },
    '& .my-table-active-color': {
      backgroundColor: '#F5F5F5'
    },
    '& .my-select-item-color': {
      backgroundColor: 'rgba(63, 81, 181, 0.2)'
    }
  }
}));

const Cabinet = () => {
  const classes = useStyles();
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState([]);
  const [total, setTotal] = useState(0);

  const defaultValue = {
    pageNo: 1,
    pageSize: 10
  };
  const [params, setParams] = useState(defaultValue);

  const columns = [
    {
      field: 'Cabinet',
      headerName: 'Cabinet ID',
      minWidth: 140,
      flex: 1
    },
    {
      field: 'ClosetLocation',
      headerName: 'Closet Location',
      headerClassName: 'data-grid-edit-class',
      editable: true,
      minWidth: 160,
      flex: 1
    },
    {
      field: 'PartNo',
      headerName: 'Part No',
      headerClassName: 'data-grid-edit-class',
      editable: true,
      minWidth: 120,
      flex: 1
    },
    {
      field: 'Description',
      headerName: 'Description',
      minWidth: 160,
      flex: 1
    },
    {
      field: 'CabinetSize',
      headerName: 'Cabinet Size (WxDxH)',
      minWidth: 240,
      flex: 1
    },
    {
      field: 'TargetDate',
      headerName: 'Target Date',
      headerClassName: 'data-grid-edit-class',
      editable: true,
      minWidth: 140,
      flex: 1
    },
    {
      field: 'EquipId',
      headerName: 'Equip.ID',
      headerClassName: 'data-grid-edit-class',
      editable: true,
      minWidth: 120,
      flex: 1
    },
    {
      field: 'CabinetKeyNo',
      headerName: 'Cabinet Key No',
      headerClassName: 'data-grid-edit-class',
      editable: true,
      minWidth: 180,
      flex: 1
    },
    {
      field: 'DeliveryNote',
      headerName: 'Delivery Note',
      headerClassName: 'data-grid-edit-class',
      editable: true,
      minWidth: 160,
      flex: 1
    },
    {
      field: 'Status',
      headerName: 'Status',
      headerClassName: 'data-grid-edit-class',
      editable: true,
      minWidth: 100,
      flex: 1
    },
    {
      field: 'DOB',
      headerName: 'DOB',
      headerClassName: 'data-grid-edit-class',
      editable: true,
      minWidth: 100,
      flex: 1
    },
    {
      field: 'Remark',
      headerName: 'Remark',
      headerClassName: 'data-grid-edit-class',
      editable: true,
      minWidth: 300,
      flex: 1
    }
  ];

  useEffect(() => {
    setTimeout(() => {
      const data = [
        {
          id: 1,
          BackboneId: 'text'
        }
      ];
      setRows(data);
      setLoading(false);
      setTotal(0);
      setParams(defaultValue);
    }, 1000);
  }, []);

  return (
    <div className={classes.root}>
      <CommonDataGrid
        rows={rows}
        rowCount={total}
        columns={columns}
        loading={loading}
        paginationMode="server"
        disableSelectionOnClick
        page={params.pageNo}
        pageSize={params.pageSize}
        // onPageSizeChange={onPageSizeChange}
        // onPageChange={onPageChange}
        rowsPerPageOptions={[10, 20, 50]}
        components={{ Toolbar: GridToolbar }}
      />
    </div>
  );
};

export default memo(Cabinet);
