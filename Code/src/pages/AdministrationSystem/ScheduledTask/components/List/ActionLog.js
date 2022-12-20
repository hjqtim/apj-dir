import React, { memo, useEffect, useState } from 'react';
import dayjs from 'dayjs';
import { CommonDataGrid, CommonDialog } from '../../../../../components';

import API from '../../../../../api/timer';

const ActionLog = (props) => {
  const { actionLogObj, setActionLogObj } = props;
  const [open, setOpen] = useState(false);
  const [rows, setRows] = useState([]);
  const [total, setTotal] = useState(0);
  const defaultValue = {
    pageNo: 1,
    pageSize: 10
  };
  const [params, setParams] = useState(defaultValue);
  const [loading, setLoading] = useState(false);

  const queryData = () => {
    setLoading(true);
    API.getLogList({ ...actionLogObj, ...params })
      .then((res) => {
        setRows(res?.data?.msg?.records || []);
        setTotal(res?.data?.msg?.total || 0);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    if (actionLogObj?.jobName) {
      queryData();
      setOpen(true);
    }
  }, [actionLogObj, params]);

  const handleClose = () => {
    setOpen(false);
    setActionLogObj({});
    setParams(defaultValue);

    setTimeout(() => {
      setRows([]);
      setTotal(0);
    }, 200);
  };

  const columns = [
    {
      field: 'jobName',
      headerName: 'Job Name',
      flex: 1
    },
    {
      field: 'execNum',
      headerName: 'Order',
      flex: 1,
      valueFormatter: ({ row }) => Number(row.execNum) + 1
    },
    {
      field: 'createTime',
      headerName: 'Time',
      flex: 1,
      valueFormatter: ({ value }) => (value ? dayjs(value).format('DD-MMM-YYYY HH:mm:ss') : '')
    },
    {
      field: 'successState',
      headerName: 'State',
      flex: 1,
      valueFormatter: ({ row }) => {
        if (row.successState === 0) {
          return 'Successful';
        }
        return 'Failing';
      }
    }
  ];

  const onPageSizeChange = (pageSize) => {
    const newParams = {
      ...params,
      pageNo: 1,
      pageSize: Number(pageSize)
    };
    setParams(newParams);
  };

  const onPageChange = (pageIndex) => {
    const newParams = {
      ...params,
      pageNo: pageIndex
    };
    setParams(newParams);
  };

  return (
    <>
      <CommonDialog
        title="Action Log"
        content={
          <div style={{ padding: '40px' }}>
            <CommonDataGrid
              rows={rows}
              rowCount={total}
              columns={columns}
              loading={loading}
              paginationMode="server"
              page={params.pageNo}
              pageSize={params.pageSize}
              onPageSizeChange={onPageSizeChange}
              disableSelectionOnClick
              onPageChange={onPageChange}
              rowsPerPageOptions={[10, 20, 50]}
            />
          </div>
        }
        open={open}
        maxWidth="md"
        handleClose={handleClose}
        isHideFooter={false}
        isHideSubmit
      />
    </>
  );
};

export default memo(ActionLog);
