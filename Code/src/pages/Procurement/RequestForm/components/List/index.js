import React, { useEffect, useState } from 'react';
import { Grid, Tooltip, IconButton } from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import { stringify, parse } from 'qs';
import { useSelector } from 'react-redux';
import { TablePagination, HAPaper, CommonTable, WarningDialog } from '../../../../../components';
// import CommonTip from '../../../../../components/CommonTip';
import API from '../../../../../api/webdp/webdp';
import HeadForm from './HeadForm';
import { L } from '../../../../../utils/lang';
import getIcons from '../../../../../utils/getIcons';
import theme from '../../../../../utils/theme';

function ReuqestFormList() {
  const history = useHistory();
  const user = useSelector((state) => state.userReducer?.currentUser) || {};
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  const urlObj = parse(history.location.search?.replace('?', '')) || {}; // 根据url获取请求参数
  const [total, setTotal] = React.useState(urlObj.page ? urlObj.page * urlObj.limit : 0);
  const [params, setParams] = useState({
    page: parseInt(urlObj.page) || 1,
    limit: parseInt(urlObj.limit) || 10,
    // startTime: urlObj.startTime || '',
    // endTime: urlObj.endTime || '',
    reqNo: urlObj.reqNo || ''
  });
  const [deleteObj, setDeleteObj] = useState({});
  const [open, setOpen] = useState(false);
  const [isInit, setIsInit] = useState(false);

  const getList = () => {
    setLoading(true);
    const queryParams = {
      // current: params.page,
      // size: params.limit,
      // requestNo: params.requestNo,
      // startTime: params.startTime,
      // endTime: params.endTime
      pageIndex: params.page,
      pageSize: params.limit,
      queryEntity: {
        reqNo: params?.reqNo,
        status: params?.status
      }
    };
    API.ncsGetRequestList(queryParams)
      .then((response) => {
        console.log(response);
        setTotal(response?.data?.data?.total || 0);
        handleData(response?.data?.data?.items || []);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    getList();
    console.log(add(2, 3));
  }, [params]);

  const add = (a, b) => {
    let i = 0;
    while (b !== 0) {
      // eslint-disable-next-line no-bitwise
      const c = a ^ b;
      console.log(`c: ${c}`, i);
      // eslint-disable-next-line no-bitwise
      b = (a & b) << 1;
      console.log(`b: ${b}`, i);
      a = c;
      i += 1;
    }
    return a;
  };

  const saveParamsToUrl = () => {
    const urlParams = {
      page: params.page,
      limit: params.limit,
      // startTime: params.startTime,
      // endTime: params.endTime,
      reqNo: params?.reqNo
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
    // const data = [];
    // rawDataList.forEach((el) => {
    //   const rowModel = {
    //     ...el,
    //     requestId: el.dprequestID,
    //     status: el.dprequeststatus,
    //     submttionDate: el.submissiondate,
    //     responsibleStaff: el.respstaff,
    //     approvalManager: el.rmanagername,
    //     approvalStatus: el.rmanagerapprovalstatus
    //   };
    //   data.push(rowModel);
    // });
    setRows(rawDataList);
  };

  const headCells = [
    { id: 'reqNo', alignment: 'left', label: L('reqNo') },
    { id: 'vendor', alignment: 'left', label: L('vendor') },
    { id: 'respStaff', alignment: 'left', label: L('respStaff') },
    { id: 'contract', alignment: 'left', label: L('contract') },
    { id: 'status', alignment: 'left', label: L('status') },
    { id: 'jobCompletionDate', alignment: 'left', label: L('jobCompletionDate') },
    { id: 'action', alignment: 'left', label: L('Actions') }
  ];
  // 每行显示的字段
  const fieldList = [
    {
      field: 'reqNo',
      align: 'left'
    },
    { field: 'vendor', align: 'left' },
    {
      field: 'respStaff',
      align: 'left',
      renderCell: (row) => <span style={{ textDecoration: 'underline' }}>{row.respStaff}</span>
    },
    { field: 'contract', align: 'left' },
    {
      field: 'status',
      align: 'left'
    },
    {
      field: 'jobCompletionDate',
      align: 'left'
    },
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
    const reqNo = row?.reqNo;
    history.push(`/Procurement/RequestForm/Detail?reqNo=${reqNo}`);
    // if (row?.apptype && row?.requestNo) {
    //   const trueRequestNo = row?.requestNo;
    //   // if (trueRequestNo.length > 10) {
    //   //   trueRequestNo = row?.requestNo?.substring(2);
    //   // }
    //   history.push(`/request/detail/${trueRequestNo}/${row.apptype?.toUpperCase()}`);
    //   // history.push(`/request/detail/${row.requestNo}/${row.apptype?.toUpperCase()}`);
    // }
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
    // API.deleteApplication(deleteObj?.requestNo).then((deleteRes) => {
    //   if (deleteRes?.data?.code === 200) {
    //     CommonTip.success('Success');
    //     handleClose();
    //     getList();
    //   }
    // });
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
        Request Form
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
              // deleteAPI={API.deleteMany}
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

export default React.memo(ReuqestFormList);
