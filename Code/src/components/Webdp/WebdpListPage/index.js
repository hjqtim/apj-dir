import React, { useEffect, useState } from 'react';
import { Grid, Chip, IconButton, Tooltip, makeStyles } from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import _ from 'lodash';
import dayjs from 'dayjs';
import { stringify, parse } from 'qs';

import {
  TablePagination,
  HAPaper,
  CommonTable,
  WarningDialog,
  CommonTip,
  Loading
} from '../../index';
import API from '../../../api/webdp/webdp';
import SYNCAPI from '../../../api/sync/index';
import HeadForm from './HeadForm';
import Comment from '../../Comment';
import { L } from '../../../utils/lang';
import theme from '../../../utils/theme';
import getIcons from '../../../utils/getIcons';
import AntTab from '../../CustomizeMuiComponent/AntTab';
import AntTabs from '../../CustomizeMuiComponent/AntTabs';
import { setDetail } from '../../../redux/myAction/my-action-actions';
import camundaAPI from '../../../api/camunda';
import { getIdentity } from '../../../utils/getIdentity';

const colorMap = {
  pending: {
    color: '#F99500',
    bg: '#FFF0DB'
  },
  completed: {
    color: '#00AB91',
    bg: '#CDF8E1'
  },
  cancelled: {
    color: '#5C5C5C',
    bg: '#DBDBDB'
  },
  rejected: {
    color: '#FD5841',
    bg: '#F3D2CE'
  }
};

const useStyles = makeStyles(() => ({
  isHiddenCell: (props) => ({
    display: props.isMyApproval ? 'table-cell' : 'none'
  })
}));

