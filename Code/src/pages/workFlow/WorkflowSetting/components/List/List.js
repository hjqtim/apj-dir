import React, { useState, useEffect } from 'react';
import { Grid } from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import {
  EventAvailable as EventAvailableIcon,
  BorderColorOutlined as BorderColorIcon,
  Settings as SettingsIcon
} from '@material-ui/icons';
import API from '../../../../../api/workFlow';
import { CommonTable, TablePagination, HAPaper } from '../../../../../components';
import { ACTIVITI_HOST } from '../../../../../utils/constant';
import prefix from '../../../../../utils/prefix';
import CommonTip from '../../../../../components/CommonTip';
import Loading from '../../../../../components/Loading';
import { L } from '../../../../../utils/lang';

const createPrefix = prefix.workflow;
const tableName = L('List');

function List(props) {
  const { path } = props;
  const history = useHistory();
  const [rows, setRows] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    Loading.show();
    API.getProcessDefinitions({ limit: rowsPerPage, page: page + 1 })
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
          version: el.version,
          name: el.name,
          deploymentId: el.deploymentId,
          deploymentUrl: el.deploymentUrl
        };
        rows.push(rowModel);
      });
    setRows(rows);
  };

  // 表头字段列表
  const headCells = [
    { id: 'name', alignment: 'left', label: L('Name') },
    { id: 'id', alignment: 'left', label: L('Model Id') },
    { id: 'version', alignment: 'left', label: L('Version') },
    { id: 'deploymentId', alignment: 'left', label: L('Deployment Id') },
    { id: 'action', alignment: 'left', label: L('Action') }
  ];

  // 每行显示的字段
  const fieldList = [
    { field: 'name', align: 'left' },
    { field: 'id', align: 'left' },
    { field: 'version', align: 'left' },
    { field: 'deploymentId', align: 'left' }
  ];

  const handleChangePage = (_, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handlePublish = (event, row) => {
    Loading.show();
    API.getPublishModel(row.id)
      .then(() => {
        CommonTip.success(L('Success'));
        Loading.hide();
        API.getProcessDefinitions({ limit: rowsPerPage, page: page + 1 }).then(({ data }) => {
          setTotal(data.total);
          handleData(data.list);
        });
      })
      .catch(() => {
        Loading.hide();
      });
  };

  const customEdit = (e, row) => {
    window.open(
      `${ACTIVITI_HOST}${createPrefix}/openEditor?modelId=${row.id}&token=${localStorage.getItem(
        'token'
      )}`
    );
  };

  const handleSetting = (event, row) => {
    history.push({ pathname: `/detail/${row.id}`, search: `name=${row.name}` });
  };

  // 自定义action
  const actionList = [
    {
      label: L('Workflow Setting'),
      icon: <BorderColorIcon fontSize="small" style={{ color: '#2553F4' }} />,
      handleClick: customEdit
    },
    {
      label: L('Form Setting'),
      icon: <SettingsIcon fontSize="small" style={{ color: '#2553F4' }} />,
      handleClick: handleSetting
    },
    {
      label: L('Deploy'),
      icon: <EventAvailableIcon fontSize="small" style={{ color: '#2553F4' }} />,
      handleClick: handlePublish
    }
  ];

  const customCreate = () => {
    window.open(`${ACTIVITI_HOST + createPrefix}/create?token=${localStorage.getItem('token')}`);
  };

  return (
    <>
      <Grid container spacing={6}>
        <Grid item xs={12}>
          <HAPaper>
            <CommonTable
              rows={rows}
              tableName={tableName}
              path={path}
              headCells={headCells}
              fieldList={fieldList}
              hideUpdate
              hideDetail
              hideCheckBox
              customCreate={customCreate}
              actionList={actionList}
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
