import React, { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import _ from 'lodash';

import {
  GridToolbarColumnsButton,
  GridToolbarContainer,
  GridToolbarDensitySelector,
  GridToolbarFilterButton,
  GridToolbarExport
} from '@material-ui/data-grid';
import {
  // IconButton,
  // Tooltip,
  Grid,
  TextField,
  Button,
  makeStyles
} from '@material-ui/core';
import { DatePicker } from '@material-ui/pickers';
import AddIcon from '@material-ui/icons/Add';
import NumberFormat from 'react-number-format';
// import getIcons from '../../../../utils/getIcons';

import { CommonDataGrid, WarningDialog } from '../../../../components';
import CommonTip from '../../../../components/CommonTip';
import API from '../../../../api/webdp/webdp';

import FTXButton from './FundingTXSummaryBTN';
import AddRecordDialog from './FundingTXSummaryAdd';

export default function SingleRowSelectionGrid() {
  const useStyles = makeStyles((theme) => ({
    headerClass: {
      color: '#229FFA'
    },
    moneyInputClass: {
      color: '#229FFA',
      '& .MuiInputBase-input.MuiInput-input': {
        paddingTop: theme.spacing(4)
      }
    },
    cellClass: {
      '& .dataChange': {
        background: '#f0f8ff url("/static/img/svg/tick.svg") no-repeat ',
        backgroundSize: '10% 30%',
        backgroundPosition: '100% 10%'
      },
      '& .dataChangeLeft': {
        background: '#f0f8ff url("/static/img/svg/tick.svg") no-repeat ',
        backgroundSize: '10% 30%',
        backgroundPosition: '100% 10%'
      },
      '& .noChange': {
        background: '#fff'
      }
    }
  }));
  const classes = useStyles();

  const [rows, setRows] = useState([]);
  const [initRows, setInitRows] = useState([]);

  const [editRow, setEditRow] = useState([]);
  const [stepRow, setStepRow] = useState([]);

  const [loading, setLoading] = useState(false);
  const [renderBillDate, setRenderBillDate] = useState({ view: '' });
  const [params, setParams] = useState({ page: 1, pageSize: 10 });

  const [openDelete, setOpenDelete] = useState(false);
  // const [deleteID, setDeleteID] = useState();

  const [openAdd, setOpenAdd] = useState(false);

  const formatterMoney = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  });
  const NumberFormatCustom = (props) => {
    const { inputRef, onChange, ...other } = props;
    return (
      <NumberFormat
        {...other}
        allowNegative={false}
        getInputRef={inputRef}
        onValueChange={(values) => {
          onChange({
            target: {
              name: props.name,
              value: values.value
            }
          });
        }}
        thousandSeparator
        isNumericString
        prefix="$"
      />
    );
  };

  const onPageSizeChange = (pageSize) => {
    const newParams = {
      ...params,
      page: 1,
      pageSize: Number(pageSize)
    };
    setParams(newParams);
  };
  const onPageChange = (page) => {
    const newParams = {
      ...params,
      page
    };
    setParams(newParams);
  };

  const renderDate = ({ id, value, api, field }) => (
    <DatePicker
      // autoOk
      format="dd-MMM-yyyy"
      variant="dialog"
      clearable
      value={value}
      onChange={(value) => {
        api.setEditCellValue({
          id,
          field,
          value: value ? dayjs(value).format('YYYY-MM-DD HH:mm:ss') : value
        });
      }}
    />
  );

  const onCellDoubleClick = async ({ id, value, api, field, row }) => {
    renderBillDate.view = (
      <span style={{ paddingLeft: '10px' }}>{value ? dayjs(value).format('DD-MMM-YYYY') : ''}</span>
    );
    if (field === 'billReceived') {
      if (row?.canEdit === false) CommonTip.warning('Can not Edit.');
      let canEdit = Boolean(row?.canEdit);
      const currentObj = rows.find((item) => item.id === id);
      const { txCode } = row || {};
      if (currentObj.canEdit === undefined && txCode?.indexOf('B') !== -1) {
        const res = await API.checkBillReceivedDate({ txCode: row?.txCode });
        const resData = res?.data?.data || {};
        canEdit = Boolean(resData?.canFundConfirmed);
        const minDate = resData?.requesterManagerApprovalDate
          ? resData?.requesterManagerApprovalDate
          : resData?.requesterApprovalDate;
        currentObj.canEdit = Boolean(resData?.canFundConfirmed);
        currentObj.minDate = minDate;

        if (!canEdit) CommonTip.warning('Can not Edit.');
      }
      const view = !canEdit ? (
        <span style={{ paddingLeft: '10px' }}>
          {value ? dayjs(value).format('DD-MMM-YYYY') : ''}
        </span>
      ) : (
        <DatePicker
          format="dd-MMM-yyyy"
          variant="dialog"
          clearable
          value={value}
          minDate={currentObj.minDate || null}
          onChange={(value) => {
            api.setEditCellValue({
              id,
              field,
              value: value ? dayjs(value).format('YYYY-MM-DD HH:mm:ss') : value
            });
            const view = (
              <span style={{ paddingLeft: '10px' }}>
                {value ? dayjs(value).format('DD-MMM-YYYY') : ''}
              </span>
            );
            setRenderBillDate({ view });
          }}
        />
      );
      setRenderBillDate({ view });
    }
  };

  // Edit table
  const handleCellEdict = (id, filed, value, row) => {
    if (filed === 'txCode') {
      API.getFundingFXSummaryByTxCode(value).then((res) => {
        console.log('txCode', res.data?.data?.status);
        if (res.data?.data?.status === true) {
          CommonTip.warning(`TX Code ${value} has exists!`);
          setRows([...rows]);
        } else if (res.data?.data?.status === false) {
          if (value === undefined) return;
          if (value === '') {
            if (filed !== 'remarks') {
              setTimeout(() => {
                CommonTip.error('The input cannot be empty');
                setRows([...rows]);
              }, 0);
              return;
            }
          }
          if (!_.isUndefined(row)) {
            const oldRow = row[filed];
            if (value === oldRow) return;
          }
          const isExit = editRow.find((item) => item.id === id);

          // 1.find row from initData
          const currentLine = initRows.find((item) => item.id === id);

          const newRows = rows.map((item) => {
            let newItem = _.cloneDeep(item);
            // setEditRow
            if (item.id === id) {
              newItem = { ...newItem, [filed]: value };

              if (_.isUndefined(isExit)) {
                setEditRow([...editRow, newItem]);
              } else {
                const newEdit = editRow.map((el) => {
                  let newEL = el;
                  if (el.id === id) {
                    newEL = newItem;
                  }
                  return newEL;
                });
                setEditRow([...editRow, newEdit]);
              }
              // ------------------------Compare object value
              if (currentLine[filed] !== value) {
                // different of source Data
                const obj = {};
                obj.id = newItem.id;
                if (filed === 'tempDate') {
                  obj.date = dayjs(newItem.tempDate).format('YYYY-MM-DD HH:mm:ss');
                } else if (filed === 'tempTime') {
                  obj.time = `${newItem.tempDate} ${newItem.tempTime}:00`;
                } else {
                  // obj[filed] = currentLine[filed];
                  obj[filed] = value;
                }
                // console.log('Debugs', obj);
                saveChangeNow([obj], 1);

                let status = false;
                for (let i = 0; i < stepRow.length; i += 1) {
                  const temp = stepRow[i];
                  if (temp.id === id && stepRow[i][filed]) {
                    status = true;
                    break;
                  }
                }
                if (status === false) {
                  // the first time,record surce data
                  const tempobj = { id, [filed]: currentLine[filed] };
                  setStepRow([tempobj, ...stepRow]);
                } else {
                  let i = editRow.length - 1;
                  for (i; i >= 0; i -= 1) {
                    if (editRow[i].id === id) {
                      break;
                    }
                  }
                  const tempobj = { id, [filed]: editRow[i][filed] };
                  setStepRow([tempobj, ...stepRow]);
                }
              } else {
                // same of source data ,then compare the editRow(from edit record)
                // console.log('editRow', editRow);
                let status = false;
                for (let i = editRow.length - 1; i >= 0; i -= 1) {
                  if (editRow[i].id === id && editRow[i][filed] !== value) {
                    status = true;
                    // console.log('status', editRow[i]);
                    break;
                  }
                }
                // change back, need save
                if (status === true) {
                  saveChangeNow([newItem], 1);
                  // record it
                  let i = editRow.length - 1;
                  for (i; i >= 0; i -= 1) {
                    if (editRow[i].id === id) {
                      break;
                    }
                  }
                  const tempobj = { id, [filed]: editRow[i][filed] };
                  const temp = [tempobj, ...stepRow];
                  setStepRow([...temp]);
                }
              }
              // ------------------------Compare object value
            }
            return newItem;
          });
          setRows(newRows);
        }
      });
    } else {
      if (value === undefined) return;
      if (value === '') {
        if (filed !== 'remarks') {
          setTimeout(() => {
            CommonTip.error('The input cannot be empty');
            setRows([...rows]);
          }, 0);
          return;
        }
      }
      if (!_.isUndefined(row)) {
        const oldRow = row[filed];
        if (value === oldRow) return;
      }
      const isExit = editRow.find((item) => item.id === id);

      // 1.find row from initData
      const currentLine = initRows.find((item) => item.id === id);

      const newRows = rows.map((item) => {
        let newItem = _.cloneDeep(item);
        // setEditRow
        if (item.id === id) {
          newItem = { ...newItem, [filed]: value };

          if (_.isUndefined(isExit)) {
            setEditRow([...editRow, newItem]);
          } else {
            const newEdit = editRow.map((el) => {
              let newEL = el;
              if (el.id === id) {
                newEL = newItem;
              }
              return newEL;
            });
            setEditRow([...editRow, newEdit]);
          }
          // ------------------------Compare object value
          if (currentLine[filed] !== value) {
            // different of source Data
            const obj = {};
            obj.id = newItem.id;
            if (filed === 'tempDate') {
              obj.date = dayjs(newItem.tempDate).format('YYYY-MM-DD HH:mm:ss');
            } else if (filed === 'tempTime') {
              obj.time = `${newItem.tempDate} ${newItem.tempTime}:00`;
            } else {
              // obj[filed] = currentLine[filed];
              obj[filed] = value;
            }
            // console.log('Debugs', obj);
            saveChangeNow([obj], 1);

            let status = false;
            for (let i = 0; i < stepRow.length; i += 1) {
              const temp = stepRow[i];
              if (temp.id === id && stepRow[i][filed]) {
                status = true;
                break;
              }
            }
            if (status === false) {
              // the first time,record surce data
              const tempobj = { id, [filed]: currentLine[filed] };
              setStepRow([tempobj, ...stepRow]);
            } else {
              let i = editRow.length - 1;
              for (i; i >= 0; i -= 1) {
                if (editRow[i].id === id) {
                  break;
                }
              }
              const tempobj = { id, [filed]: editRow[i][filed] };
              setStepRow([tempobj, ...stepRow]);
            }
          } else {
            // same of source data ,then compare the editRow(from edit record)
            // console.log('editRow', editRow);
            let status = false;
            for (let i = editRow.length - 1; i >= 0; i -= 1) {
              if (editRow[i].id === id && editRow[i][filed] !== value) {
                status = true;
                // console.log('status', editRow[i]);
                break;
              }
            }
            // change back, need save
            if (status === true) {
              saveChangeNow([newItem], 1);
              // record it
              let i = editRow.length - 1;
              for (i; i >= 0; i -= 1) {
                if (editRow[i].id === id) {
                  break;
                }
              }
              const tempobj = { id, [filed]: editRow[i][filed] };
              const temp = [tempobj, ...stepRow];
              setStepRow([...temp]);
            }
          }
          // ------------------------Compare object value
        }
        return newItem;
      });
      setRows(newRows);
    }
  };

  // save now
  const saveChangeNow = async (obj, status) => {
    if (obj.length > 0) {
      const backCurentData = JSON.parse(JSON.stringify(rows));
      const updateRowData = backCurentData.find((item) => item.id === obj[0].id);
      const keys = Object.keys(obj[0]);
      // console.log('saveChangeNow', obj, updateRowData, keys);
      // when update, record source data
      if (status === 1) {
        // update operation
        obj = [{ ...obj[0], sourceData: updateRowData[keys[1]] }];
      } else if (status === 2) {
        if (obj.length === 1) {
          // undo last operation
          obj = [{ ...obj[0], sourceData: updateRowData[keys[1]] }];
        } else {
          // undo all operation
          obj = obj.map((item) => {
            const bkdata = backCurentData.find((val) => val.id === item.id);
            const keys = Object.keys(item);
            return { ...item, sourceData: bkdata[keys[1]] };
          });
        }
      }
    }

    API.saveFundTXSumarry(obj).then((res) => {
      // console.log('saveChange Now:', res);
      if (status === 1) {
        if (res.data.code === 200) {
          CommonTip.success(`Cell saved successfully.`);
        }
      } else if (status === 2) {
        if (res.data.code === 200) {
          CommonTip.success(`Cell recovery successfully.`);
        }
      }
    });
  };

  // undo All
  const cancelChange = () => {
    setRows(initRows);
    setEditRow([]);
    const source = stepRow;
    saveChangeNow(source, 2);
    setStepRow([]);
  };
  //  undo last
  const undoLast = () => {
    const stepRowTemp = _.cloneDeep(stepRow);
    // console.log('stepRowTemp', stepRowTemp);
    if (stepRowTemp.length > 0) {
      const temp = stepRowTemp[0];
      saveChangeNow([temp], 2);

      let rowsTemp = [];
      rowsTemp = _.cloneDeep(rows);
      for (let i = 0; i < rowsTemp.length; i += 1) {
        if (rowsTemp[i].id === temp.id) {
          let obj = rowsTemp[i];
          obj = { ...obj, ...temp };
          rowsTemp[i] = obj;
          break;
        }
      }
      setRows([...rowsTemp]);

      stepRowTemp.splice(0, 1);
      setStepRow([...stepRowTemp]);
    }
  };

  // Columns
  const columns = [
    {
      field: 'id',
      headerName: 'id',
      hide: true,
      flex: 1,
      headerClassName: classes.headerClass,
      editable: false
    },
    {
      field: 'fiscalYear',
      headerName: 'FY',
      hide: false,
      width: 150,
      // headerClassName: classes.headerClass,
      editable: false
    },
    // {
    //   field: 'dpReqNo',
    //   headerName: 'DP Req No.',
    //   hide: false,
    //   width: 150,
    //   headerClassName: classes.headerClass,
    //   editable: true
    // },
    {
      field: 'fundParty',
      headerName: 'Fund Party',
      hide: false,
      width: 150,
      headerClassName: classes.headerClass,
      editable: true
    },
    {
      field: 'billNo',
      headerName: 'Bill No.',
      hide: false,
      width: 150,
      headerClassName: classes.headerClass,
      editable: true
    },
    {
      field: 'txCode',
      headerName: 'Fund TX Code',
      hide: false,
      width: 150,
      headerClassName: classes.headerClass,
      editable: true
    },
    {
      field: 'totalAmount',
      headerName: 'Total Amount',
      hide: false,
      width: 150,
      headerClassName: classes.headerClass,
      align: 'right',
      valueFormatter: (param) =>
        !_.isNull(param.value) ? formatterMoney.format(param.value) : param?.value,
      renderEditCell: ({ id, value, api, field }) => (
        <TextField
          label=""
          value={value}
          className={classes.moneyInputClass}
          onChange={(event) => {
            let value = Number(event?.target?.value);
            if (value) {
              value = value.toFixed(2);
            }
            api.setEditCellValue({ id, field, value }, event);
          }}
          name="numberformat"
          id="formatted-numberformat-input"
          InputProps={{
            inputComponent: NumberFormatCustom
          }}
        />
      ),
      editable: true
    },
    {
      field: 'date',
      headerName: 'Memo Date',
      width: 200,
      headerClassName: classes.headerClass,
      valueFormatter: (param) =>
        _.isNull(param.value) ? param.value : dayjs(param.value).format('DD-MMM-YYYY'),
      renderEditCell: (param) => renderDate(param),
      editable: true
    },
    {
      field: 'dateSend',
      headerName: 'Sent Date',
      hide: false,
      width: 200,
      headerClassName: classes.headerClass,
      valueFormatter: (param) =>
        _.isNull(param.value) ? param.value : dayjs(param.value).format('DD-MMM-YYYY'),
      renderEditCell: (param) => renderDate(param),
      editable: true
    },
    {
      field: 'billReceived',
      headerName: 'Payment Received Date',
      hide: false,
      width: 200,
      headerClassName: classes.headerClass,
      valueFormatter: (param) =>
        _.isNull(param.value) ? param.value : dayjs(param.value).format('DD-MMM-YYYY'),
      renderEditCell: (param) =>
        param?.row?.txCode?.indexOf('B') !== -1 ? renderBillDate.view : renderDate(param),
      editable: true
    },
    {
      field: 'remarks',
      headerName: 'Remarks',
      hide: false,
      width: 600,
      headerClassName: classes.headerClass,
      editable: true
    }
    // ,
    // {
    //   field: 'actions',
    //   headerName: 'Actions',
    //   hide: false,
    //   width: 120,
    //   headerAlign: 'center',
    //   filterable: false,
    //   align: 'center',
    //   headerClassName: classes.headerClass,
    //   renderCell: RowMenuCell
    // }
  ];

  const getDataList = (fiscalYear = '') => {
    setLoading(true);
    API.getFundTXSummaryList({ year: fiscalYear || undefined })
      .then((res) => {
        // console.log('res', res.data.data.fundingFXSummaryList);
        if (res?.data?.data) {
          setRows(res.data.data?.fundingFXSummaryList || []);
          setInitRows(res.data.data?.fundingFXSummaryList || []);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    getDataList();
  }, []);

  // Export CSV has Bugs
  const CustomToolbar = () => {
    const addOneRow = () => {
      setOpenAdd(true);
    };
    return (
      <>
        <GridToolbarContainer>
          <GridToolbarFilterButton />
          <GridToolbarColumnsButton />
          <GridToolbarDensitySelector />
          <GridToolbarExport />
          <Button color="primary" startIcon={<AddIcon />} onClick={addOneRow}>
            Add record
          </Button>
        </GridToolbarContainer>
      </>
    );
  };
  return (
    <div className={classes.cellClass}>
      <Grid container style={{ padding: '10px 0px' }}>
        <FTXButton
          undoLast={undoLast}
          cancelChange={cancelChange}
          stepRow={stepRow}
          editRow={editRow}
          params={params}
          setParams={setParams}
          searchCondition={getDataList}
        />
      </Grid>

      <CommonDataGrid
        rows={rows}
        columns={columns}
        loading={loading}
        disableColumnMenu
        page={params.page}
        getRowId={(row) => row.id}
        pageSize={params.pageSize}
        onPageSizeChange={onPageSizeChange}
        onPageChange={onPageChange}
        rowsPerPageOptions={[10, 20, 50, 100]}
        onCellEditCommit={(params) => {
          handleCellEdict(params.id, params.field, params.value, params.row);
        }}
        onCellDoubleClick={onCellDoubleClick}
        isCellEditable={(params) => {
          const { field, row } = params;
          let canEdit = true;
          if (field === 'billReceived' && row?.canEdit === false) canEdit = false;
          return canEdit;
        }}
        disableSelectionOnClick
        components={{
          Toolbar: CustomToolbar
        }}
        getCellClassName={(params) => {
          if (params.field === 'fiscalYear') {
            const { id } = params.row;
            const { fiscalYear } = params.row;
            const isExit = initRows.find((item) => item.id === id);
            if (isExit?.fiscalYear !== fiscalYear) {
              return 'dataChange';
            }
            return 'noChange';
          }
          if (params.field === 'fundParty') {
            const { id } = params.row;
            const { fundParty } = params.row;
            const isExit = initRows.find((item) => item.id === id);
            if (isExit?.fundParty !== fundParty) {
              return 'dataChange';
            }
            return 'noChange';
          }
          if (params.field === 'billNo') {
            const { id } = params.row;
            const { billNo } = params.row;
            const isExit = initRows.find((item) => item.id === id);
            if (isExit?.billNo !== billNo) {
              return 'dataChange';
            }
            return 'noChange';
          }
          if (params.field === 'txCode') {
            const { id } = params.row;
            const { txCode } = params.row;
            const isExit = initRows.find((item) => item.id === id);
            if (isExit?.txCode !== txCode) {
              return 'dataChange';
            }
            return 'noChange';
          }
          if (params.field === 'totalAmount') {
            const { id } = params.row;
            const { totalAmount } = params.row;
            const isExit = initRows.find((item) => item.id === id);
            if (isExit?.totalAmount !== totalAmount) {
              return 'dataChangeLeft';
            }
            return 'noChange';
          }
          if (params.field === 'date') {
            const { id } = params.row;
            const { date } = params.row;
            const isExit = initRows.find((item) => item.id === id);
            if (isExit?.date !== date) {
              return 'dataChange';
            }
            return 'noChange';
          }
          if (params.field === 'dateSend') {
            const { id } = params.row;
            const { dateSend } = params.row;
            const isExit = initRows.find((item) => item.id === id);
            if (isExit?.dateSend !== dateSend) {
              return 'dataChange';
            }
            return 'noChange';
          }
          if (params.field === 'billReceived') {
            const { id } = params.row;
            const { billReceived } = params.row;
            const isExit = initRows.find((item) => item.id === id);
            if (isExit?.billReceived !== billReceived) {
              return 'dataChange';
            }
            return 'noChange';
          }
          if (params.field === 'remarks') {
            const { id } = params.row;
            const { remarks } = params.row;
            const isExit = initRows.find((item) => item.id === id);
            if (isExit?.remarks !== remarks) {
              return 'dataChange';
            }
            return 'noChange';
          }
          return 'noChange';
        }}
      />

      <WarningDialog
        open={openDelete}
        // handleConfirm={handleDelete}
        handleClose={() => setOpenDelete(false)}
        content="Are you sure delete this data? It can't be restored after deletion."
      />

      <AddRecordDialog
        openAdd={openAdd}
        setOpenAdd={setOpenAdd}
        getDataList={getDataList}
        setStepRow={setStepRow}
      />
    </div>
  );
}
