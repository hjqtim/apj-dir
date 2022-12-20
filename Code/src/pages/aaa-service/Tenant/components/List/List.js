import React, { useEffect, useState } from 'react';
import { Grid } from '@material-ui/core';
import { SearchBar, CommonTable, TablePagination, HAPaper } from '../../../../../components';
import API from '../../../../../api/tenant';
import adGroupApi from '../../../../../api/adGroup';
import formatDateTime from '../../../../../utils/formatDateTime';
import { L } from '../../../../../utils/lang';

const tableName = 'Tenant List';

function List(props) {
  const { path } = props;

  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [managerGroupId, setManagerGroupId] = useState('');
  const [supporterGroupId, setSupporterGroupId] = useState('');
  const [createdAt, setCreatedAt] = useState({});
  const [updatedAt, setUpdateAt] = useState({});
  const [query, setQuery] = useState({});
  const [rows, setRows] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [total, setTotal] = useState(0);
  const [groupList, setGroupList] = useState([]);

  // 获取 groupList
  useEffect(() => {
    adGroupApi.list({ limit: 999, page: 1 }).then(({ data }) => {
      if (data && data.data) {
        const { rows } = data.data;
        setGroupList(rows);
      }
    });
  }, []);

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
        code: el.code,
        managerGroupId: el.manager_group ? el.manager_group.name : '',
        supporterGroupId: el.supporter_group ? el.supporter_group.name : '',
        createdAt: formatDateTime(el.createdAt),
        updatedAt: formatDateTime(el.updatedAt)
      };
      rows.push(rowModel);
    });
    setRows(rows);
  };

  // 表头字段列表
  const headCells = [
    { id: 'code', alignment: 'left', label: L('Code') },
    { id: 'name', alignment: 'left', label: L('Name') },
    { id: 'managerGroupId', alignment: 'left', label: L('Manager Group') },
    { id: 'supporterGroupId', alignment: 'left', label: L('Supporter Group') },
    { id: 'createdAt', alignment: 'left', label: L('Created At') },
    { id: 'updatedAt', alignment: 'left', label: L('Updated At') },
    { id: 'action', alignment: 'left', label: L('Actions') }
  ];

  // 每行显示的字段
  const fieldList = [
    { field: 'code', align: 'left' },
    { field: 'name', align: 'left' },
    { field: 'managerGroupId', align: 'left' },
    { field: 'supporterGroupId', align: 'left' },
    { field: 'createdAt', align: 'left' },
    { field: 'updatedAt', align: 'left' }
  ];

  // 搜索栏字段列表
  const searchBarFieldList = [
    {
      id: 'code',
      label: L('Code'),
      type: 'text',
      disabled: false,
      readOnly: false,
      value: code
    },
    {
      id: 'name',
      label: L('Name'),
      type: 'text',
      disabled: false,
      readOnly: false,
      value: name
    },
    {
      id: 'managerGroupId',
      label: L('Manager Group'),
      type: 'text',
      disabled: false,
      value: managerGroupId,
      isSelector: true,
      itemList: groupList,
      labelField: 'name',
      valueField: 'id'
    },
    {
      id: 'supporterGroupId',
      label: L('Supporter Group'),
      type: 'text',
      disabled: false,
      value: supporterGroupId,
      isSelector: true,
      itemList: groupList,
      labelField: 'name',
      valueField: 'id'
    },
    {
      id: 'createdAt',
      label: L('Created At'),
      type: 'dateRange',
      startMaxDate: createdAt?.endDate,
      endMinDate: createdAt?.startDate,
      disabled: false,
      readOnly: false,
      value: createdAt
    },
    {
      id: 'updatedAt',
      label: L('Updated At'),
      type: 'dateRange',
      startMaxDate: updatedAt?.endDate,
      endMinDate: updatedAt?.startDate,
      disabled: false,
      readOnly: false,
      value: updatedAt
    }
  ];

  const handleClear = () => {
    setName('');
    setCode('');
    setManagerGroupId('');
    setSupporterGroupId('');
    setCreatedAt('');
    setUpdateAt('');
    setQuery({
      name: '',
      code: '',
      managerGroupId: '',
      supporterGroupId: '',
      createdAt: '',
      updatedAt: ''
    });
  };

  const handleSearch = () => {
    setQuery({
      name,
      code,
      manager_group_id: managerGroupId,
      supporter_group_id: supporterGroupId,
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
      case 'code':
        setCode(value);
        break;
      case 'managerGroupId':
        setManagerGroupId(value);
        break;
      case 'supporterGroupId':
        setSupporterGroupId(value);
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
              // hideCheckBox={true}
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
