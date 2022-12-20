import React, { useState, useEffect } from 'react';
import { makeStyles, IconButton, Checkbox } from '@material-ui/core';
import {
  GridToolbarFilterButton,
  getGridStringOperators,
  getGridDateOperators
} from '@material-ui/data-grid';
import { createTheme } from '@material-ui/core/styles';
import { Rating } from '@material-ui/lab';
import dayjs from 'dayjs';
import Detail from './Detail';
// import SendEmail from './SendEmail';
import {
  HAPaper,
  CommonDataGrid,
  WarningDialog,
  CommonTip,
  Loading
} from '../../../../../components';
// import  from '../../../../../components/';
import getIcons from '../../../../../utils/getIcons';
import dataGridTooltip from '../../../../../utils/dataGridTooltip';
import API from '../../../../../api/webdp/webdp';

const defaultTheme = createTheme();
const useStyles = makeStyles(
  (theme) => ({
    root: {
      padding: theme.spacing(0.5, 0.5, 0),
      justifyContent: 'space-between',
      display: 'flex',
      alignItems: 'flex-start',
      flexWrap: 'wrap'
    },
    textField: {
      [theme.breakpoints.down('xs')]: {
        width: '100%'
      },
      margin: theme.spacing(1, 0.5, 1.5),
      '& .MuiSvgIcon-root': {
        marginRight: theme.spacing(0.5)
      },
      '& .MuiInput-underline:before': {
        borderBottom: `1px solid ${theme.palette.divider}`
      }
    }
  }),
  { defaultTheme }
);

