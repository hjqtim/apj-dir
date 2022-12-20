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
  Grid,
  // Button,
  TextField,
  // Tooltip,
  // IconButton,
  makeStyles
} from '@material-ui/core';
// import AddIcon from '@material-ui/icons/Add';
import NumberFormat from 'react-number-format';

import { DatePicker, TimePicker } from '@material-ui/pickers';

import { CommonDataGrid, WarningDialog } from '../../../../components';
import CommonTip from '../../../../components/CommonTip';
// import getIcons from '../../../../utils/getIcons';

import ProblemLogButton from './ProblemLogBTN';
import ProblemLogAdd from './ProblemLogAdd';

import API from '../../../../api/webdp/webdp';
import { useGlobalStyles } from '../../../../style';

export default function SingleRowSelectionGrid() {
  const globalClasses = useGlobalStyles();

  const useStyles = makeStyles((theme) => ({
    headerClass: {
      // color: '#229FFA'
      color: '#000'
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
  const [params, setParams] = useState({ page: 1, pageSize: 10 });

  const [openDelete, setOpenDelete] = useState(false);
  // const [deleteID, setDeleteID] = useState();
  const [deleteID] = useState();

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
      autoOk
      format="dd-MMM-yyyy"
      variant="inline"
      // variant="dialog"
      // clearable
      value={value}
      onChange={(value) => {
        api.setEditCellValue({ id, field, value: dayjs(value).format('YYYY-MM-DD HH:mm:ss') });
      }}
    />
  );
  const renderTime = ({ id, value, api, field }) => (
    <TimePicker
      autoOk
      ampm={false}
      variant="inline"
      // variant="dialog"
      // clearable
      size="small"
      format="HH:mm"
      value={value}
      onChange={(value) => {
        api.setEditCellValue({ id, field, value: dayjs(value).format('YYYY-MM-DD HH:mm:ss') });
      }}
    />
  );
  // const RowMenuCell = (props) => {
  //   const { id } = props;
  //   return (
  //     <div>
  //       <Tooltip title="Delete">
  //         <IconButton onClick={(e) => handleDeleteClick(e, id)}>{getIcons('delete')}</IconButton>
  //       </Tooltip>
  //     </div>
  //   );
  // };

  // handleDeleteClick
  // const handleDeleteClick = (e, id) => {
  //   setOpenDelete(true);
  //   setDeleteID(id);
  // };
  // True Delete
  const handleDelete = () => {
    setOpenDelete(false);
    API.deleteProblemLog(deleteID).then((res) => {
      if (res?.data?.code === 200) {
        CommonTip.success('Delete data successfully');
        getDataList();
      }
    });
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
      field: 'tempDate',
      headerName: 'Date',
      hide: false,
      width: 250,
      headerClassName: classes.headerClass,
      valueFormatter: (param) =>
        _.isNull(param.value) ? param.value : dayjs(param.value).format('DD-MMM-YYYY'),
      renderEditCell: (param) => renderDate(param),
      editable: false
    },
    {
      field: 'time',
      headerName: 'Time',
      width: 250,
      headerClassName: classes.headerClass,
      valueFormatter: (param) =>
        _.isNull(param.value) ? param.value : dayjs(param.value).format('HH:mm'),
      renderEditCell: (param) => renderTime(param),
      editable: false
    },
    {
      field: 'refNo',
      headerName: 'Ref No.',
      hide: false,
      width: 150,
      headerClassName: classes.headerClass,
      editable: false
    },
    {
      field: 'value',
      headerName: 'Value',
      hide: false,
      width: 150,
      align: 'right',
      headerClassName: classes.headerClass,
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
      editable: false
    },
    {
      field: 'description',
      headerName: 'Description',
      hide: false,
      width: 600,
      headerClassName: classes.headerClass,
      editable: false
    }
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
    API.getProblemLogList({ fiscalYear })
      .then((res) => {
        if (res?.data?.data) {
          console.log('Problem List', res.data.data);
          let temparr = [];
          temparr = res.data.data.problemLogList;
          for (let i = 0; i < temparr.length; i += 1) {
            const temp = temparr[i].date;
            // console.log('TempDate : ', temp, dayjs(temp).format('DD-MMM-YYYY'));
            temparr[i].tempDate = dayjs(temp).format('DD-MMM-YYYY');
            temparr[i].tempTime = temp.substring(11, 16);
          }
          console.log('Problem List2', temparr);
          setRows(temparr || []);
          setInitRows(temparr || []);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  // 表格编辑
  const handleCellEdit = (id, filed, value, row) => {
    console.log('handleCellEdit', id, filed, value, row);

    if (value === undefined) {
      // console.log('that is undefined');
      if (filed !== 'description') {
        setTimeout(() => {
          CommonTip.error('The input cannot be empty');
          setRows([...rows]);
        }, 0);
        return;
      }
    }
    // allow null submit to save
    if (value === '') {
      // console.log('that is null');
      if (filed !== 'description') {
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
            // console.log('Yancy', newItem.tempDate);
            if (newItem.tempDate === 'Invalid Date') {
              obj.date = '0000-00-00 00:00:00';
            } else {
              obj.date = dayjs(newItem.tempDate).format('YYYY-MM-DD HH:mm:ss');
            }
            // obj.date = newItem.tempDate;
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
          let status = false;
          for (let i = editRow.length - 1; i >= 0; i -= 1) {
            if (editRow[i].id === id && editRow[i][filed] !== value) {
              status = true;
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
  };

  // save now
  const saveChangeNow = async (obj, status) => {
    if (obj.length > 0) {
      const backCurentData = JSON.parse(JSON.stringify(rows));
      const updateRowData = backCurentData.find((item) => item.id === obj[0].id);
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

    API.saveProblemLog(obj).then((res) => {
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

  useEffect(() => {
    getDataList();
  }, []);

  // CustomToolbar
  const CustomToolbar = () => {
    // const addOneRow = () => {
    //   setOpenAdd(true);
    // };
    console.log('customToolbar');

    return (
      <>
        <GridToolbarContainer>
          <GridToolbarFilterButton />
          <GridToolbarColumnsButton />
          <GridToolbarDensitySelector />
          <GridToolbarExport />
          {/* <Button color="primary" startIcon={<AddIcon />} onClick={addOneRow}>
            Add record
          </Button> */}
        </GridToolbarContainer>
      </>
    );
  };

  return (
    <div className={classes.cellClass}>
      <Grid container style={{ padding: '10px 0px' }}>
        <ProblemLogButton
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
          handleCellEdit(params.id, params.field, params.value, params.row);
        }}
        disableSelectionOnClick
        components={{
          Toolbar: CustomToolbar
        }}
        getCellClassName={(params) => {
          if (params.field === 'tempDate') {
            const { id } = params.row;
            const { tempDate } = params.row;
            const isExit = initRows.find((item) => item.id === id);
            if (isExit?.tempDate !== tempDate) {
              return 'dataChange';
            }
            return 'noChange';
          }
          if (params.field === 'time') {
            const { id } = params.row;
            const { time } = params.row;
            const isExit = initRows.find((item) => item.id === id);
            if (isExit?.time !== time) {
              return 'dataChange';
            }
            return 'noChange';
          }
          if (params.field === 'refNo') {
            const { id } = params.row;
            const { refNo } = params.row;
            const isExit = initRows.find((item) => item.id === id);
            if (isExit?.refNo !== refNo) {
              return 'dataChange';
            }
            return 'noChange';
          }
          if (params.field === 'value') {
            const { id } = params.row;
            const { value } = params.row;
            const isExit = initRows.find((item) => item.id === id);
            if (isExit?.value !== value) {
              return 'dataChangeLeft';
            }
            return 'noChange';
          }
          if (params.field === 'description') {
            const { id } = params.row;
            const { description } = params.row;
            const isExit = initRows.find((item) => item.id === id);
            if (isExit?.description !== description) {
              return 'dataChange';
            }
            return 'noChange';
          }
          return 'noChange';
        }}
      />

      <WarningDialog
        open={openDelete}
        handleConfirm={handleDelete}
        handleClose={() => setOpenDelete(false)}
        content="Are you sure delete this data? It can't be restored after deletion."
      />

      <ProblemLogAdd
        openAdd={openAdd}
        setOpenAdd={setOpenAdd}
        getDataList={getDataList}
        setStepRow={setStepRow}
      />
    </div>
  );
}
