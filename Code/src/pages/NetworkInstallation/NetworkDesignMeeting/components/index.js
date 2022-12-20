import React, { memo, useEffect } from 'react';
import { useFormik } from 'formik';
import { useHistory } from 'react-router';
import {
  IconButton,
  Tooltip
  // makeStyles,Grid, Button
} from '@material-ui/core';
// import dayjs from 'dayjs';
import EditIcon from '@material-ui/icons/Edit';
import HeadForm from './HeadForm';
import { CommonDataGrid, WarningDialog } from '../../../../components';
import { useGlobalStyles } from '../../../../style';
import meetingAPI from '../../../../api/networkdesign/index';
import getIcons from '../../../../utils/getIcons';

const MeetingList = () => {
  const globalclasses = useGlobalStyles();
  const history = useHistory();
  const formik = useFormik({
    initialValues: {
      columns: [
        {
          field: 'id',
          headerName: 'ID',
          width: 100
        },
        {
          field: 'meetingNo',
          headerName: 'Meeting No.',
          width: 150
        },
        {
          field: 'requesterName',
          headerName: 'Requester',
          // width: 280
          flex: 1
        },
        {
          field: 'meetingPlace',
          headerName: 'Meeting Place',
          // width: 280
          flex: 1
        },
        {
          field: 'createdDate',
          headerName: 'Created Date',
          width: 180
        },
        {
          field: 'startDate',
          headerName: 'Start Date',
          width: 180
        },
        {
          field: 'targetDate',
          headerName: 'Target Date',
          width: 180
        },
        {
          field: 'actions',
          headerName: 'Actions',
          headerAlign: 'center',
          align: 'center',
          hide: false,
          width: 180,
          filterable: false,
          renderCell: ({ row }) => (
            <div>
              <Tooltip title="Detail">
                <IconButton
                  onClick={() => {
                    // console.log('detail', row);
                    toDetail(row.meetingNo);
                  }}
                >
                  {getIcons('detaiEyeIcon')}
                </IconButton>
              </Tooltip>
              <Tooltip title="Edit">
                <IconButton
                  onClick={() => {
                    // console.log('edit');
                    toEdit(row.meetingNo);
                  }}
                >
                  <EditIcon style={{ width: '20px', height: '20px', color: '#229FFA' }} />
                </IconButton>
              </Tooltip>
              <Tooltip title="Delete">
                <IconButton
                  onClick={() => {
                    // console.log('delete');
                    toDelete(row.meetingNo);
                  }}
                >
                  {getIcons('delete')}
                </IconButton>
              </Tooltip>
              <Tooltip title="Mail Again">
                <IconButton
                  onClick={() => {
                    // console.log('delete');
                    toMailAgain(row.meetingNo);
                  }}
                >
                  {getIcons('email')}
                </IconButton>
              </Tooltip>
            </div>
          )
        }
      ],
      rows: [],
      total: 0,
      pageSize: 10,
      pageNo: 1,
      loading: false,
      open: false,
      open2: false,
      meetingNo: ''
    }
  });
  const { columns, rows, total, pageSize, loading, open, meetingNo, open2 } = formik.values;
  const { setFieldValue } = formik;

  const onPageSizeChange = (value) => {
    // console.log('onPageSizeChange', value);
    setFieldValue(`pageSize`, value);
  };
  // const onPageChange = (value) => {
  //   console.log('onPageChange', value);
  // };

  // 调起 构建 会议 模块
  const toAddMeeting = () => {
    history.push('/NetworkInstallation/NetworkDesignMeeting/addmeeting');
  };

  // 去detail
  const toDetail = (meetingNo) => {
    history.push(`/NetworkInstallation/NetworkDesignMeeting/meeting/detail/${meetingNo}`);
  };

  // 去 编辑
  const toEdit = (meetingNo) => {
    history.push(`/NetworkInstallation/NetworkDesignMeeting/meeting/edit/${meetingNo}`);
  };

  // 去删除
  const toDelete = (meetingNo) => {
    // console.log('toDelete', meetingNo);
    setFieldValue(`meetingNo`, meetingNo);
    setFieldValue(`open`, true);
  };
  // 关闭 删除 提示
  const handleClose = () => {
    setFieldValue(`open`, false);
  };
  // 确认 删除
  const handleConfirm = () => {
    console.log('handleConfirm');
    setFieldValue(`open`, false);
  };

  // Mail Again
  const toMailAgain = () => {
    setFieldValue(`open2`, true);
  };
  const handleConfrmMail = () => {
    console.log('mail again');
    setFieldValue(`open2`, false);
  };
  // 关闭 删除 提示
  const handleClose2 = () => {
    setFieldValue(`open2`, false);
  };

  // 获取 会议 列表
  const getMeetingListInfo = (param) => {
    setFieldValue(`loading`, true);
    let obj = {};
    obj = param;
    meetingAPI
      .getMeetingList(obj)
      .then((res) => {
        if (res?.data?.code === 200) {
          const networkDesignMeetingList = res?.data?.data?.networkDesignMeetingList;
          // console.log('getMeetingList', networkDesignMeetingList);
          setFieldValue(`rows`, networkDesignMeetingList);
          setFieldValue(`total`, networkDesignMeetingList?.length);
        }
      })
      .finally(() => {
        setFieldValue(`loading`, false);
      });
  };

  useEffect(() => {
    getMeetingListInfo();
  }, []);

  return (
    <>
      <div>
        {/* 搜索模块 */}
        <div style={{ marginBottom: 30 }}>
          <HeadForm getMeetingListInfo={getMeetingListInfo} toAddMeeting={toAddMeeting} />
        </div>
        {/* 会议列表 */}
        <div style={{ height: 680 }}>
          <CommonDataGrid
            className={globalclasses.fixDatagrid}
            style={{ height: 680, overflowY: 'auto' }}
            minHeight={680}
            rows={rows}
            rowCount={total}
            columns={columns}
            loading={loading}
            // paginationMode="server"
            // page={pageNo}
            pageSize={pageSize}
            disableSelectionOnClick
            rowsPerPageOptions={[10, 20, 50]}
            onPageSizeChange={onPageSizeChange}
            // onPageChange={onPageChange}
          />
        </div>
      </div>
      <WarningDialog
        open={open}
        handleConfirm={handleConfirm}
        handleClose={handleClose}
        content={`Whether to delete this record ${meetingNo} ?`}
      />
      <WarningDialog
        open={open2}
        handleConfirm={handleConfrmMail}
        handleClose={handleClose2}
        content={`Whether to mail this record ${meetingNo} again ?`}
      />
    </>
  );
};

export default memo(MeetingList);
