import React, { useState, useEffect } from 'react';
import _ from 'lodash';
import {
  GridToolbarColumnsButton,
  GridToolbarContainer,
  GridToolbarDensitySelector,
  GridToolbarFilterButton,
  GridToolbarExport
} from '@material-ui/data-grid';
import { IconButton, Grid, Tooltip, Button, makeStyles, TextField } from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import AddIcon from '@material-ui/icons/Add';
import POLineButton from './POLineSummaryBTN';
import { CommonDataGrid, WarningDialog } from '../../../../components';
import getIcons from '../../../../utils/getIcons';
import API from '../../../../api/webdp/webdp';
import CommonTip from '../../../../components/CommonTip';
import AddPOLineDialog from './AddPOLineDialog';
import { useGlobalStyles } from '../../../../style';

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
  const [initRows, setInitRows] = useState([]);
  const [rows, setRows] = useState([]);
  const [record, setRecord] = useState([]); // edit record

  const [loading, setLoading] = useState(false);
  const [params, setParams] = useState({ page: 1, pageSize: 10 });

  const [openDelete, setOpenDelete] = useState(false);
  const [deleteObj, setDeleteObj] = useState({});
  const [actionLoading, setActionLoading] = useState(false);
  // const [drawerOpen, setDrawerOpen] = useState(false);
  const [options, setOptions] = useState([]);
  const [optionsLoading, setOptionsLoading] = useState(false);
  const [addOpen, setAddOpen] = useState(false);

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

  const handleClose = () => {
    setOpenDelete(false);
    setDeleteObj({});
  };

  // Delete
  const handleDelete = () => {
    API.deletePoLineItem(deleteObj?.id)
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
    API.savePoLineItem(saveParams)
      .then((res) => {
        if (res?.data?.code === 200) {
          CommonTip.success('Roll back the success', 1000);
          record.pop();
          const oldItem = rows.find((item) => item.id === lastItem.id);
          if (oldItem) {
            oldItem[lastItem.field] = lastItem.oldValue;
          }
          if (oldItem && lastItem.field === 'shortFormEquipId') {
            oldItem.shortDesc = lastItem.oldShortDesc;
          }
        }
      })
      .finally(() => {
        setRecord([...record]);
        setRows([...rows]);
        setActionLoading(false);
      });
  };

  // Columns
  const columns = [
    {
      field: 'poNo',
      headerName: 'PO No.',
      hide: false,
      width: 200
    },
    {
      field: 'poLineNo',
      headerName: 'PO Line No.',
      headerClassName: classes.headerClass,
      width: 150,
      editable: true
    },
    {
      field: 'shortFormEquipId',
      headerName: 'Product Description',
      headerClassName: classes.headerClass,
      flex: 1,
      editable: true,
      renderCell: ({ row }) => row.shortDesc || '',
      renderEditCell: (params) => {
        const {
          value,
          api: { setEditCellValue }
        } = params;

        const valueMap = options.find((item) => item.shortFormEquipId === value);

        return (
          <div style={{ width: '100%' }}>
            <Autocomplete
              style={{ height: '100%' }}
              loading={optionsLoading}
              value={valueMap || null}
              onChange={(event, val) => {
                setEditCellValue({ ...params, value: val?.shortFormEquipId || '' });
              }}
              options={options}
              getOptionLabel={(option) => `${option?.partNo || ''} ${option?.shortDesc || ''}`}
              renderInput={(inputParams) => (
                <TextField
                  {...inputParams}
                  variant="outlined"
                  size="small"
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
      field: 'shortDesc',
      headerName: 'Product Description',
      headerClassName: classes.headerClass,
      flex: 1,
      hide: true
    },
    {
      field: 'qty',
      headerName: 'Qty',
      headerClassName: classes.headerClass,
      width: 150,
      editable: true,
      type: 'number',
      headerAlign: 'left',
      align: 'left'
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 120,
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

  const getDataList = (isSetInit) => {
    setLoading(true);
    API.getPoLineItem()
      .then((res) => {
        if (res?.data?.data) {
          const newRows = res?.data?.data?.poLineItemList || [];
          console.log('new Rows', newRows);

          setRows(JSON.parse(JSON.stringify(newRows)));
          if (isSetInit) {
            setInitRows(JSON.parse(JSON.stringify(newRows)));
          }
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    getDataList(true);
  }, []);

  const onCellEditCommit = (params) => {
    const { id, field, value, row } = params;

    if (actionLoading) {
      CommonTip.warning('Modified too frequently');
      setTimeout(() => {
        setRows([...rows]);
      }, 0);
      return;
    }

    const oldItem = rows.find((item) => item.id === id);
    const oldValue = oldItem?.[field]; // before modify value
    if (!oldItem || value === oldValue) {
      return;
    }

    if (field === 'qty' && (value <= 0 || !/^[0-9]*$/.test(value))) {
      CommonTip.warning('The input must be an integer');
      setTimeout(() => {
        setRows([...rows]);
      }, 0);
      return;
    }

    if (!value) {
      CommonTip.warning('The input cannot be empty');
      setTimeout(() => {
        setRows([...rows]);
      }, 0);
      return;
    }

    const saveParams = [
      {
        id,
        [field]: value,
        sourceData: oldValue
      }
    ];

    let hasOption = {};
    let newShortDesc = null;
    let oldShortDesc = null;
    if (field === 'shortFormEquipId') {
      hasOption = options.find((item) => item.shortFormEquipId === value);
      newShortDesc = hasOption?.shortDesc;
      oldShortDesc = row.shortDesc;
    }

    setActionLoading(true);
    API.savePoLineItem(saveParams)
      .then((res) => {
        if (res?.data?.code === 200) {
          CommonTip.success('Modify successfully', 1000);
          oldItem[field] = value; // new value
          if (field === 'shortFormEquipId') {
            oldItem.shortDesc = hasOption?.shortDesc;
          }
          const newRecord = record;
          newRecord.push({
            ...oldItem,
            field,
            oldValue,
            newValue: value,
            oldShortDesc,
            newShortDesc
          });
          setRecord([...newRecord]); // once modified, recorded once
        }
      })
      .finally(() => {
        setRows([...rows]);
        setActionLoading(false);
      });
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

    const saveValueMap = restoreAll.map((item) => {
      const initItem = initRows.find((initVal) => initVal.id === item.id);
      return {
        id: item.id,
        [item.field]: initItem?.[item.field], // 页面进来时最初始的值
        sourceData: item.newValue
      };
    });

    setActionLoading(true);
    API.savePoLineItem(saveValueMap)
      .then((res) => {
        if (res?.data?.code === 200) {
          CommonTip.success('All the rollback is successful');
          getDataList(true);
          setRecord([]);
        }
      })
      .finally(() => {
        setActionLoading(false);
      });
  };

  const onCellEditStart = (params) => {
    const {
      field,
      row: { poNo }
    } = params;
    if (field === 'shortFormEquipId') {
      setOptionsLoading(true);
      setOptions([]);
      API.getProductDescription(poNo)
        .then((res) => {
          const newOptions = res?.data?.data?.productDescriptionList || [];
          newOptions.sort((a, b) =>
            `${a.partNo}`
              .replace(/[. /-]/g, '')
              ?.localeCompare(`${b.partNo}`.replace(/[. /-]/g, ''))
          );

          setOptions(newOptions);
        })
        .catch(() => {
          setOptions([]);
        })
        .finally(() => {
          setOptionsLoading(false);
        });
    }
  };

  // const addOneItem = (newItem) => {
  //   const InitItem = JSON.parse(JSON.stringify(newItem));
  //   initRows.unshift(InitItem);
  //   setInitRows([...initRows]);
  //   getDataList();
  // };

  // Export CSV has Bugs
  const CustomToolbar = () => (
    <>
      <GridToolbarContainer>
        <GridToolbarFilterButton />
        <GridToolbarColumnsButton />
        <GridToolbarDensitySelector />
        <GridToolbarExport
          csvOptions={{
            fileName: 'exportFile',
            fields: ['poNo', 'poLineNo', 'shortDesc', 'qty'],
            utf8WithBom: true
          }}
        />
        <Button color="primary" startIcon={<AddIcon />} onClick={() => setAddOpen(true)}>
          Add record
        </Button>
      </GridToolbarContainer>
    </>
  );

  return (
    <div className={globalClasses.cellEditClass}>
      <Grid container style={{ padding: '10px 0px' }}>
        <POLineButton
          undoLast={undoLast}
          record={record}
          handleUndoAll={handleUndoAll}
          actionLoading={actionLoading}
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
        onCellEditStart={onCellEditStart}
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
        content="Are you sure delete this data?"
      />

      <AddPOLineDialog addOpen={addOpen} setAddOpen={setAddOpen} addOneItem={getDataList} />
    </div>
  );
}
