import React, { useState, memo, useCallback, useEffect } from 'react';
import {
  IconButton,
  Grid,
  Tooltip,
  makeStyles,
  CircularProgress,
  TextField,
  Select,
  Backdrop,
  Button,
  MenuItem
} from '@material-ui/core';
import {
  GridToolbarColumnsButton,
  GridToolbarContainer,
  GridToolbarDensitySelector,
  GridToolbarFilterButton
  // GridToolbarExport
} from '@material-ui/data-grid';
// import CloudDownloadIcon from '@material-ui/icons/CloudDownload';
// import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import _ from 'lodash';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import dayjs from 'dayjs';
import AddIcon from '@material-ui/icons/Add';
import { DatePicker } from '@material-ui/pickers';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { CommonDataGrid, CommonTip } from '../../../../../components';
import { useGlobalStyles } from '../../../../../style';
import { validMacAddress } from '../../../../../utils/tools';

import ipassignAPI from '../../../../../api/ipassign';
import webAPI from '../../../../../api/webdp/webdp';
import HandleSearch from './HandleSearch';
import Edit from './Edit';

// import fileAPI from '../../../../../api/file/file';
// import envUrl from '../../../../../utils/baseUrl';
// import { uploadFileCheck } from '../../../../../utils/auth';

const useStyles = makeStyles(() => ({
  headerClass: {
    color: '#229FFA'
  },
  dataGrids: {
    '& .inavailable': {
      backgroundColor: '#F5F5F5'
    }
  }
}));

