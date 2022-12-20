import React, { useEffect, useState } from 'react';
import { Grid } from '@material-ui/core';
import API from '../../../../../api/adGroup';
import { SearchBar, CommonTable, TablePagination, HAPaper } from '../../../../../components';
import { L } from '../../../../../utils/lang';
import formatDateTime from '../../../../../utils/formatDateTime';

const tableName = L('List');

function List(props) {
  const { path } = props;

  const [name, setName] = useState('');
  const [createdAt, setCreatedAt] = useState('');
  const [updatedAt, setUpdateAt] = useState('');
  const [query, setQuery] = useState({});
  const [rows, setRows] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    API.list({ ...query, limit: rowsPerPage, page: page + 1 }).then(({ data }) => {
      setTotal(data.data.count);
      handleData(data.data.rows);
    });
  }, [page, rowsPerPage, query]);

  const handleData = (rawDataList) => {
    const rows = [];
    rawDataList.forEach((el) => {
      const rowModel = {
        id: el.id,
        name: el.name,
        createdAt: formatDateTime(el.createdAt),
        updatedAt: formatDateTime(el.updatedAt)
      };
      rows.push(rowModel);
    });
    setRows(rows);
  };

  // 表头字段列表
  const headCells = [
    { id: 'name', alignment: 'left', label: L('Name') },
    { id: 'createdAt', alignment: 'left', label: L('Created At') },
    { id: 'updatedAt', alignment: 'left', label: L('Updated At') },
    { id: 'action', alignment: 'left', label: L('Actions') }
  ];

  // 每行显示的字段
  const fieldList = [
    { field: 'name', align: 'left' },
    { field: 'createdAt', align: 'left' },
    { field: 'updatedAt', align: 'left' }
  ];

  // 搜索栏字段列表
  const searchBarFieldList = [
    {
      id: 'name',
      label: L('Name'),
      type: 'text',
      disabled: false,
      readOnly: false,
      value: name
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
    setName('');
    setCreatedAt('');
    setUpdateAt('');
    setQuery({
      name: '',
      createdAt: '',
      updatedAt: ''
    });
  };

  const handleSearch = () => {
    setQuery({
      name,
      createdAt,
      updatedAt
    });
  };

  const handleFieldChange = (e, id) => {
    const { value } = e.target;
    switch (id) {
      case 'name':
        setName(value);
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
