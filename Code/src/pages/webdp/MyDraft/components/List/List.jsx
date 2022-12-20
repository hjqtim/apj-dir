import React, { useEffect, useState } from 'react';
import { Grid, Tooltip, IconButton } from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import { stringify, parse } from 'qs';
import { useSelector } from 'react-redux';
import dayjs from 'dayjs';
import { TablePagination, HAPaper, CommonTable, WarningDialog } from '../../../../../components';
import CommonTip from '../../../../../components/CommonTip';
import API from '../../../../../api/webdp/webdp';
import HeadForm from './HeadForm';
import { L } from '../../../../../utils/lang';
import getIcons from '../../../../../utils/getIcons';
import theme from '../../../../../utils/theme';

function WebdpList() {
  const history = useHistory();
  const user = useSelector((state) => state.userReducer?.currentUser) || {};
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  const urlObj = parse(history.location.search?.replace('?', '')) || {}; // 根据url获取请求参数
  const [total, setTotal] = React.useState(urlObj.page ? urlObj.page * urlObj.limit : 0);
  const [params, setParams] = useState({
    page: parseInt(urlObj.page) || 1,
    limit: parseInt(urlObj.limit) || 10,
    startTime: urlObj.startTime || '',
    endTime: urlObj.endTime || '',
    requestNo: urlObj.requestNo || ''
  });
  const [deleteObj, setDeleteObj] = useState({});
  const [open, setOpen] = useState(false);
  const [isInit, setIsInit] = useState(false);

  const getList = () => {
    setLoading(true);
    // const queryParams = { ...params, dprequeststatusList: ['Saved'] };
    const queryParams = {
      current: params.page,
      size: params.limit,
      requestNo: params.requestNo,
      startTime: params.startTime,
      endTime: params.endTime
    };
    API.getDprequeststatusList(queryParams)
      .then((response) => {
        setTotal(response?.data?.data?.total || 0);
        handleData(response?.data?.data?.records || []);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    getList();
  }, [params]);

  const saveParamsToUrl = () => {
    const urlParams = {
      page: params.page,
      limit: params.limit,
      startTime: params.startTime,
      endTime: params.endTime,
      requestNo: params?.requestNo
    };
    const url = `?${stringify(urlParams)}`;
    history.push(url);
  };

  useEffect(() => {
    if (isInit) {
      saveParamsToUrl();
    } else {
      setIsInit(true);
    }
  }, [params]);

  const handleData = (rawDataList) => {
    // console.log('Yancy test:', rawDataList);
    const data = [];
    rawDataList.forEach((el) => {
      const rowModel = {
        ...el,
        requestId: el.dprequestID,
        status: el.dprequeststatus,
        submttionDate: el.submissiondate,
        responsibleStaff: el.respstaff,
        approvalManager: el.rmanagername,
        approvalStatus: el.rmanagerapprovalstatus
      };
      data.push(rowModel);
    });
    setRows(data);
  };

  const headCells = [
    { id: 'requestNo', alignment: 'left', label: L('requestId') },
    // { id: 'apptype', alignment: 'left', label: L('type') },
    { id: 'serviceathosp', alignment: 'left', label: 'Institution' },
    { id: 'requestdate', alignment: 'left', label: 'Submission Date' },
    { id: 'requestername', alignment: 'left', label: 'Requester' },
    // { id: 'rmanagername', alignment: 'left', label: "Requester's Manager" },
    // { id: 'dprequeststatus', alignment: 'left', label: 'Progress Status' },
    // { id: 'rmanagerapprovalstatus', alignment: 'left', label: L('approvalStatus') },
    // { id: 'respstaff', alignment: 'left', label: 'Responsible Staff' },
    { id: 'actions', alignment: 'left', label: 'Actions' }
  ];
  // 每行显示的字段
  const fieldList = [
    {
      field: 'requestNo',
      align: 'left',
      renderCell: (row) => `${row.apptype}${row.requestNo}`
    },
    { field: 'serviceathosp', align: 'left' },
    {
      field: 'requestdate',
      align: 'left',
      renderCell: (row) =>
        row.requestdate ? dayjs(row.requestdate).format('DD-MMM-YYYY HH:mm:ss') : ''
    },
    { field: 'requestername', align: 'left' },
    {
      field: 'action',
      align: 'left',
      padding: 'none',
      renderCell: (row) => (
        <>
          <Tooltip title={L('Detail')}>
            <IconButton onClick={() => handleDetail(row)}>{getIcons('detaiEyeIcon')}</IconButton>
          </Tooltip>
          {user.username?.toLowerCase() === row.requesterid?.toLowerCase() && (
            <Tooltip title="Delete">
              <IconButton onClick={() => handleDelete(row)}>{getIcons('delete')}</IconButton>
            </Tooltip>
          )}
        </>
      )
    }
    // { field: 'rmanagername', align: 'left' },
    // { field: 'dprequeststatus', align: 'left' },
    // { field: 'rmanagerapprovalstatus', align: 'left' },
    // {
    //   field: 'respstaff',
    //   align: 'left',
    //   renderCell: (row) => <span style={{ textDecoration: 'underline' }}>{row.respstaff}</span>
    // }
  ];

  // 修改pageIndex
  const handleChangePage = (_, newPage) => {
    const newParams = {
      ...params,
      page: newPage + 1
    };
    setParams(newParams);
  };

  // 修改pageSize
  const handleChangeRowsPerPage = (event) => {
    const newParams = {
      ...params,
      page: 1,
      limit: Number(event.target.value)
    };
    setParams(newParams);
  };

  const handleSearch = (values) => {
    console.log(values);
  };

  const handleDetail = (row) => {
    if (row?.apptype && row?.requestNo) {
      const trueRequestNo = row?.requestNo;
      // if (trueRequestNo.length > 10) {
      //   trueRequestNo = row?.requestNo?.substring(2);
      // }
      history.push(`/request/detail/${trueRequestNo}/${row.apptype?.toUpperCase()}`);
      // history.push(`/request/detail/${row.requestNo}/${row.apptype?.toUpperCase()}`);
    }
  };

  const handleDelete = (row) => {
    setDeleteObj(row);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setTimeout(() => {
      setDeleteObj({});
    }, 200);
  };

  const handleConfirm = () => {
    API.deleteApplication(deleteObj?.requestNo).then((deleteRes) => {
      if (deleteRes?.data?.code === 200) {
        CommonTip.success('Success');
        handleClose();
        getList();
      }
    });
  };

  return (
    <div
      style={{
        marginTop: '2em',
        display: 'flex',
        justifyContent: 'center',
        flexDirection: 'column'
      }}
    >
      <div
        style={{
          fontSize: theme.font.important.size,
          lineHeight: theme.font.important.lineHeight,
          fontWeight: 'bolder',
          color: theme.color.sub.mainText
          // marginTop: '2em'
        }}
      >
        My Draft
      </div>
      <Grid container spacing={6}>
        <Grid item xs={12}>
          <HeadForm params={params} setParams={setParams} isInit={isInit} />
          <br />
          <HAPaper>
            <br />
            <CommonTable
              rows={rows}
              hideUpdate
              hideDetail
              loading={loading}
              deleteAPI={API.deleteMany}
              handleSearch={handleSearch}
              // handleSearch={handleSearch}
              headCells={headCells}
              fieldList={fieldList}
              hideCreate
              hideCheckBox
              hideToolBar
              // actionList={actionList}
              hideActionColumn
            />
            <TablePagination
              rowsPerPageOptions={[10, 50, 100]}
              component="div"
              count={total}
              rowsPerPage={parseInt(params.limit) || 10}
              page={params.page ? params.page - 1 : 0}
              onChangePage={handleChangePage}
              onChangeRowsPerPage={handleChangeRowsPerPage}
              loading={loading}
            />
          </HAPaper>
        </Grid>
      </Grid>

      {/* delete dialog */}
      <WarningDialog
        title="Deletion"
        open={open}
        handleConfirm={handleConfirm}
        handleClose={handleClose}
        content={`Are you sure you want to permanently delete ${deleteObj.requestNo}?`}
        // content={`Whether to delete the application ${deleteObj.requestNo} ?`}
      />
    </div>
  );
}

export default React.memo(WebdpList);
