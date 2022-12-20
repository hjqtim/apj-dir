import { stringify, parse } from 'qs';
import dayjs from 'dayjs';
import { useHistory } from 'react-router-dom';
import { Grid, Tooltip } from '@material-ui/core';
import React, { useState, useEffect } from 'react';

import { CommonTable, TablePagination, HAPaper } from '../../../../../components';
import { useGlobalStyles } from '../../../../../style';
import API from '../../../../../api/project/project';
import { L } from '../../../../../utils/lang';
import HeadForm from './HeadForm';

const tableName = L('List');

const List = (props) => {
  const { path, refresh } = props;
  const history = useHistory();
  const globalClaess = useGlobalStyles();
  const [rows, setRows] = useState([]); // 表格数据
  const [loading, setLoading] = useState(false); // 是否请求中
  const urlObj = parse(history.location.search?.replace('?', '')) || {}; // 根据url获取请求参数
  const [total, setTotal] = useState(urlObj.pageNum ? urlObj.pageNum * urlObj.pageSize : 0);

  // 搜索参数
  const [params, setParams] = useState({
    pageNum: parseInt(urlObj?.pageNum) || 1,
    pageSize: parseInt(urlObj?.pageSize) || 10,
    appType: urlObj?.appType || '',
    projectName: urlObj?.projectName || '',
    status: urlObj?.status || ''
  });
  const renderLongTextt = (row, type) => (
    <div className={globalClaess.tableCelContenMax}>
      <Tooltip title={row[type] || ''} placement="top">
        <span>{row[type] || ''}</span>
      </Tooltip>
    </div>
  );

  // 表头显示的名字
  const headCells = [
    { id: 'project', alignment: 'left', label: L('project') },
    { id: 'team', alignment: 'left', label: L('team') },
    { id: 'section', alignment: 'left', label: L('section') },
    { id: 'tenant', alignment: 'left', label: L('tenant') },
    { id: 'description', alignment: 'left', label: L('Description') },
    { id: 'appType', alignment: 'left', label: L('appType') },
    { id: 'status', alignment: 'left', label: L('status') },
    { id: 'createdBy', alignment: 'left', label: L('creator') },
    { id: 'createdDate', alignment: 'left', label: L('createTime') },
    { id: 'projectType', alignment: 'left', label: L('projectType') },
    { id: 'website', alignment: 'left', label: L('Website') },
    { id: 'Action', alignment: 'left', label: L('Actions') }
  ];

  // 表格字段
  const fieldList = [
    {
      field: 'project',
      align: 'left',
      renderCell: (row) => renderLongTextt(row, 'project')
    },
    { field: 'team', align: 'left', renderCell: (row) => renderLongTextt(row, 'team') },
    { field: 'section', align: 'left', renderCell: (row) => renderLongTextt(row, 'section') },
    { field: 'tenant', align: 'left', renderCell: (row) => renderLongTextt(row, 'tenant') },
    {
      field: 'description',
      align: 'left',
      renderCell: (row) => renderLongTextt(row, 'description')
    },
    { field: 'appType', align: 'left' },
    { field: 'status', align: 'left' },
    { field: 'createdBy', align: 'left' },
    {
      field: 'createdDate',
      align: 'left',
      renderCell: (row) => (
        <span>{row?.createdDate ? dayjs(row.createdDate).format('YYYY-MM-DD HH:mm:ss') : ''}</span>
      )
    },
    {
      field: 'projectType',
      align: 'left',
      renderCell: (row) => renderLongTextt(row, 'projectType')
    },
    {
      field: 'website',
      align: 'left',
      renderCell: (row) => renderLongTextt(row, 'website')
    }
  ];

  // 监听params请求数据
  useEffect(() => {
    getProjectList();
  }, [params, refresh]);

  // 请求数据
  const getProjectList = () => {
    setLoading(true);
    API.getProjectList(params)
      .then((res) => {
        if (res?.data?.data?.items) {
          setTotal(res.data.data.total || 0);
          setRows(res?.data?.data?.items || []);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  // 修改页码事件
  const onChangePage = (_, newPage) => {
    const newParams = {
      ...params,
      pageNum: Number(newPage) + 1
    };
    const url = `?${stringify(newParams)}`;
    history.push(url);
    setParams(newParams);
  };

  // 修改pageSize事件
  const onChangeRowsPerPage = (event) => {
    const newParams = {
      ...params,
      pageNum: 1,
      pageSize: Number(event.target.value)
    };
    const url = `?${stringify(newParams)}`;
    // 将请求参数放在url上
    history.push(url);
    setParams(newParams);
  };

  // 搜索事件
  const handleSearch = (values) => {
    const newParams = {
      ...params,
      ...values,
      pageNum: 1
    };
    const url = `?${stringify(newParams)}`;
    history.push(url);
    setParams(newParams);
  };

  // 重置事件
  const handleReset = () => {
    const newParams = {
      pageNum: 1,
      pageSize: 10,
      appType: '',
      projectName: '',
      status: ''
    };
    history.push('/');
    setParams(newParams);
  };

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <HeadForm handleSearch={handleSearch} handleReset={handleReset} />
        <HAPaper>
          <CommonTable
            rows={rows}
            path={path}
            // hideCreate
            hideCheckBox
            loading={loading}
            tableName={tableName}
            headCells={headCells}
            fieldList={fieldList}
            handleSearch={getProjectList}
          />
          <TablePagination
            count={total}
            component="div"
            onChangePage={onChangePage}
            page={params.pageNum - 1 || 0}
            rowsPerPage={params.pageSize || 10}
            rowsPerPageOptions={[10, 50, 100]}
            onChangeRowsPerPage={onChangeRowsPerPage}
          />
        </HAPaper>
      </Grid>
    </Grid>
  );
};

export default List;
