import dayjs from 'dayjs';
import React, { useState, useEffect } from 'react';
import { Grid, Chip, makeStyles, Tooltip } from '@material-ui/core';
import { useFormik } from 'formik';
import { L } from '../../../../../utils/lang';
import getIcons from '../../../../../utils/getIcons';
import { CommonTable, SearchBar, TablePagination, HAPaper } from '../../../../../components';
import Detail from '../Detail';
import API from '../../../../../api/webdp/webdp';

const useStyles = makeStyles(() => ({
  root: {
    '& .MuiTableBody-root': {
      '& td:last-child': {
        '& div:nth-child(1),div:nth-child(2)': {
          display: 'none'
        }
      }
    },
    '& .myCellClass': {
      width: '10vw'
    }
  },
  requestwayChip: {
    width: '90px',
    color: '#fff',
    fontWeight: '700'
  },
  statusStyle: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center'
  }
}));
const tableName = L('List');
export default function List(props) {
  const { path } = props;
  const classes = useStyles();
  const [rows, setRows] = useState([]);
  const [total, setTotal] = useState(0);

  const defaultParams = {
    pageIndex: 1,
    pageSize: 10,
    createdBy: '',
    systemName: '',
    module: '',
    startTime: '',
    endTime: ''
  };

  const [params, setParams] = useState(defaultParams);

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [actionRow, setActionRow] = useState({});

  const formik = useFormik({
    initialValues: {
      createdBy: defaultParams.createdBy,
      systemName: defaultParams.systemName,
      module: defaultParams.module,
      startTime: defaultParams.startTime,
      endTime: defaultParams.endTime
    },
    onSubmit: (values) => {
      setParams({ ...params, ...values, pageIndex: 1 });
    }
  });

  useEffect(() => {
    const { pageIndex, pageSize, createdBy, systemName, module, startTime, endTime } = params;

    const queryParams = {
      pageIndex,
      pageSize,
      createdBy: createdBy || undefined,
      systemName: systemName || undefined,
      module: module || undefined,
      startTime: startTime || undefined,
      endTime: endTime || undefined
    };

    setLoading(true);
    API.getOperLogPage(queryParams)
      .then((res) => {
        setRows(res?.data?.data?.records || []);
        setTotal(res?.data?.data?.total || 0);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [params]);

  const handleClear = () => {
    formik.handleReset();
    setParams({ ...defaultParams, pageSize: params.pageSize });
  };

  // 搜索的字段
  const searchBarLogsList = [
    {
      id: 'createdBy',
      label: 'Operator',
      type: 'text',
      value: formik.values.createdBy
    },
    {
      id: 'systemName',
      label: 'System',
      type: 'text',
      value: formik.values.systemName
    },
    {
      id: 'module',
      label: 'Module',
      type: 'text',
      value: formik.values.module
    },
    {
      id: 'date',
      type: 'dateRange',
      startDisableFuture: true,
      endDisableFuture: true,
      startMaxDate: formik.values.endTime,
      endMinDate: formik.values.startTime,
      value: {
        startDate: formik.values.startTime || null,
        endDate: formik.values.endTime || null
      }
    }
  ];

  // 请求类型的颜色映射
  const requestWayColorMap = {
    GET: '#61AFFE',
    DELETE: '#F93E3E',
    PUT: '#FCA130',
    POST: '#49CC90'
  };

  // 表头显示的名字
  const headCells = [
    { id: 'systemName', alignment: 'left', label: L('system') },
    { id: 'module', alignment: 'left', label: L('module') },
    { id: 'createdBy', alignment: 'left', label: L('operator') },
    { id: 'operMethod', alignment: 'left', label: L('requestway') },
    // { id: 'requesttype', alignment: 'left', label: L('requesttype') },
    { id: 'operIp', alignment: 'left', label: L('reqip') },
    { id: 'operUri', alignment: 'left', label: L('reqpath') },
    { id: 'createdDate', alignment: 'left', label: L('requestAt') },
    // { id: 'status', alignment: 'left', label: L('status') },
    { id: 'Action', alignment: 'left', label: L('Actions') }
  ];

  //  列表对应的数据
  const fieldList = [
    { field: 'systemName', align: 'left', renderCell: () => 'SENSE' },
    { field: 'module', align: 'left' },
    { field: 'createdBy', align: 'left' },
    {
      field: 'operMethod',
      align: 'left',
      renderCell: (row) => (
        <>
          {row ? (
            <Chip
              label={row.operMethod || ''}
              className={classes.requestwayChip}
              style={{
                backgroundColor: requestWayColorMap[row.operMethod] || ''
              }}
            />
          ) : (
            ''
          )}
        </>
      )
    },

    // { field: 'requesttype', align: 'left' },
    { field: 'operIp', align: 'left' },
    {
      field: 'operUri',
      align: 'left',
      cellClassName: 'myCellClass',
      renderCell: (row) => (
        <div
          style={{
            width: '10vw',
            display: '-webkit-box',
            WebkitBoxOrient: 'vertical',
            WebkitLineClamp: 3,
            overflow: 'hidden',
            wordWrap: 'break-word',
            textOverflow: 'ellipsis'
          }}
        >
          <Tooltip title={row.operUri || ''} placement="top">
            <span>{row.operUri}</span>
          </Tooltip>
        </div>
      )
    },

    { field: 'createdDate', align: 'left' }
    // {
    //   field: 'status',
    //   align: 'left',
    //   renderCell: (row) => (
    //     <div className={classes.statusStyle}>
    //       {row?.status === 1 ? (
    //         <Tooltip title={L('Success')}>
    //           <CheckCircleIcon style={{ color: '#04DE69' }} />
    //         </Tooltip>
    //       ) : (
    //         <Tooltip title={L('Error')}>
    //           <ErrorIcon style={{ color: '#FD5841' }} />
    //         </Tooltip>
    //       )}
    //     </div>
    //   )
    // }
  ];

  // 修改页码事件
  const onChangePage = (_, newPage) => {
    if (loading) {
      return;
    }
    const newParams = {
      ...params,
      pageIndex: newPage + 1
    };
    setParams(newParams);
  };

  // 修改pageSize事件
  const onChangeRowsPerPage = (event) => {
    if (loading) {
      return;
    }
    const newParams = {
      ...params,
      pageIndex: 1,
      pageSize: event.target.value
    };
    setParams(newParams);
  };

  const detailClick = (e, row) => {
    setActionRow(row);
    setOpen(true);
  };

  const actionList = [
    {
      label: L('Detail'),
      icon: getIcons('detail'),
      handleClick: detailClick
    }
  ];

  return (
    <>
      <Grid container spacing={6} className={classes.root}>
        <Grid item xs={12}>
          <SearchBar
            onSearchFieldChange={(e, id) => {
              if (id === 'date') {
                let newStartTime = e?.target?.value?.startDate || '';
                let newEndTime = e?.target?.value?.endDate || '';

                if (newStartTime) {
                  newStartTime = dayjs(newStartTime).format('YYYY-MM-DD 00:00:00');
                }
                if (newEndTime) {
                  newEndTime = dayjs(newEndTime).format('YYYY-MM-DD 23:59:59');
                }

                formik.setFieldValue('startTime', newStartTime);
                formik.setFieldValue('endTime', newEndTime);
              } else {
                formik.handleChange(e);
              }
            }}
            onSearchButton={formik.handleSubmit}
            onClearButton={handleClear}
            fieldList={searchBarLogsList}
          />
          <HAPaper style={{ width: '100%' }}>
            <>
              <CommonTable
                hideUpdate
                hideCreate
                hideDetail
                rows={rows}
                path={path}
                hideCheckBox
                tableName={tableName}
                headCells={headCells}
                fieldList={fieldList}
                actionList={actionList}
                loading={loading}
              />
              <TablePagination
                count={total}
                component="div"
                onChangePage={onChangePage}
                page={params.pageIndex - 1 || 0}
                rowsPerPage={params.pageSize || 10}
                rowsPerPageOptions={[10, 50, 100]}
                onChangeRowsPerPage={onChangeRowsPerPage}
              />
            </>
          </HAPaper>
        </Grid>
      </Grid>

      {/* 详情对话框 */}
      <Detail open={open} setOpen={setOpen} actionRow={actionRow} setActionRow={setActionRow} />
    </>
  );
}
