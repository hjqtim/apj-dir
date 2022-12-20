import dayjs from 'dayjs';
import React, { useState, useEffect } from 'react';
import { makeStyles, Button, Tooltip, IconButton } from '@material-ui/core';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import {
  CommonTable,
  CommonTip,
  WarningDialog,
  CommonDialog,
  HAPaper
} from '../../../../components';
import Loading from '../../../../components/Loading';
import API from '../../../../api/webdp/webdp';
import getIcons from '../../../../utils/getIcons';
import { formatterMoney, countTotal } from '../../../../utils/tools';
import OrderForm from './OrderForm';

const useStyles = makeStyles((theme) => ({
  main: {
    padding: theme.spacing(5)
  },
  headerStyle: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-end'
  },
  total: {
    paddingLeft: theme.spacing(10)
  },
  symbol: {
    margin: theme.spacing(2),
    fontSize: '18px',
    fontWeight: 700
  },
  addBtn: {
    display: 'flex',
    padding: theme.spacing(5, 10, 0, 10),
    justifyContent: 'flex-end'
  },
  highlightNo: {
    color: '#229FFA'
  },
  notPadding: {
    padding: 0
  }
}));

const BillList = () => {
  const classes = useStyles();
  const { requestId, apptype } = useParams();
  const [orderDetaiDialog, setOrderDetaiDialog] = useState(false);
  const [notDeleteDialog, setNotDeleteDialog] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [clickRowData, setClickRowData] = useState({});
  const [correlatePrcode, setCorrelatePrcode] = useState('');
  const [isDetail, setIsDetail] = useState(false);
  const [isAdd, setIsAdd] = useState(false);
  const [isEdict, setIsEdict] = useState(false);
  const [rows, setRows] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [loading, setLoading] = useState(false);
  const readOnly = useSelector((state) => state.myAction.requestForm?.readOnly) || false;
  const dprequeststatusno = useSelector(
    (state) => state.myAction.requestForm?.dpRequest?.dprequeststatusno
  );
  const lanpool = useSelector((state) => state.myAction.requestForm?.dpRequest?.lanpool);

  const headCells = [
    { id: 'reqNo', alignment: 'left', label: 'Req. No' },
    { id: 'expenditureFY', alignment: 'left', label: 'FY' },
    { id: 'vendor', alignment: 'left', label: 'Vendor' },
    { id: 'description', alignment: 'left', label: 'Description' },
    { id: 'reqIssuedOn', alignment: 'left', label: 'Req Issued On' },
    { id: 'totalExpense', alignment: 'right', label: 'Total Exp.' },
    { id: 'due', alignment: 'left', label: 'Due' },
    { id: 'status', alignment: 'left', label: 'Status' },
    { id: 'respStaff', alignment: 'left', label: 'Resp Staff' },
    { id: 'action', alignment: 'left', label: 'Actions' }
  ];

  const fieldList = [
    { field: 'reqNo', align: 'left' },
    { field: 'expenditureFY', align: 'left' },
    { field: 'vendor', align: 'left' },
    { field: 'description', align: 'left' },
    {
      field: 'reqIssuedDate',
      align: 'left',
      renderCell: (row) => (
        <p>{row?.reqIssuedDate ? dayjs(row?.reqIssuedDate).format('YYYY-MMM-DD') : ''}</p>
      )
    },
    {
      field: 'totalExpense',
      align: 'right',
      renderCell: (row) => formatterMoney(row?.totalExpense)
    },
    { field: 'due', align: 'left' },
    { field: 'status', align: 'left' },
    { field: 'respStaff', align: 'left' },
    {
      field: 'Actions',
      align: 'left',
      cellClassName: classes.notPadding,
      renderCell: (row) => (
        <div style={{ margin: 0 }}>
          <Tooltip title="Detail">
            <IconButton onClick={() => handleDetail(row)}>{getIcons('detaiEyeIcon')}</IconButton>
          </Tooltip>
          <Tooltip title="Edit">
            <IconButton
              // disabled={readOnly}
              onClick={() => handleEdict(row)}
            >
              {getIcons('edictIcon')}
            </IconButton>
          </Tooltip>
          {!row?.reqIssuedDate && (
            <Tooltip title="Delete">
              <IconButton disabled={readOnly} onClick={() => handleDelete(row)}>
                {getIcons('delete')}
              </IconButton>
            </Tooltip>
          )}
        </div>
      )
    }
  ];

  const handleDetail = (row) => {
    setClickRowData(row);
    setIsDetail(true);
    setOrderDetaiDialog(true);
  };
  const handleEdict = (row) => {
    setOrderDetaiDialog(true);
    setIsEdict(true);
    setClickRowData(row);
  };
  const handleDelete = (row) => {
    setDeleteDialog(true);
    setClickRowData(row);
  };

  // 删除请求
  const removeOrder = async () => {
    Loading.show();
    API.removeOrder(clickRowData?.id || '')
      .then((res) => {
        if (res?.data?.data?.status === 2) {
          setCorrelatePrcode(res?.data?.data?.prCode);
          setDeleteDialog(false);
          setNotDeleteDialog(true);
        } else if (res?.data?.data?.status === 0) {
          CommonTip.error(`Deleted fail.`);
        } else {
          setDeleteDialog(false);
          CommonTip.success(`Deleted successfully.`);
          getOrderList();
        }
      })
      .finally(() => {
        Loading.hide();
      });
  };

  useEffect(() => {
    getOrderList();
  }, []);

  const getOrderList = async () => {
    setLoading(true);
    API.getOrderList(requestId, apptype)
      .then((res) => {
        let resOrderList = res?.data?.data?.orderList || [];
        setTotalPrice(res?.data?.data?.totalPrice || 0);
        if (resOrderList.length > 0) {
          resOrderList = res.data.data.orderList.map((item) => {
            let due = '';
            const instDateTo = item?.instDateTo ? dayjs(item.instDateTo).format('YYYY-MM-DD') : '';
            if (
              item.status?.toLocaleLowerCase()?.includes('completed') &&
              item.instDateTo &&
              item.jobCompletionDate
            ) {
              due = dayjs(instDateTo).diff(item.jobCompletionDate, 'day');
            } else if (item.instDateTo) {
              due = dayjs(instDateTo).diff(dayjs().format('YYYY-MM-DD'), 'day');
            }

            const newItem = { ...item, due };
            return newItem;
          });
        }
        setRows(resOrderList);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const total = countTotal(rows, 'totalExpense');

  const controlDialog = (bool) => {
    setIsEdict(false);
    setIsAdd(bool);
    setOrderDetaiDialog(bool);
  };

  return (
    <>
      <HAPaper>
        <div className={classes.headerStyle}>
          {dprequeststatusno > 50 ? (
            <div className={classes.total}>
              <span style={{ fontSize: '16px', fontWeight: 700 }}> Total Income: </span>
              <span> {formatterMoney(totalPrice)} </span>
              <span style={{ fontSize: '16px', fontWeight: 700, marginLeft: '20px' }}>
                Total Expenses:
              </span>
              <span> {formatterMoney(total)}</span>
              <span style={{ fontSize: '16px', fontWeight: 700, marginLeft: '20px' }}>
                Net Balance:
              </span>
              <span style={{ color: totalPrice - total < 0 ? 'red' : '#000' }}>
                &nbsp;{formatterMoney(totalPrice - total)}
              </span>
            </div>
          ) : (
            <div />
          )}

          <div className={classes.addBtn}>
            <Button
              variant="contained"
              color="secondary"
              size="small"
              disabled={Boolean(readOnly)}
              startIcon={getIcons('addIcon')}
              onClick={() => {
                if (parseInt(lanpool) >= 0) {
                  controlDialog(true);
                } else {
                  CommonTip.warning(
                    'Please declare whether this request is LAN Pool or not at cost estimation before creating new order.'
                  );
                }
              }}
            >
              Add
            </Button>
          </div>
        </div>

        <div className={classes.main}>
          <CommonTable
            rows={rows}
            headCells={headCells}
            fieldList={fieldList}
            hideCreate
            hideDetail
            hideUpdate
            hideCheckBox
            hideActionColumn
            hideToolBar
            loading={loading}
          />
        </div>
      </HAPaper>
      {/* 删除会话框 */}
      <WarningDialog
        open={deleteDialog}
        handleConfirm={removeOrder}
        title="Deletion"
        handleClose={() => setDeleteDialog(false)}
        content={
          <div>
            Are you sure you want to permanently delete
            <span className={classes.highlightNo}> {clickRowData?.reqNo} </span>?
          </div>
        }
      />
      {/* 不能删除的提醒 */}
      <WarningDialog
        open={notDeleteDialog}
        title="Warning"
        CancelText="OK"
        isHideConfirm
        handleClose={() => {
          setNotDeleteDialog(false);
          setCorrelatePrcode('');
        }}
        content={
          <div>
            <span className={classes.highlightNo}> {clickRowData?.reqNo} </span> is currently
            associated with PR <span className={classes.highlightNo}> {correlatePrcode} </span> .
            Please ask PR administrator to exclude it from PR
            <span className={classes.highlightNo}> {correlatePrcode}</span> before making any
            changes.
          </div>
        }
      />
      {/* 订单详情会话框 */}
      <CommonDialog
        title="Order Detail"
        content={
          <OrderForm
            isEdict={isEdict}
            isAdd={isAdd}
            isDetail={isDetail}
            getOrderList={getOrderList}
            reqNo={clickRowData?.reqNo || ''}
            controlDialog={controlDialog}
          />
        }
        open={orderDetaiDialog}
        fullScreen
        handleClose={() => {
          setOrderDetaiDialog(false);
          setIsDetail(false);
          setIsEdict(false);
          setIsAdd(false);
          setClickRowData({});
        }}
        isHideSubmit
      />
    </>
  );
};
export default BillList;
