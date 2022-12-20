import React, { useEffect, useState } from 'react';

import { Grid } from '@material-ui/core';

import { CommonTable, SearchBar, TablePagination, HAPaper } from '../../../../../components';
import API from '../../../../../api/expiry';
import tenantApi from '../../../../../api/tenant';
import { L } from '../../../../../utils/lang';
import formatDateTime from '../../../../../utils/formatDateTime';

const tableName = L('List');

function List(props) {
  const { path } = props;

  const [tenant, setTenant] = useState('');
  // const [ user, setUser ] = useState('')
  const [expiryDate, setExpiryDate] = useState('');
  const [createdAt, setCreatedAt] = useState('');
  const [updatedAt, setUpdateAt] = useState('');
  const [query, setQuery] = useState({});
  const [rows, setRows] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [total, setTotal] = useState(0);
  const [tenantList, setTenantList] = useState([]);
  // const [ userList, setUserList ] = useState([])

  // 获取 tenantList、 groupList、roleList 和 userList
  useEffect(() => {
    tenantApi.list({ limit: 999, page: 1 }).then(({ data }) => {
      if (data && data.data) {
        const { rows } = data.data;
        setTenantList(rows);
      }
    });

    // userApi.list({ limit: 999, page: 1 }).then(({ data }) => {
    //   if (data && data.data) {
    //     const { rows } = data.data
    //     setUserList(rows)
    //   }
    // })
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
        tenant: el?.tenant?.name || '',
        expiryDate: el.expiryDate ? formatDateTime(el.expiryDate, 'DD-MMM-YYYY') : '',
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
    { id: 'expiryDate', alignment: 'left', label: L('Expiry Date') },
    { id: 'createdAt', alignment: 'left', label: L('Created At') },
    { id: 'updatedAt', alignment: 'left', label: L('Updated At') },
    { id: 'action', alignment: 'left', label: L('Actions') }
  ];

  // 每行显示的字段
  const fieldList = [
    { field: 'tenant', align: 'left' },
    { field: 'expiryDate', align: 'left' },
    { field: 'createdAt', align: 'left' },
    { field: 'updatedAt', align: 'left' }
  ];

  const searchBarFieldList = [
    {
      id: 'tenant',
      label: L('Tenant'),
      type: 'text',
      disabled: false,
      value: tenant,
      isSelector: true,
      itemList: tenantList,
      labelField: 'name',
      valueField: 'id'
    },
    {
      id: 'expiryDate',
      label: L('Expiry Date'),
      type: 'dateRange',
      disabled: false,
      readOnly: false,
      value: expiryDate
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
    setTenant('');
    // setUser('')
    setExpiryDate('');
    setCreatedAt('');
    setUpdateAt('');
    setQuery({
      tenantId: '',
      // userId: '',
      expiryDate: '',
      createdAt: '',
      updatedAt: ''
    });
  };

  const handleSearch = () => {
    setQuery({
      tenantId: tenant,
      // userId: user,
      expiryDate,
      createdAt,
      updatedAt
    });
  };

  const handleFieldChange = (e, id) => {
    const { value } = e.target;
    switch (id) {
      case 'tenant':
        setTenant(value);
        break;
      // case "user":
      //   setUser(value)
      //   break
      case 'expiryDate':
        setExpiryDate(value);
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
          <HAPaper>
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
          </HAPaper>
        </Grid>
      </Grid>
    </>
  );
}

export default List;
