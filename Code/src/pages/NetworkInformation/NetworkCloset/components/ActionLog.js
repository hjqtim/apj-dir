import React, { useState, memo } from 'react';
import dayjs from 'dayjs';
import {
  makeStyles,
  Drawer,
  IconButton,
  Typography,
  Button,
  Select,
  MenuItem,
  FormControl
} from '@material-ui/core';
import { EventNoteOutlined } from '@material-ui/icons';
import CloseIcon from '@material-ui/icons/Close';
import { CommonDataGrid } from '../../../../components';
import { textFieldProps, dateFormatShow } from '../../../../utils/tools';
import dataGridTooltip from '../../../../utils/dataGridTooltip';
import webdpAPI from '../../../../api/webdp/webdp';

const useStyles = makeStyles((theme) => ({
  list: {
    '& .MuiDrawer-paperAnchorRight': {
      width: '1100px'
    },
    '& .my-table-active-color': {
      backgroundColor: '#F5F5F5'
    },
    '& .MuiDataGrid-iconSeparator': {
      display: 'none'
    }
  },
  headerStyle: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    background: theme.palette.primary.main,
    color: '#fff',
    padding: theme.spacing(0, 5)
  },
  dataGrid: {
    '& .MuiDataGrid-columnHeaderTitleContainer': {
      padding: 0
    }
  }
}));

const ActionLog = () => {
  const defaultValue = { pageIndex: 1, pageSize: 20, type: 'All' };
  const [params, setParams] = useState(defaultValue);
  const [open, setOpen] = useState(false);
  const [rows, setRows] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const classes = useStyles();

  const getList = (customParams = {}) => {
    const queryParams = {
      ...params,
      ...customParams
    };
    if (queryParams.type === 'All') {
      queryParams.type = undefined;
    }
    setLoading(true);
    webdpAPI
      .getNetworkClosetActionLogs(queryParams)
      .then((res) => {
        const newRecords = res?.data?.data?.records || [];
        const newRows = newRecords.map((item, index) => ({
          ...item,
          tableIndex: index
        }));
        setRows(newRows);
        setTotal(res?.data?.data?.total || 0);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleClose = () => {
    setParams(defaultValue);
    setTotal(0);
    setRows([]);
    setOpen(false);
  };

  const columns = [
    { field: 'tableName', headerName: 'Table Name', width: 170, hideSortIcons: true },
    { field: 'fileId', headerName: 'Field ID', flex: 1, hideSortIcons: true },
    { field: 'fieldName', headerName: 'Field Name', flex: 1, hideSortIcons: true },
    {
      field: 'sourceData',
      headerName: 'Source Data',
      flex: 1,
      hideSortIcons: true,
      renderCell: dataGridTooltip
    },
    {
      field: 'newData',
      headerName: 'New Data',
      flex: 1,
      hideSortIcons: true,
      renderCell: dataGridTooltip
    },
    {
      field: 'lastUpdatedDate',
      headerName: 'Time',
      width: 180,
      hideSortIcons: true,
      valueGetter: (record) => {
        const { value } = record;
        return value ? dayjs(value).format(dateFormatShow) : '';
      }
    },
    { field: 'lastUpdatedBy', headerName: 'User Name', flex: 1, hideSortIcons: true }
  ];

  const onPageSizeChange = (pageSize) => {
    const newParams = {
      ...params,
      pageIndex: 1,
      pageSize: Number(pageSize)
    };
    setParams(newParams);
    getList(newParams);
  };

  const onPageChange = (pageIndex) => {
    const newParams = {
      ...params,
      pageIndex
    };
    setParams(newParams);
    getList(newParams);
  };

  const selectList = [
    { label: 'All', value: 'All' },
    { label: 'Closet', value: 'Closet' },
    { label: 'Cabinet', value: 'Cabinet' },
    { label: 'Cabinet Power Connection', value: 'CabinetPowerSource' },
    { label: 'Equipment', value: 'Equipment' },
    { label: 'Outlet', value: 'Outlet' },
    { label: 'Backbone', value: 'Backbone' }
  ];

  return (
    <div>
      <div style={{ textAlign: 'right', paddingRight: '10px' }}>
        <Button
          color="primary"
          onClick={() => {
            setOpen(true);
            getList();
          }}
          startIcon={<EventNoteOutlined />}
          size="small"
        >
          Action Log
        </Button>
      </div>

      <Drawer anchor="right" open={open} onClose={handleClose} className={classes.list}>
        <div>
          <div className={classes.headerStyle}>
            <Typography variant="h4">Action Log</Typography>
            <IconButton onClick={handleClose}>
              <CloseIcon style={{ color: '#fff' }} />
            </IconButton>
          </div>
          <div style={{ padding: '10px 20px' }}>
            <FormControl {...textFieldProps}>
              <Select
                style={{ width: '200px' }}
                value={params.type}
                onChange={(e) => {
                  const newParams = {
                    ...params,
                    pageIndex: 1,
                    type: e.target.value
                  };
                  setParams(newParams);
                  getList(newParams);
                }}
              >
                {selectList.map((item) => (
                  <MenuItem key={item.value} value={item.value}>
                    {item.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>
          <div className={classes.dataGrid}>
            <CommonDataGrid
              rows={rows}
              rowCount={total}
              loading={loading}
              columns={columns}
              page={params.pageIndex}
              pageSize={params.pageSize}
              onPageChange={onPageChange}
              paginationMode="server"
              sortingMode="server"
              rowHeight={25}
              rowsPerPageOptions={[20, 50, 100]}
              onPageSizeChange={onPageSizeChange}
              getRowClassName={(params) => {
                const { row } = params;
                return row.tableIndex % 2 === 0 ? 'my-table-active-color' : '';
              }}
            />
          </div>
        </div>
      </Drawer>
    </div>
  );
};
export default memo(ActionLog);
