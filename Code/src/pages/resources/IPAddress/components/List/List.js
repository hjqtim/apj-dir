import React, { useState, useEffect } from 'react';
import { Grid } from '@material-ui/core';
import API from '../../../../../api/IPAssignment';
import { CommonTable, SearchBar, TablePagination, HAPaper } from '../../../../../components';
import formatDateTime from '../../../../../utils/formatDateTime';
import DCAPI from '../../../../../api/dc';
import { L } from '../../../../../utils/lang';
// import envUrl from '../../../../../utils/baseUrl'

const tableName = L('List');

function List(props) {
  const { path } = props;

  const [rows, setRows] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [total, setTotal] = useState(0);
  const [query, setQuery] = useState({});
  const [IP, setIp] = useState('');
  const [DCId, setDCId] = useState(null);
  const [hostname, setHostname] = useState('');
  const [projectTeam, setProjectTeam] = useState('');
  const [dcList, setDcList] = useState([]);

  // 获取 DC list
  useEffect(() => {
    DCAPI.list().then(({ data }) => {
      setDcList(data.data);
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

    rawDataList &&
      rawDataList.forEach((el) => {
        const rowModel = {
          id: el.id,
          ip: el.IP,
          dc: el.DC ? el.DC.name : '',
          hostname: el.hostname,
          projectTeam: el.projectTeam,
          networkType: el.networkType,
          ipPool: el.IPPool,
          assignedDate: el.assignedDate ? formatDateTime(el.assignedDate) : ''
        };
        rows.push(rowModel);
      });
    setRows(rows);
  };

  // 表头字段列表
  const headCells = [
    { id: 'ip', alignment: 'left', label: L('IP') },
    { id: 'dc', alignment: 'left', label: L('DC') },
    { id: 'hostname', alignment: 'left', label: L('Hostname') },
    { id: 'projectTeam', alignment: 'left', label: L('Project Team') },
    { id: 'networkType', alignment: 'left', label: L('Network Type') },
    { id: 'ipPool', alignment: 'left', label: L('IP Pool') },
    { id: 'assignedDate', alignment: 'left', label: L('Assigned Date') },
    { id: 'action', alignment: 'left', label: L('Actions') }
  ];

  // 每行显示的字段
  const fieldList = [
    { field: 'ip', align: 'left' },
    { field: 'dc', align: 'left' },
    { field: 'hostname', align: 'left' },
    { field: 'projectTeam', align: 'left' },
    { field: 'networkType', align: 'left' },
    { field: 'ipPool', align: 'left' },
    { field: 'assignedDate', align: 'left' }
  ];

  // 搜索栏字段列表
  const searchBarFieldList = [
    {
      id: 'ip',
      label: L('IP'),
      type: 'text',
      disabled: false,
      readOnly: false,
      value: IP
    },
    {
      id: 'dc',
      label: L('DC'),
      type: 'text',
      disabled: false,
      readOnly: false,
      value: DCId,
      isSelector: true,
      itemList: dcList,
      labelField: 'name',
      valueField: 'id'
    },
    {
      id: 'hostname',
      label: L('Hostname'),
      type: 'text',
      disabled: false,
      readOnly: false,
      value: hostname
    },
    {
      id: 'projectTeam',
      label: L('Project Team'),
      type: 'text',
      disabled: false,
      readOnly: false,
      value: projectTeam
    }
  ];

  const handleChangePage = (_, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSearch = () => {
    setQuery({
      IP,
      DCId,
      hostname,
      projectTeam
    });
  };

  const handleFieldChange = (e, id) => {
    const { value } = e.target;
    switch (id) {
      case 'ip':
        setIp(value);
        break;
      case 'dc':
        setDCId(value);
        break;
      case 'hostname':
        setHostname(value);
        break;
      case 'projectTeam':
        setProjectTeam(value);
        break;
      default:
        break;
    }
  };

  const handleClear = () => {
    setIp('');
    setDCId(null);
    setHostname('');
    setProjectTeam('');
    setQuery({
      IP: '',
      DCId: null,
      hostname: '',
      projectTeam: ''
    });
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
