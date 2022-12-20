import React, { useState, useEffect, useMemo } from 'react';
import { useHistory } from 'react-router-dom';
import { Tooltip, IconButton } from '@material-ui/core';
import dayjs from 'dayjs';
import { stringify, parse } from 'qs';
import HeadForm from './HeadForm';
import { HAPaper, WarningDialog, CommonDataGrid } from '../../../../../components';
import getIcons from '../../../../../utils/getIcons';
import webdpAPI from '../../../../../api/webdp/webdp';
import dataGridTooltip from '../../../../../utils/dataGridTooltip';

const List = () => {
  const history = useHistory();

  const urlObj = parse(history.location.search?.replace('?', '')) || {}; // 根据url获取默认请求参数
  const [params, setParams] = useState({
    page: urlObj.page ? parseInt(urlObj.page) : 1,
    pageSize: urlObj.pageSize ? parseInt(urlObj.pageSize) : 10,
    requestNo: urlObj.requestNo || '',
    hospital: urlObj.hospital || '',
    status: urlObj.status || 'All',
    staff: urlObj.staff || ''
  });
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleDetail = (row) => {
    history.push(`detail/${row.reqNo}`);
  };

  const getList = () => {
    setLoading(true);
    webdpAPI
      .getOrderSummary()
      .then((res) => {
        const list = res?.data?.data?.orderSummaryList || [];
        const value = list.map((item) => {
          let due = '';
          if (
            item.status?.toLocaleLowerCase()?.includes('completed') &&
            item.instDateTo &&
            item.jobCompletionDate
          ) {
            due = dayjs(item.instDateTo).diff(item.jobCompletionDate, 'day');
          } else if (item.instDateTo) {
            due = dayjs(item.instDateTo).diff(dayjs().format('YYYY-MM-DD'), 'day');
          }

          const newItem = { ...item, id: item.reqNo, due };
          return newItem;
        });
        setRows(value);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    getList();
  }, []);

  const saveParamsToUrl = () => {
    const urlParams = {
      page: params.page,
      pageSize: params.pageSize,
      requestNo: params.requestNo || '',
      hospital: params.hospital || '',
      status: params.status || '',
      staff: params.staff || ''
    };
    const url = `?${stringify(urlParams)}`;
    history.push(url);
  };

  useEffect(() => {
    saveParamsToUrl();
  }, [params]);

  const columns = [
    { field: 'reqNo', headerName: 'Req. No', minWidth: 130 },
    { field: 'expenditureFY', headerName: 'FY' },
    { field: 'reqHospital', headerName: 'Institution', minWidth: 120, renderCell: dataGridTooltip },
    {
      field: 'description',
      headerName: 'Description',
      minWidth: 130,
      renderCell: dataGridTooltip
    },
    { field: 'totalExpense', headerName: 'Total Exp.', minWidth: 120 },
    {
      field: 'due',
      headerName: 'Due',
      type: 'number',
      align: 'left',
      headerAlign: 'left',
      renderCell: ({ row }) => {
        const { due } = row;
        if (due === '') {
          return '';
        }
        return <span style={{ color: due < 0 ? 'red' : '' }}>{due}</span>;
      }
    },
    { field: 'status', headerName: 'Status', minWidth: 120 },
    { field: 'prCode', headerName: 'PR Code', minWidth: 120 },
    { field: 'vendor', headerName: 'Vendor', minWidth: 120, renderCell: dataGridTooltip },
    {
      field: 'jobCompletionDate',
      headerName: 'Inst. Comp.',
      minWidth: 130,
      renderCell: dataGridTooltip
    },
    { field: 'invoiceRecdDate', headerName: 'OC/DN Date', minWidth: 140 },
    { field: 'lanpoolOrder', headerName: 'LP' },
    {
      field: 'connectMedicalNet2HANet',
      headerName: 'MNI',
      renderCell: ({ row }) => {
        if (row.connectMedicalNet2HANet === 1) {
          return 'Yes';
        }
        return 'No';
      }
    },
    { field: 'respStaff', headerName: 'Resp Staff', minWidth: 130 },
    {
      field: 'action',
      headerName: 'Actions',
      minWidth: 130,
      renderCell: ({ row }) => (
        <Tooltip title="Detail" placement="top">
          <IconButton onClick={() => handleDetail(row)}>{getIcons('detaiEyeIcon')}</IconButton>
        </Tooltip>
      )
    }
  ];

  const onPageSizeChange = (pageSize) => {
    const newParams = {
      ...params,
      page: 1,
      pageSize: Number(pageSize)
    };
    setParams(newParams);
  };

  const onPageChange = (page) => {
    const newParams = {
      ...params,
      page
    };
    setParams(newParams);
  };

  const filterReqNo = (item = {}) => {
    if (item.reqNo?.includes?.(params.requestNo)) {
      return true;
    }
    return false;
  };

  const filterHospital = (item = {}) => {
    if (!params.hospital || item.reqHospital === params.hospital) {
      return true;
    }
    return false;
  };

  const filterStaff = (item = {}) => {
    if (!params.staff || item.respStaff?.includes?.(params.staff)) {
      return true;
    }
    return false;
  };

  const filterStatus = (item = {}) => {
    if (params.status === 'All') {
      return true;
    }
    if (params.status === 'Cancelled' && item.status?.toLocaleLowerCase()?.includes('cancelled')) {
      return true;
    }
    if (params.status === 'Completed' && item.status?.toLocaleLowerCase()?.includes('completed')) {
      return true;
    }
    if (
      params.status === 'In Progress' &&
      !item.status?.toLocaleLowerCase()?.includes('completed') &&
      !item.status?.toLocaleLowerCase()?.includes('cancelled')
    ) {
      return true;
    }
    return false;
  };

  const filterData = useMemo(() => {
    const newRows = rows.filter(
      (item) => filterReqNo(item) && filterHospital(item) && filterStaff(item) && filterStatus(item)
    );
    return newRows;
  }, [params.requestNo, params.hospital, params.status, params.staff, rows]);

  return (
    <div>
      <HeadForm params={params} setParams={setParams} />
      <br />
      <HAPaper>
        <br />
        <CommonDataGrid
          columns={columns}
          rows={filterData}
          onPageSizeChange={onPageSizeChange}
          loading={loading}
          pageSize={params.pageSize}
          page={params.page}
          onPageChange={onPageChange}
        />
      </HAPaper>
    </div>
  );
};

export default List;
