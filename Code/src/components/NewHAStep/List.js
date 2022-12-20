import React, { useEffect, useState } from 'react';

import { Grid, Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import {
  BorderColorOutlined as BorderColorIcon,
  Reorder as ReorderIcon,
  Chat as ChatIcon
} from '@material-ui/icons';
import dayjs from 'dayjs';
import GetAppIcon from '@material-ui/icons/GetApp';
import { L } from '../../../../../utils/lang';

import {
  CommonTable,
  SearchBar,
  NewChatBox,
  TablePagination,
  HAPaper
} from '../../../../../components';
import API from '../../../../../api/camunda';
import { getUserGroupList } from '../../../../../utils/auth';
import formatDateTime from '../../../../../utils/formatDateTime';
import Loading from '../../../../../components/Loading';
import downloadFile from '../../../../../utils/downloadFile';

const tableName = L('My Camunda Approval');

function List(props) {
  const { path } = props;
  const history = useHistory();
  const [startTime, setStartTime] = useState('');
  const [type, setType] = useState('pending');
  const [query, setQuery] = useState({ type: 'pending' });
  const [rows, setRows] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [total, setTotal] = useState(0);
  const [open, setOpen] = useState(false);
  const [image, setImage] = useState('');
  const [taskId, setTaskId] = useState('');
  const [showChatBox, setShowChatBox] = useState(false);

  useEffect(() => {
    const groupList = getUserGroupList();
    Loading.show();
    API.getTaskListByGroup({
      ...query,
      groupList,
      limit: rowsPerPage,
      page: page + 1
    })
      .then((response) => {
        setTotal(response.data.data.total);
        handleData(response.data.data.list);
      })
      .finally(() => Loading.hide())
      .catch((e) => {
        console.log(e);
        Loading.hide();
      });
  }, [page, rowsPerPage, query]);

  const handleData = (rawDataList) => {
    const rows = [];
    rawDataList.forEach((el) => {
      const rowModel = {
        id: el.processInstanceId,
        taskId: el.id,
        workflowName: el.processName,
        name: el.name,
        deploymentId: el.deploymentId,
        processDefinitionId: el.processDefinitionId,
        createBy: el.createBy,
        createTime: formatDateTime(el.createTime),
        stepName: el.taskDefinitionKey,
        status: el.status,
        end: el.end
      };
      rows.push(rowModel);
    });
    setRows(rows);
  };

  // 表头字段列表
  const headCells = [
    { id: 'id', alignment: 'left', label: L('Id') },
    { id: 'workflowName', alignment: 'left', label: L('Workflow Name') },
    { id: 'name', alignment: 'left', label: L('Name') },
    { id: 'createBy', alignment: 'left', label: L('Create By') },
    { id: 'createTime', alignment: 'left', label: L('Create Time') },
    { id: 'action', alignment: 'left', label: L('Action') }
  ];

  // 每行显示的字段
  const fieldList = [
    { field: 'id', align: 'left' },
    { field: 'workflowName', align: 'left' },
    { field: 'name', align: 'left' },
    { field: 'createBy', align: 'left' },
    { field: 'createTime', align: 'left' }
  ];

  const searchBarFieldList = [
    {
      id: 'startTime',
      label: L('Create Time'),
      type: 'dateRange',
      disabled: false,
      readOnly: false,
      value: startTime
    },
    {
      id: 'type',
      label: L('Type'),
      type: 'text',
      disabled: false,
      value: type,
      isSelector: true,
      itemList: [
        { id: 'pending', name: 'pending' },
        { id: 'approved', name: 'approved' },
        { id: '', name: 'all' }
      ],
      labelField: 'name',
      valueField: 'id'
    }
    // { id: 'endTime', label: L('End Date'), type: 'date', disabled: false, readOnly: false, value: endTime },
  ];

  const handleClear = () => {
    setStartTime('');
    setType('');
    setQuery({
      startTime: '',
      type: ''
    });
  };

  const handleSearch = () => {
    if (startTime.startDate && startTime.endDate) {
      if (
        dayjs(startTime.startDate).format('YYYY-MM-DD') ===
        dayjs(startTime.endDate).format('YYYY-MM-DD')
      ) {
        startTime.startDate = `${dayjs(startTime.startDate).format('YYYY-MM-DD')}T00:00:00Z`;
        startTime.endDate = `${dayjs(startTime.endDate).format('YYYY-MM-DD')}T23:59:59Z`;
      } else if (dayjs(startTime.startDate).isAfter(startTime.endDate)) {
        const startTimeStart = `${dayjs(startTime.endDate).format('YYYY-MM-DD')}T00:00:00Z`;
        const startTimeEnd = `${dayjs(startTime.startDate).format('YYYY-MM-DD')}T00:00:00Z`;
        startTime.startDate = startTimeStart;
        startTime.endDate = startTimeEnd;
      }
    } else if (startTime.startDate) {
      startTime.startDate = `${dayjs(startTime.startDate).format('YYYY-MM-DD')}T00:00:00Z`;
    } else if (startTime.endDate) {
      startTime.endDate = `${dayjs(startTime.endDate).format('YYYY-MM-DD')}T00:00:00Z`;
    }
    setQuery({
      createTime: startTime,
      type
    });
  };

  const handleFieldChange = (e, id) => {
    const { value } = e.target;
    switch (id) {
      case 'startTime':
        setStartTime(value);
        break;
      case 'type':
        setType(value);
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

  // eslint-disable-next-line no-unused-vars
  const handleImage = (event, row) => {
    API.getDiagram('260008').then((response) => {
      const blob = new Blob([response.data]);
      setImage(window.URL.createObjectURL(blob));
      setOpen(true);
    });
  };

  const handleApprove = (event, row) => {
    history.push({
      pathname: `/detail/${row.id}`,
      search: `processDefinitionId=${row.processDefinitionId}&deploymentId=${row.deploymentId}&stepName=${row.stepName}&taskId=${row.taskId}`
    });
  };

  const handleDetail = (event, row) => {
    history.push({
      pathname: `/detail/${row.id}`,
      search: `deploymentId=${row.deploymentId}`
    });
  };

  const handleStep = (event, row) => {
    history.push({ pathname: `/step/${row.id}` });
  };

  const handleChatBox = (event, row) => {
    setTaskId(row.taskId);
    setShowChatBox(true);
  };

  const handleDownload = (event, row) => {
    Loading.show();
    API.download({ processInstanceId: row.id })
      .then(({ data }) => {
        downloadFile(data, 'Account management.pdf');
      })
      .finally(() => {
        Loading.hide();
      })
      .catch((e) => {
        console.log(e);
        Loading.hide();
      });
  };

  const display = (row) => row.status === 'pending';

  const displayApprove = (row) => row.status === 'approved';

  const displayDownload = (row) => row.workflowName === 'Account management' && row.end === 'End';

  const actionList = [
    {
      label: L('Process'),
      icon: <ReorderIcon fontSize="small" style={{ color: '#2553F4' }} />,
      handleClick: handleStep
    },
    {
      label: L('Approve'),
      icon: <BorderColorIcon fontSize="small" style={{ color: '#2553F4' }} />,
      handleClick: handleApprove,
      display
    },
    {
      label: L('Detail'),
      icon: <BorderColorIcon fontSize="small" style={{ color: '#2553F4' }} />,
      handleClick: handleDetail,
      display: displayApprove
    },
    {
      label: L('Message'),
      icon: <ChatIcon fontSize="small" style={{ color: '#2553F4' }} />,
      handleClick: handleChatBox,
      display
    },
    {
      label: L('Download'),
      icon: <GetAppIcon fontSize="small" style={{ color: '#2553F4' }} />,
      handleClick: handleDownload,
      display: displayDownload
    }
  ];

  const handleClose = () => {
    setOpen(false);
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
              hideCheckBox
              hideUpdate
              hideDetail
              hideImage
              path={path}
              headCells={headCells}
              fieldList={fieldList}
              handleImage={handleImage}
              actionList={actionList}
              hideCreate
            />
            <NewChatBox
              open={showChatBox}
              onClose={() => {
                setShowChatBox(false);
              }}
              taskId={taskId}
            />
            <Dialog
              open={open}
              aria-labelledby="image-modal-title"
              aria-describedby="iamge-modal-description"
            >
              <DialogTitle id="form-dialog-title">{L('Activity')}</DialogTitle>
              <DialogContent>
                <img alt="" src={image} />
              </DialogContent>
              <DialogActions>
                <Button onClick={handleClose} color="primary">
                  {L('Close')}
                </Button>
              </DialogActions>
            </Dialog>
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
