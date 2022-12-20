import React, { memo, useEffect, useMemo } from 'react';
import {
  Grid,
  makeStyles,
  Slide,
  Button,
  Tooltip,
  Backdrop,
  CircularProgress
} from '@material-ui/core';
import { useFormik } from 'formik';
import dayjs from 'dayjs';
import { Autocomplete } from '@material-ui/lab';
import { MyTextField, CommonDialog, CommonDataGrid, CommonTip } from '../../../../components';
import TypeEnum from './TypeEnum';
import webdpAPI from '../../../../api/webdp/webdp';
import { dateFormatShow, handleSortHospital } from '../../../../utils/tools';
import dataGridTooltip from '../../../../utils/dataGridTooltip';

const useStyles = makeStyles(() => ({
  historyDataGrid: {
    '& .MuiDataGrid-iconSeparator': {
      display: 'none'
    },
    '& .MuiDataGrid-columnHeaderTitleContainer': {
      padding: 0
    }
  }
}));

const ItemStyle = {
  padding: '5px'
};

const DialogProps = { xs: 3, item: true };

const Transition = React.forwardRef((props, ref) => <Slide direction="up" ref={ref} {...props} />);

const HistoryDialog = (props) => {
  const classes = useStyles();

  const { history = {}, setValueByField, equipid, statusList, freshData } = props;
  const { type } = history;

  const open = !Number.isNaN(parseInt(type)); // 数字为打开，null为关闭

  const formik = useFormik({
    initialValues: {
      baseData: {},
      historyList: [],
      serialNoTo: '',
      assetNoTo: '',
      caseRef: '',
      reason: '',
      modelDescTo: '',
      modelCodeTo: '',
      descriptionList: [],
      loading: false,
      hospitalList: [],
      hospital: null,
      closetList: [],
      closetIDTo: '',
      networkApplied: ''
    },
    validate: (values) => {
      const customErrors = {};

      if (!values.caseRef) {
        customErrors.caseRef = true;
      }
      if (!values.reason) {
        customErrors.reason = true;
      }

      if (type === TypeEnum.replace) {
        if (!values.serialNoTo) {
          customErrors.serialNoTo = true;
        }
        if (!values.assetNoTo) {
          customErrors.assetNoTo = true;
        }
        if (!values.modelDescTo) {
          customErrors.modelDescTo = true;
        }
        if (!values.modelCodeTo) {
          customErrors.modelCodeTo = true;
        }
      } else if (type === TypeEnum.relocate) {
        if (!values.hospital?.hospital) {
          customErrors.hospital = true;
        }
        if (!values.closetIDTo) {
          customErrors.closetIDTo = true;
        }
        if (!values.networkApplied) {
          customErrors.networkApplied = true;
        }
      }

      return customErrors;
    },
    onSubmit: () => {
      if (type === TypeEnum.replace) {
        handleSubmitReplace();
      } else if (type === TypeEnum.relocate) {
        handleSubmitRelocate();
      }
      // 调用返回equiment刷新数据
    }
  });

  const { setFieldValue, handleChange, handleBlur } = formik;

  const {
    baseData,
    historyList,
    serialNoTo,
    assetNoTo,
    caseRef,
    reason,
    descriptionList,
    modelDescTo,
    modelCodeTo,
    loading,
    hospitalList,
    hospital,
    closetList,
    closetIDTo,
    networkApplied
  } = formik.values;

  const appliedList = useMemo(
    () => statusList.filter((item) => item.optionType === 'NetworkApplied'),
    [statusList]
  );

  const getClosetList = (hospitalCode) => {
    webdpAPI.getClosetsAndSub({ hospital: hospitalCode }).then((res) => {
      setFieldValue('closetList', res?.data?.data?.data?.closets || []);
    });
  };

  const getDetailData = () => {
    const p1 = webdpAPI.getEquipmentDetail({ equipId: equipid });

    let p3 = null;

    let p4 = null;

    const historyParams = {
      equipId: equipid
    };

    if (type === TypeEnum.replace) {
      p3 = webdpAPI.getShortFormEquipByEquip();
      historyParams.actionType = 'Replace';
    } else if (type === TypeEnum.relocate) {
      p4 = webdpAPI.getHospitalList();
      historyParams.actionType = 'Relocate';
    } else if (type === TypeEnum.history) {
      historyParams.actionType = null;
    }

    const p2 = webdpAPI.getHistoryEquip(historyParams);

    setFieldValue('loading', true);
    Promise.all([p1, p2, p3, p4])
      .then((res) => {
        const newBaseData = res?.[0]?.data?.data?.data?.baseData || {};

        if (!baseData?.id) {
          setFieldValue('networkApplied', newBaseData.networkApplied || '');
          setFieldValue('modelDescTo', newBaseData.modeldesc || '');
          setFieldValue('modelCodeTo', newBaseData.modelCode || '');
        }

        setFieldValue('baseData', newBaseData);
        setFieldValue('historyList', res?.[1]?.data?.data?.data || []);
        setFieldValue('descriptionList', res?.[2]?.data?.data?.data || []);
        const newHospitalList = handleSortHospital(res?.[3]?.data?.data?.hospitalList || []);
        setFieldValue('hospitalList', newHospitalList);
      })
      .finally(() => {
        setFieldValue('loading', false);
      });
  };

  useEffect(() => {
    if (open && equipid) {
      getDetailData();
    }
  }, [open]);

  const networkAppliedMap = (record) => {
    const { value } = record;
    let val = '';
    const hasFind = appliedList.find((item) => item.optionValue === value);
    if (hasFind) {
      val = hasFind.description;
    } else if (value) {
      val = value;
    }

    return (
      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
        <Tooltip title={val} placement="top">
          <span>{val}</span>
        </Tooltip>
      </span>
    );
  };

  const columns = [
    {
      field: 'actionType',
      headerName: 'Action Type',
      width: 100,
      hideSortIcons: true,
      renderCell: (record) => {
        const { value } = record;
        return (
          <span>
            <strong>{value}</strong>
          </span>
        );
      }
    },
    {
      field: 'recordCreatedOn',
      headerName: 'Action Date',
      minWidth: 170,
      flex: 1,
      hideSortIcons: true,
      valueGetter: (record) => {
        const { value } = record;
        return value ? dayjs(value).format(dateFormatShow) : '';
      }
    },
    {
      field: 'serialNoFr',
      headerName: 'S/N Before',
      minWidth: 160,
      flex: 1,
      hideSortIcons: true,
      hide: type === TypeEnum.relocate,
      renderCell: dataGridTooltip
    },
    {
      field: 'serialNoTo',
      headerName: 'S/N After',
      minWidth: 160,
      flex: 1,
      hideSortIcons: true,
      hide: type === TypeEnum.relocate,
      renderCell: dataGridTooltip
    },
    {
      field: 'assetNoFr',
      headerName: 'Asset No Before',
      minWidth: 160,
      flex: 1,
      hideSortIcons: true,
      hide: type === TypeEnum.relocate,
      renderCell: dataGridTooltip
    },
    {
      field: 'assetNoTo',
      headerName: 'Asset No After',
      minWidth: 160,
      flex: 1,
      hideSortIcons: true,
      hide: type === TypeEnum.relocate,
      renderCell: dataGridTooltip
    },
    {
      field: 'modelDescFr',
      headerName: 'Description Before',
      minWidth: 200,
      flex: 1,
      hideSortIcons: true,
      hide: type === TypeEnum.relocate,
      renderCell: (record) => {
        const { row } = record;

        let val = '';
        if (row.modelDescFr) {
          val = `${row.modelDescFr} (${row.modelCodeFr})`;
        }

        return (
          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            <Tooltip title={val} placement="top">
              <span>{val}</span>
            </Tooltip>
          </span>
        );
      }
    },
    {
      field: 'modelDescTo',
      headerName: 'Description After',
      minWidth: 200,
      flex: 1,
      hideSortIcons: true,
      hide: type === TypeEnum.relocate,
      renderCell: (record) => {
        const { row } = record;

        let val = '';
        if (row.modelDescTo) {
          val = `${row.modelDescTo} (${row.modelCodeTo})`;
        }

        return (
          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            <Tooltip title={val} placement="top">
              <span>{val}</span>
            </Tooltip>
          </span>
        );
      }
    },
    {
      field: 'closetIDFr',
      headerName: 'Closet Before',
      minWidth: 160,
      flex: 1,
      hideSortIcons: true,
      hide: type === TypeEnum.replace,
      renderCell: dataGridTooltip
    },
    {
      field: 'closetIDTo',
      headerName: 'Closet After',
      minWidth: 160,
      flex: 1,
      hideSortIcons: true,
      hide: type === TypeEnum.replace,
      renderCell: dataGridTooltip
    },
    {
      field: 'networkAppliedFr',
      headerName: 'Network Applied Before',
      minWidth: 170,
      flex: 1,
      hideSortIcons: true,
      hide: type === TypeEnum.replace,
      renderCell: networkAppliedMap
    },
    {
      field: 'networkAppliedTo',
      headerName: 'Network Applied After',
      minWidth: 170,
      flex: 1,
      hideSortIcons: true,
      hide: type === TypeEnum.replace,
      renderCell: networkAppliedMap
    },
    {
      field: 'respStaff',
      headerName: 'Action BY',
      minWidth: 150,
      flex: 1,
      hideSortIcons: true,
      renderCell: dataGridTooltip
    },
    {
      field: 'reason',
      headerName: 'Reason',
      minWidth: 150,
      flex: 1,
      hideSortIcons: true,
      renderCell: dataGridTooltip
    },
    {
      field: 'caseRef',
      headerName: 'Case Ref',
      minWidth: 150,
      flex: 1,
      hideSortIcons: true,
      renderCell: dataGridTooltip
    }
  ];

  const handleClose = () => {
    setValueByField('history.selectItem', null);
    setValueByField('history.type', null);
    setTimeout(() => {
      formik.handleReset();
    }, 500);
  };

  const getTitle = () => {
    if (type === TypeEnum.replace) {
      return 'Replace';
    }

    if (type === TypeEnum.relocate) {
      return 'Relocate';
    }

    if (type === TypeEnum.history) {
      return 'History';
    }
    return '';
  };

  const onRowDoubleClick = (record) => {
    if (type === TypeEnum.history) {
      setValueByField('history.selectItem', record.row);
    }
  };

  // 提交Replace
  const handleSubmitReplace = () => {
    const saveReplaceParams = {
      equipID: baseData.equipid,
      serialNoFr: baseData.serialNo,
      serialNoTo: serialNoTo || '',
      assetNoFr: baseData.assetNo,
      assetNoTo: assetNoTo || '',
      modelDescFr: baseData.modeldesc,
      modelDescTo: modelDescTo || '',
      modelCodeFr: baseData.modelCode,
      modelCodeTo: modelCodeTo || '',
      caseRef: caseRef || '',
      reason: reason || '',
      actionType: 'Replace'
    };
    setFieldValue('loading', true);
    webdpAPI
      .insertHistoryEquip(saveReplaceParams)
      .then((res) => {
        if (res?.data?.data?.result) {
          CommonTip.success('success', 2000);
          setTimeout(() => {
            getDetailData();
          }, 1000);
          setValueByField('freshData', freshData + 1);
        }
      })
      .finally(() => {
        setFieldValue('loading', false);
      });
  };

  // 提交Relocate
  const handleSubmitRelocate = () => {
    const saveRelocateParams = {
      equipID: baseData.equipid,
      closetIDFr: baseData.closetid,
      closetIDTo: closetIDTo || '',
      networkAppliedFr: baseData.networkApplied || '',
      networkAppliedTo: networkApplied || '',
      caseRef: caseRef || '',
      reason: reason || '',
      actionType: 'Relocate'
    };

    setFieldValue('loading', true);
    webdpAPI
      .insertHistoryEquip(saveRelocateParams)
      .then((res) => {
        if (res?.data?.data?.result) {
          CommonTip.success('success', 2000);
          setTimeout(() => {
            getDetailData();
          }, 1000);
          // 还要到首页更新数据
          setValueByField('freshData', freshData + 1);
        }
      })
      .finally(() => {
        setFieldValue('loading', false);
      });
  };

  const getDescriptionValue = useMemo(() => {
    const hasFind = descriptionList.find((item) => item.shortDesc === modelDescTo);

    if (hasFind) {
      return hasFind;
    }
    if (!hasFind && modelDescTo) {
      return { shortDesc: modelDescTo };
    }
    return null;
  }, [descriptionList, modelDescTo]);

  const getClosetValue = useMemo(
    () => closetList.find((item) => item.closetid === closetIDTo) || null,
    [closetList, closetIDTo]
  );

  const getNetworkAppliedVal = useMemo(
    () => appliedList.find((item) => item.optionValue === networkApplied) || null,
    [appliedList, networkApplied]
  );

  return (
    <div>
      <CommonDialog
        TransitionComponent={Transition}
        open={open}
        title={getTitle()}
        handleClose={handleClose}
        maxWidth="md"
        content={
          <div style={{ padding: '20px' }}>
            <Grid container>
              <Grid {...DialogProps} style={ItemStyle}>
                <MyTextField label="Ref. ID" disabled value={baseData.equipid || ''} />
              </Grid>

              <Grid {...DialogProps} style={ItemStyle}>
                <MyTextField label="IP Address" disabled value={baseData.ipAddress || ''} />
              </Grid>

              <Grid {...DialogProps} style={ItemStyle}>
                <MyTextField label="Closet ID" disabled value={baseData.closetid || ''} />
              </Grid>
            </Grid>

            {/* Replace */}
            {type === TypeEnum.replace && (
              <Grid container>
                <Grid
                  xs={12}
                  item
                  style={{
                    ...ItemStyle,
                    color: '#078080',
                    fontSize: '16px'
                  }}
                >
                  <strong>Replacement</strong>
                </Grid>

                <Grid {...DialogProps} style={ItemStyle}>
                  <MyTextField
                    label="New Serial No. *"
                    value={serialNoTo || ''}
                    name="serialNoTo"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={Boolean(formik.touched.serialNoTo && formik.errors.serialNoTo)}
                  />
                </Grid>

                <Grid {...DialogProps} style={ItemStyle}>
                  <MyTextField
                    label="New Asset No. *"
                    value={assetNoTo}
                    name="assetNoTo"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={Boolean(formik.touched.assetNoTo && formik.errors.assetNoTo)}
                  />
                </Grid>

                <Grid {...DialogProps} style={ItemStyle}>
                  <Autocomplete
                    options={descriptionList}
                    getOptionLabel={(option) => option.shortDesc}
                    value={getDescriptionValue}
                    onChange={(e, v) => {
                      setFieldValue('modelDescTo', v?.shortDesc || '');

                      setTimeout(() => {
                        setFieldValue('modelCodeTo', v?.modelCode || '');
                      }, 0);
                    }}
                    renderInput={(inputParams) => (
                      <MyTextField
                        {...inputParams}
                        label="New Description *"
                        name="modelDescTo"
                        onBlur={handleBlur}
                        error={Boolean(formik.touched.modelDescTo && formik.errors.modelDescTo)}
                      />
                    )}
                  />
                </Grid>

                <Grid {...DialogProps} style={ItemStyle}>
                  <MyTextField
                    label="New Model Code *"
                    disabled
                    value={modelCodeTo || ''}
                    error={Boolean(formik.touched.modelDescTo && formik.errors.modelCodeTo)}
                  />
                </Grid>
              </Grid>
            )}

            {/* Relocate */}
            {type === TypeEnum.relocate && (
              <Grid container>
                <Grid
                  xs={12}
                  item
                  style={{
                    ...ItemStyle,
                    color: '#078080',
                    fontSize: '16px'
                  }}
                >
                  <strong>Relocation</strong>
                </Grid>

                <Grid {...DialogProps} style={ItemStyle}>
                  <Autocomplete
                    options={hospitalList}
                    getOptionLabel={(option) => `${option.hospital}---${option.hospitalName}`}
                    value={hospital}
                    onChange={(e, value) => {
                      setFieldValue('hospital', value);

                      setFieldValue('closetList', []);
                      setFieldValue('closetIDTo', '');

                      if (value?.hospital) {
                        getClosetList(value.hospital);
                      }
                    }}
                    renderInput={(inputParams) => (
                      <MyTextField
                        {...inputParams}
                        label="To Institution *"
                        name="hospital"
                        onBlur={handleBlur}
                        error={Boolean(formik.touched.hospital && formik.errors.hospital)}
                      />
                    )}
                  />
                </Grid>

                <Grid {...DialogProps} style={ItemStyle}>
                  <Autocomplete
                    options={closetList}
                    getOptionLabel={(option) => option.closetid}
                    value={getClosetValue}
                    onChange={(e, value) => {
                      setFieldValue('closetIDTo', value?.closetid || '');
                    }}
                    renderInput={(inputParams) => (
                      <MyTextField
                        {...inputParams}
                        label="To Closet *"
                        name="closetIDTo"
                        onBlur={handleBlur}
                        error={Boolean(formik.touched.closetIDTo && formik.errors.closetIDTo)}
                      />
                    )}
                  />
                </Grid>

                <Grid {...DialogProps} style={ItemStyle}>
                  <Autocomplete
                    options={appliedList}
                    getOptionLabel={(option) => option.description}
                    value={getNetworkAppliedVal}
                    onChange={(e, v) => {
                      setFieldValue('networkApplied', v?.optionValue || '');
                    }}
                    renderInput={(inputParams) => (
                      <MyTextField
                        {...inputParams}
                        label="Network Applied *"
                        name="networkApplied"
                        onBlur={handleBlur}
                        error={Boolean(
                          formik.touched.networkApplied && formik.errors.networkApplied
                        )}
                      />
                    )}
                  />
                </Grid>
              </Grid>
            )}

            {/* Operator */}
            {(type === TypeEnum.replace || type === TypeEnum.relocate) && (
              <Grid container>
                <Grid
                  xs={12}
                  item
                  style={{
                    ...ItemStyle,
                    color: '#078080',
                    fontSize: '16px'
                  }}
                >
                  <strong>Other</strong>
                </Grid>

                <Grid {...DialogProps} style={ItemStyle}>
                  <MyTextField
                    label="Case Reference *"
                    value={caseRef}
                    name="caseRef"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={Boolean(formik.touched.caseRef && formik.errors.caseRef)}
                  />
                </Grid>

                <Grid {...DialogProps} xs={9} style={ItemStyle}>
                  <MyTextField
                    label="Reason *"
                    value={reason}
                    name="reason"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={Boolean(formik.touched.reason && formik.errors.reason)}
                  />
                </Grid>
              </Grid>
            )}

            {(type === TypeEnum.relocate || type === TypeEnum.replace) && (
              <Grid container justifyContent="flex-end">
                <Grid item style={ItemStyle}>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => {
                      formik.handleSubmit();
                    }}
                  >
                    Confirm This Change
                  </Button>
                </Grid>
              </Grid>
            )}

            <Grid container className={classes.historyDataGrid}>
              <Grid
                xs={12}
                item
                style={{
                  ...ItemStyle,
                  color: '#078080',
                  fontSize: '16px'
                }}
              >
                <strong>History</strong>
              </Grid>

              <Grid item xs={12} style={ItemStyle}>
                <CommonDataGrid
                  rows={historyList}
                  columns={columns}
                  pageSize={10}
                  headerHeight={25}
                  rowHeight={25}
                  //   autoHeight={false}
                  hideFooterSelectedRowCount
                  filterMode="server"
                  //   headerHeight={20}
                  rowsPerPageOptions={[10]}
                  sortingMode="server"
                  isRowSelectable={() => false}
                  onRowDoubleClick={onRowDoubleClick}
                />
              </Grid>
            </Grid>
          </div>
        }
      />

      <Backdrop open={loading} style={{ zIndex: 1301 }}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </div>
  );
};

export default memo(HistoryDialog);
