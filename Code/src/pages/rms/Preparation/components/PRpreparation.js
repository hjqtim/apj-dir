import React, { useState, useEffect } from 'react';
import {
  GridToolbarContainer,
  GridToolbarDensitySelector,
  GridToolbarColumnsButton,
  GridToolbarFilterButton,
  getGridStringOperators
} from '@material-ui/data-grid';
import NumberFormat from 'react-number-format';
import dayjs from 'dayjs';
import _ from 'lodash';
import { DatePicker } from '@material-ui/pickers';
import { Grid, makeStyles, TextField, InputLabel, NativeSelect } from '@material-ui/core';

// import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import PRButton from './PRpreparationBTN';
import { CommonDataGrid } from '../../../../components';
import CommonTip from '../../../../components/CommonTip';
import API from '../../../../api/webdp/webdp';
import { useGlobalStyles } from '../../../../style';
import { formatterMoney } from '../../../../utils/tools';
import PRpreparationEEB from './PRpreparationEEB';

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
    display: 'block',
    '& .dataChange': {
      // backgroundImage: "url('/static/img/svg/tick.svg')",
      // background: '#f0f8ff'
      background: '#f0f8ff url("/static/img/svg/tick.svg") no-repeat ',
      backgroundSize: '10% 30%',
      backgroundPosition: '100% 10%'
    },
    '& .noChange': {
      background: '#fff'
    }
  }
}));

