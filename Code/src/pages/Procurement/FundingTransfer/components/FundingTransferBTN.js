import _ from 'lodash';
import React, { useState, useRef, memo, useEffect } from 'react';
import { Grid, Button, TextField, makeStyles } from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';
import { useReactToPrint } from 'react-to-print';
import CheckIcon from '@material-ui/icons/Check';
import RestoreIcon from '@material-ui/icons/Restore';
import UndoIcon from '@material-ui/icons/Undo';
import SearchIcon from '@material-ui/icons/Search';
import SaveIcon from '@material-ui/icons/Save';
import * as Yup from 'yup';
import dayjs from 'dayjs';
import { useFormik } from 'formik';
import { WarningDialog, HAKeyboardDatePicker } from '../../../../components';
import CommonTip from '../../../../components/CommonTip';
import Loading from '../../../../components/Loading';
import API from '../../../../api/webdp/webdp';
import FundingTransferTemplate from './template/FundingTransferTemplate';
import SendEmailDialog from './SendEmailDialog/index';
import ActionLogs from '../../../rms/Preparation/components/ActionLogs/index';

const useStyles = makeStyles((theme) => ({
  btnStyle: {
    marginLeft: theme.spacing(4),
    marginBottom: theme.spacing(1)
  }
}));

const FTButton = (props) => {
  const {
    undoLast,
    searchCondition,
    stepRow,
    selected,
    setSelected,
    txCodes,
    loading,
    selectType,
    setSelectType,
    params,
    setParams,
    getCompletedTXCode
  } = props;
  const classes = useStyles();
  const componentRef = useRef();
  const titleRef = useRef('');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [pdfList, setPdfList] = useState([]);
  const [openCancel, setOpenCancel] = useState(false);
  const [openFundingDialog, setOpenFundingDialog] = useState(false);
  const [openEmail, setOpenEmail] = useState(false);
  const [exportTXCode] = useState({ value: '' });
  const [oldTitle] = useState(document.title);

  useEffect(() => {
    titleRef.current = pdfList?.[0]?.txCode || '';
  }, [pdfList]);

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    onBeforePrint: () => {
      document.title = `${titleRef.current}-Fund Transfer`;
    },
    onAfterPrint: () => {
      setSelected([]);
      exportExcel();
      setSelectType({ id: '', type: '', txCode: '' });
      document.title = oldTitle;
    }
  });

  const formik = useFormik({
    initialValues: {
      status: 0,
      startTime: params.startTime,
      endTime: params.endTime
    },
    validationSchema: Yup.object({
      startTime: Yup.string().required('Please input startTime.'),
      endTime: Yup.string().required('Please input endTime.')
    }),
    onSubmit: (values) => {
      const { status, startTime, endTime } = values;
      setSelected([]);
      setSelectType({ id: '', type: '', txCode: '' });
      setParams({ ...params, page: 1, status, startTime, endTime });
    }
  });
  const { startTime, endTime } = formik.values;

  const statusList = [
    { values: 2, label: 'ALL' },
    { values: 3, label: 'External Bill' },
    { values: 1, label: 'Completed TX Code' }
  ];

  // export Excel
  const exportExcel = () => {
    const id = _.map(selected, 'id');
    API.exportExcel(id).then((res) => {
      if (res?.data) {
        try {
          const blob = new Blob([res.data], {
            type: 'application/vnd.ms-excel;charset=utf-8'
          });
          const objectUrl = URL.createObjectURL(blob);
          const link = document.createElement('a');
          const fileName = exportTXCode.value
            ? `${exportTXCode.value}-Fund Transfer`
            : `Fund Transfer`;
          link.href = objectUrl;
          link.setAttribute('download', fileName);
          document.body.appendChild(link);
          link.click();
        } catch (error) {
          CommonTip.error(`Export fail.`);
        }
      }
    });
  };

  // handleConfirm
  const handleConfirm = () => {
    let id = _.map(selected, 'id');
    id = id?.join(',') || '';
    Loading.show();
    API.getInfoToPDF({ id })
      .then((res) => {
        const getInfoToPDFList = res?.data?.data?.getInfoToPDFList || [];
        if (getInfoToPDFList?.length > 0) {
          exportTXCode.value = getInfoToPDFList[0]?.txCode || '';
          setPdfList(res?.data?.data?.getInfoToPDFList || []);
          setOpenFundingDialog(false);
          handlePrint();
          searchCondition();
        } else {
          CommonTip.error(`System Busy.`);
        }
        getCompletedTXCode();
      })
      .finally(() => {
        Loading.hide();
      });
  };

  const commonProps = { item: true, xs: 12, lg: 12, xl: 7 };
  const commonProps2 = { item: true, xs: 12, lg: 12, xl: 5 };
  const buttonProps = { variant: 'contained', color: 'primary', className: classes.btnStyle };

  const fundingDialogContent = () => {
    const dpReqs = _.map(selected, 'dpReq');
    return `Document and TX code will be generated for ${dpReqs?.length} selected ${
      dpReqs?.length > 1 ? 'requests' : 'request'
    }.`;
  };

  const getEndTimeMaxDate = () => {
    if (startTime) {
      const handleTime = dayjs(startTime).add(2, 'year');
      const nowTime = dayjs().format('YYYY-MM-DD 00:00:00');

      if (handleTime.diff(nowTime) < 0) {
        return handleTime;
      }
    }

    return new Date();
  };

  return (
    <>
      <Grid container>
        <Grid {...commonProps}>
          <Grid container spacing={4} style={{ minWidth: 710, marginBottom: 0 }}>
            <Grid item xs={12} sm={6} md={7} lg={7}>
              <Grid container spacing={5}>
                <Grid item xs={4}>
                  <Autocomplete
                    style={{ marginTop: -3 }}
                    id="status"
                    options={statusList}
                    getOptionLabel={(option) => `${option.label}`}
                    onChange={(e, data) => {
                      formik.setFieldValue('status', data?.values || 0);
                    }}
                    renderInput={(inputParams) => <TextField {...inputParams} label="Status" />}
                  />
                </Grid>
                <Grid item xs={4}>
                  <HAKeyboardDatePicker
                    label="Start Date"
                    inputVariant="standard"
                    value={startTime}
                    error={Boolean(formik.errors.startTime && formik.touched.startTime)}
                    name="startTime"
                    style={{ minWidth: 138 }}
                    minDate={
                      endTime ? dayjs(endTime).add(-2, 'year').format('YYYY-MM-DD') : undefined
                    }
                    maxDate={endTime || new Date()}
                    onChange={(date) => {
                      formik.setFieldValue('startTime', date);
                    }}
                  />
                </Grid>
                <Grid item xs={4}>
                  <HAKeyboardDatePicker
                    label="End Date"
                    name="endTime"
                    style={{ minWidth: 138 }}
                    inputVariant="standard"
                    minDate={startTime || undefined}
                    maxDate={getEndTimeMaxDate()}
                    value={endTime}
                    error={Boolean(formik.errors.endTime && formik.touched.endTime)}
                    onChange={(date) => {
                      formik.setFieldValue('endTime', date);
                    }}
                  />
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12} sm={6} md={5} lg={5}>
              <Button {...buttonProps} startIcon={<SearchIcon />} onClick={formik.handleSubmit}>
                Search
              </Button>
              {selected?.length > 0 && (
                <Button
                  {...buttonProps}
                  startIcon={<SaveIcon />}
                  onClick={() => {
                    exportTXCode.value = selected?.[0].txCode || '';
                    exportExcel();
                  }}
                >
                  Export Excel
                </Button>
              )}
            </Grid>
          </Grid>
        </Grid>

        <Grid {...commonProps2}>
          <Grid container spacing={4} justifyContent="flex-end" style={{ marginTop: 0 }}>
            {selected?.length > 0 && (
              <>
                {!selectType?.txCode ? (
                  <Button {...buttonProps} onClick={() => setOpenFundingDialog(true)}>
                    Funding Transfer
                  </Button>
                ) : (
                  <Button
                    {...buttonProps}
                    onClick={() => {
                      setPdfList(selected);
                      setTimeout(() => {
                        handlePrint();
                      }, 0);
                    }}
                  >
                    Regenerate File
                  </Button>
                )}
              </>
            )}

            {selected.length === 0 && (
              <Button {...buttonProps} disabled={loading} onClick={() => setOpenEmail(true)}>
                Send Email
              </Button>
            )}
            <Button {...buttonProps} startIcon={<CheckIcon />} onClick={() => setDrawerOpen(true)}>
              Action Log
            </Button>
            <Button
              {...buttonProps}
              startIcon={<RestoreIcon />}
              onClick={() => setOpenCancel(true)}
              disabled={!stepRow.length > 0 || !!selected.length}
            >
              Undo All
            </Button>
            <Button
              {...buttonProps}
              startIcon={<UndoIcon />}
              onClick={() => undoLast(false)}
              disabled={!stepRow.length > 0 || !!selected.length}
            >
              Undo Last
            </Button>
          </Grid>
        </Grid>
      </Grid>

      <WarningDialog
        open={openCancel}
        handleConfirm={() => {
          undoLast(true);
          setOpenCancel(false);
        }}
        handleClose={() => setOpenCancel(false)}
        content="All the changes will be recovered.  Are you sure to continue?"
      />

      <WarningDialog
        open={openFundingDialog}
        handleConfirm={() => {
          handleConfirm();
        }}
        handleClose={() => setOpenFundingDialog(false)}
        content={fundingDialogContent()}
      />
      <div style={{ display: 'none' }}>
        <div ref={componentRef}>
          <FundingTransferTemplate
            selected={pdfList}
            isShowIssueBill={selectType?.type === 'External'}
          />
        </div>
      </div>

      {openEmail && (
        <SendEmailDialog
          setOpenEmail={setOpenEmail}
          openEmail={openEmail}
          txCodes={txCodes}
          setParams={setParams}
          params={params}
        />
      )}

      <ActionLogs {...{ drawerOpen, setDrawerOpen, module: 'fundingTransfer' }} />
    </>
  );
};

export default memo(FTButton);
