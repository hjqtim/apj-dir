import React, { useState, useEffect, useMemo } from 'react';
import { Grid, Tooltip, makeStyles } from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import { useFormik } from 'formik';
import { stringify, parse } from 'qs';
import dayjs from 'dayjs';
import {
  CommonTable,
  SearchBar,
  TablePagination,
  HAPaper,
  WarningDialog,
  CommonTip
} from '../../../../../components';
import { useGlobalStyles } from '../../../../../style';
import API from '../../../../../api/email/mailRecord';
import { L } from '../../../../../utils/lang';
import getIcons from '../../../../../utils/getIcons';

const useStyles = makeStyles(() => ({
  mailRecordTable: {
    '& tr': {
      '& td:last-child': {
        '& div:first-of-type': {
          display: 'none !important '
        },
        '& div:last-of-type': {
          display: 'inline-block'
        }
      }
    }
  }
}));
const tableName = L('List');

const List = (props) => {
  const { path } = props;
  const history = useHistory();
  const classes = useStyles();
  const globalClaess = useGlobalStyles();
  const [rows, setRows] = useState([]); // 表格数据
  const urlObj = parse(history.location.search?.replace('?', '')) || {}; // 根据url获取请求参数
  const [total, setTotal] = useState(urlObj.pageIndex ? urlObj.pageIndex * urlObj.pageSize : 0); // 表格总数
  const [loading, setLoading] = useState(false); // 是否请求中
  const [openReplayDialog, setOpenReplayDialog] = useState(false);
  const [currentRow, setCurrentRow] = useState({});

  // 搜索参数
  const [params, setParams] = useState({
    pageIndex: urlObj?.pageIndex || 1,
    pageSize: urlObj?.pageSize || 10,
    subject: urlObj?.subject || ''
  });

  // 搜索表单数据收集
  const formik = useFormik({
    initialValues: {
      subject: urlObj.subject || ''
    },
    onSubmit: (values) => {
      const newParams = {
        ...params,
        pageIndex: 1,
        subject: values.subject
      };
      const url = `?${stringify(newParams)}`;
      history.push(url);
      setParams(newParams);
    }
  });

  // 清空搜索内容
  const handleClear = () => {
    formik.handleReset();
    formik.setFieldValue('subject', '');
    const newParams = {
      pageIndex: 1,
      pageSize: 10,
      subject: ''
    };
    history.push('/');
    setParams(newParams);
  };

  // 获取表格数据
  const getEmailLogsLists = () => {
    setLoading(true);
    API.getEmailRecordList(params)
      .then((res) => {
        if (res?.data?.data?.items) {
          setTotal(res.data.data.total || 0);
          const data = res.data.data.items.map((item) => {
            // console.log('item', item);
            let statusTo = '';
            if (item.status === 0) {
              statusTo = 'Send fail';
            }
            if (item.status === 1) {
              statusTo = 'Send success';
            }
            if (item.status === 2) {
              statusTo = 'Intercepted';
            }
            const temp = { ...item, id: item.mailId, statusTo };
            return temp;
          });
          setRows(data);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  // 监听params
  useEffect(() => {
    getEmailLogsLists();
  }, [params]);

  const searchBarFieldList = [
    {
      //   id: "tenant",
      label: L('subject'),
      type: 'text',
      disabled: false,
      value: formik.values.subject,
      name: 'subject'
    }
  ];

  // 表头显示的名字
  const headCells = [
    { id: 'Subject', alignment: 'left', label: L('subject') },
    { id: 'SendTime', alignment: 'left', label: L('sendTime') },
    { id: 'ToWho', alignment: 'left', label: L('toWho') },
    { id: 'CopyTo', alignment: 'left', label: L('copyTo') },
    { id: 'Status', alignment: 'left', label: L('statusTo') },
    { id: 'Action', alignment: 'left', label: L('Actions') }
  ];

  //  列表对应的数据
  const fieldList = [
    { field: 'subject', align: 'left' },
    {
      field: 'sendTime',
      align: 'left',
      renderCell: (row) => <span>{dayjs(row.sendTime).format('YYYY-MM-DD HH:mm:ss') || ''}</span>
    },
    {
      field: 'toEmail',
      align: 'left',
      renderCell: (row) => (
        <div className={globalClaess.tableCelContenMax}>
          <Tooltip title={row.toEmail} placement="top">
            <span>{row.toEmail}</span>
          </Tooltip>
        </div>
      )
    },
    { field: 'copyTo', align: 'left' },
    { field: 'statusTo', align: 'left' }
  ];

  // 修改页码事件
  const onChangePage = (_, newPage) => {
    const newParams = {
      ...params,
      pageIndex: newPage + 1
    };
    const url = `?${stringify(newParams)}`;
    history.push(url);
    setParams(newParams);
  };

  // 修改pageSize事件
  const onChangeRowsPerPage = (event) => {
    const newParams = {
      ...params,
      pageIndex: 1,
      pageSize: event.target.value
    };
    const url = `?${stringify(newParams)}`;
    // 将请求参数放在url上
    history.push(url);
    setParams(newParams);
  };

  // 重新发送邮件
  const retryClick = (e, row) => {
    setCurrentRow(row);
    setOpenReplayDialog(true);
  };

  // 确认重发邮件
  const handleConfirm = async () => {
    const data = { isResend: 'Y', mailId: currentRow?.mailId || '' };
    const res = await API.resendEmail(data);
    if (res?.data?.code === 200) {
      CommonTip.success(L('operationSucceeded'));
    } else {
      CommonTip.error(L('operationFailed'));
    }
    handleClose();
  };

  // 取消发送邮件
  const handleClose = () => {
    setOpenReplayDialog(false);
    setCurrentRow({});
  };

  const actionList = [
    {
      label: L('Retry'),
      icon: getIcons('replay'),
      handleClick: retryClick
    }
  ];

  // 抽出来防止重复渲染
  const pageHaper = useMemo(
    () => (
      <div className={classes.mailRecordTable}>
        <CommonTable
          hideUpdate
          hideCreate
          rows={rows}
          path={path}
          hideCheckBox
          loading={loading}
          tableName={tableName}
          headCells={headCells}
          fieldList={fieldList}
          actionList={actionList}
          handleSearch={getEmailLogsLists}
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
      </div>
    ),
    [rows, loading]
  );

  return (
    <>
      <Grid container spacing={6}>
        <Grid item xs={12}>
          <SearchBar
            onSearchFieldChange={formik.handleChange}
            onSearchButton={formik.handleSubmit}
            onClearButton={handleClear}
            fieldList={searchBarFieldList}
          />
          <HAPaper>{pageHaper}</HAPaper>
        </Grid>
      </Grid>

      {/* 重发会话对话框 */}
      <WarningDialog
        open={openReplayDialog}
        handleConfirm={handleConfirm}
        handleClose={handleClose}
        content="Are you sure to resend this email ?"
      />
    </>
  );
};

export default List;