const IPList = () => {
  const classes = useStyles();
  const [initRows, setInitRows] = useState([]);
  const [stepRow, setStepRow] = useState([]);
  const [ADLoading, setADLoading] = useState(false);
  const [filedUpdateLoading, setFiledUpdateLoading] = useState(false);
  const [requesterOptions, setRequesterOptions] = useState([]);
  const globalClasses = useGlobalStyles();
  const [rows, setRows] = useState([]);
  const [params, setParams] = useState({
    page: 1,
    pageSize: 10,
    subnet: '',
    ipAddress: '',
    hospital: '',
    block: '',
    floor: ''
  });
  const [listLoading, setListLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const [currentEditRow, setCurrentEditRow] = useState();

  const [hospitalList, setHospitalList] = useState([]);
  const [hospitalLoading, sethospitalLoading] = useState(false);

  useEffect(() => {
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
  }, []);

  const getIpAdminList = (queryData = {}) => {
    setListLoading(true);
    ipassignAPI
      .getIpAdminList(queryData)
      .then((res) => {
        let reslist = res?.data?.data || [];
        reslist = reslist.map((item) => ({
          ...item,
          id: item.ipAddress,
          tempFlag: String(item?.tempFlag),
          available: String(item?.available)
        }));
        setRows(JSON.parse(JSON.stringify(reslist)));
        setInitRows(JSON.parse(JSON.stringify(reslist)));
      })
      .finally(() => {
        setListLoading(false);
      });
  };

  const columns = [
    {
      field: 'ipAddress',
      headerName: 'IP Address',
      flex: 1,
      minWidth: 130
    },
    {
      field: 'lastUser',
      headerName: 'Current/Last User',
      flex: 1,
      minWidth: 170,
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
      field: 'phone',
      headerName: 'Phone',
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
      field: 'assignDate',
      headerName: 'Assign Date',
      flex: 1,
      editable: true,
      minWidth: 150,
      headerClassName: classes.headerClass,
      valueFormatter: (param) => (param?.value ? dayjs(param.value).format('DD-MMM-YYYY') : ''),
      renderEditCell: (param) => renderDate(param)
    },
    {
      field: 'purpose',
      headerName: 'Purpose',
      flex: 1,
      editable: true,
      minWidth: 150,
      headerClassName: classes.headerClass
    },
    {
      field: 'macAddress',
      headerName: 'Mac Address',
      flex: 1,
      editable: true,
      minWidth: 150,
      headerClassName: classes.headerClass
    },
    {
      field: 'hospital',
      headerName: 'Institution',
      flex: 1,
      hide: true,
      editable: true,
      headerClassName: classes.headerClass,
      minWidth: 150,
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
      field: 'available',
      headerName: 'Available',
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
      field: 'remark',
      headerName: 'Remarks',
      flex: 1,
      editable: true,
      minWidth: 150,
      headerClassName: classes.headerClass
    },
    {
      field: 'portId',
      headerName: 'Port ID',
      flex: 1,
      editable: true,
      minWidth: 150,
      headerClassName: classes.headerClass
    },
    {
      field: 'requestNo',
      headerName: 'RequestID',
      flex: 1,
      minWidth: 150
    },
    {
      field: 'tempFlag',
      headerName: 'Perm/Temp',
      flex: 1,
      editable: true,
      minWidth: 150,
      headerClassName: classes.headerClass,
      valueFormatter: (param) => (param.value === '1' ? 'Temp' : 'Perm'),
      renderEditCell: ({ id, value, api, field }) => (
        <Select
          value={value}
          onChange={(event, value) => {
            api.setEditCellValue({ id, field, value: value.props.value }, event);
          }}
        >
          <MenuItem value="0">Perm</MenuItem>
          <MenuItem value="1">Temp</MenuItem>
        </Select>
      )
    },
    {
      field: 'releaseData',
      headerName: 'Release Date',
      flex: 1,
      editable: true,
      minWidth: 150,
      headerClassName: classes.headerClass,
      valueFormatter: (param) => (param?.value ? dayjs(param.value).format('DD-MMM-YYYY') : ''),
      renderEditCell: (param) => renderDate(param)
    },
    {
      field: 'actions',
      headerName: 'Actions',
      flex: 1,
      editable: true,
      minWidth: 150,
      headerClassName: classes.headerClass,
      renderCell: (props) => (
        <Tooltip title="Copy">
          <IconButton
            onClick={() => {
              setOpen(true);
              setCurrentEditRow(props?.row);
            }}
          >
            <FileCopyIcon style={{ color: '#229FFA', fontSize: '20px' }} />
          </IconButton>
        </Tooltip>
      )
    }
  ];

  const renderDate = ({ id, value, api, field }) => (
    <DatePicker
      format="dd-MMM-yyyy"
      variant="dialog"
      clearable
      value={value || null}
      onChange={(value) => {
        api.setEditCellValue({
          id,
          field,
          value: value ? dayjs(value).format('YYYY-MM-DD HH:mm:ss') : value || ''
        });
      }}
    />
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
    const updateRowData = backCurentData.find((item) => item.id === data[0].ip);
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

    setFiledUpdateLoading(true);
    ipassignAPI
      .ipAdminListUpdate(data[0])
      .then((res) => {
        const oldObj = rows.find((item) => item.id === data[0].ip);
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
        setFiledUpdateLoading(false);
      });
  };

  const checkAD = useCallback(
    _.debounce((inputValue) => {
      if (inputValue?.length >= 3) {
        setADLoading(true);
        setRequesterOptions([]);
        webAPI
          .findUserList({ username: inputValue })
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

  const handleCellEdict = (id, filed, value) => {
    const currentObj = rows.find((item) => item.id === id);
    if (_.isUndefined(value) || currentObj?.[filed] === value) return;
    if (filed === 'macAddress' && !validMacAddress(value)) {
      CommonTip.warning('Incorrect MAC Address format!');
      setTimeout(() => {
        setRows([...rows]);
      }, 0);
      return;
    }

    if (filed === 'phone' && value?.length < 8) {
      CommonTip.warning('Phone length must be 8.');
      setTimeout(() => {
        setRows([...rows]);
      }, 0);
      return;
    }

    if (filed === 'available' || filed === 'tempFlag') {
      value = Number(value);
    }

    handleUpdate([{ ip: id, [filed]: value }], { isRecovery: false, filed });
  };
  // // 导出 xlsx
  // const exportExcel = () => {
  //   let ipsList = [];
  //   if (rows?.length > 0) {
  //     for (let i = 0; i < rows.length; i += 1) {
  //       ipsList = [...ipsList, rows[i].ipAddress];
  //     }
  //   }
  //   // console.log('exportExcel', rows, ipsList);
  //   if (ipsList.length > 0) {
  //     ipassignAPI.exportExcelIPList({ ipAddressList: ipsList }).then((res) => {
  //       // console.log('exportExcelIPList', res?.data?.data);
  //       if (res?.data?.code === 200) {
  //         const url = res?.data?.data;
  //         if (url !== '') {
  //           fetch(url)
  //             .then((res) => res.blob())
  //             .then((blob) => {
  //               // 将链接地址字符内容转变成blob地址
  //               const a = document.createElement('a');
  //               a.href = URL.createObjectURL(blob);
  //               // 测试链接console.log(a.href)
  //               a.download = 'ipList.xlsx'; // 下载文件的名字
  //               document.body.appendChild(a);
  //               a.click();
  //             });
  //         }
  //       }
  //     });
  //   }
  // };

  // 导入 xlsx
  // const fileHandler = (e) => {
  //   const file = e.currentTarget.files[0];
  //   if (uploadFileCheck(file)) {
  //     console.log('test: ', file);
  //     const formData = new FormData();
  //     formData.append('file', file);
  //     formData.append('fileName', file.name);
  //     formData.append('innerDir', '/SENSE/fileservice/upload/test');
  //     formData.append(
  //       'resumeFile',
  //       new Blob(
  //         [
  //           JSON.stringify({
  //             groupType: 'netWorkDesign',
  //             requestNo: 0,
  //             requesterId: 0,
  //             projectName: 'webDP'
  //           })
  //         ],
  //         {
  //           type: 'application/json'
  //         }
  //       )
  //     );

  //     Loading.show();
  //     fileAPI.webDPuploadFile(formData).then((res) => {
  //       // console.log('webDPuploadFile', res);
  //       const resData = res?.data?.data || [];
  //       const count = _.countBy(resData?.[0]?.fileUrl)['/'];
  //       let arr = resData?.[0]?.fileUrl.split('/');
  //       const fileName = arr?.[arr.length - 1];
  //       arr = arr?.splice(0, count);
  //       const dir = arr?.join('/');
  //       const path = `${envUrl.file}/resumeFile/downloadFile?remoteDir=${dir}/&remoteFile=${fileName}`;
  //       // console.log('path', path);
  //       updateURL2IPassign(path);
  //     });
  //     // .finally(() => {
  //     //   Loading.hide();
  //     // });
  //   }
  // };
  // 告诉 后端哪里取文件
  // const updateURL2IPassign = (path) => {
  //   Loading.show();
  //   ipassignAPI
  //     .importCSV2IPList({ url: path })
  //     .then((res) => {
  //       // console.log('importCSV2IPList', res);
  //       if (res?.data?.code === 200) {
  //         CommonTip.success('import success');
  //         // 检查一下 当前 查询框是否有条件，有就执行，没有就不用
  //         if(rows.length>0){

  //         }
  //       }
  //     })
  //     .finally(() => {
  //       Loading.hide();
  //       const files = document.getElementById('import');
  //       files.value = '';
  //     });
  // };

  const EditToolbar = () => (
    <GridToolbarContainer>
      <GridToolbarFilterButton />
      <GridToolbarColumnsButton />
      <GridToolbarDensitySelector />
      {/* <GridToolbarExport csvOptions={{ fileName: 'test' }} startIcon={<CloudDownloadIcon />} /> */}
      {/* <Button
        color="primary"
        component="label"
        startIcon={<CloudDownloadIcon />}
        onClick={exportExcel}
      >
        Export
      </Button>
      <Button color="primary" component="label" startIcon={<CloudUploadIcon />}>
        Import
        <input type="file" id="import" hidden onChange={fileHandler} accept=".xlsx" />
      </Button> */}
      <Button
        color="primary"
        disabled={!params.hospital}
        startIcon={<AddIcon />}
        onClick={() => setAddOpen(true)}
      >
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
          {...{
            listLoading,
            params,
            setParams,
            getIpAdminList,
            hospitalList,
            hospitalLoading,
            setRows,
            rows
            // exportExcel
          }}
        />
      </Grid>
      <CommonDataGrid
        className={`${globalClasses.fixDatagrid}  ${classes.dataGrids}`}
        rows={rows}
        onCellEditCommit={(params) => {
          handleCellEdict(params.id, params.field, params.value);
        }}
        columns={columns}
        loading={listLoading}
        disableColumnMenu
        page={params.page}
        pageSize={params.pageSize}
        onPageSizeChange={onPageSizeChange}
        onPageChange={onPageChange}
        rowsPerPageOptions={[10, 20, 50, 100]}
        disableSelectionOnClick
        getCellClassName={(params) => (params.row.available === '0' ? 'inavailable' : '')}
        isCellEditable={(params) => {
          const { row, field } = params;
          if (field === 'releaseData' && row.available === '1') {
            return false;
          }
          return true;
        }}
        components={{
          Toolbar: EditToolbar
        }}
      />

      <Edit
        {...{
          currentEditRow,
          open,
          setOpen,
          getIpAdminList,
          params,
          rows,
          hospitalList,
          hospitalLoading
        }}
      />
      <Edit
        isAdd
        {...{
          open: addOpen,
          setOpen: setAddOpen,
          getIpAdminList,
          params,
          hospitalList,
          hospitalLoading
        }}
      />
    </Grid>
  );
};

export default memo(IPList);
