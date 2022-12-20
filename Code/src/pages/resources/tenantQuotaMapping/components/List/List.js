import React, { useEffect, useState } from 'react';

import { Grid, TablePagination, Paper as MuiPaper } from '@material-ui/core';

import styled from 'styled-components';
import { spacing } from '@material-ui/system';
import { CommonTable, SearchBar } from '../../../../../components';
import API from '../../../../../api/tenantQuotaMapping';
import tenantApi from '../../../../../api/tenant';
import { L } from '../../../../../utils/lang';
import formatDateTime from '../../../../../utils/formatDateTime';

const Paper = styled(MuiPaper)(spacing);

const tableName = L('List');

function List(props) {
  const { path } = props;

  const [tenantId, setTenantId] = useState('');
  const [type, setType] = useState('');
  const [year, setYear] = useState('');
  const [createdAt, setCreatedAt] = useState('');
  const [updatedAt, setUpdateAt] = useState('');
  const [query, setQuery] = useState({});
  const [rows, setRows] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [total, setTotal] = useState(0);
  const [tenantList, setTenantList] = useState([]);

  // 获取 tenantList
  useEffect(() => {
    tenantApi.list({ limit: 999, page: 1 }).then(({ data }) => {
      if (data && data.data) {
        const { rows } = data.data;
        setTenantList(rows);
      }
    });
  }, []);

  useEffect(() => {
    API.list({ ...query, limit: rowsPerPage, page: page + 1 }).then((response) => {
      setTotal(response.data.data.count);
      handleData(response.data.data.rows);
    });
  }, [page, rowsPerPage, query]);

  const handleData = (rawDataList) => {
    const rows = [];
    rawDataList.forEach((el) => {
      const rowModel = {
        id: el.id,
        tenant: el.tenant ? el.tenant.name : '',
        type: el.type,
        quota: el.quota,
        currentQuota: el.currentQuota,
        year: el.year,
        createdAt: formatDateTime(el.createdAt),
        updatedAt: formatDateTime(el.updatedAt)
      };
      rows.push(rowModel);
    });
    setRows(rows);
  };

  // 表头字段列表
  const headCells = [
    { id: 'tenant', alignment: 'left', label: L('Tenant') },
    { id: 'type', alignment: 'left', label: L('Type') },
    { id: 'quota', alignment: 'left', label: L('Quota') },
    { id: 'currentQuota', alignment: 'left', label: L('CurrentQuota') },
    { id: 'year', alignment: 'left', label: L('Year') },
    { id: 'createdAt', alignment: 'left', label: L('Created At') },
    { id: 'updatedAt', alignment: 'left', label: L('Updated At') },
    { id: 'action', alignment: 'left', label: L('Actions') }
  ];

  // 每行显示的字段
  const fieldList = [
    { field: 'tenant', align: 'left' },
    { field: 'type', align: 'left' },
    { field: 'quota', align: 'left' },
    { field: 'currentQuota', align: 'left' },
    { field: 'year', align: 'left' },
    { field: 'createdAt', align: 'left' },
    { field: 'updatedAt', align: 'left' }
  ];

  const searchBarFieldList = [
    {
      id: 'tenant',
      label: L('Tenant'),
      type: 'text',
      disabled: false,
      value: tenantId,
      isSelector: true,
      itemList: tenantList,
      labelField: 'name',
      valueField: 'id'
    },
    {
      id: 'type',
      label: L('Type'),
      type: 'text',
      disabled: false,
      value: type
    },
    {
      id: 'year',
      label: L('Year'),
      type: 'date',
      disabled: false,
      value: year,
      views: ['year']
    },
    {
      id: 'createdAt',
      label: L('Created At'),
      type: 'dateRange',
      disabled: false,
      readOnly: false,
      value: createdAt
    },
    {
      id: 'updatedAt',
      label: L('Updated At'),
      type: 'dateRange',
      disabled: false,
      readOnly: false,
      value: updatedAt
    }
  ];

  const handleClear = () => {
    setTenantId('');
    setType('');
    setYear('');
    setCreatedAt('');
    setUpdateAt('');
    setQuery({
      tenantId: '',
      type: '',
      year: '',
      createdAt: '',
      updatedAt: ''
    });
  };

  const handleSearch = () => {
    setQuery({
      tenantId,
      type,
      year: year ? formatDateTime(year, 'YYYY') : '',
      createdAt,
      updatedAt
    });
  };

  const handleFieldChange = (e, id) => {
    const { value } = e.target;
    switch (id) {
      case 'tenant':
        setTenantId(value);
        break;
      case 'type':
        setType(value);
        break;
      case 'year':
        setYear(value);
        break;
      case 'createdAt':
        setCreatedAt(value);
        break;
      case 'updatedAt':
        setUpdateAt(value);
        break;
      default:
        break;
    }
  };

  const handleChangePage = (_, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <>
      <Grid container spacing={6}>
        <Grid item xs={12}>
          <SearchBar
            onSearchFieldChange={handleFieldChange}
            onSearchButton={handleSearch}
            onClearButton={handleClear}
            fieldList={searchBarFieldList}
          />
          <Paper>
            <CommonTable
              rows={rows}
              tableName={tableName}
              deleteAPI={API.deleteMany}
              handleSearch={handleSearch}
              path={path}
              headCells={headCells}
              fieldList={fieldList}
            />
            <TablePagination
              rowsPerPageOptions={[10, 50, 100]}
              component="div"
              count={total}
              rowsPerPage={rowsPerPage}
              page={page}
              onChangePage={handleChangePage}
              onChangeRowsPerPage={handleChangeRowsPerPage}
            />
          </Paper>
        </Grid>
      </Grid>
    </>
  );
}

export default List;