export default function PRpreparation() {
  const [rows, setRows] = useState([]);
  const [initRows, setInitRows] = useState([]);

  const [editRow, setEditRow] = useState([]);
  const [stepRow, setStepRow] = useState([]);
  const [startTime, setStartTime] = useState([]);
  const [endTime, setEndTime] = useState([]);

  const [loading, setLoading] = useState(false);
  const [params, setParams] = useState({ page: 1, pageSize: 10 });

  const classes = useStyles();

  const globalClasses = useGlobalStyles();

  const NumberFormatCustom = (props) => {
    const { inputRef, onChange, ...other } = props;
    return (
      <NumberFormat
        {...other}
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

  // const tipIcon = (param) => {
  //   console.log('Param', param);
  //   const status = getChangeStatus(param);
  //   if (status === true) {
  //     return (
  //       <div style={{ width: '100%', display: 'flex' }}>
  //         <div style={{ width: '78%', marginTop: 5 }}>{param.value}</div>
  //         <div style={{ width: '20%', marginTop: 10 }}>
  //           <CheckCircleIcon color="primary" size={45} />
  //         </div>
  //       </div>
  //     );
  //   }
  //   return (
  //     <div style={{ width: '100%', display: 'flex' }}>
  //       <div style={{ width: '78%' }}>{param.value}</div>
  //     </div>
  //   );
  // };
  // const getChangeStatus = (param) => {
  //   const { id, field, value } = param;
  //   const itemRow = initRows.find((item) => item.reqNo === id);
  //   console.log('itemRow', rows, initRows, itemRow);
  //   if (itemRow[field] !== value) {
  //     return true;
  //   }
  //   return false;
  // };

  const columns = [
    {
      field: 'reqNo',
      headerName: 'Request No.',
      width: 150,
      editable: false
    },
    {
      field: 'dpReq',
      headerName: 'DP Req No.',
      width: 150,
      editable: false
    },
    {
      field: 'hospital',
      headerName: 'Institution',
      width: 150,
      editable: false
    },
    {
      field: 'project',
      headerName: 'Project',
      width: 150,
      editable: false
    },
    {
      field: 'lanpoolOrder',
      headerName: 'LP',
      width: 100,
      valueFormatter: (param) => (param.value === '1' ? 'Y' : 'N'),
      editable: false
    },
    {
      field: 'reqIssuedDate',
      headerName: 'Req Issue Date',
      width: 150,
      type: 'date',
      headerClassName: classes.headerClass,
      valueFormatter: (param) =>
        _.isNull(param.value) ? param.value : dayjs(param.value).format('DD-MMM-YYYY'),
      renderEditCell: (param) => renderDate(param),
      editable: true
    },
    {
      field: 'expenditureFY',
      headerName: 'FY',
      width: 80,
      editable: false
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 150,
      editable: false
      // renderEditCell: ({ id, value, api, field }) => (
      //   <Autocomplete
      //     value={statusMap[value] || null}
      //     options={statusData}
      //     getOptionLabel={(option) => ` ${option.status}`}
      //     onChange={(event, value) => {
      //       api.setEditCellValue({ id, field, value: value.status }, event);
      //     }}
      //     renderInput={(params) => <TextField {...params} label="" />}
      //   />
      // )
    },
    {
      field: 'prCode',
      headerName: 'PR Code',
      width: 150,
      headerClassName: classes.headerClass,
      // renderCell: (param) => tipIcon(param),
      editable: true
    },
    {
      field: 'prissuedDate',
      headerName: 'PR Issue Date',
      width: 150,
      type: 'date',
      valueFormatter: (param) =>
        _.isNull(param.value) ? param.value : dayjs(param.value).format('DD-MMM-YYYY'),
      // renderEditCell: (param) => renderDate(param),
      editable: false
    },
    {
      field: 'invoice',
      headerName: 'Invoice',
      width: 150,
      headerClassName: classes.headerClass,
      editable: true
    },
    {
      field: 'invoiceRecdDate',
      headerName: 'Received Date',
      width: 180,
      headerClassName: classes.headerClass,
      type: 'date',
      valueFormatter: (param) =>
        _.isNull(param.value) ? param.value : dayjs(param.value).format('DD-MMM-YYYY'),
      renderEditCell: (param) => renderDate(param),
      editable: true
    },
    {
      field: 'totalExpense',
      headerName: 'Total Exp.',
      width: 150,
      type: 'number',
      align: 'right',
      editable: false,
      valueFormatter: (param) =>
        !_.isNull(param.value) ? formatterMoney(param.value) : param?.value
    },
    {
      field: 'backboneExp',
      headerName: 'BackBone',
      width: 150,
      type: 'number',
      align: 'right',
      valueFormatter: (param) =>
        !_.isNull(param.value) ? formatterMoney(param.value) : param?.value,
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
      editable: false
    },
    {
      field: 'totalIncome',
      headerName: 'Income',
      width: 150,
      type: 'number',
      editable: false,
      align: 'right',
      valueFormatter: (param) =>
        !_.isNull(param.value) ? formatterMoney(param.value) : param?.value
    },
    {
      field: 'instDateFr',
      headerName: 'Start Installation',
      width: 150,
      type: 'date',
      valueFormatter: (param) =>
        _.isNull(param.value) ? param.value : dayjs(param.value).format('DD-MMM-YYYY'),
      editable: false
    },
    {
      field: 'instDateTo',
      headerName: 'End Installation',
      width: 150,
      type: 'date',
      valueFormatter: (param) =>
        _.isNull(param.value) ? param.value : dayjs(param.value).format('DD-MMM-YYYY'),
      editable: false
    },
    {
      field: 'respStaff',
      headerName: 'Resp Staff',
      width: 150,
      editable: false
    }
  ];

  const renderLanPoolFilter = (lanPoolProps) => {
    const { item, applyValue } = lanPoolProps;
    const handleFilterChange = (e) => {
      applyValue({ ...item, value: e.target.value });
    };

    return (
      <div>
        <InputLabel>Value</InputLabel>
        <NativeSelect value={item.value} onChange={handleFilterChange} fullWidth>
          <option value="" />
          <option value="1">Y</option>
          <option value="0">N</option>
        </NativeSelect>
      </div>
    );
  };

  const lanPoolColumn = columns.find((column) => column.field === 'lanpoolOrder');
  const lanPoolColIndex = columns.findIndex((col) => col.field === 'lanpoolOrder');

  const lanPoolOperators = getGridStringOperators().map((operator) => ({
    ...operator,
    InputComponent: renderLanPoolFilter
  }));

  columns[lanPoolColIndex] = {
    ...lanPoolColumn,
    filterOperators: lanPoolOperators
  };

  const getPRPreparation = (
    status = 2,
    startTime = dayjs().add(-2, 'year').format('YYYY-MM-DD'),
    endTime = dayjs().format('YYYY-MM-DD')
  ) => {
    startTime = dayjs(startTime).format('YYYY-MM-DD 00:00:00');
    endTime = dayjs(endTime).format('YYYY-MM-DD 23:59:59');
    setLoading(true);
    API.getPRPreparation({ status, startTime, endTime })
      .then((res) => {
        if (res?.data?.data) {
          const resData = res.data.data?.prPreparationList?.map((item) => ({
            ...item,
            lanpoolOrder: String(item?.lanpoolOrder === null ? 0 : item.lanpoolOrder)
          }));
          setRows(JSON.parse(JSON.stringify(resData)));
          setInitRows(JSON.parse(JSON.stringify(resData)));
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };
  //
  useEffect(() => {
    getPRPreparation();
  }, []);

  const renderDate = ({ id, value, api, field }) => (
    <DatePicker
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

  // 表格编辑
  const handleCellEdict = (id, filed, value, row) => {
    console.log('handleCellEdict', id, filed, value, row);
    if (value === undefined) return;
    if (filed === 'prCode' && value?.length > 10) {
      CommonTip.warning(`The length cannot exceed 10.`);
      setTimeout(() => {
        setRows([...rows]);
      }, 0);
      return;
    }
    if (!_.isUndefined(row)) {
      const oldRow = row[filed];
      if (value === oldRow) return;
    }
    const isExit = editRow.find((item) => item.id === id);

    // 1.find row from initData
    const currentLine = initRows.find((item) => item.id === id);
    // console.log('currentLine', currentLine[filed], value);

    const newRows = rows.map((item) => {
      let newItem = _.cloneDeep(item);
      // setEditRow
      if (item.id === id) {
        newItem = { ...newItem, [filed]: value };
        // 记录修改数据
        // 如果不存在则将数据直接保存
        if (_.isUndefined(isExit)) {
          setEditRow([...editRow, newItem]); // 保存更新后的数据
        } else {
          // 如果存在，就更新了
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
            // const tempobj = { reqNo: id, [filed]: currentLine[filed] };
            const tempobj = { id, [filed]: currentLine[filed] };
            setStepRow([tempobj, ...stepRow]);
          } else {
            let i = editRow.length - 1;
            for (i; i >= 0; i -= 1) {
              if (editRow[i].id === id) {
                break;
              }
            }
            // const tempobj = { reqNo: id, [filed]: editRow[i][filed] };
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
            // const tempobj = { reqNo: id, [filed]: editRow[i][filed] };
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
  };

  // save now
  const saveChangeNow = async (obj, status) => {
    if (obj.length > 0) {
      const backCurentData = JSON.parse(JSON.stringify(rows));
      console.log('backCurentData', backCurentData, obj);
      const updateRowData = backCurentData.find((item) => item.id === obj[0].id);
      console.log('updateRowData', updateRowData);
      const keys = Object.keys(obj[0]);
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
    // console.log('updatePRPreparation', obj);
    API.updatePRPreparation(obj).then((res) => {
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

  // 保存编辑
  // const saveChange = async () => {
  //   API.updatePRPreparation(editRow)
  //     .then((res) => {
  //       if (res?.data?.code === 200) {
  //         CommonTip.success(`Saved successfully.`);
  //         setEditRow([]);
  //         setInitRows(rows);
  //       } else {
  //         CommonTip.error(`Saveds fail.`);
  //       }
  //     })
  //     .finally(() => {
  //       setInitRows(rows);
  //     }, []);
  // };

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
    console.log('stepRowTemp', stepRowTemp);
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

  // Export CSV has Bugs
  const CustomToolbar = () => (
    <GridToolbarContainer>
      <GridToolbarFilterButton />
      <GridToolbarColumnsButton />
      <GridToolbarDensitySelector />
      <PRpreparationEEB startTime={startTime} endTime={endTime} />
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
  const BTNTime = (startTime, endTime) => {
    setStartTime(startTime);
    setEndTime(endTime);
  };
  return (
    <div className={classes.cellClass}>
      <Grid container style={{ padding: '10px 0px' }}>
        <PRButton
          undoLast={undoLast}
          cancelChange={cancelChange}
          stepRow={stepRow}
          editRow={editRow}
          params={params}
          setParams={setParams}
          searchCondition={getPRPreparation}
          BTNTime={BTNTime}
        />
      </Grid>
      <CommonDataGrid
        className={globalClasses.fixDatagrid}
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
        disableSelectionOnClick
        components={{
          Toolbar: CustomToolbar
        }}
        // getCellClassName={(params) => {
        //   if (params.field === 'reqIssuedDate') {
        //     const { id } = params.row;
        //     const { reqIssuedDate } = params.row;
        //     const isExit = initRows.find((item) => item.id === id);
        //     if (isExit.reqIssuedDate !== reqIssuedDate) {
        //       return 'dataChange';
        //     }
        //   }
        //   if (params.field === 'prCode') {
        //     const { id } = params.row;
        //     const { prCode } = params.row;
        //     const isExit = initRows.find((item) => item.id === id);
        //     if (isExit.prCode !== prCode) {
        //       return 'dataChange';
        //     }
        //   }
        //   if (params.field === 'invoice') {
        //     const { id } = params.row;
        //     const { invoice } = params.row;
        //     const isExit = initRows.find((item) => item.id === id);
        //     if (isExit.invoice !== invoice) {
        //       return 'dataChange';
        //     }
        //   }
        //   return 'nochange';
        // }}

        getCellClassName={(params) => {
          const { id, field, row } = params;
          if (row?.[field] !== 'lanpoolOrder') {
            const value = row?.[field];
            const isExit = initRows.find((item) => item.id === id);
            if (isExit?.[field] !== value) {
              return 'dataChange';
            }
          }
          return 'noChange';
        }}
      />
    </div>
  );
}
