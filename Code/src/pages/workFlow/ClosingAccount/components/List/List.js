import React, { useEffect, useState } from 'react';

import { Grid } from '@material-ui/core';

import { useHistory } from 'react-router-dom';
import PlayCircleFilledWhiteOutlinedIcon from '@material-ui/icons/PlayCircleFilledWhiteOutlined';
import { CommonTable, TablePagination, HAPaper } from '../../../../../components';
import API from '../../../../../api/workFlow';
import formatDateTime from '../../../../../utils/formatDateTime';
import { L } from '../../../../../utils/lang';
import Loading from '../../../../../components/Loading';

const tableName = 'List';

function List(props) {
  const { path } = props;
  const history = useHistory();
  const [rows, setRows] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    Loading.show();
    API.getProcessList({
      name: 'Closing Account',
      limit: rowsPerPage,
      page: page + 1
    })
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
    rawDataList &&
      rawDataList.forEach((el) => {
        const rowModel = {
          id: el.id,
          deploymentId: el.deploymentId,
          version: el.version,
          workflowName: el.name,
          deployTime: formatDateTime(el.deployTime)
        };
        rows.push(rowModel);
      });
    setRows(rows);
  };

  // 表头字段列表
  const headCells = [
    // { id: 'id', alignment: 'center', label: L('Id') },
    { id: 'workflowName', alignment: 'left', label: L('Workflow name') },
    { id: 'deploymentId', alignment: 'left', label: L('Deployment Id') },
    { id: 'version', alignment: 'left', label: L('Version') },
    { id: 'deployTime', alignment: 'left', label: L('Deploy Time') },
    { id: 'action', alignment: 'left', label: L('Action') }
  ];

  // 每行显示的字段
  const fieldList = [
    // { field: 'id', align: 'center' },
    { field: 'workflowName', align: 'left' },
    { field: 'deploymentId', align: 'left' },
    { field: 'version', align: 'left' },
    { field: 'deployTime', align: 'left' }
  ];

  const handleRunClick = (e, row) => {
    history.push({
      pathname: `${path}/create/${row.id}`,
      search: `deploymentId=${row.deploymentId}`
    });
    // Loading.show()
    // const groupList = getUser().groupList
    // const userId = getUser().id.toString()
    // const data = {
    //     processDefinitionId : row.id,
    //     variables : { manager_group_id : groupList },
    //     startUser : userId
    // }
    // API.startProcess(data).then(() => {
    //     CommonTip.success("Success")
    //     Loading.hide()
    // })
  };

  // 自定义action
  const actionList = [
    {
      label: 'run',
      icon: <PlayCircleFilledWhiteOutlinedIcon fontSize="small" style={{ color: '#2553F4' }} />,
      handleClick: handleRunClick
    }
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
          <HAPaper>
            <CommonTable
              rows={rows}
              tableName={tableName}
              deleteAPI={API.deleteMany}
              hideUpdate
              hideDetail
              hideImage={false}
              path={path}
              hideCheckBox
              headCells={headCells}
              fieldList={fieldList}
              actionList={actionList}
              hideCreate
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
