import React, { useEffect, useState } from 'react';

import { Grid, Button } from '@material-ui/core';

import { useHistory } from 'react-router-dom';
import UpdateIcon from '@material-ui/icons/Update';
import PlayCircleFilledWhiteOutlinedIcon from '@material-ui/icons/PlayCircleFilledWhiteOutlined';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import TextField from '@material-ui/core/TextField';
import DialogActions from '@material-ui/core/DialogActions';
import formatDateTime from '../../../../../utils/formatDateTime';
import API from '../../../../../api/camunda';
import UserApi from '../../../../../api/user';
import { CommonTable, TablePagination, HAPaper, CommonTip } from '../../../../../components';
import { L } from '../../../../../utils/lang';
import Loading from '../../../../../components/Loading';
// import { getUser } from "../../../../../utils/auth"

const tableName = 'List';

function List(props) {
  const { path } = props;
  const history = useHistory();
  const [rows, setRows] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [total, setTotal] = useState(0);
  const [shown, setShown] = useState(false);
  const [cuIdRow, setCuIdRow] = useState({});
  const [type] = useState('corp');
  // const [ type, setType ] = useState('corp')

  useEffect(() => {
    Loading.show();
    API.getProcessList({
      name: 'Test',
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
    // { id: 'id', alignment: 'center', label: 'Id' },
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
    console.log(row);
    Loading.show();
    // const from = {
    //   processDefinitionId: row.id,
    //   variables: null,
    //   startUser: getUser().displayName,
    // }
    // API.startProcess(from).then((e) => {
    //   CommonTip.success(L('Success'))
    //   console.log(e)
    // }).finally(()=>Loading.hide())
    history.push({
      pathname: `${path}/create/${row.id}`,
      search: `deploymentId=${row.deploymentId}`
    });
  };

  const handleUpdateClick = (e, row) => {
    setCuIdRow(row);
    setShown(true);
  };

  // 自定义action
  const actionList = [
    {
      label: 'run',
      icon: <PlayCircleFilledWhiteOutlinedIcon fontSize="small" style={{ color: '#2553F4' }} />,
      handleClick: handleRunClick
    },
    {
      label: 'update',
      icon: <UpdateIcon fontSize="small" style={{ color: '#2553F4' }} />,
      handleClick: handleUpdateClick
    }
  ];

  const handleChangePage = (_, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const dialogReason = {
    title: L('changeAccount'),
    value: '',
    formField: {
      id: 'corpId',
      label: type !== 'corp' ? L('CPS ID') : L('corpId'),
      type: 'text',
      disabled: false,
      readOnly: false,
      required: true,
      helperText: L('NotEmpty')
    },
    onSubmit: (value) => {
      if (!value) return;
      rejectActions(value);
    }
  };
  const handleReasonSubmit = async () => {
    if (dialogReason.value && dialogReason.value.length > 0) {
      const { data } = await UserApi.findUser({
        username: dialogReason.value,
        type
      });
      if (data && data.data) {
        rejectActions(dialogReason.value);
      } else {
        CommonTip.error(type === 'corp' ? L('corpIdNotFind') : L('CPS ID not found'));
      }
    }
  };
  const handleReasonChange = (event) => {
    dialogReason.value = event.target.value;
  };

  const rejectActions = (data) => {
    history.push({
      pathname: `${path}/create/${cuIdRow.id}`,
      search: `deploymentId=${cuIdRow.deploymentId}&cuId=${data}`
    });
  };

  // const onCheckBoxChange = (e) => {
  //   if (e.target.checked) {
  //     setType('cps')
  //   } else {
  //     setType('corp')
  //   }
  // }

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
              hideCheckBox
              path={path}
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
          <Dialog open={shown} fullWidth aria-labelledby="form-dialog-title">
            <DialogTitle id="form-dialog-title">{dialogReason.title}</DialogTitle>
            <DialogContent>
              <form autoComplete="off">
                {/* <input */}
                {/*  type={'checkbox'} */}
                {/*  id={'checkbox_isCps'} */}
                {/*  onChange={onCheckBoxChange} */}
                {/* /> */}
                {/* <label */}
                {/*  htmlFor={'checkbox_isCps'} */}
                {/*  style={{ */}
                {/*    fontSize: '1.1em', */}
                {/*  }} */}
                {/* > */}
                {/*  Is CPS ID */}
                {/* </label> */}
                <TextField
                  fullWidth
                  id={dialogReason.formField.id.toString()}
                  key={dialogReason.formField.id + dialogReason.formField.label}
                  label={dialogReason.formField.label}
                  type={dialogReason.formField.type}
                  error={dialogReason.formField.error || false}
                  helperText={dialogReason.formField.helperText || ''}
                  disabled={dialogReason.formField.disabled || false}
                  required={dialogReason.formField.required || false}
                  onChange={
                    !dialogReason.formField.readOnly ? (event) => handleReasonChange(event) : null
                  }
                  value={dialogReason.formField.value}
                  multiline
                />
              </form>
            </DialogContent>
            <DialogActions>
              <Button
                variant="contained"
                onClick={() => {
                  setShown(false);
                }}
              >
                {L('Cancel')}
              </Button>
              <Button
                variant="contained"
                color="primary"
                style={{ marginRight: '2ch' }}
                onClick={handleReasonSubmit}
              >
                {L('Submit')}
              </Button>
            </DialogActions>
          </Dialog>
        </Grid>
      </Grid>
    </>
  );
}

export default List;
