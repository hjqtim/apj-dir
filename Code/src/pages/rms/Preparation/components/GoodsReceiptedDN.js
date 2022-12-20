import React, { useState, useEffect } from 'react';
import _ from 'lodash';
import {
  GridToolbarColumnsButton,
  GridToolbarContainer,
  GridToolbarDensitySelector,
  GridToolbarFilterButton,
  GridToolbarExport
} from '@material-ui/data-grid';
import { IconButton, Grid, Tooltip, Button, makeStyles } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';

import { CommonDataGrid, WarningDialog } from '../../../../components';
import getIcons from '../../../../utils/getIcons';
import CommonTip from '../../../../components/CommonTip';
import API from '../../../../api/webdp/webdp';
import AddRecordDialog from './AddRecordDialog';
import { useGlobalStyles } from '../../../../style';

import DNButton from './GoodsReceiptedDNBTN';

export default function SingleRowSelectionGrid() {
  const useStyles = makeStyles(() => ({
    headerClass: {
      color: '#229FFA'
    }
  }));
  const classes = useStyles();
  const globalClasses = useGlobalStyles();

  const [rows, setRows] = useState([]);
  const [stepRow, setStepRow] = useState([]);
  const [initRows, setInitRows] = useState([]);
  const [openDelete, setOpenDelete] = useState(false);
  const [openAdd, setOpenAdd] = useState(false);
  const [deleteID, setDeleteID] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [listLoading, setListLoading] = useState(false);
  const [params, setParams] = useState({ page: 1, pageSize: 10 });

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

  // handleDeleteClick
  const handleDeleteClick = (e, id) => {
    setOpenDelete(true);
    setDeleteID(id);
  };

  // True Delete
  const handleDelete = () => {
    if (isLoading) {
      return;
    }
    API.deleteGoodReceiptDn(deleteID)
      .then((res) => {
        if (res?.data?.code === 200) {
          CommonTip.success('Delete data successfully');

          // 更新记录和表格数据
          const newStepRow = stepRow.filter((item) => item.id !== deleteID);
          const newRows = rows.filter((item) => item.id !== deleteID);
          setStepRow(newStepRow);
          setRows(newRows);
        }
      })
      .finally(() => {
        setOpenDelete(false);
      });
  };

  // Edit table
  const handleCellEdict = (id, filed, value) => {
    const currentObj = rows.find((item) => item.id === id);
    if (_.isUndefined(value) || currentObj?.[filed] === value) return;
    // 数据输入为空则将数据恢复
    if (!value && filed !== 'remarks') {
      CommonTip.warning('The input cannot be empty.');
      setTimeout(() => {
        setRows([...rows]);
      }, 0);
      return;
    }
    saveChange([{ id, [filed]: value }], { isRecovery: false, filed });
  };

  /**
   *
   * @param {*} data 保存数据的数组
   * @param {*} helpData 辅助数据 isRecovery 是否是回退操作
   */

  const saveChange = async (data, helpData) => {
    if (isLoading) {
      CommonTip.warning(`Modified too frequently.`);
      setTimeout(() => {
        setRows([...rows]);
      }, 0);
      return;
    }

    if (!data.length) return;

    const backCurentData = JSON.parse(JSON.stringify(rows));
    const updateRowData = backCurentData.find((item) => item.id === data[0].id);
    // when update, record source data
    if (!helpData.isRecovery) {
      // update operation
      data = [{ ...data[0], sourceData: updateRowData[helpData.filed] }];
    } else if (helpData.isRecovery) {
      if (data.length === 1) {
        // undo last operation
        const keys = Object.keys(data[0]);
        data = [{ ...data[0], sourceData: updateRowData[keys[1]] }];
      } else {
        // undo all operation
        data = data.map((item) => {
          const bkdata = backCurentData.find((val) => val.id === item.id);
          const keys = Object.keys(item);
          return { ...item, sourceData: bkdata[keys[1]] };
        });
      }
    }

    setIsLoading(true);
    API.saveGoodReceiptDn(data)
      .then((res) => {
        const oldObj = rows.find((item) => item.id === data[0].id);
        const oldValue = oldObj[helpData.filed];

        if (!helpData.isRecovery) {
          // the length of data must be 1
          if (res.data.code === 200) {
            CommonTip.success(`Cell saved successfully.`);

            // Update view
            oldObj[helpData?.filed] = data[0][helpData?.filed];
            // Add a record of the record list
            stepRow.push({ id: oldObj.id, [helpData.filed]: oldValue });
            setStepRow([...stepRow]);
          }
        } else if (helpData.isRecovery) {
          if (res.data.code === 200) {
            CommonTip.success(`Cell recovery successfully.`);
            if (data.length === 1) {
              // undo Last , remove record list  item
              const undoLastObj = stepRow[stepRow.length - 1];
              const keys = Object.keys(undoLastObj);
              oldObj[keys[1]] = data[0][keys[1]];
              stepRow.pop();
              setStepRow([...stepRow]);
            } else {
              // undo All
              setRows(JSON.parse(JSON.stringify(initRows)));
              setStepRow([]);
            }
          }
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  // Columns
  const columns = [
    {
      field: 'deliverynote',
      headerName: 'Delivery Note No.',
      headerClassName: classes.headerClass,
      hide: false,
      flex: 1,
      editable: true
    },
    {
      field: 'reqNo',
      headerName: 'Request Form No.',
      headerClassName: classes.headerClass,
      flex: 1,
      editable: true
    },
    {
      field: 'receiptNo',
      headerName: 'Receipt No.',
      headerClassName: classes.headerClass,
      flex: 1,
      editable: true
    },
    {
      field: 'remarks',
      headerName: 'Remarks',
      headerClassName: classes.headerClass,
      flex: 1,
      editable: true
    },
    {
      field: 'actions',
      headerName: 'Actions',
      hide: false,
      flex: 1,
      disableExport: true,
      headerAlign: 'center',
      filterable: false,
      align: 'center',
      headerClassName: classes.headerClass,
      renderCell: (props) => {
        const { id } = props;
        return (
          <div>
            <Tooltip title="Delete">
              <IconButton onClick={(e) => handleDeleteClick(e, id)}>
                {getIcons('delete')}
              </IconButton>
            </Tooltip>
          </div>
        );
      }
    }
  ];

  const getDataList = () => {
    setListLoading(true);
    API.getGoodReceiptDnList()
      .then((res) => {
        if (res?.data?.data) {
          const newRows = res?.data?.data?.goodReceiptDnList || [];
          setRows(JSON.parse(JSON.stringify(newRows)));
          setInitRows(JSON.parse(JSON.stringify(newRows)));
        }
      })
      .finally(() => {
        setListLoading(false);
      });
  };

  useEffect(() => {
    getDataList();
  }, []);

  /**
   * @description  undo lasts
   * @param {*} isUndoAll  Whether UndoAll
   */
  const undoLast = (isUndoAll) => {
    let data = [];
    if (isUndoAll) {
      setRows(initRows);
      // Record the value before the first modification
      let exitItem = [];
      // Request's  data
      data = stepRow.filter((item) => {
        const keys = Object.keys(item);
        const unionkey = `${item.id}${keys[1]}`;
        const ixExit = exitItem.find((item) => item === unionkey);
        if (_.isUndefined(ixExit)) {
          exitItem = [...exitItem, unionkey];
        }
        return _.isUndefined(ixExit);
      });
    } else {
      data = [stepRow[stepRow.length - 1]];
    }
    saveChange(data, { isRecovery: true });
  };

  const EditToolbar = () => {
    const addOneRow = () => {
      setOpenAdd(true);
    };

    return (
      <GridToolbarContainer>
        <GridToolbarFilterButton />
        <GridToolbarColumnsButton />
        <GridToolbarDensitySelector />
        <GridToolbarExport />
        <Button color="primary" startIcon={<AddIcon />} onClick={addOneRow}>
          Add record
        </Button>
      </GridToolbarContainer>
    );
  };

  return (
    <div className={globalClasses.cellEditClass}>
      <Grid container style={{ padding: '10px 0px' }}>
        <DNButton
          undoLast={undoLast}
          stepRow={stepRow}
          setStepRow={setStepRow}
          params={params}
          setParams={setParams}
          searchCondition={getDataList}
        />
      </Grid>

      <CommonDataGrid
        className={globalClasses.fixDatagrid}
        rows={rows}
        columns={columns}
        loading={listLoading}
        disableColumnMenu
        page={params.page}
        getRowId={(row) => row.id}
        pageSize={params.pageSize}
        onPageSizeChange={onPageSizeChange}
        onPageChange={onPageChange}
        rowsPerPageOptions={[10, 20, 50, 100]}
        onCellEditCommit={(params) => {
          handleCellEdict(params.id, params.field, params.value);
        }}
        disableSelectionOnClick
        components={{
          Toolbar: EditToolbar
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
      <AddRecordDialog
        openAdd={openAdd}
        setOpenAdd={setOpenAdd}
        getDataList={getDataList}
        isLoading={isLoading}
        setIsLoading={setIsLoading}
      />
      <WarningDialog
        open={openDelete}
        handleConfirm={handleDelete}
        handleClose={() => setOpenDelete(false)}
        content="Are you sure delete this data?"
      />
    </div>
  );
}
