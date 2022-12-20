import React, { useEffect, useState } from 'react';
import { Grid } from '@material-ui/core';
import { L } from '../../../../../utils/lang';

import { CommonTable, SearchBar, TablePagination, HAPaper } from '../../../../../components';
import API from '../../../../../api/vm';
import formatDateTime from '../../../../../utils/formatDateTime';

const tableName = L('List');

function List(props) {
  const { path } = props;

  const [serialNumber, setSerialNumber] = useState('');
  const [createdAt, setCreatedAt] = useState('');
  const [updatedAt, setUpdateAt] = useState('');
  const [query, setQuery] = useState({});
  const [rows, setRows] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const queryData = {
      ...query,
      createdAt: {
        startDate: createdAt?.startDate ? new Date(createdAt?.startDate) : null,
        endDate: createdAt?.endDate ? new Date(createdAt?.endDate) : null
      },
      updatedAt: {
        startDate: updatedAt?.startDate ? new Date(updatedAt?.startDate) : null,
        endDate: updatedAt?.endDate ? new Date(updatedAt?.endDate) : null
      }
    };
    API.list({ ...queryData, limit: rowsPerPage, page: page + 1 }).then((response) => {
      setTotal(response.data.data.count);
      handleData(response.data.data.rows);
    });
  }, [page, rowsPerPage, query]);

  const handleData = (rawDataList) => {
    const rows = [];
    rawDataList.forEach((el) => {
      const rowModel = {
        id: el.id,
        serialNumber: el.serialNumber,
        hostname: el.hostname,
        OS: el.OS,
        VMClusterName: el.VMClusterName,
        tenant: el.tenant,
        createdAt: formatDateTime(el.createdAt),
        updatedAt: formatDateTime(el.updatedAt)
      };
      rows.push(rowModel);
    });
    setRows(rows);
  };

  // 表头字段列表
  const headCells = [
    { id: 'serialNumber', alignment: 'left', label: L('Serial Number') },
    { id: 'hostname', alignment: 'left', label: L('Hostname') },
    { id: 'OS', alignment: 'left', label: L('OS') },
    { id: 'VMClusterName', alignment: 'left', label: L('VM Cluster') },
    { id: 'tenant', alignment: 'left', label: L('Tenant') },
    { id: 'createdAt', alignment: 'left', label: L('Created At') },
    { id: 'updatedAt', alignment: 'left', label: L('Updated At') },
    { id: 'action', alignment: 'left', label: L('Actions') }
  ];

  // 每行显示的字段
  const fieldList = [
    { field: 'serialNumber', align: 'left' },
    { field: 'hostname', align: 'left' },
    { field: 'OS', align: 'left' },
    { field: 'VMClusterName', align: 'left' },
    { field: 'tenant', align: 'left' },
    { field: 'createdAt', align: 'left' },
    { field: 'updatedAt', align: 'left' }
  ];

  const searchBarFieldList = [
    {
      id: 'serialNumber',
      label: L('Serial Number'),
      type: 'text',
      disabled: false,
      readOnly: false,
      value: serialNumber
    },
    {
      id: 'createdAt',
      label: L('Created At'),
      type: 'dateRange',
      disabled: false,
      readOnly: false,
      value: createdAt,
      startMaxDate: createdAt?.endDate,
      endMinDate: createdAt.startDate
    },
    {
      id: 'updatedAt',
      label: L('Updated At'),
      type: 'dateRange',
      disabled: false,
      readOnly: false,
      value: updatedAt,
      startMaxDate: updatedAt?.endDate,
      endMinDate: updatedAt.startDate
    }
  ];

  const handleClear = () => {
    setSerialNumber('');
    setCreatedAt('');
    setUpdateAt('');
    setQuery({
      serialNumber: '',
      createdAt: '',
      updatedAt: ''
    });
  };

  const handleSearch = () => {
    setQuery({
      serialNumber,
      createdAt,
      updatedAt
    });
  };

  const handleFieldChange = (e, id) => {
    const { value } = e.target;
    switch (id) {
      case 'serialNumber':
        setSerialNumber(value);
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
              page="VM"
              rows={rows}
              showDownLoad
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
