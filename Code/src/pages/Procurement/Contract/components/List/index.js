import dayjs from 'dayjs';
import { parse, stringify } from 'qs';
import { useHistory } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import { IconButton, Grid, Tooltip, makeStyles, Button } from '@material-ui/core';
import { useGlobalStyles } from '../../../../../style';
import { HAPaper, CommonDataGrid, WarningDialog, CommonTip } from '../../../../../components';
import getIcons from '../../../../../utils/getIcons';
import HeadForm from './HeadForm';
import API from '../../../../../api/webdp/webdp';

const useStyles = makeStyles((theme) => ({
  addBtn: {
    display: 'flex',
    paddingBottom: theme.spacing(5),
    justifyContent: 'flex-end'
  }
}));

export default function List() {
  const classes = useStyles();
  const history = useHistory();
  const [open, setOpen] = useState(false);
  const globalclasses = useGlobalStyles();
  const [rows, setRows] = useState([]);
  const [operateRow, setOperateRow] = useState({});
  const [loading, setLoading] = useState(false);
  const urlObj = parse(history.location.search?.replace('?', '')) || {};

  // const [total, setTotal] = React.useState(
  //   urlObj.pageIndex ? urlObj.pageIndex * urlObj.pageSize : 0
  // );
  const [params, setParams] = useState({
    pageIndex: parseInt(urlObj.pageIndex) || 1,
    pageSize: parseInt(urlObj.pageSize) || 10,
    contract: urlObj.contract || '',
    vendor: urlObj.vendor || '',
    startTime: urlObj?.startTime || '',
    endTime: urlObj?.endTime || ''
  });

  const columns = [
    {
      field: 'contract',
      headerName: 'Contract',
      flex: 1
    },
    {
      field: 'vendor',
      headerName: 'Vendor',
      flex: 1
    },
    {
      field: 'vendorCoordinator',
      headerName: 'Vendor Coordinator',
      flex: 1
    },
    {
      field: 'phone',
      headerName: 'Phone',
      flex: 1
    },
    {
      field: 'startTime',
      headerName: 'Start Time',
      valueFormatter: (param) => (param.value ? dayjs(param.value).format('DD-MMM-YYYY') : ''),
      flex: 1
    },
    {
      field: 'endTime',
      headerName: 'End Time',
      valueFormatter: (param) => (param.value ? dayjs(param.value).format('DD-MMM-YYYY') : ''),
      flex: 1
    },
    {
      field: 'actions',
      headerName: 'Actions',
      hide: false,
      width: 200,
      filterable: false,
      renderCell: ({ row }) => (
        <div>
          <Tooltip title="Detail">
            <IconButton onClick={() => history.push(`/Procurement/Contract/detail/${row.id}`)}>
              {getIcons('detaiEyeIcon')}
            </IconButton>
          </Tooltip>
          <Tooltip title="Edit">
            <IconButton onClick={() => history.push(`/Procurement/Contract/update/${row.id}`)}>
              {getIcons('edictIcon')}
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete">
            <IconButton
              onClick={() => {
                setOpen(true);
                setOperateRow(row);
              }}
            >
              {getIcons('delete')}
            </IconButton>
          </Tooltip>
        </div>
      )
    }
  ];

  useEffect(() => {
    getContractLists();
  }, []);

  const getContractLists = (param) => {
    if (!param) {
      param = {
        contract: urlObj?.contract || undefined,
        vendor: urlObj?.vendor || undefined,
        startTime: urlObj?.startTime || undefined,
        endTime: urlObj?.endTime || undefined
      };
    }
    setLoading(true);

    API.getProcurementContractList(param)
      .then((res) => {
        const resData = res?.data?.data || [];
        setRows(resData);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  // change pageSize
  const onPageSizeChange = (pageSize) => {
    const newParams = {
      ...params,
      pageIndex: 1,
      pageSize: Number(pageSize)
    };
    const url = `?${stringify(newParams)}`;
    history.push(url);
    setParams(newParams);
  };

  // change pageIndex
  const onPageChange = (pageIndex) => {
    const newParams = {
      ...params,
      pageIndex
    };
    const url = `?${stringify(newParams)}`;
    history.push(url);
    setParams(newParams);
  };

  const handleConfirm = () => {
    API.deleteContract(operateRow?.id || '').then((res) => {
      if (res?.data?.code === 200) {
        CommonTip.success('Success');
        setOpen(false);
        getContractLists();
      } else {
        CommonTip.error('System Busy');
      }
    });
  };

  return (
    <div className={globalclasses.pageStyle}>
      <div className={globalclasses.subTitle}>Contract</div>
      <Grid container spacing={6}>
        <Grid item xs={12}>
          <HeadForm params={params} setParams={setParams} getContractLists={getContractLists} />
          <br />
          <HAPaper style={{ padding: '20px' }}>
            <div className={classes.addBtn}>
              <Tooltip title="Create">
                <Button
                  variant="contained"
                  color="secondary"
                  size="small"
                  startIcon={getIcons('addIcon')}
                  onClick={() => {
                    history.push('/Procurement/Contract/create');
                  }}
                >
                  Add
                </Button>
              </Tooltip>
            </div>
            <CommonDataGrid
              rows={rows}
              // rowCount={total}
              columns={columns}
              loading={loading}
              // paginationMode="server"
              className={globalclasses.fixDatagrid}
              page={params.pageIndex}
              getRowId={(row) => row.id}
              pageSize={params.pageSize}
              onPageSizeChange={onPageSizeChange}
              disableSelectionOnClick
              onPageChange={onPageChange}
              rowsPerPageOptions={[10, 20, 50]}
            />
          </HAPaper>
        </Grid>
      </Grid>

      <WarningDialog
        open={open}
        handleConfirm={handleConfirm}
        handleClose={() => setOpen(false)}
        content="Whether to delete this contract ?"
      />
    </div>
  );
}
