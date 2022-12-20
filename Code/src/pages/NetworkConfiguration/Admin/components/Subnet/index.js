import React, { useState, memo, useEffect } from 'react';
import {
  Grid,
  makeStyles,
  Button,
  Backdrop,
  CircularProgress,
  Select,
  MenuItem,
  TextField
} from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import {
  GridToolbarColumnsButton,
  GridToolbarContainer,
  GridToolbarDensitySelector,
  GridToolbarFilterButton
} from '@material-ui/data-grid';
import AddIcon from '@material-ui/icons/Add';
import _ from 'lodash';

import { CommonDataGrid, CommonTip } from '../../../../../components';
import { useGlobalStyles } from '../../../../../style';
import { validSubnet } from '../../../../../utils/tools';
import HandleSearch from './HandleSearch';
import webAPI from '../../../../../api/webdp/webdp';
import AddDialog from './AddDialog';
import ipassignAPI from '../../../../../api/ipassign';

const useStyles = makeStyles(() => ({
  headerClass: {
    color: '#229FFA'
  }
}));

const Subnet = () => {
  const classes = useStyles();
  const globalClasses = useGlobalStyles();
  const [rows, setRows] = useState([]);
  const [stepRow, setStepRow] = useState([]);
  const [listLoading, setListLoading] = useState(false);
  const [filedUpdateLoading, setFiledUpdateLoading] = useState(false);
  const [initRows, setInitRows] = useState([]);
  const [addOpen, setAddOpen] = useState(false);

  const [hospitalList, setHospitalList] = useState([]);
  const [hospitalLoading, sethospitalLoading] = useState(false);

  const [floorLoading, setFloorLoading] = useState(false);

  const [blockLoading, setBlockLoading] = useState(false);

  const [blockistMap, setBlockListMap] = useState([]);
  const [floorListMap, setFloorListMap] = useState([]);

  const [params, setParams] = useState({
    page: 1,
    pageSize: 10,
    subnet: '',
    ipAddres: '',
    hospital: '',
    block: '',
    floor: ''
  });

  const getListPage = (queryData = {}) => {
    queryData = { ...queryData, pageIndex: 1, pageSize: 999999 };
    setListLoading(true);
    ipassignAPI
      .getListPage(queryData)
      .then((res) => {
        let reslist = res?.data?.data?.records || [];
        reslist = reslist.map((item) => ({
          ...item,
          isEnable: String(item?.isEnable)
        }));
        setRows(JSON.parse(JSON.stringify(reslist)));
        setInitRows(JSON.parse(JSON.stringify(reslist)));
      })
      .finally(() => {
        setListLoading(false);
      });
  };

  useEffect(() => {
    getHospitalList();
    getListPage();
  }, []);

  const getHospitalList = () => {
    sethospitalLoading(true);
    webAPI
      .getHospitalList()
      .then((res) => {
        const resHospitalList = res?.data?.data?.hospitalList || [];
        setHospitalList(resHospitalList);
      })
      .finally(() => {
        sethospitalLoading(false);
      });
  };

  const columns = [
    {
      field: 'id',
      headerName: 'ID',
      flex: 1,
      minWidth: 100
    },
    {
      field: 'hospital',
      headerName: 'Institution',
      flex: 1,
      editable: true,
      minWidth: 150,
      headerClassName: classes.headerClass,
      renderEditCell: (params) => {
        const {
          value,
          api: { setEditCellValue }
        } = params;
        return (
          <div style={{ width: '100%' }}>
            <Autocomplete
              forcePopupIcon
              style={{ height: '100%' }}
              value={hospitalList?.find((item) => item.hospital === value) || null}
              onChange={(event, value) => {
                setEditCellValue({ ...params, value: value?.hospital || '' });
              }}
              options={hospitalList || []}
              getOptionLabel={(option) => `${option?.hospital}---${option?.hospitalName}`}
              renderInput={(params) => <TextField {...params} size="medium" variant="outlined" />}
            />
          </div>
        );
      }
    },
    {
      field: 'block',
      headerName: 'Block',
      flex: 1,
      editable: true,
      minWidth: 150,
      headerClassName: classes.headerClass,
      renderEditCell: (params) => {
        const {
          value,
          api: { setEditCellValue }
        } = params;
        return (
          <div style={{ width: '100%' }}>
            <Autocomplete
              forcePopupIcon
              style={{ height: '100%' }}
              value={value}
              onChange={(e, value) => {
                setEditCellValue({ ...params, value: value || '' });
              }}
              loading={blockLoading}
              options={blockistMap?.[params?.row?.hospital] || []}
              renderInput={(params) => <TextField {...params} size="medium" variant="outlined" />}
            />
          </div>
        );
      }
    },
    {
      field: 'floor',
      headerName: 'Floor',
      flex: 1,
      editable: true,
      minWidth: 150,
      headerClassName: classes.headerClass,
      renderEditCell: (params) => {
        const {
          value,
          row,
          api: { setEditCellValue }
        } = params;
        return (
          <div style={{ width: '100%' }}>
            <Autocomplete
              forcePopupIcon
              style={{ height: '100%' }}
              value={value}
              onChange={(e, value) => {
                setEditCellValue({ ...params, value: value || '' });
              }}
              loading={floorLoading}
              options={floorListMap?.[`${row.hospital}${row.block}`] || []}
              renderInput={(params) => <TextField {...params} size="medium" variant="outlined" />}
            />
          </div>
        );
      }
    },
    {
      field: 'floorOrder',
      headerName: 'Floor Order',
      flex: 1,
      editable: true,
      minWidth: 150,
      headerClassName: classes.headerClass,
      renderEditCell: (params) => {
        const {
          value,
          api: { setEditCellValue }
        } = params;
        return (
          <div style={{ width: '100%' }}>
            <TextField
              value={value}
              size="medium"
              variant="outlined"
              style={{ height: '100%' }}
              inputProps={{ maxLength: 8 }}
              onChange={(e) => {
                const value = e?.target?.value || '';
                if ((value && /^[0-9]*$/.test(value)) || !value) {
                  setEditCellValue({ ...params, value });
                }
              }}
            />
          </div>
        );
      }
    },
    {
      field: 'newSubnet',
      headerName: 'New Subnet',
      flex: 1,
      editable: true,
      minWidth: 150,
      headerClassName: classes.headerClass
    },
    {
      field: 'isEnable',
      headerName: 'Is Enable',
      flex: 1,
      editable: true,
      minWidth: 150,
      headerClassName: classes.headerClass,
      valueFormatter: (param) => (param.value === '1' ? 'Yes' : 'No'),
      renderEditCell: ({ id, value, api, field }) => (
        <Select
          value={value}
          onChange={(event, value) => {
            api.setEditCellValue({ id, field, value: value.props.value }, event);
          }}
        >
          <MenuItem value="1">Yes</MenuItem>
          <MenuItem value="0">No</MenuItem>
        </Select>
      )
    },
    {
      field: 'remarks',
      headerName: 'Remarks',
      flex: 1,
      editable: true,
      minWidth: 150,
      headerClassName: classes.headerClass
    },
    {
      field: 'bit',
      headerName: 'Bit',
      flex: 1,
      editable: true,
      minWidth: 150,
      headerClassName: classes.headerClass,
      renderEditCell: (params) => {
        const {
          value,
          api: { setEditCellValue }
        } = params;
        return (
          <div style={{ width: '100%' }}>
            <TextField
              value={value}
              size="medium"
              variant="outlined"
              style={{ height: '100%' }}
              inputProps={{ maxLength: 8 }}
              onChange={(e) => {
                let value = e?.target?.value || '';
                if ((value && /^[0-9]*$/.test(value)) || value === '') {
                  value = Number(value || '');
                  value = value > 32 ? 32 : value;
                  setEditCellValue({ ...params, value });
                }
              }}
            />
          </div>
        );
      }
    }
  ];

  const getBlockList = (row) => {
    if (!Object.prototype.hasOwnProperty.call(blockistMap, row.hospital)) {
      setBlockLoading(true);
      webAPI
        .getBlockByHospCodeList(row?.hospital)
        .then((blockResult) => {
          let blockList = blockResult?.data?.data?.blockByHospCodeList || [];
          blockList = blockList.map((item) => item.block);
          const blocktMap = { ...blockistMap, [row.hospital]: blockList };
          setBlockListMap(blocktMap);
        })
        .finally(() => {
          setBlockLoading(false);
        });
    }
  };
  const getFloorList = (row) => {
    if (!Object.prototype.hasOwnProperty.call(floorListMap, `${row.hospital}${row.block}`)) {
      setFloorLoading(true);
      webAPI
        .getBlockAndFloorByHospCodeList({
          hospCode: row?.hospital,
          block: row?.block
        })
        .then((blockResult) => {
          let floorList = blockResult?.data?.data?.blockAndFloorByHospCodeList || [];
          floorList = floorList.map((item) => item.floor);
          const floorListMap = { ...floorListMap, [`${row.hospital}${row.block}`]: floorList };
          setFloorListMap(floorListMap);
        })
        .finally(() => {
          setFloorLoading(false);
        });
    }
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

  const handleCellEdict = (id, filed, value) => {
    const currentObj = rows.find((item) => item.id === id);
    if (_.isUndefined(value) || currentObj?.[filed] === value) return;
    if (filed === 'newSubnet' && !validSubnet(value)) {
      CommonTip.warning('Incorrect subnet format!');
      setTimeout(() => {
        setRows([...rows]);
      }, 0);
      return;
    }
    if (filed === 'isEnable') {
      value = Number(value);
    }
    if (filed === 'floorOrder') {
      value = value || null;
    }

    handleUpdate([{ id, [filed]: value }], { isRecovery: false, filed });
  };

  const handleUpdate = async (data, helpData) => {
    // 这里还不用撤销功能，这样写未来后面需要
    if (filedUpdateLoading) {
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

      // ↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓
      // 联动修改
      if (
        helpData.filed === 'hospital' &&
        (!data[0]?.hospital || data[0]?.hospital !== updateRowData.hospital)
      ) {
        data = [
          ...data,
          { id: updateRowData.id, block: null, sourceData: updateRowData?.block },
          { id: updateRowData.id, floor: null, sourceData: updateRowData?.floor }
        ];
      } else if (
        helpData.filed === 'block' &&
        (!data[0]?.block || data[0]?.block !== updateRowData.block)
      ) {
        data = [...data, { id: updateRowData.id, floor: null, sourceData: updateRowData?.floor }];
      }

      // ↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↓
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

    setFiledUpdateLoading(true);
    ipassignAPI
      .updateListData(data)
      .then((res) => {
        const oldObj = rows.find((item) => item.id === data[0].id);
        const oldValue = oldObj[helpData.filed];

        if (!helpData.isRecovery) {
          if (res.data.code === 200) {
            CommonTip.success(`Cell saved successfully.`);

            // Update view
            oldObj[helpData?.filed] = data[0][helpData?.filed];
            if (
              helpData?.filed === 'hospital' &&
              (!data[0].hospital || data[0]?.hospital !== updateRowData.hospital)
            ) {
              oldObj.block = '';
              oldObj.floor = '';
            }
            if (
              helpData?.filed === 'block' &&
              (!data[0].block || data[0]?.block !== updateRowData.block)
            ) {
              oldObj.floor = '';
            }

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
        setFiledUpdateLoading(false);
      });
  };

  const EditToolbar = () => (
    <GridToolbarContainer>
      <GridToolbarFilterButton />
      <GridToolbarColumnsButton />
      <GridToolbarDensitySelector />
      <Button color="primary" startIcon={<AddIcon />} onClick={() => setAddOpen(true)}>
        Add
      </Button>
    </GridToolbarContainer>
  );
  return (
    <Grid container className={globalClasses.cellEditClass}>
      <Backdrop open={filedUpdateLoading} style={{ zIndex: 999 }} invisible>
        <CircularProgress />
      </Backdrop>
      <Grid item xs={12} style={{ padding: '10px 0px' }}>
        <HandleSearch
          {...{ params, setParams, hospitalList, hospitalLoading, listLoading, getListPage }}
        />
      </Grid>
      <CommonDataGrid
        className={globalClasses.fixDatagrid}
        rows={rows}
        onCellEditCommit={(params) => {
          handleCellEdict(params.id, params.field, params.value);
        }}
        onCellDoubleClick={(params) => {
          const { row, field } = params;
          if (field === 'block' && row.hospital) {
            getBlockList(row);
          }
          if (field === 'floor' && row.hospital && row.block) {
            getFloorList(row);
          }
        }}
        columns={columns}
        loading={listLoading}
        disableColumnMenu
        page={params.page}
        getRowId={(row) => row.id}
        pageSize={params.pageSize}
        onPageSizeChange={onPageSizeChange}
        onPageChange={onPageChange}
        rowsPerPageOptions={[10, 20, 50, 100]}
        disableSelectionOnClick
        isCellEditable={(params) => {
          const { row, field } = params;
          if (field === 'block' && !row.hospital) {
            return false;
          }
          if (field === 'floor' && (!row.hospital || !row.block)) {
            return false;
          }
          return true;
        }}
        components={{
          Toolbar: EditToolbar
        }}
      />

      <AddDialog {...{ hospitalList, hospitalLoading, addOpen, setAddOpen, getListPage }} />
    </Grid>
  );
};

export default memo(Subnet);
