import React, { useState, useEffect } from 'react';
import {
  GridToolbarContainer,
  GridToolbarExport,
  GridToolbarDensitySelector,
  GridToolbarColumnsButton,
  GridToolbarFilterButton
} from '@material-ui/data-grid';
import Autocomplete from '@material-ui/lab/Autocomplete';
import dayjs from 'dayjs';
import _ from 'lodash';
import { Grid, makeStyles, TextField, Checkbox, Tooltip, IconButton } from '@material-ui/core';

import { CommonDataGrid } from '../../../../components';
import CommonTip from '../../../../components/CommonTip';
import API from '../../../../api/webdp/webdp';
import { useGlobalStyles } from '../../../../style';
import { formatterMoney } from '../../../../utils/tools';
import Detail from './Detail/index';
import getIcons from '../../../../utils/getIcons';

import FTButton from './FundingTransferBTN';

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
  myDataGrid: {
    '& .MuiDataGrid-columnsContainer .MuiCheckbox-root.MuiDataGrid-checkboxInput': {
      display: 'none !important'
    },
    '& .MuiAutocomplete-inputRoot': {
      height: '100%'
    }
  }
}));

export default function FundingTransfer() {
  const classes = useStyles();
  const globalClaess = useGlobalStyles();
  const [openDetail, setOpenDetail] = useState(false);
  const [currentRow, setCurrentRow] = useState({});
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [listLoading, setListLoading] = useState(false);
  const [params, setParams] = useState({
    page: 1,
    pageSize: 10,
    status: 0,
    sendEmailFlag: false,
    startTime: dayjs().add(-2, 'year').format('YYYY-MM-DD'),
    endTime: dayjs().format('YYYY-MM-DD')
  });
  const [stepRow, setStepRow] = useState([]);
  const [initRows, setInitRows] = useState([]);
  const [selected, setSelected] = useState([]);
  const [txCodes, setTxCodes] = useState([]);
  const [txCodesNotExternalN, setTxCodesNotExternalN] = useState([]);
  const [txCodesNotExternalY, setTxCodesNotExternalY] = useState([]);
  const [selectType, setSelectType] = useState({
    id: '',
    type: '',
    txCode: '',
    status: 0
  });

  // 处理点击表格的checkedbox
  const handleRowSelection = (ckecked, obj) => {
    const data = { id: obj.id, type: 'External', txCode: obj?.txCode, LP: obj.lanpoolOrder };
    // 选中的数组长度为0，并且 ckecked为true，记录选择的类型
    if (selected.length === 0 && ckecked) {
      if (obj.fundParty === 'External') {
        // fundParty 为 External 的
        setSelectType({ ...selectType, ...data, type: 'External' });
      } else if (
        obj.fundParty === 'Others' &&
        (obj.costCode === 'External Bill' || obj.costCode === '' || obj.costCode === null)
      ) {
        // fundParty 为 Others 并且 costCode为 External Bill 的
        setSelectType({ ...selectType, ...data, type: 'ExternalBill' });
      } else {
        setSelectType({ ...selectType, ...data, type: 'NotExternal' });
      }
    } else if (selected.length === 1 && !ckecked) {
      // 选中的数组长度为1，并且 ckecked为false，清空选择类型
      setSelectType({ ...selectType, id: '', type: '', txCode: '', LP: '' });
    }

    if (!obj.txCode && ckecked) {
      // 将勾中的在添加到选中的数组中
      setSelected([...selected, obj]);
    } else if (!obj.txCode && !ckecked) {
      // 将取消选中的在数组中移除
      const newSelected = selected.filter((item) => item.id !== obj.id);
      setSelected(newSelected);
    }
    // ------------------------------以上都是  status状态为 0 时候

    // 自动选中 txCode 相同的数据
    if (obj.txCode && ckecked) {
      const arr = rows.filter((item) => item.txCode === obj.txCode);
      setSelected(arr);
    } else if (obj.txCode && !ckecked) {
      setSelected([]);
    }
  };

  const columns = [
    {
      field: '',
      headerName: '',
      align: 'center',
      sortable: false,
      headerAlign: 'center',
      renderCell: (params) => (
        <Checkbox
          color="primary"
          disabled={
            !handleIsSelect(params) ||
            _.isNull(params?.row?.lanpoolOrder) ||
            _.isNull(params?.row?.fundParty) ||
            params?.row?.fundParty === '' ||
            (params?.row?.lanpoolOrder !== 1 && !params?.row?.budgetingFiscalYear)
          }
          onChange={(e, ckecked) => handleRowSelection(ckecked, params.row)}
          checked={selected.some((item) => item.id === params?.id)}
        />
      )
    },
    {
      field: 'dpReq',
      headerName: 'DP Req No.',
      minWidth: 150,
      flex: 1
    },
    {
      field: 'requestFormCount',
      headerName: 'Request Form Count',
      minWidth: 200,
      flex: 1,
      renderCell: (params) => (
        <div style={{ display: 'flex', justifyContent: 'space-around', width: '100%' }}>
          <span> {params?.value || 0}</span>
          <Tooltip title="Detail">
            <IconButton
              onClick={() => {
                setCurrentRow(params.row);
                setOpenDetail(true);
              }}
            >
              {getIcons('detaiEyeIcon')}
            </IconButton>
          </Tooltip>
        </div>
      )
    },
    {
      field: 'relatedDpReq',
      headerName: 'Related',
      minWidth: 150,
      flex: 1
    },
    {
      field: 'hospital',
      headerName: 'Institution',
      minWidth: 150,
      flex: 1
    },
    {
      field: 'project',
      headerName: 'Project',
      minWidth: 150,
      flex: 1
    },
    {
      field: 'fundParty',
      headerName: 'Fund Party',
      minWidth: 150,
      flex: 1
    },
    {
      field: 'costCode',
      headerName: 'Chart of Account',
      minWidth: 250,
      flex: 1
    },
    {
      field: 'totalIncome',
      headerName: 'Total Income',
      minWidth: 150,
      flex: 1,
      type: 'number',
      align: 'right',
      valueFormatter: ({ value }) => `HKD ${formatterMoney(value || 0)?.slice(1) || ''}`,
      renderCell: ({ value }) => formatterMoney(value || 0)
    },
    {
      field: 'lanpoolOrder',
      headerName: 'LP',
      minWidth: 75,
      flex: 1
      // valueFormatter: (param) =>
      //   _.isNull(param.value) ? param?.value : param?.value === 1 ? 'Y' : 'N'
    },
    {
      field: 'budgetingFiscalYear',
      headerName: 'FY',
      minWidth: 150,
      flex: 1,
      align: 'left'
    },
    {
      field: 'txCode',
      headerName: 'Fund TX Code',
      minWidth: 150,
      flex: 1,
      align: 'left',
      headerClassName: classes.headerClass,
      editable: true,
      renderEditCell: (params) => {
        const {
          value,
          row,
          api: { setEditCellValue }
        } = params;
        // const options = row?.lanpoolOrder === 1 ? txCodesNotExternalY : txCodesNotExternalN;
        const options = row?.lanpoolOrder === 'Y' ? txCodesNotExternalY : txCodesNotExternalN;
        return (
          <div style={{ width: '100%' }}>
            <Autocomplete
              style={{ height: '100%' }}
              value={value || ''}
              disabled={Boolean(row?.emailStatus) || _.isNull(row?.lanpoolOrder)}
              onChange={(event, value) => {
                setEditCellValue({ ...params, value }, event);
              }}
              options={
                row?.fundParty === 'External' ||
                (row?.fundParty === 'Others' &&
                  (row.costCode === 'External Bill' ||
                    row.costCode === '' ||
                    row.costCode === null))
                  ? []
                  : options
              }
              renderInput={(inputParams) => (
                <TextField
                  {...inputParams}
                  variant="outlined"
                  fullWidth
                  style={{ height: '100%' }}
                />
              )}
            />
          </div>
        );
      }
    },
    {
      field: 'status',
      headerName: 'Status',
      minWidth: 150,
      flex: 1,
      renderCell: (params) => (
        <Tooltip title={params?.value || ''}>
          <div style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{params?.value || ''}</div>
        </Tooltip>
      )
    },
    {
      field: 'respStaff',
      headerName: 'Resp Staff',
      minWidth: 150,
      flex: 1,
      editable: true
    },
    {
      field: 'fundConfirmDate',
      headerName: 'Fund Confirmed',
      minWidth: 180,
      flex: 1
      // valueFormatter: (param) =>
      //   _.isNull(param.value) ? param.value : dayjs(param.value).format('DD-MMM-YYYY')
    }
  ];

  const getDataList = () => {
    setStepRow([]);
    setListLoading(true);
    const { status } = params;
    let { startTime, endTime } = params;
    startTime = dayjs(startTime).format('YYYY-MM-DD 00:00:00');
    endTime = dayjs(endTime).format('YYYY-MM-DD 23:59:59');
    API.getFundingTransferList({ status, startTime, endTime })
      .then((res) => {
        const resData = res?.data?.data || {};
        if (resData) {
          const newResData = changeResData(resData);
          // console.log('newResData', newResData);
          // const newRows = res?.data?.data || [];
          const newRows = newResData || [];
          setRows(JSON.parse(JSON.stringify(newRows)));
          setInitRows(JSON.parse(JSON.stringify(newRows)));
        }
      })
      .finally(() => {
        setListLoading(false);
      });
  };
  const changeResData = (resData) => {
    // console.log('getFundingTransferList', resData);
    const newResData = _.cloneDeep(resData);
    newResData.forEach((item) => {
      if (item.lanpoolOrder === 1) {
        item.lanpoolOrder = 'Y';
      }
      if (item.lanpoolOrder === 0) {
        item.lanpoolOrder = 'N';
      }
      item.fundConfirmDate = dayjs(item.fundConfirmDate).format('DD-MMM-YYYY');
    });

    return newResData;
  };

  const getCompletedTXCode = () => {
    API.getCompletedTXCode().then((res) => {
      const completedTXCodeList = res?.data?.data?.completedTXCodeList || [];
      const txCodesNotExternals = completedTXCodeList?.filter(
        (item) => item?.split('-')?.pop() !== 'B'
      );
      const txCodesLPIsY = txCodesNotExternals?.filter((item) => {
        const arr = item?.split('-');
        return arr?.[arr?.length - 2] !== '00';
      });
      const txCodesLPIsN = txCodesNotExternals?.filter((item) => {
        const arr = item?.split('-');
        return arr?.[arr?.length - 2] === '00';
      });
      setTxCodesNotExternalN(txCodesLPIsN);
      setTxCodesNotExternalY(txCodesLPIsY);
      setTxCodes(completedTXCodeList);
    });
  };

  useEffect(() => {
    getCompletedTXCode();
  }, [params.sendEmailFlag]);

  useEffect(() => {
    getDataList();
  }, [params.status, params.startTime, params.endTime]);

  // Edit table
  const handleCellEdict = (id, filed, value) => {
    const currentObj = rows.find((item) => item.id === id);
    if (_.isUndefined(value) || currentObj?.[filed] === value) return;

    // if input enpty,data recovery
    if (!value && filed !== 'txCode') {
      CommonTip.warning('The input cannot be empty.');
      setTimeout(() => {
        setRows([...rows]);
      }, 0);
      return;
    }

    saveChange([{ id, [filed]: value }], { isRecovery: false, filed });
  };

  // save now
  const saveChange = async (data, helpData) => {
    if (loading) {
      CommonTip.warning(`Modified too frequently.`);
      setTimeout(() => {
        setRows([...rows]);
      }, 0);
      return;
    }

    if (!data.length) return;

    const backCurentData = JSON.parse(JSON.stringify(rows));
    const updateRowData = backCurentData.find((item) => item.id === data?.[0]?.id);
    // when update, record source data
    if (!helpData.isRecovery) {
      // update operation
      data = [{ ...data[0], sourceData: updateRowData?.[helpData.filed] }];
    } else if (helpData.isRecovery) {
      if (data.length === 1) {
        // undo last operation
        const keys = Object.keys(data[0]);
        data = [{ ...data[0], sourceData: updateRowData?.[keys[1]] }];
      } else {
        // undo all operation
        data = data.map((item) => {
          const bkdata = backCurentData.find((val) => val.id === item.id);
          const keys = Object.keys(item);
          return { ...item, sourceData: bkdata?.[keys[1]] };
        });
      }
    }

    setLoading(true);

    //   Call  change API
    API.updateFundingTransfer(data)
      .then((res) => {
        const oldObj = rows.find((item) => item.id === data[0].id) || {};
        const oldValue = oldObj?.[helpData.filed];

        if (!helpData.isRecovery) {
          // the length of data must be 1
          if (res.data.code === 200) {
            CommonTip.success(`Cell saved successfully.`);

            // Update view
            oldObj[helpData?.filed] = data?.[0]?.[helpData?.filed];

            // Add a record of the record list
            stepRow.push({ id: oldObj.id, [helpData.filed]: oldValue });
            setStepRow([...stepRow]);
          }
        } else if (helpData.isRecovery) {
          if (res.data.code === 200) {
            CommonTip.success(`Cell recovery successfully.`);
            if (data.length === 1) {
              // Step back and remove the record list
              const undoLastObj = stepRow[stepRow.length - 1];
              const keys = Object.keys(undoLastObj);
              oldObj[keys[1]] = data?.[0]?.[keys?.[1]];
              stepRow.pop();
              setStepRow([...stepRow]);
            } else {
              // Undo all
              setRows(JSON.parse(JSON.stringify(initRows)));
              setStepRow([]);
            }
          }
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  //  undo last
  const undoLast = (isUndoAll) => {
    let data = [];
    if (isUndoAll) {
      // Record the value before the first modification
      let exitItem = [];
      // Request data
      data = stepRow.filter((item) => {
        const keys = Object.keys(item);
        const unionkey = `${item.id}${keys[1]}`;
        const isExit = exitItem.find((item) => item === unionkey);
        if (_.isUndefined(isExit)) {
          exitItem = [...exitItem, unionkey];
        }
        return _.isUndefined(isExit);
      });
    } else {
      data = [stepRow[stepRow.length - 1]];
    }
    saveChange(data, { isRecovery: true });
  };

  // Export CSV
  const CustomToolbar = () => (
    <GridToolbarContainer>
      <GridToolbarFilterButton />
      <GridToolbarColumnsButton />
      <GridToolbarDensitySelector />
      <GridToolbarExport />
    </GridToolbarContainer>
  );

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

  const handleIsSelect = (paramsData) => {
    // 是否可以选择的标志
    let allowSelect = true;
    // 选择的长度不为零
    const selectLen = selected.length !== 0;
    const { row } = paramsData || {};
    const { id, LP, type, txCode } = selectType || {};

    // 1.勾选了有txCod的，禁用没有txCode的 --------------------------------------------
    if (txCode && !row?.txCode && selectLen) {
      allowSelect = false;
    }

    // 2. 勾选了没txCode的，禁用有txCode的--------------------------------------------
    if (!txCode && row?.txCode && selectLen) {
      allowSelect = false;
    }

    // 选择了是External的，禁用不是External的
    if (!txCode && !row?.txCode && selectLen && type !== 'NotExternal' && paramsData.id !== id) {
      allowSelect = false;
    }

    // 选择了不是External的，禁用External的
    if (!txCode && !row?.txCode && selectLen && type === 'NotExternal') {
      if (
        row?.fundParty === 'External' ||
        (row?.fundParty === 'Others' &&
          (row.costCode === 'External Bill' || row.costCode === '' || row.costCode === null))
      ) {
        allowSelect = false;
      }
    }
    // 选择了不是External的，LP得一致
    // if (!txCode && !row?.txCode && selectLen && type === 'NotExternal' && LP === 1) {
    //   if (row?.lanpoolOrder !== 1) {
    //     allowSelect = false;
    //   }
    // }
    // if (!txCode && !row?.txCode && selectLen && type === 'NotExternal' && LP !== 1) {
    //   if (row?.lanpoolOrder === 1) {
    //     allowSelect = false;
    //   }
    // }
    if (!txCode && !row?.txCode && selectLen && type === 'NotExternal' && LP === 'Y') {
      if (row?.lanpoolOrder !== 'Y') {
        allowSelect = false;
      }
    }
    if (!txCode && !row?.txCode && selectLen && type === 'NotExternal' && LP !== 'Y') {
      if (row?.lanpoolOrder === 'Y') {
        allowSelect = false;
      }
    }

    return allowSelect;
  };

  return (
    <div className={globalClaess.cellEditClass}>
      <Grid container style={{ padding: '10px 0px' }}>
        <FTButton
          undoLast={undoLast}
          loading={listLoading}
          stepRow={stepRow}
          params={params}
          setParams={setParams}
          txCodes={txCodes}
          selected={selected}
          setSelected={setSelected}
          selectType={selectType}
          setSelectType={setSelectType}
          searchCondition={getDataList}
          getCompletedTXCode={getCompletedTXCode}
        />
      </Grid>

      <CommonDataGrid
        rows={rows}
        columns={columns}
        loading={listLoading}
        disableColumnMenu
        page={params.page}
        pageSize={params.pageSize}
        className={classes.myDataGrid}
        onPageSizeChange={onPageSizeChange}
        onPageChange={onPageChange}
        getRowId={(row) => row.id}
        rowsPerPageOptions={[10, 20, 50, 100]}
        onCellEditCommit={(params) => {
          handleCellEdict(params.id, params.field, params.value);
        }}
        disableSelectionOnClick
        components={{
          Toolbar: CustomToolbar
        }}
        getCellClassName={({ id, field, row }) => {
          let className = '';
          const value = row?.[field];
          const isExit = initRows.find((item) => item.id === id);
          if (isExit?.[field] !== value) {
            className = 'dataChange';
          }
          return className;
        }}
      />

      <Detail openDetail={openDetail} setOpenDetail={setOpenDetail} currentRow={currentRow} />
    </div>
  );
}
