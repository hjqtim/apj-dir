import React, { memo, useState, useEffect } from 'react';

import { GridToolbar } from '@material-ui/data-grid';
import { Select, MenuItem, makeStyles } from '@material-ui/core';
import { CommonDataGrid } from '../../../../../../components';
import { textFieldProps } from '../../../../../../utils/tools';
import API from '../../../../../../api/webdp/webdp';

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

const DataPort = () => {
  const classes = useStyles();
  console.log('Data Port');
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState([]);
  const [total, setTotal] = useState(0);

  const defaultValue = {
    pageNo: 1,
    pageSize: 10
  };
  const [params, setParams] = useState(defaultValue);

  const selectRender = (props) => {
    const { api, id, value, field, dataList } = props;
    return (
      <Select
        {...textFieldProps}
        value={value}
        onChange={(e) => {
          api.setEditCellValue({ id, field, value: e.target.value }, e);
        }}
      >
        {dataList.map((item) => (
          <MenuItem key={item.id} value={item.optionValue}>
            {item.optionValue}
          </MenuItem>
        ))}
      </Select>
    );
  };

  const columns = [
    {
      field: 'dataPortId',
      headerName: 'Data Port ID',
      headerClassName: 'data-grid-edit-class',
      editable: true,
      minWidth: 140,
      flex: 1,
      renderEditCell: (props) => {
        const dataList = [
          {
            id: 1,
            optionValue: 'DP'
          },
          {
            id: 2,
            optionValue: 'AP'
          },
          {
            id: 3,
            optionValue: 'WLAN'
          }
        ];
        return selectRender({ ...props, dataList });
      }
    },
    {
      field: 'dataPortType',
      headerName: 'Data Port Type',
      headerClassName: 'data-grid-edit-class',
      editable: true,
      minWidth: 160,
      flex: 1
    },
    {
      field: 'PriorSec',
      headerName: 'Pri or Sec',
      headerClassName: 'data-grid-edit-class',
      editable: true,
      minWidth: 120,
      flex: 1
    },
    {
      field: 'LinkPort',
      headerName: 'Link Port',
      headerClassName: 'data-grid-edit-class',
      editable: true,
      minWidth: 120,
      flex: 1
    },
    {
      field: 'Room',
      headerName: 'Data Port Location: Room',
      headerClassName: 'data-grid-edit-class',
      editable: true,
      minWidth: 260,
      flex: 1
    },
    {
      field: 'Block',
      headerName: 'Block',
      headerClassName: 'data-grid-edit-class',
      editable: true,
      minWidth: 100,
      flex: 1
    },
    {
      field: 'Floor',
      headerName: 'Floor',
      headerClassName: 'data-grid-edit-class',
      editable: true,
      minWidth: 100,
      flex: 1
    },
    {
      field: 'ClosetLocation',
      headerName: 'Closet Location',
      headerClassName: 'data-grid-edit-class',
      editable: true,
      minWidth: 200,
      flex: 1
    },
    {
      field: 'Cabinet',
      headerName: 'Cabinet',
      headerClassName: 'data-grid-edit-class',
      editable: true,
      minWidth: 120,
      flex: 1
    },
    {
      field: 'Project',
      headerName: 'Project',
      headerClassName: 'data-grid-edit-class',
      editable: true,
      minWidth: 120,
      flex: 1
    },
    {
      field: 'ViewClose',
      headerName: 'View Close',
      headerClassName: 'data-grid-edit-class',
      editable: true,
      minWidth: 160,
      flex: 1
    },
    {
      field: 'Cable',
      headerName: 'Cable',
      headerClassName: 'data-grid-edit-class',
      editable: true,
      minWidth: 100,
      flex: 1
    },
    {
      field: 'Conduit',
      headerName: 'Conduit',
      headerClassName: 'data-grid-edit-class',
      editable: true,
      minWidth: 120,
      flex: 1
    },
    {
      field: 'FacePlate',
      headerName: 'Face Plate',
      headerClassName: 'data-grid-edit-class',
      editable: true,
      minWidth: 160,
      flex: 1
    },
    {
      field: 'TargetDate',
      headerName: 'Target Date',
      headerClassName: 'data-grid-edit-class',
      editable: true,
      minWidth: 180,
      flex: 1
    },
    {
      field: 'ContactPerson',
      headerName: 'Contact Person & Tel. No',
      headerClassName: 'data-grid-edit-class',
      editable: true,
      minWidth: 240,
      flex: 1
    },
    {
      field: 'CableLen',
      headerName: 'Cable Len',
      headerClassName: 'data-grid-edit-class',
      editable: true,
      minWidth: 140,
      flex: 1
    },
    {
      field: 'PanelID',
      headerName: 'Panel ID',
      headerClassName: 'data-grid-edit-class',
      editable: true,
      minWidth: 140,
      flex: 1
    },
    {
      field: 'PortID',
      headerName: 'P.PortID',
      headerClassName: 'data-grid-edit-class',
      editable: true,
      minWidth: 140,
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
      field: 'Polarity',
      headerName: 'Polarity',
      headerClassName: 'data-grid-edit-class',
      editable: true,
      minWidth: 140,
      flex: 1
    },
    {
      field: 'PortSpeed',
      headerName: 'Port Speed',
      headerClassName: 'data-grid-edit-class',
      editable: true,
      minWidth: 160,
      flex: 1
    },
    {
      field: 'Duplex',
      headerName: 'Duplex',
      headerClassName: 'data-grid-edit-class',
      editable: true,
      minWidth: 140,
      flex: 1
    },
    {
      field: 'Area',
      headerName: 'Located at Public Area',
      headerClassName: 'data-grid-edit-class',
      editable: true,
      minWidth: 220,
      flex: 1
    },
    {
      field: 'VLanID',
      headerName: 'VLan ID',
      headerClassName: 'data-grid-edit-class',
      editable: true,
      minWidth: 120,
      flex: 1
    },
    {
      field: 'Security',
      headerName: 'Port Security',
      headerClassName: 'data-grid-edit-class',
      editable: true,
      minWidth: 180,
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
    // setTimeout(() => {
    //   const data = [
    //     {
    //       id: 1,
    //       dataPortId: 'DP'
    //     }
    //   ];
    //   setRows(data);
    //   setLoading(false);
    // }, 1000);
    API.getDataPortInfoList().then((res) => {
      console.log(res);
    });
    const data = [
      {
        id: 1,
        dataPortId: 'DP'
      }
    ];
    setRows(data);
    setLoading(false);
    setTotal(0);
    setParams(params);
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

export default memo(DataPort);
