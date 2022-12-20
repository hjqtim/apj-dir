import dayjs from 'dayjs';
import { parse, stringify } from 'qs';
import { useHistory } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import { IconButton, Grid, Tooltip, makeStyles, Button } from '@material-ui/core';
import { useGlobalStyles } from '../../../../../style';
import { HAPaper, CommonDataGrid, WarningDialog } from '../../../../../components';
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
    id: urlObj.id || '',
    itemtype: urlObj.itemtype || ''
  });

  const columns = [
    {
      field: 'id',
      headerName: 'Id',
      flex: 1
    },
    {
      field: 'packageName',
      headerName: 'PackageName',
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
      field: 'createdBy',
      headerName: 'CreatedBy',
      flex: 1
    },
    {
      field: 'lastUpdatedDate',
      headerName: 'LastUpdatedDate',
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
            <IconButton
              onClick={() => {
                history.push(`/Procurement/PackageList/detail/${row.id}`);
              }}
            >
              {getIcons('detaiEyeIcon')}
            </IconButton>
          </Tooltip>
          <Tooltip title="Edit">
            <IconButton
              onClick={() => {
                history.push(`/Procurement/PackageList/update/${row.id}`);
              }}
            >
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
    getPackageLists();
  }, []);

  const getPackageLists = (param) => {
    if (!param) {
      param = {
        id: urlObj?.id || undefined,
        itemtype: urlObj?.itemtype || undefined
      };
    }
    setLoading(true);

    API.getPackageList(param)
      .then((res) => {
        const resData = res?.data?.data?.networkDesignPackages || [];
        console.log(resData);
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
    // delete operateRow.createdBy;
    // delete operateRow.createdDate;
    // delete operateRow.endTime;
    // // delete operateRow.id;
    // delete operateRow.lastUpdatedBy;
    // delete operateRow.lastUpdatedDate;
    // delete operateRow.packageName;
    // delete operateRow.remarks;
    // delete operateRow.startTime;
    // delete operateRow.isDelete;
    // rows.splice(operateRow.id, 1);
    // const newRows = JSON.parse(JSON.stringify(rows));
    // newRows[item] = undefined;
    // setRows(newRows);
    // console.log(newRows);
    console.log(operateRow);
    console.log(rows);
    setOpen(false);
  };

  return (
    <div className={globalclasses.pageStyle}>
      <div className={globalclasses.subTitle}>Package</div>
      <Grid container spacing={6}>
        <Grid item xs={12}>
          <HeadForm params={params} setParams={setParams} getPackageLists={getPackageLists} />
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
                    history.push('/Procurement/PackageList/create');
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
