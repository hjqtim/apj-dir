import React, { useState } from 'react';
import { IconButton, Tooltip } from '@material-ui/core';
import { Error, CheckCircle } from '@material-ui/icons';
import { CommonDataGrid } from '../../../../components';
import getIcons from '../../../../utils/getIcons';
import { useGlobalStyles } from '../../../../style';
import DrawerDetail from './DrawerDetail';

export default function DataList({ params, setParams, rows }) {
  const classes = useGlobalStyles();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [currentRow, setCurrentRow] = useState({});

  const onPageSizeChange = (pageSize) => {
    const newParams = {
      ...params,
      pageIndex: 1,
      pageSize: Number(pageSize)
    };
    setParams(newParams);
  };

  const onPageChange = (pageIndex) => {
    const newParams = {
      ...params,
      pageIndex
    };
    setParams(newParams);
  };

  const columns = [
    {
      field: 'hospital',
      headerName: 'Institution',
      flex: 1
    },
    {
      field: 'block',
      headerName: 'Block',
      flex: 1
    },
    {
      field: 'floor',
      headerName: 'Floor',
      flex: 1
    },
    {
      field: 'room',
      headerName: 'Room',
      flex: 1
    },
    {
      field: 'wired',
      headerName: 'Wired Network',
      flex: 1,
      renderCell: (params) => renderCell(params)
    },
    {
      field: 'wirelessStatus',
      headerName: 'Wireless Network',
      flex: 1,
      renderCell: (params) => renderCell(params)
    },

    {
      field: 'externalNetworkStatus',
      headerName: 'External Network',
      flex: 1,
      renderCell: (params) => renderCell(params)
    },
    {
      field: 'actions',
      headerName: 'Actions',
      flex: 1,
      renderCell: ({ row }) => (
        <div>
          <Tooltip title="Detail">
            <IconButton
              onClick={() => {
                setDrawerOpen(true);
                setCurrentRow(row);
              }}
            >
              {getIcons('detail')}
            </IconButton>
          </Tooltip>
        </div>
      )
    }
  ];

  // show view
  const renderCell = ({ value }) =>
    !!value === true ? (
      <Tooltip title="Exist">
        <CheckCircle style={{ color: '#00AB91' }} size={30} />
      </Tooltip>
    ) : (
      <Tooltip title="Inexistence">
        <Error color="error" size={30} />
      </Tooltip>
    );
  return (
    <>
      <CommonDataGrid
        rows={rows}
        columns={columns}
        disableColumnMenu
        page={params.pageIndex}
        pageSize={params.pageSize}
        onPageChange={onPageChange}
        getRowId={(row) => row?.id}
        className={classes.fixDatagrid}
        rowsPerPageOptions={[10, 20, 50]}
        onPageSizeChange={onPageSizeChange}
        disableSelectionOnClick
      />

      <DrawerDetail drawerOpen={drawerOpen} setDrawerOpen={setDrawerOpen} currentRow={currentRow} />
    </>
  );
}
