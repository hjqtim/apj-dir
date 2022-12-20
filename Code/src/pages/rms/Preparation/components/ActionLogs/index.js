import React, { useState, useEffect, memo } from 'react';
import { makeStyles, Drawer, IconButton, Typography } from '@material-ui/core';
import {
  GridToolbarContainer,
  GridToolbarDensitySelector,
  GridToolbarColumnsButton,
  GridToolbarFilterButton
} from '@material-ui/data-grid';
import CloseIcon from '@material-ui/icons/Close';
import { CommonDataGrid } from '../../../../../components';

import API from '../../../../../api/webdp/webdp';

const useStyles = makeStyles((theme) => ({
  list: {
    '& .MuiDrawer-paperAnchorRight': {
      width: '1100px'
    }
  },
  headerStyle: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    background: theme.palette.primary.main,
    color: '#fff',
    padding: theme.spacing(0, 5)
  }
}));

const ActionLog = (props) => {
  const { drawerOpen, setDrawerOpen, module } = props;
  const [params, setParams] = useState({ pageIndex: 1, pageSize: 10 });
  const [loading, setLoading] = useState(false);
  const [rows, setRows] = useState([]);
  const [total, setTotal] = useState(0);
  const classes = useStyles();

  const toggleDrawer = () => {
    setDrawerOpen(false);
  };

  const needConvertData = ['lanPoolOrder'];

  const columns = [
    { field: 'id', headerName: 'ID', flex: 1 },
    { field: 'fieldName', headerName: 'Field Name', flex: 1 },
    {
      field: 'sourceData',
      headerName: 'Source Data',
      flex: 1,
      renderCell: (params) => {
        const { fieldName } = params?.row || {};
        if (needConvertData.includes(fieldName)) {
          return Number(params?.value) === 1 ? 'Y' : 'N';
        }
        return params?.value || '';
      }
    },
    {
      field: 'newData',
      headerName: 'New Data',
      flex: 1,
      renderCell: (params) => {
        const { fieldName } = params?.row || {};
        if (needConvertData.includes(fieldName)) {
          return Number(params?.value) === 1 ? 'Y' : 'N';
        }
        return params?.value || '';
      }
    },
    { field: 'lastUpdatedDate', headerName: 'Time', flex: 1 },
    { field: 'lastUpdatedBy', headerName: 'User Name', flex: 1 }
  ];

  useEffect(() => {
    if (drawerOpen) {
      getActionList();
    }
  }, [params, drawerOpen]);

  const getActionList = () => {
    const queryData = {
      module,
      pageIndex: params.pageIndex,
      pageSize: params.pageSize
    };
    setLoading(true);
    API.getProcurementActionLog(queryData)
      .then((res) => {
        const records = res?.data?.data?.records || [];
        const totals = res?.data?.data?.total || 0;
        setTotal(totals);
        setRows(records);
      })
      .finally(() => {
        setLoading(false);
      });
  };

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

  const CustomToolbar = () => (
    <GridToolbarContainer>
      <GridToolbarFilterButton />
      <GridToolbarColumnsButton />
      <GridToolbarDensitySelector />
    </GridToolbarContainer>
  );
  return (
    <Drawer
      anchor="right"
      open={drawerOpen}
      onClose={toggleDrawer}
      classes={{ root: classes.list }}
    >
      <div className={classes.headerStyle}>
        <Typography variant="h4"> Action Log</Typography>
        <IconButton onClick={toggleDrawer}>
          <CloseIcon style={{ color: '#fff' }} />
        </IconButton>
      </div>
      <div>
        <CommonDataGrid
          rows={rows}
          rowCount={total}
          loading={loading}
          columns={columns}
          page={params.pageIndex}
          pageSize={params.pageSize}
          onPageChange={onPageChange}
          getRowId={(row) => row?.id}
          paginationMode="server"
          componentsProps={{ panel: { disablePortal: true } }}
          rowsPerPageOptions={[10, 20, 50]}
          onPageSizeChange={onPageSizeChange}
          components={{
            Toolbar: CustomToolbar
          }}
        />
      </div>
    </Drawer>
  );
};
export default memo(ActionLog);