function WebdpListPage(props) {
  // isMyRequest is my request page
  // isMyApproval is my approval page
  const { isMyRequest, isMyApproval } = props;
  const history = useHistory();

  const dispatch = useDispatch();
  const classes = useStyles({ isMyApproval });

  const [rows, setRows] = useState([]);
  const [openSync, setOpenSync] = useState(false);
  const [open, setOpen] = useState(false);
  const [commentObj, setCommentObj] = useState({});
  const user = useSelector((state) => state.userReducer?.currentUser) || {};
  const isN3 = getIdentity(user)?.isN3;
  const isN4 = getIdentity(user)?.isN4;
  const isN5 = getIdentity(user)?.isN5;
  const urlObj = parse(history.location.search?.replace('?', '')) || {}; // 根据url获取请求参数
  const [total, setTotal] = React.useState(
    urlObj.pageIndex ? urlObj.pageIndex * urlObj.pageSize : 0
  );
  const [params, setParams] = useState({
    pageIndex: parseInt(urlObj.pageIndex) || 1,
    pageSize: parseInt(urlObj.pageSize) || 10,
    requestNo: urlObj.requestNo || '',
    startDate: urlObj.startDate || '',
    endDate: urlObj.endDate || '',
    hospital: urlObj.hospital || '',
    respStaff: urlObj.respStaff || '',
    stepName: '',
    state: urlObj.state || (isMyRequest ? '' : 'Pending'),
    appType: urlObj.appType || [],
    requester: urlObj.requester || '',
    isMyTeam: urlObj.isMyTeam || (isMyRequest ? 2 : 1)
  });
  const [isInit, setIsInit] = useState(false);
  const [stepNameOptions, setStepNameOptions] = useState([]);

  const getList = () => {
    const queryList = isMyRequest ? API.getMyRequestList : API.getMyAcitionList;
    const Temp = [];
    if (params.hospital) {
      Temp.push({
        key: 'hospital',
        value: params.hospital
      });
    }
    if (params.requestNo) {
      Temp.push({
        key: 'requestNo',
        value: params.requestNo
      });
    }
    if (params.respStaff) {
      Temp.push({
        key: 'respStaff',
        value: params.respStaff
      });
    }
    if (params.requester) {
      Temp.push({
        key: 'requester',
        value: params.requester
      });
    }
    if (params.appType?.length !== 0) {
      Temp.push({
        key: 'appType',
        value: params.appType?.join(',')
      });
    }
    if (params?.state && params?.state === 'Cancelled') {
      Temp.push({
        key: 'state',
        value: 'Cancelled'
      });
    }

    const stepNameParams = stepNameOptions
      .filter((item) => item.name === params.stepName)
      .map((mapItem) => mapItem.id);

    const queryParams = {
      // requestNo: params.requestNo,
      startTime: params.startDate,
      endTime: params.endDate,
      paramVo: Temp.length > 0 ? Temp : undefined,
      actIds: params.stepName ? stepNameParams : undefined,
      isMyTeam: params.isMyTeam,
      current: params.pageIndex,
      size: params.pageSize,
      state: params.state !== 'Cancelled' ? params.state : undefined,
      userId: []
    };

    Loading.show();
    queryList(queryParams)
      .then((listRes) => {
        const newRows = listRes?.data?.data?.list || [];
        // for (let i = 0; i < newRows.length; i += 1) {
        //   newRows[i].requestNo2 = newRows[i].requestNo;
        //   newRows[i].requestNo = newRows[i].variables.requestNo;
        // }

        setRows(newRows);
        const newTotal = listRes?.data?.data?.total || 0;
        setTotal(newTotal);
      })
      .finally(() => {
        Loading.hide();
      });
  };

  const queryStepName = () => {
    camundaAPI.queryStepName().then((stepNameRes) => {
      setStepNameOptions(stepNameRes?.data?.data || []);
    });
  };

  useEffect(() => {
    getList();
  }, [params]);

  useEffect(() => {
    queryStepName();
  }, []);

  const saveParamsToUrl = () => {
    const url = `?${stringify(params)}`;
    history.replace(url);
  };

  useEffect(() => {
    if (isInit) {
      saveParamsToUrl();
    } else {
      setIsInit(true);
    }
  }, [params]);

  const getStatusColor = (state) => {
    const statusValue = state?.toLocaleLowerCase() || '';
    let color = colorMap[statusValue]?.color || '';
    let backgroundColor = colorMap[statusValue]?.bg || '';
    if (!color || !backgroundColor) {
      color = '#5C5C5C';
      backgroundColor = '#DBDBDB';
    }
    return { color, backgroundColor };
  };

  const handleComment = (row) => {
    setOpen(true);
    setCommentObj(row);
  };

  const headCells = [
    { id: 'requestNo', alignment: 'left', label: L('requestId') },
    // { id: 'apptype', alignment: 'left', label: L('type') },
    { id: 'hospital', alignment: 'left', label: 'Institution' },
    { id: 'startTime', alignment: 'left', label: 'Submission Date' },
    { id: 'requester', alignment: 'left', label: 'Requester' },
    { id: 'reference', alignment: 'left', label: 'Institution Reference' },
    {
      id: 'respStaffName',
      alignment: 'left',
      label: 'NMS Responsible Staff',
      headerClassName: classes.isHiddenCell
    },
    { id: 'state', alignment: 'left', label: 'Status' },
    { id: 'actName', alignment: 'left', label: 'Progress' },
    { id: 'action', alignment: 'left', label: 'Actions' }
  ];
  // 每行显示的字段
  const fieldList = [
    {
      field: 'requestNo',
      align: 'left',
      renderCell: (row) => `${row.variables?.appType}${row.requestNo}`
    },
    {
      field: 'hospital',
      align: 'left',
      renderCell: (row) => row.variables?.hospital || ''
    },
    {
      field: 'startTime',
      align: 'left',
      renderCell: (row) =>
        row.startTime ? dayjs(row.startTime).format('DD-MMM-YYYY HH:mm:ss') : ''
    },
    { field: 'requester', align: 'left', renderCell: (row) => row.variables?.requester || '' },
    { field: 'reference', align: 'left', renderCell: (row) => row.variables?.reference || '' },
    {
      field: 'respStaffName',
      align: 'left',
      cellClassName: classes.isHiddenCell,
      renderCell: (row) => row.variables?.respStaffName || ''
    },
    {
      field: 'state',
      align: 'left',
      renderCell: (row) => (
        <Chip
          label={_.capitalize(row.state || '')}
          style={{
            width: 90,
            fontWeight: 500,
            ...getStatusColor(row.state)
          }}
        />
      )
    },
    { field: 'actName', align: 'left' },
    {
      field: 'action',
      align: 'left',
      padding: 'none',
      renderCell: (row) => (
        <>
          <Tooltip title="Detail">
            <IconButton onClick={() => handleDetail(row)}>{getIcons('detaiEyeIcon')}</IconButton>
          </Tooltip>
          {isMyRequest &&
            row.feedBack === false &&
            row.startUserId?.toLowerCase() === user.username?.toLowerCase() &&
            row.state === 'Completed' && (
              <Tooltip title="Comment">
                <IconButton onClick={() => handleComment(row)}>{getIcons('comment')}</IconButton>
              </Tooltip>
            )}
        </>
      )
    }
  ];

  let tabsValues = [
    { label: 'All', value: '' },
    { label: 'Outstanding', value: 'Pending' }
  ];

  if (isMyRequest) {
    tabsValues = [
      ...tabsValues,
      { label: 'Completed', value: 'Completed' },
      { label: 'Cancelled', value: 'Cancelled' }
    ];
  } else {
    tabsValues = [...tabsValues, { label: 'Handled', value: 'Handled' }];
  }

  // 修改pageIndex
  const handleChangePage = (_, newPage) => {
    const newParams = {
      ...params,
      pageIndex: newPage + 1
    };
    setParams(newParams);
  };

  // 修改pageSize
  const handleChangeRowsPerPage = (event) => {
    const newParams = {
      ...params,
      pageIndex: 1,
      pageSize: Number(event.target.value)
    };
    setParams(newParams);
  };

  const tabsChange = (e, value) => {
    const newParams = { ...params, pageIndex: 1, state: value };
    setParams(newParams);
  };

  const handleSearch = (values) => {
    console.log(values);
  };

  const handleDetail = (row) => {
    console.log('handleDetail', row);
    // const apptype = row?.appType;
    const apptype = row?.variables?.appType;

    // const tLength = row?.requestNo?.length;
    // let trueRequestNo  = row?.requestNo;
    // if (tLength > 10) {
    //   trueRequestNo = row?.requestNo?.substring(2);
    // // console.log('Yancy test :', row.requestNo, apptype, trueRequestNo);
    // if (apptype === 'DP' || apptype === 'AP') {
    //   dispatch(setDetail(row));
    //   history.push(`${history.location.pathname}/detail/${trueRequestNo}/${apptype.toUpperCase()}`);
    // } else if (apptype === 'DE' && isMyRequest) {
    //   history.push(`/webdp/deForm/detail/de/re/${trueRequestNo}`);
    // } else if (apptype === 'DE' && isMyApproval) {
    //   history.push(`/webdp/deForm/detail/de/n3/${trueRequestNo}`);
    // } else if (apptype === 'LP' && isMyRequest) {
    //   history.push(`/webdp/looping/detail/${trueRequestNo}`);
    // } else if (apptype === 'LP' && isMyApproval) {
    //   history.push(`/webdp/looping/approval/${trueRequestNo}`);
    // }

    if (apptype === 'DP' || apptype === 'AP') {
      dispatch(setDetail(row));
      history.push(`${history.location.pathname}/detail/${row.requestNo}/${apptype.toUpperCase()}`);
    } else if (apptype === 'DE' && isMyRequest) {
      history.push(`/webdp/deForm/detail/de/re/${row.requestNo}`);
    } else if (apptype === 'DE' && isMyApproval) {
      history.push(`/webdp/deForm/detail/de/n3/${row.requestNo}`);
    } else if (apptype === 'LP' && isMyRequest) {
      history.push(`/webdp/looping/detail/${row.requestNo}`);
    } else if (apptype === 'LP' && isMyApproval) {
      history.push(`/webdp/looping/approval/${row.requestNo}`);
    } else if (apptype === 'IP' && isMyRequest) {
      history.push(`/IPAddress/detail/${row.requestNo}`);
    } else if (apptype === 'IP' && isMyApproval) {
      history.push(`/IPAddress/approval/${row.requestNo}`);
    } else if (apptype === 'IPR' && isMyRequest) {
      history.push(`/IPAddress/IPAddressRelease/detail/${row.requestNo}`);
    } else if (apptype === 'IPR' && isMyApproval) {
      history.push(`/IPAddress/IPAddressRelease/approval/${row.requestNo}`);
    } else if (apptype === 'IPU' && isMyRequest) {
      history.push(`/IPAddress/IPAddressUpdate/detail/${row.requestNo}`);
    } else if (apptype === 'IPU' && isMyApproval) {
      history.push(`/IPAddress/IPAddressUpdate/approval/${row.requestNo}`);
    } else if (apptype === 'RM' && isMyApproval) {
      history.push(`/resourcemanage/approval/${row.requestNo}`);
    } else if (apptype === 'RM' && isMyRequest) {
      history.push(`/resourcemanage/detail/${row.requestNo}`);
    } else if (apptype === 'RP' && isMyApproval) {
      history.push(`/NetworkInformation/Replace/${row.requestNo}`);
    }
  };

  const handleSyncData = () => {
    setOpenSync(false);
    Loading.show();
    SYNCAPI.oneClickSync()
      .then((res) => {
        if (res?.data?.status === 200) CommonTip.success('Success');
      })
      .finally(() => {
        Loading.hide();
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
        }}
      >
        {isMyRequest ? 'My Request' : 'My Action'}

        {(isN3 || isN4 || isN5) && (
          <Tooltip placement="top" title="Sync">
            <IconButton onClick={() => setOpenSync(true)}>{getIcons('syncIcon')}</IconButton>
          </Tooltip>
        )}
      </div>
      <Grid container spacing={6}>
        <Grid item xs={12}>
          <HeadForm
            params={params}
            setParams={setParams}
            isInit={isInit}
            isMyApproval={isMyApproval}
            stepNameOptions={stepNameOptions}
          />
          <br />
          <HAPaper>
            <AntTabs value={params.state} onChange={tabsChange} textColor="primary">
              {tabsValues &&
                tabsValues.map((item) => (
                  <AntTab key={item.value} label={item.label} value={item.value} />
                ))}
            </AntTabs>
            <br />
            <CommonTable
              rows={rows}
              hideUpdate
              hideDetail
              hideActionColumn
              handleSearch={handleSearch}
              // handleSearch={handleSearch}
              headCells={headCells}
              fieldList={fieldList}
              hideCreate
              hideCheckBox
              hideToolBar
              // actionList={actionList}
            />
            <TablePagination
              rowsPerPageOptions={[10, 50, 100]}
              component="div"
              count={total}
              rowsPerPage={parseInt(params.pageSize) || 10}
              page={params.pageIndex ? params.pageIndex - 1 : 0}
              onChangePage={handleChangePage}
              onChangeRowsPerPage={handleChangeRowsPerPage}
            />
          </HAPaper>
        </Grid>
      </Grid>

      <Comment
        open={open}
        setOpen={setOpen}
        commentObj={commentObj}
        setCommentObj={setCommentObj}
        getList={getList}
      />

      <WarningDialog
        open={openSync}
        handleConfirm={handleSyncData}
        handleClose={() => setOpenSync(false)}
        content="This will synchronize all the data. Are you sure?"
      />
    </div>
  );
}

export default React.memo(WebdpListPage);
