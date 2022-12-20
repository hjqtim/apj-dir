import React, { useState, useEffect } from 'react';
import { Grid, Tooltip } from '@material-ui/core';
import { useFormik } from 'formik';
import { useHistory } from 'react-router-dom';
import { stringify, parse } from 'qs';
import { CommonTable, SearchBar, TablePagination, HAPaper } from '../../../../../components';
import CommonDialog from '../../../../../components/CommonDialog';
import API from '../../../../../api/email/template';
import { L } from '../../../../../utils/lang';
import { useGlobalStyles } from '../../../../../style';
// import getIcons from '../../../../../utils/getIcons';

const tableName = L('List');

const List = (props) => {
  const { path } = props;
  const history = useHistory();
  const globalClaess = useGlobalStyles();
  const urlObj = parse(history.location.search?.replace('?', '')) || {}; // 根据url获取请求参数

  const [rows, setRows] = useState([]); // 表格数据
  const [total, setTotal] = useState(urlObj.pageNum ? urlObj.pageNum * urlObj.pageSize : 0); // 表格总数
  const [loading, setLoading] = useState(false); // 是否请求中

  const [open, setOpen] = useState(false); // 是否打开删除对话框
  // 搜索参数，默认值从url获取
  const [params, setParams] = useState({
    pageNum: urlObj?.pageNum || 1,
    pageSize: urlObj?.pageSize || 10,
    mouldName: urlObj?.mouldName || ''
  });

  const [deleteObj, setDeleteObj] = useState({}); // 要删除的对象

  const formik = useFormik({
    initialValues: {
      mouldName: urlObj?.mouldName || '' // 默认值从url获取
    },
    onSubmit: (values) => {
      const newParams = {
        ...params,
        pageNum: 1,
        mouldName: values.mouldName
      };
      const url = `?${stringify(newParams)}`;
      history.push(url);
      setParams(newParams);
    }
  });

  const handleClear = () => {
    formik.handleReset();
    formik.setFieldValue('mouldName', '');
    const newParams = {
      pageNum: 1,
      pageSize: 10,
      mouldName: ''
    };
    history.push('/');
    setParams(newParams);
  };

  // 获取表格数据
  const getEmailTemplateLists = () => {
    setLoading(true);
    API.getEmailLists(params)
      .then((res) => {
        if (res?.data?.rows) {
          setTotal(res.data.total || 0);
          // const data = res.data.rows.map((item) => ({ ...item, id: item.templateId }));
          const data = res.data.rows;
          for (let i = 0; i < data.length; i += 1) {
            const { remark } = data[i];
            if (remark != null && remark.length > 4 && remark.substr(0, 4) === 'Prod') {
              data[i].allowupdate = true;
            } else {
              data[i].allowupdate = false;
            }
            data[i].id = data[i].templateId;
          }
          setRows(data);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  // 监听params
  useEffect(() => {
    getEmailTemplateLists();
  }, [params]);

  const renderLongTextt = (row, type) => (
    <div className={globalClaess.tableCelContenMax}>
      <Tooltip title={row[type] || ''} placement="top">
        <span>{row[type] || ''}</span>
      </Tooltip>
    </div>
  );

  const searchBarFieldList = [
    {
      //   id: "tenant",
      label: L('theme'),
      type: 'text',
      disabled: false,
      value: formik.values.mouldName,
      name: 'mouldName'
    }
  ];

  const headCells = [
    { id: 'mouldName', alignment: 'left', label: L('theme') },
    { id: 'remark', alignment: 'left', label: L('description') },
    { id: 'createBy', alignment: 'left', label: L('creator') },
    { id: 'createTime', alignment: 'left', label: L('createTime') },
    { id: 'updateTime', alignment: 'left', label: L('updateTime') },
    { id: 'action', alignment: 'left', label: L('Actions') }
  ];

  const fieldList = [
    { field: 'mouldName', align: 'left', renderCell: (row) => renderLongTextt(row, 'mouldName') },
    { field: 'remark', align: 'left', renderCell: (row) => renderLongTextt(row, 'remark') },
    { field: 'createBy', align: 'left' },
    { field: 'createTime', align: 'left' },
    { field: 'updateTime', align: 'left' }
  ];

  // 修改页码事件
  const onChangePage = (_, newPage) => {
    const newParams = {
      ...params,
      pageNum: newPage + 1
    };
    const url = `?${stringify(newParams)}`;
    // 将请求参数放在url上
    history.push(url);
    setParams(newParams);
  };

  // 修改pageSize事件
  const onChangeRowsPerPage = (event) => {
    const newParams = {
      ...params,
      pageNum: 1,
      pageSize: event.target.value
    };
    const url = `?${stringify(newParams)}`;
    // 将请求参数放在url上
    history.push(url);
    setParams(newParams);
  };

  //   编辑icon事件
  // const editClick = () => {};

  //   邮箱icon事件
  // const sendClick = () => {};

  //   删除icon事件
  // const deleteClick = (e, row) => {
  //   setDeleteObj(row);
  //   setOpen(true);
  // };

  // const actionList = [
  //   // {
  //   //   label: L('edit'),
  //   //   icon: getIcons('edit'),
  //   //   handleClick: editClick
  //   // },
  //   // {
  //   //   label: L('send'),
  //   //   icon: getIcons('email'),
  //   //   handleClick: sendClick
  //   // },
  //   {
  //     label: L('Delete'),
  //     icon: getIcons('delete'),
  //     handleClick: deleteClick
  //   }
  // ];

  //   删除提示框确认事件
  const handleConfirm = () => {};

  //   删除提示框取消事件
  const handleClose = () => {
    setOpen(false);
    setTimeout(() => {
      setDeleteObj({});
    }, 200);
  };

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
          <HAPaper>
            <CommonTable
              rows={rows}
              tableName={tableName}
              // hideUpdate
              // hideDetail
              deleteAPI={API.deleteTemplates}
              handleSearch={getEmailTemplateLists}
              path={path}
              headCells={headCells}
              fieldList={fieldList}
              loading={loading}
              // actionList={actionList}
            />
            <TablePagination
              rowsPerPageOptions={[10, 50, 100]}
              component="div"
              count={Number(total)}
              rowsPerPage={Number(params.pageSize) || 10}
              page={params.pageNum - 1 || 0}
              onChangePage={onChangePage}
              onChangeRowsPerPage={onChangeRowsPerPage}
            />
          </HAPaper>
        </Grid>
      </Grid>

      {/* 删除对话框 */}
      <CommonDialog
        open={open}
        content={`${L('deleteTip')} ${deleteObj?.mouldName} ?`}
        handleConfirm={handleConfirm}
        handleClose={handleClose}
      />
    </>
  );
};

export default List;