const List = () => {
  const [params, setParams] = useState({
    pageIndex: 1,
    pageSize: 10
  });

  const [rows, setRows] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  const [open, setOpen] = useState(false);
  const [obj, setObj] = useState({});
  const [detailList, setDetailList] = useState([]);
  const [isGetDetail, setIsGetDetail] = useState(false);
  const [isEmailOpen, setIsEmailOpen] = useState(false);
  const [emailObj, setEmailObj] = useState({});
  const [isSendEmail, setIsSendEmail] = useState(false);
  const [filterModel, setFilterModel] = useState({ items: [] });

  const queryFeedbackList = () => {
    setLoading(true);
    const queryParams = {
      ...params
    };
    const { columnField, operatorValue, value } = filterModel?.items?.[0] || {};
    if (columnField === 'createdDate' && value) {
      if (operatorValue === 'is') {
        queryParams.startTime = dayjs(value).format('YYYY-MM-DD 00:00:00');
        queryParams.endTime = dayjs(value).format('YYYY-MM-DD 23:59:59');
      }
      if (operatorValue === 'after') {
        queryParams.startTime = dayjs(value).format('YYYY-MM-DD 00:00:00');
      }
      if (operatorValue === 'before') {
        queryParams.endTime = dayjs(value).format('YYYY-MM-DD 23:59:59');
      }
    } else if (columnField !== 'createdDate') {
      queryParams[columnField] = value || undefined;
    }

    API.getFeedbackList(queryParams)
      .then((res) => {
        setRows(res?.data?.data?.records || []);
        setTotal(res?.data?.data?.total || 0);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const getDetailList = (row) => {
    const queryParams = {
      pageIndex: 1,
      pageSize: 9999,
      commentId: row.id
    };
    setIsGetDetail(true);
    setOpen(true);
    setObj(row);
    API.getFeedbackDetailList(queryParams)
      .then((res) => {
        setDetailList(res?.data?.data?.records || []);
      })
      .finally(() => {
        setIsGetDetail(false);
      });
  };

  useEffect(() => {
    queryFeedbackList();
  }, [params]);

  const QuickSearchToolbar = () => {
    const classes = useStyles();
    return (
      <div className={classes.root}>
        <div>
          <GridToolbarFilterButton />
        </div>
      </div>
    );
  };

  const originDateFilterOperators = getGridDateOperators();
  const filterOperators = [getGridStringOperators()[0]];
  const dateFilterOperators = [
    originDateFilterOperators[0],
    originDateFilterOperators[2],
    originDateFilterOperators[4]
  ];

  const handleCheckbox = (row, newState) => {
    const updateParams = {
      id: row.id,
      state: newState ? 1 : 0
    };
    API.updateCommentState(updateParams)
      .then((res) => {
        if (res?.data?.status === 200) {
          CommonTip.success('Success', 2000);
        }
      })
      .finally(() => {
        handleEmailClose();
        queryFeedbackList();
        Loading.hide();
      });
  };

  const columns = [
    {
      field: 'createdDate',
      headerName: 'Date',
      flex: 1,
      type: 'date',
      filterOperators: dateFilterOperators,
      minWidth: 100,
      sortable: false,
      renderCell: ({ row }) => {
        const newRow = {
          ...row,
          value: row.createdDate ? dayjs(row.createdDate).format('DD-MMM-YYYY HH:mm:ss') : ''
        };
        return dataGridTooltip(newRow);
      }
    },
    {
      field: 'requestNo',
      headerName: 'Request No.',
      flex: 1,
      filterOperators,
      minWidth: 140,
      sortable: false,
      renderCell: ({ row }) => `${row.appType || ''}${row.requestNo}`
    },
    {
      field: 'requester',
      headerName: 'Requester',
      flex: 1,
      filterOperators,
      sortable: false,
      minWidth: 130
    },
    {
      field: 'institution',
      headerName: 'Institution',
      flex: 1,
      filterable: false,
      sortable: false,
      minWidth: 130
    },
    {
      field: 'rating',
      headerName: 'Rating',
      flex: 1,
      filterable: false,
      sortable: false,
      minWidth: 100,
      renderCell: ({ row }) => <Rating value={row.rating} readOnly size="small" />
    },
    {
      field: 'comment',
      headerName: 'Comment',
      flex: 1,
      filterable: false,
      sortable: false,
      minWidth: 120,
      renderCell: ({ row }) => {
        const newRow = { ...row, value: row.comment };
        return dataGridTooltip(newRow, 'left');
      }
    },
    {
      field: 'respStaff',
      headerName: 'Resp Staff',
      flex: 1,
      filterable: false,
      sortable: false,
      minWidth: 130
    },
    {
      field: 'handle',
      headerName: 'Handled',
      flex: 1,
      filterable: false,
      sortable: false,
      minWidth: 130
    },
    {
      field: 'state',
      headerName: 'Status',
      // flex: 1,
      filterable: false,
      sortable: false,
      width: 80,
      renderCell: ({ row }) => (
        <Checkbox
          checked={row.state === 1}
          size="small"
          onChange={(e, v) => handleCheckbox(row, v)}
        />
      )
    },
    {
      field: 'action',
      headerName: 'Actions',
      minWidth: 120,
      // flex: 1,
      filterable: false,
      sortable: false,
      renderCell: ({ row }) => (
        <>
          <IconButton
            onClick={() => {
              getDetailList(row);
            }}
          >
            {getIcons('detaiEyeIcon')}
          </IconButton>
          {row.state !== 1 && (
            <IconButton
              onClick={() => {
                setIsEmailOpen(true);
                setEmailObj(row);
              }}
            >
              {getIcons('email', '#229FFA')}
            </IconButton>
          )}
        </>
      )
    }
  ];

  const onPageChange = (newPage) => {
    const newParams = {
      ...params,
      pageIndex: newPage
    };
    setParams(newParams);
  };

  const onPageSizeChange = (newPageSize) => {
    const newParams = {
      ...params,
      pageIndex: 1,
      pageSize: newPageSize
    };
    setParams(newParams);
  };

  const closeDetail = () => {
    setOpen(false);
    setTimeout(() => {
      setDetailList([]);
      setObj({});
    }, 200);
  };

  const handleEmailClose = () => {
    setIsSendEmail(false);
    setIsEmailOpen(false);
    setEmailObj({});
  };

  const handleEmailConfirm = () => {
    if (isSendEmail || !emailObj?.id) {
      return;
    }
    const sendParams = {
      feedbackCommentId: emailObj.id
    };
    setIsSendEmail(true);
    Loading.show();
    API.sendFeedbackEmail(sendParams)
      .then((res) => {
        if (res?.data?.status === 200) {
          handleCheckbox(emailObj, true);
        }
      })
      .catch(() => {
        Loading.hide();
        handleEmailClose();
      });
  };

  const onFilterModelChange = (model) => {
    setFilterModel(model);
    if (model?.items?.length) {
      const newParams = {
        ...params,
        pageIndex: 1
      };
      setParams(newParams);
    }
  };

  return (
    <>
      <HAPaper>
        <CommonDataGrid
          columns={columns}
          rows={rows}
          pageSize={params.pageSize}
          page={params.pageIndex}
          components={{
            Toolbar: QuickSearchToolbar
          }}
          loading={loading}
          onPageChange={onPageChange}
          onPageSizeChange={onPageSizeChange}
          rowCount={total}
          paginationMode="server"
          filterMode="server"
          filterModel={filterModel}
          onFilterModelChange={(model) => onFilterModelChange(model)}
        />
      </HAPaper>

      <Detail
        open={open}
        obj={obj}
        detailList={detailList}
        getDetailList={getDetailList}
        isGetDetail={isGetDetail}
        closeDetail={closeDetail}
        queryFeedbackList={queryFeedbackList}
      />

      <WarningDialog
        open={isEmailOpen}
        handleConfirm={handleEmailConfirm}
        handleClose={handleEmailClose}
        content="Once the email is sent, this feedback is considered complete and whether to continue ?"
      />
    </>
  );
};

export default List;
