import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react';
import { IconButton, Grid, Tooltip, makeStyles, Button } from '@material-ui/core';
import { History } from '@material-ui/icons';
import { useGlobalStyles } from '../../../../../style';
import { HAPaper, CommonDataGrid, WarningDialog, CommonTip } from '../../../../../components';
import getIcons from '../../../../../utils/getIcons';
import dataGridTooltip from '../../../../../utils/dataGridTooltip';
import HeadForm from './HeadForm';
import API from '../../../../../api/timer';
import AddTimer from './AddTimer';
import AntSwitch from './AntSwitch';
import Detail from './Detail';
import ActionLog from './ActionLog';

const useStyles = makeStyles((theme) => ({
  addBtn: {
    display: 'flex',
    paddingBottom: theme.spacing(5),
    justifyContent: 'flex-end'
  }
}));

export default function List() {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const globalclasses = useGlobalStyles();
  const [rows, setRows] = useState([]);
  const [total, setTotal] = useState(0);
  const [operateRow, setOperateRow] = useState({});
  const [loading, setLoading] = useState(false);
  const [params, setParams] = useState({
    pageNo: 1,
    pageSize: 10
  });
  const [isOpenAdd, setIsOpenAdd] = useState(false);
  console.log('isOpenAdd: ', isOpenAdd);
  const [actionRow, setActionRow] = useState({});
  const [isOpenDetail, setIsOpenDetail] = useState(false);
  const [actionLogObj, setActionLogObj] = useState({});

  const handleSwitch = (r, v) => {
    const updateParams = {
      ...r,
      triggerState: v ? 'ACQUIRED' : 'PAUSED'
    };
    API.updateState(updateParams).then((res) => {
      if (res?.data?.code === 0) {
        CommonTip.success('Success', 2000);
        queryJobLists();
      }
    });
  };

  const getMonth = (month) => {
    const monthMap = {
      1: 'Jan',
      2: 'Feb',
      3: 'Mar',
      4: 'Apr',
      5: 'May',
      6: 'Jun',
      7: 'Jul',
      8: 'Aug',
      9: 'Sep',
      10: 'Oct',
      11: 'Nov',
      12: 'Dec'
    };
    if (month === '*' || month === '?') {
      return 'every month';
    }
    const newMonth = `${month}@`;
    const res = newMonth.replace(/(\d{1,2})[,-@]/g, (match, p) => match.replace(p, monthMap[p]));
    const result = res.replace('@', '');
    return result;
  };

  const getWeek = (week) => {
    const weekMap = {
      1: 'Sun',
      2: 'Mon',
      3: 'Tue',
      4: 'Wed',
      5: 'Thur',
      6: 'Fri',
      7: 'Sat'
    };
    // if (day !== '*' && day !== '?' && (week === '*' || week === '?')) {
    //   return '--';
    // }
    if (week === '*') {
      return 'every week';
    }
    if (week === '?') {
      return '?';
    }
    const newWeek = `${week}@`;
    const res = newWeek.replace(/(\d)[,-@/]/g, (match, p) => match.replace(p, weekMap[p]));
    const result = res.replace('@', '');
    return result;
  };

  const getDay = (day) => {
    // if (week !== '*' && week !== '?' && (day === '*' || day === '?')) {
    //   return '--';
    // }
    if (day === '*') {
      return 'every day';
    }
    if (day === '?') {
      return '?';
    }
    return `${day}th`;
  };

  const getTime = (hour, minutes, second) => {
    let newhour = hour;
    if (newhour === '*') {
      newhour = '**';
    } else if (newhour?.length < 2) {
      newhour = `0${newhour}`;
    }

    let newMinutes = minutes;
    if (newMinutes === '*') {
      newMinutes = '**';
    } else if (newMinutes?.length < 2) {
      newMinutes = `0${newMinutes}`;
    }

    let newSecond = second;
    if (newSecond === '*') {
      newSecond = '**';
    } else if (newSecond?.length < 2) {
      newSecond = `0${newSecond}`;
    }
    return `${newhour}:${newMinutes}:${newSecond}`;
  };

  const parseExpression = (expression) => {
    try {
      const expressionArr = expression?.split?.(' ') || [];
      const month = expressionArr[4];
      const week = expressionArr[5];
      const day = expressionArr[3];
      const hour = expressionArr[2];
      const minutes = expressionArr[1];
      const second = expressionArr[0];
      return `${getMonth(month)} ${getWeek(week)} ${getDay(day)} At ${getTime(
        hour,
        minutes,
        second
      )}`;
    } catch (error) {
      console.log(error);
      return '';
    }
  };

  const columns = [
    {
      field: 'jobName',
      headerName: 'Job Name',
      flex: 1,
      renderCell: ({ row }) => {
        const newRow = { ...row, value: row.jobName };
        return dataGridTooltip(newRow);
      }
    },
    {
      field: 'jobGroup',
      headerName: 'Job Group',
      flex: 1,
      renderCell: ({ row }) => {
        const newRow = { ...row, value: row.jobGroup };
        return dataGridTooltip(newRow);
      }
    },
    // {
    //   field: 'jobClassName',
    //   headerName: 'Job Class Name',
    //   flex: 1,
    //   minWidth: 170,
    //   renderCell: ({ row }) => {
    //     const newRow = { ...row, value: row.jobClassName };
    //     return dataGridTooltip(newRow);
    //   }
    // },
    // {
    //   field: 'triggerName',
    //   headerName: 'Trigger Name',
    //   flex: 1,
    //   renderCell: ({ row }) => {
    //     const newRow = { ...row, value: row.triggerName };
    //     return dataGridTooltip(newRow);
    //   }
    // },
    {
      field: 'cronExpression',
      headerName: 'Expression',
      flex: 1,
      renderCell: ({ row }) => {
        const newRow = { ...row, value: parseExpression(row.cronExpression) };
        return dataGridTooltip(newRow);
      }
    },
    // {
    //   field: 'triggerStartTime',
    //   headerName: 'Trigger Start Time',
    //   minWidth: 180,
    //   flex: 1,
    //   renderCell: ({ value }) => (value ? dayjs(value).format('DD-MMM-YYYY HH:mm:ss') : '')
    // },
    {
      field: 'nexTriggerStartTime',
      headerName: 'Next Trigger Time',
      minWidth: 170,
      // maxWidth: 150,
      flex: 1,
      renderCell: ({ value }) => (value ? dayjs(value).format('DD-MMM-YYYY HH:mm:ss') : '')
    },
    {
      field: 'description',
      headerName: 'Description',
      flex: 1,
      renderCell: ({ row }) => {
        const newRow = { ...row, value: row.description };
        return dataGridTooltip(newRow);
      }
    },
    {
      field: 'triggerState',
      headerName: 'State',
      // flex: 1,
      width: 120,
      renderCell: ({ value, row }) => (
        <>
          <AntSwitch checked={value === 'ACQUIRED'} onChange={(e, v) => handleSwitch(row, v)} />
        </>
      )
    },
    {
      field: 'actions',
      headerName: 'Actions',
      hide: false,
      width: 150,
      filterable: false,
      renderCell: ({ row }) => (
        <div>
          {/* <Tooltip title="Detail">
            <IconButton
              onClick={() => history.push(`/AdministrationSystem/ScheduledTask/detail/${row.id}`)}
            >
              {getIcons('detaiEyeIcon')}
            </IconButton>
          </Tooltip>
          <Tooltip title="Edit">
            <IconButton
              onClick={() => history.push(`/AdministrationSystem/ScheduledTask/update/${row.id}`)}
            >
              {getIcons('edictIcon')}
            </IconButton>
          </Tooltip> */}
          <Tooltip title="Detail">
            <IconButton
              onClick={() => {
                const newRow = {
                  ...row,
                  triggerState: row.triggerState === 'ACQUIRED' ? 'Enable' : 'Disable',
                  nexTriggerStartTime: row.nexTriggerStartTime
                    ? dayjs(row.nexTriggerStartTime).format('DD-MMM-YYYY HH:mm:ss')
                    : '',
                  triggerStartTime: row.triggerStartTime
                    ? dayjs(row.triggerStartTime).format('DD-MMM-YYYY HH:mm:ss')
                    : ''
                };
                setActionRow(newRow);
                setIsOpenDetail(true);
              }}
            >
              {getIcons('detaiEyeIcon')}
            </IconButton>
          </Tooltip>
          <Tooltip title="Action Log">
            <IconButton
              onClick={() => {
                setActionLogObj(row);
              }}
            >
              <History style={{ width: '20px', height: '20px', color: '#229FFA' }} />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete">
            <IconButton
              onClick={() => {
                setOpen(true);
                setOperateRow(row);
              }}
            >
              {getIcons('delete')}
            </IconButton>
          </Tooltip>
        </div>
      )
    }
  ];

  const queryJobLists = () => {
    setLoading(true);
    API.getJobList(params)
      .then((res) => {
        const newRows =
          res?.data?.msg?.records?.map((item) => ({
            ...item,
            id: new Date().getTime() + Math.ceil(Math.random() * 1000)
          })) || [];
        setRows(newRows);
        setTotal(res?.data?.msg?.total || 0);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    queryJobLists();
  }, [params]);

  // change pageSize
  const onPageSizeChange = (pageSize) => {
    const newParams = {
      ...params,
      pageNo: 1,
      pageSize: Number(pageSize)
    };
    setParams(newParams);
  };

  // change pageIndex
  const onPageChange = (pageIndex) => {
    const newParams = {
      ...params,
      pageNo: pageIndex
    };
    setParams(newParams);
  };

  const handleClose = () => {
    setOpen(false);
    setTimeout(() => {
      setOperateRow({});
    }, 200);
  };

  const handleConfirm = () => {
    API.removeJob(operateRow).then((res) => {
      if (res?.data?.code === 0) {
        CommonTip.success('Success');
        handleClose();
        if (rows.length === 1 && params.pageNo > 1) {
          const newParams = { ...params, pageNo: params.pageNo - 1 };
          setParams(newParams);
        } else {
          queryJobLists();
        }
      }
    });
  };

  return (
    <div className={globalclasses.pageStyle}>
      <div className={globalclasses.subTitle}>Task Scheduler</div>
      <Grid container spacing={6}>
        <Grid item xs={12}>
          <HeadForm params={params} setParams={setParams} />
          <br />
          <HAPaper style={{ padding: '20px' }}>
            <div className={classes.addBtn}>
              <Button
                variant="contained"
                color="secondary"
                size="small"
                startIcon={getIcons('addIcon')}
                onClick={() => {
                  setIsOpenAdd(true);
                }}
              >
                Add
              </Button>
            </div>
            <CommonDataGrid
              rows={rows}
              rowCount={total}
              columns={columns}
              loading={loading}
              paginationMode="server"
              className={globalclasses.fixDatagrid}
              page={params.pageNo}
              pageSize={params.pageSize}
              onPageSizeChange={onPageSizeChange}
              disableSelectionOnClick
              onPageChange={onPageChange}
              rowsPerPageOptions={[10, 20, 50]}
            />
          </HAPaper>
        </Grid>
      </Grid>

      {/* delete  dialog */}
      <WarningDialog
        open={open}
        handleConfirm={handleConfirm}
        handleClose={handleClose}
        content={`Whether to delete ${operateRow?.jobName} ?`}
      />

      {/* add dialog */}
      <AddTimer isOpenAdd={isOpenAdd} setIsOpenAdd={setIsOpenAdd} queryJobLists={queryJobLists} />

      {/* detail dialog */}
      <Detail actionRow={actionRow} isOpenDetail={isOpenDetail} setIsOpenDetail={setIsOpenDetail} />

      {/* action log dialog */}
      <ActionLog actionLogObj={actionLogObj} setActionLogObj={setActionLogObj} />
    </div>
  );
}
