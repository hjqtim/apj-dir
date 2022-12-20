import React, { useState, useEffect, useCallback, useMemo } from 'react';
import dayjs from 'dayjs';
import _ from 'lodash';

import {
  GridToolbarColumnsButton,
  GridToolbarContainer,
  GridToolbarDensitySelector,
  GridToolbarFilterButton,
  GridToolbarExport,
  getGridStringOperators
} from '@material-ui/data-grid';
import {
  IconButton,
  Grid,
  Select,
  MenuItem,
  Tooltip,
  Button,
  makeStyles,
  TextField,
  CircularProgress,
  NativeSelect,
  InputLabel
} from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import AddIcon from '@material-ui/icons/Add';
import { DatePicker } from '@material-ui/pickers';

// import { number } from 'prop-types';
import { CommonDataGrid, WarningDialog } from '../../../../components';
import CommonTip from '../../../../components/CommonTip';
import API from '../../../../api/webdp/webdp';
import getIcons from '../../../../utils/getIcons';
import PRPOButton from './PRPOSummaryBTN';
import AddPRPODialog from './AddPRPODialog';
import { useGlobalStyles } from '../../../../style';
import getFiscalYearOptions from '../../../../utils/getFiscalYearOptions2';

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
    '& .MuiAutocomplete-inputRoot': {
      height: '100%'
    }
  }
}));
export default function SingleRowSelectionGrid() {
  const globalClasses = useGlobalStyles();
  const classes = useStyles();

  const [rows, setRows] = useState([]);
  const [record, setRecord] = useState([]); // 每次修改都会追加那条数据到这个数组；oldValue是旧值，newValue是新到的值，field是修改的字段；回退后删除数组最后一条数据
  const [loading, setLoading] = useState(false);
  const [ADLoading, setADLoading] = useState(false);
  const [requesterOptions, setRequesterOptions] = useState([]);
  const [contractOptions, setContractOptions] = useState([]);
  const [contractOptionsMap, setContractOptionsMap] = useState([]);
  const [params, setParams] = useState({ page: 1, pageSize: 10 });
  const [initRows, setInitRows] = useState([]);
  const [openDelete, setOpenDelete] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [deleteObj, setDeleteObj] = useState({});
  const [addOpen, setAddOpen] = useState(false);
  const [lanPool, setLanPool] = useState(2);
  const [fiscalYear, setFiscalYear] = useState('');
  const [options, setOptions] = useState([]);
  const [optionsMap, setOptionsMap] = useState({});

  const [fiscalYearList, setfiscalYearList] = useState([]);
  const getFiscalYearOptionsList = () => {
    const result = getFiscalYearOptions();
    // console.log('getFiscalYearOptions', result);
    setfiscalYearList(result);
  };
  const optionsFiscaYear = useMemo(
    () => fiscalYearList.map((optionItem) => optionItem.value),
    [fiscalYearList]
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

  const renderDate = ({ id, value, api, field }) => (
    <DatePicker
      // autoOk
      format="dd-MMM-yyyy"
      // variant="inline"
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

  const handleClose = () => {
    setOpenDelete(false);
    setDeleteObj({});
  };

  // True Delete
  const handleDelete = () => {
    API.deletePRPOSummary(deleteObj?.id)
      .then((res) => {
        if (res?.data?.code === 200) {
          CommonTip.success('Delete data successfully', 2000);
          const newRows = rows.filter((item) => item.id !== deleteObj.id);
          setRows(newRows);
          const newInitRows = initRows.filter((item) => item.id !== deleteObj.id);
          setInitRows(newInitRows);
          const newRecord = record.filter((item) => item.id !== deleteObj.id);
          setRecord(newRecord);
          getDataList();
        }
      })
      .finally(() => {
        handleClose();
      });
  };

  const getDataList = (isSetInit) => {
    setLoading(true);
    API.getPRPOSummary({ lanPool, fiscalYear: fiscalYear || undefined })
      .then((res) => {
        if (res?.data?.data?.poMasterList) {
          const newData = res.data.data.poMasterList.map((item) => ({
            ...item,
            lanPoolOrder: String(item?.lanPoolOrder === null ? 0 : item.lanPoolOrder)
          }));

          setRows(JSON.parse(JSON.stringify(newData)));

          if (isSetInit) {
            setInitRows(JSON.parse(JSON.stringify(newData)));
          }
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    getFiscalYearOptionsList();
    reGetDataList();
  }, []);

  useEffect(() => {
    const dpPromise = API.getProjectNameList('DP');
    const apPromise = API.getProjectNameList('AP');
    const clPromise = API.getProcurementContractList();
    Promise.all([dpPromise, apPromise, clPromise]).then((res) => {
      const dpResult = res[0]?.data?.data?.projectNameList || [];
      const apResult = res[1]?.data?.data?.projectNameList || [];
      const cListResult = res[2]?.data?.data || [];
      const projectNameList = _.unionBy([...dpResult, ...apResult], 'project');

      projectNameList.sort((a, b) =>
        `${a.project}${a.description}`
          .replace(/[() /-]/g, '')
          ?.localeCompare(`${b.project}${b.description}`.replace(/[() /-]/g, ''))
      );

      cListResult.sort((a, b) => `${a.contract}`?.localeCompare(`${b.contract}`));

      const newOptionsMap = {};
      const newContractOptionsMap = {};

      projectNameList.forEach((item) => {
        newOptionsMap[item.project] = item;
      });

      cListResult.forEach((item) => {
        newContractOptionsMap[item.contract] = item;
      });

      setContractOptions(cListResult);
      setContractOptionsMap(newContractOptionsMap);

      setOptionsMap(newOptionsMap);
      setOptions(projectNameList);
    });
  }, []);

  // 重新渲染页面
  const reRender = () => {
    setTimeout(() => {
      setRows([...rows]);
    }, 0);
  };

  const reGetDataList = () => {
    getDataList(true);
    setRecord([]);
  };

  //  undo last
  const undoLast = () => {
    if (!record.length || actionLoading) {
      return;
    }

    const lastItem = record[record.length - 1];

    const saveParams = [
      {
        id: lastItem.id,
        [lastItem.field]: lastItem.oldValue,
        sourceData: lastItem.newValue
      }
    ];

    setActionLoading(true);
    API.savePRPOSummary(saveParams)
      .then((res) => {
        if (res?.data?.code === 200) {
          CommonTip.success('Roll back the success', 1000);
          record.pop();
          const oldItem = rows.find((item) => item.id === lastItem.id);
          if (oldItem) {
            oldItem[lastItem.field] = lastItem.oldValue;
          }
        }
      })
      .finally(() => {
        setRecord([...record]);
        setRows([...rows]);
        setActionLoading(false);
      });
  };

  const onCellEditCommit = async (params) => {
    try {
      const { id, field, value } = params;
      const canNullArr = ['prDate', 'prSend', 'poSend'];
      if (actionLoading) {
        CommonTip.warning('Modified too frequently');
        reRender();
        return;
      }

      const oldItem = rows.find((item) => item.id === id);
      const oldValue = oldItem?.[field];
      if (!oldItem || value === oldValue) {
        return;
      }

      if (!canNullArr.includes(field) && (value === '' || value === undefined || value === null)) {
        CommonTip.warning('The input cannot be empty');
        reRender();
        return;
      }

      if (field === 'fiscalYear' && !/^[\d]*$/.test(value)) {
        CommonTip.warning('The input must be an integer');
        reRender();
        return;
      }

      if (field === 'prCode' && value?.length > 10) {
        CommonTip.warning('The length cannot exceed 10');
        reRender();
        return;
      }

      let flagObj = {};
      if (field === 'project') {
        const projectIsExit = options.find((item) => item?.project === value);
        const projectFlag = _.isUndefined(projectIsExit) ? 0 : 1;
        flagObj = { ...flagObj, projectFlag };
      }
      if (field === 'contract') {
        const contractIsExit = contractOptions.find((item) => item?.contract === value);
        const contractFlag = _.isUndefined(contractIsExit) ? 0 : 1;
        flagObj = { ...flagObj, contractFlag };
      }
      const saveParams = [{ id, [field]: value, sourceData: oldValue, ...flagObj }];

      setActionLoading(true);

      if (field === 'prCode') {
        const prCodeRes = await API.getPRPOSummaryByPrCode(value);
        if (prCodeRes?.data?.data?.status !== false) {
          CommonTip.warning(`${value} already exists`);
          reRender();
          setActionLoading(false);
          return;
        }
      }

      const res = await API.savePRPOSummary(saveParams);
      if (res?.data?.code === 200) {
        CommonTip.success('Modify successfully', 1000);
        oldItem[field] = value; // new value
        const newRecord = record;
        newRecord.push({
          ...oldItem,
          field,
          oldValue,
          newValue: value
        });
        setRecord([...newRecord]); // once modified, recorded once
      }
    } catch (error) {
      console.log(error);
    }

    setRows([...rows]);
    setActionLoading(false);
  };

  const handleUndoAll = () => {
    if (actionLoading) {
      return;
    }
    const recordCopy = JSON.parse(JSON.stringify(record));
    recordCopy.reverse(); // 先反转数组
    const restoreAll = _.unionBy(recordCopy, (item) => item.id + item.field); // 根据id+field去重
    if (!restoreAll?.length) {
      return;
    }

    const saveValueParams = restoreAll.map((item) => {
      const initItem = initRows.find((initVal) => initVal.id === item.id);
      return {
        id: item.id,
        [item.field]: initItem?.[item.field], // 页面进来时最初始的值
        sourceData: item.newValue
      };
    });

    setActionLoading(true);
    API.savePRPOSummary(saveValueParams)
      .then((res) => {
        if (res?.data?.code === 200) {
          CommonTip.success('All the rollback is successful');
          reGetDataList();
        }
      })
      .finally(() => {
        setActionLoading(false);
      });
  };

  const checkAD = useCallback(
    _.debounce((inputValue) => {
      if (inputValue?.length >= 3 && !loading) {
        setADLoading(true);
        setRequesterOptions([]);
        API.findUserList({ username: inputValue })
          .then((res) => {
            const newOptions = res?.data?.data || [];
            setRequesterOptions(newOptions);
          })
          .finally(() => {
            setADLoading(false);
          }, []);
      }
    }, 800),
    [ADLoading]
  );

  // Columns
  const columns = [
    {
      field: 'id',
      headerName: 'id',
      hide: true,
      flex: 1,
      editable: false
    },
    {
      field: 'fiscalYear',
      headerName: 'Fis Yr',
      hide: false,
      minWidth: 150,
      flex: 1,
      headerClassName: classes.headerClass,
      renderEditCell: ({ id, value, api, field }) => (
        <Autocomplete
          style={{ width: 140 }}
          id="fiscalYear"
          freeSolo
          value={value || null}
          options={optionsFiscaYear || []}
          onChange={(event, value) => {
            // console.log('change:', id, field, value, event);
            api.setEditCellValue({ id, field, value }, event);
          }}
          renderInput={(inputParams) => <TextField {...inputParams} />}
        />
      ),
      editable: true
    },
    {
      field: 'prDate',
      headerName: 'PR Date',
      minWidth: 150,
      flex: 1,
      headerClassName: classes.headerClass,
      valueFormatter: (param) =>
        _.isNull(param.value) ? param.value : dayjs(param.value).format('DD-MMM-YYYY'),
      renderEditCell: (param) => renderDate(param),
      editable: true
    },
    {
      field: 'prCode',
      headerName: 'PR Code',
      minWidth: 150,
      flex: 1,
      headerClassName: classes.headerClass,
      editable: true
    },
    {
      field: 'prNo',
      headerName: 'PR No.',
      minWidth: 150,
      flex: 1,
      headerClassName: classes.headerClass,
      editable: true
    },

    {
      field: 'lanPoolOrder',
      headerName: 'LPool',
      minWidth: 150,
      flex: 1,
      headerClassName: classes.headerClass,
      valueFormatter: (param) => (param.value === '1' ? 'Y' : 'N'),
      renderEditCell: ({ id, value, api, field }) => {
        console.log('LP:', value);
        return (
          <Select
            value={value}
            onChange={(event, value) => {
              console.log('change:', value);
              api.setEditCellValue({ id, field, value: value.props.value }, event);
            }}
          >
            <MenuItem value="1">Y</MenuItem>
            <MenuItem value="0">N</MenuItem>
          </Select>
        );
      },

      editable: true
    },
    {
      field: 'prSend',
      headerName: 'PR Sent',
      minWidth: 150,
      flex: 1,
      headerClassName: classes.headerClass,
      valueFormatter: (param) =>
        _.isNull(param.value) ? param.value : dayjs(param.value).format('DD-MMM-YYYY'),
      renderEditCell: (param) => renderDate(param),

      editable: true
    },
    {
      field: 'poNo',
      headerName: 'PO No.',
      headerClassName: classes.headerClass,
      minWidth: 150,
      flex: 1,
      editable: true
    },
    {
      field: 'poSend',
      headerName: 'PO Sent',
      minWidth: 150,
      flex: 1,
      headerClassName: classes.headerClass,
      valueFormatter: (param) =>
        _.isNull(param.value) ? param.value : dayjs(param.value).format('DD-MMM-YYYY'),
      renderEditCell: (param) => renderDate(param),

      editable: true
    },
    {
      field: 'totalAmount',
      headerName: 'Final Amt',
      type: 'number',
      minWidth: 150,
      flex: 1,
      headerClassName: classes.headerClass,
      editable: true
    },
    {
      field: 'contract',
      headerName: 'Contract No.',
      minWidth: 200,
      flex: 1,
      headerClassName: classes.headerClass,
      editable: true,
      renderEditCell: (params) => {
        const {
          value,
          api: { setEditCellValue }
        } = params;

        return (
          <div style={{ width: '100%' }}>
            <Autocomplete
              style={{ height: '100%' }}
              freeSolo
              forcePopupIcon
              value={contractOptionsMap[value] || null}
              onChange={(event, val) => {
                setEditCellValue({ ...params, value: val?.contract || '' });
              }}
              options={contractOptions || []}
              getOptionLabel={(option) => `${option?.contract}`}
              renderInput={(inputParams) => (
                <TextField
                  {...inputParams}
                  variant="outlined"
                  size="small"
                  fullWidth
                  style={{ height: '100%' }}
                  onChange={(e) => {
                    setEditCellValue({ ...params, value: e?.target?.value || '' });
                  }}
                />
              )}
            />
          </div>
        );
      }
    },
    {
      field: 'requesterTeam',
      headerName: "Requester's Team",
      minWidth: 180,
      flex: 1,
      headerClassName: classes.headerClass,
      editable: true
    },
    {
      field: 'prRequester',
      headerName: 'PR Requester',
      minWidth: 150,
      flex: 1,
      headerClassName: classes.headerClass,
      editable: true,
      renderEditCell: (params) => {
        const {
          value,
          api: { setEditCellValue }
        } = params;
        return (
          <div style={{ width: '100%' }}>
            <Autocomplete
              freeSolo
              forcePopupIcon
              style={{ height: '100%' }}
              value={value || ''}
              onChange={(event, value) => {
                setEditCellValue({ ...params, value });
              }}
              options={requesterOptions?.map((optionItem) => optionItem?.display) || []}
              renderInput={(inputParams) => (
                <TextField
                  {...inputParams}
                  variant="outlined"
                  style={{ height: '100%' }}
                  fullWidth
                  InputProps={{
                    ...inputParams.InputProps,
                    endAdornment: (
                      <>
                        {ADLoading ? <CircularProgress size={20} color="inherit" /> : null}
                        {inputParams.InputProps.endAdornment}
                      </>
                    )
                  }}
                  onChange={(e) => {
                    const value = e?.target?.value || '';
                    setEditCellValue({ ...params, value });
                    checkAD(value);
                  }}
                />
              )}
            />
          </div>
        );
      }
    },
    {
      field: 'vendorCode',
      headerName: 'Vendor Code',
      minWidth: 150,
      flex: 1,
      headerClassName: classes.headerClass,
      editable: true
    },
    {
      field: 'coa',
      headerName: 'COA',
      minWidth: 150,
      flex: 1,
      headerClassName: classes.headerClass,
      editable: true
    },
    {
      field: 'project',
      headerName: 'Project',
      minWidth: 150,
      flex: 1,
      headerClassName: classes.headerClass,
      editable: true,
      renderEditCell: (params) => {
        const {
          value,
          api: { setEditCellValue }
        } = params;
        console.log(optionsMap);
        console.log(optionsMap[value]);

        return (
          <div style={{ width: '100%' }}>
            <Autocomplete
              style={{ height: '100%' }}
              freeSolo
              forcePopupIcon
              value={optionsMap[value] || null}
              onChange={(event, val) => {
                setEditCellValue({ ...params, value: val?.project || '' });
              }}
              options={options}
              getOptionLabel={(option) => `${option.project}---${option.description}`}
              renderInput={(inputParams) => (
                <TextField
                  {...inputParams}
                  variant="outlined"
                  size="small"
                  fullWidth
                  style={{ height: '100%' }}
                  onChange={(e) => {
                    setEditCellValue({ ...params, value: e?.target?.value || '' });
                  }}
                />
              )}
            />
          </div>
        );
      }
    },
    {
      field: 'remark',
      headerName: 'Remarks',
      minWidth: 150,
      flex: 1,
      headerClassName: classes.headerClass,
      editable: true
    },
    {
      field: 'actions',
      headerName: 'Actions',
      hide: false,
      width: 150,
      filterable: false,
      renderCell: ({ row }) => (
        <div>
          <Tooltip title="Delete">
            <IconButton
              onClick={() => {
                setOpenDelete(true);
                setDeleteObj(row);
              }}
            >
              {getIcons('delete')}
            </IconButton>
          </Tooltip>
        </div>
      )
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

  const lanPoolColumn = columns.find((column) => column.field === 'lanPoolOrder');
  const lanPoolColIndex = columns.findIndex((col) => col.field === 'lanPoolOrder');

  const lanPoolOperators = getGridStringOperators().map((operator) => ({
    ...operator,
    InputComponent: renderLanPoolFilter
  }));

  columns[lanPoolColIndex] = {
    ...lanPoolColumn,
    filterOperators: lanPoolOperators
  };

  const addOneItem = (newItem) => {
    const InitItem = JSON.parse(JSON.stringify(newItem));
    initRows.unshift(InitItem);
    setInitRows([...initRows]);
    getDataList();
  };

  // Export CSV has Bugs
  const CustomToolbar = () => (
    <>
      <GridToolbarContainer>
        <GridToolbarFilterButton />
        <GridToolbarColumnsButton />
        <GridToolbarDensitySelector />
        <GridToolbarExport />
        <Button color="primary" startIcon={<AddIcon />} onClick={() => setAddOpen(true)}>
          Add record
        </Button>
      </GridToolbarContainer>
    </>
  );
  return (
    <div className={globalClasses.cellEditClass}>
      <Grid container style={{ padding: '10px 0px' }}>
        <PRPOButton
          undoLast={undoLast}
          record={record}
          handleUndoAll={handleUndoAll}
          actionLoading={actionLoading}
          lanPool={lanPool}
          setLanPool={setLanPool}
          reGetDataList={reGetDataList}
          fiscalYear={fiscalYear}
          setFiscalYear={setFiscalYear}
        />
      </Grid>

      <CommonDataGrid
        className={`${classes.myDataGrid} ${globalClasses.fixDatagrid}`}
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
        onCellEditCommit={onCellEditCommit}
        disableSelectionOnClick
        components={{
          Toolbar: CustomToolbar
        }}
        getCellClassName={(params) => {
          const { id, field, row } = params;
          let className = '';
          const value = row?.[field];
          const isExit = initRows.find((item) => item.id === id);
          if (isExit?.[field] !== value) {
            className = 'dataChange';
          }
          return className;
        }}
      />

      <WarningDialog
        open={openDelete}
        handleConfirm={handleDelete}
        handleClose={handleClose}
        title="Deletion"
        content={`Are you sure you want to permanently delete ${deleteObj.prCode}?`}
      />

      <AddPRPODialog
        addOpen={addOpen}
        setAddOpen={setAddOpen}
        addOneItem={addOneItem}
        options={options}
        optionsMap={optionsMap}
        contractOptions={contractOptions}
        contractOptionsMap={contractOptionsMap}
      />
    </div>
  );
}
