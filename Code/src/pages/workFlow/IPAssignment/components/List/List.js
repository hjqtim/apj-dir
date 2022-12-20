import React, { useState, useEffect } from 'react';
import { Grid, TablePagination, Paper as MuiPaper } from '@material-ui/core';
import styled from 'styled-components';
import { spacing } from '@material-ui/system';
import API from '../../../../../api/IPAssignment.js';
import { CommonTable } from '../../../../../components';
// import envUrl from '../../../../../utils/baseUrl'
import { L } from '../../untils/lang';
import Loading from '../../../../../components/Loading';

const Paper = styled(MuiPaper)(spacing);
const tableName = 'IP Address';

function List(props) {
  const { path } = props;

  const [rows, setRows] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    Loading.show();
    API.list({ limit: rowsPerPage, page: page + 1 })
      .then(({ data }) => {
        setTotal(data.total);
        handleData(data.list);
      })
      .finally(() => Loading.hide())
      .catch((e) => {
        console.log(e);
        Loading.hide();
      });
  }, [page, rowsPerPage]);

  const handleData = (rawDataList) => {
    const rows = [];
    rawDataList.forEach((el) => {
      const rowModel = {
        id: el.id,
        ip: el.ip,
        dc: el.dc,
        hostname: el.hostname,
        projectTeam: el.projectTeam,
        networkType: el.networkType,
        assignedDate: el.assignedDate
      };
      rows.push(rowModel);
    });
    setRows(rows);
  };

  // 表头字段列表
  const headCells = [
    { id: 'ip', alignment: 'center', label: L('IP') },
    { id: 'dc', alignment: 'center', label: L('DC') },
    { id: 'hostname', alignment: 'center', label: L('Hostname') },
    { id: 'projectTeam', alignment: 'center', label: L('Project Team') },
    { id: 'networkType', alignment: 'center', label: L('Network Type') },
    { id: 'assignedDate', alignment: 'center', label: L('Assigned Date') },
    { id: 'action', alignment: 'right', label: L('Actions') }
  ];

  // 每行显示的字段
  const fieldList = [
    { field: 'ip', align: 'center' },
    { field: 'dc', align: 'center' },
    { field: 'hostname', align: 'center' },
    { field: 'projectTeam', align: 'center' },
    { field: 'networkType', align: 'center' },
    { field: 'assignedDate', align: 'center' }
  ];

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
          <Paper>
            <CommonTable
              rows={rows}
              tableName={tableName}
              deleteAPI={API.deleteMany}
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
