import React, { useEffect, useState } from 'react';
import * as Yup from 'yup';
import { useFormik } from 'formik';
// import { alpha } from '@material-ui/core/styles';
import { Grid, TextField, Button } from '@material-ui/core';
import dayjs from 'dayjs';
import { CommonTip, CommonDialog, HAKeyboardDatePicker } from '../../../../components';
// import DatePicker from '../../../../components/DatePickerforRMS/DatePicker';
import API from '../../../../api/webdp/webdp';

export default function AddRecordDialog({ openAdd, setOpenAdd, getDataList, setStepRow }) {
  const generateFY = () => {
    let year = '';
    year = dayjs().format('YYYY');
    const a = year.slice(2, 4);
    const b = parseInt(a) + 1;
    return a + b;
  };

  const formik = useFormik({
    initialValues: {
      fiscalYear: generateFY(),

      fundParty: '',
      billNo: '',

      fundTxCode: '',
      totalAmount: '',

      date: '',
      dateSend: '',
      billReceived: '',

      remarks: ''
    },
    // 表单验证
    validationSchema: Yup.object({
      fiscalYear: Yup.string().required('error'),

      fundParty: Yup.string().required('error'),
      // billNo: Yup.string().required('error'),

      fundTxCode: Yup.string().required('error'),
      totalAmount: Yup.number().required('error')
    }),
    onSubmit: (values) => {
      handleSave(values);
    }
  });

  const handleSave = (values) => {
    // console.log('handleSave', values);

    API.saveFundTXSumarry([
      {
        id: 0,
        fiscalYear: values.fiscalYear,
        fundParty: values.fundParty,
        billNo: values.billNo,
        // fundTxCode: values.fundTxCode,
        txCode: values.fundTxCode,
        totalAmount: parseFloat(values.totalAmount).toFixed(2),
        date: dayjs(memoDate).format('YYYY-MM-DD HH:mm:ss'),
        dateSend: dayjs(dateSend).format('YYYY-MM-DD HH:mm:ss'),
        billReceived: dayjs(billReceived).format('YYYY-MM-DD HH:mm:ss'),
        remarks: values.remarks
      }
    ]).then((res) => {
      if (res.data.code === 200) {
        formik.handleReset();
        setOpenAdd(false);
        CommonTip.success(`Added successfully.`);

        getDataList();
        setStepRow([]);
      } else {
        CommonTip.warning(`Added fail.`);
      }
    });
  };
  const checkTxcode = () => {
    // console.log('checkTxcode', formik.values.fundTxCode);
    API.getFundingFXSummaryByTxCode(formik.values.fundTxCode).then((res) => {
      console.log('txCode', res.data?.data?.status);
      if (res.data?.data?.status === true) {
        CommonTip.warning(`TX Code ${formik.values.fundTxCode} has exists!`);
        formik.setFieldValue('fundTxCode', '');
      }
    });
  };

  const [memoDate, setMemoDate] = useState(dayjs().format('DD-MMM-YYYY'));
  const [dateSend, setDateSend] = useState(dayjs().format('DD-MMM-YYYY'));
  const [billReceived, setBillReceived] = useState(dayjs().format('DD-MMM-YYYY'));

  useEffect(() => {}, []);

  return (
    <>
      <CommonDialog
        open={openAdd}
        title="Add  Record "
        content={
          <div style={{ padding: 40 }}>
            <Grid container spacing={4}>
              <Grid item xs={6}>
                <TextField
                  name="FisYr"
                  label="FisYr"
                  variant="outlined"
                  size="small"
                  fullWidth
                  value={formik.values.fiscalYear || ''}
                  disabled
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  name="fundParty"
                  label="Fund Party"
                  variant="outlined"
                  size="small"
                  fullWidth
                  onChange={formik.handleChange}
                  value={formik.values.fundParty || ''}
                  error={Boolean(formik.errors.fundParty && formik.touched.fundParty)}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  name="billNo"
                  label="Bill No"
                  variant="outlined"
                  size="small"
                  fullWidth
                  onChange={formik.handleChange}
                  value={formik.values.billNo || ''}
                  error={Boolean(formik.errors.billNo && formik.touched.billNo)}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  name="fundTxCode"
                  label="Fund TX Code"
                  variant="outlined"
                  size="small"
                  fullWidth
                  onChange={formik.handleChange}
                  onBlur={checkTxcode}
                  value={formik.values.fundTxCode || ''}
                  error={Boolean(formik.errors.fundTxCode && formik.touched.fundTxCode)}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  name="totalAmount"
                  label="Total Amount"
                  variant="outlined"
                  size="small"
                  fullWidth
                  onChange={(e) => {
                    console.log('totalAmount', e, e.target.value);
                    let temp = '';
                    temp = e.target.value;
                    temp = temp.replace(/[^\d.]/g, '');
                    temp = temp.replace(/\.{2,}/g, '');
                    temp = temp.replace('.', '$#$').replace(/\./g, '').replace('$#$', '.');
                    temp = temp.replace(/^(-)*(\d+)\.(\d\d).*$/, '$1$2.$3');
                    console.log('totalAmount', temp);
                    formik.setFieldValue('totalAmount', temp);
                  }}
                  value={formik.values.totalAmount || ''}
                  error={Boolean(formik.errors.totalAmount && formik.touched.totalAmount)}
                />
              </Grid>
              <Grid item xs={6}>
                <HAKeyboardDatePicker
                  label="Memo Date"
                  value={memoDate || ''}
                  onChange={(val) => {
                    const memoDate = dayjs(val).format('DD-MMM-YYYY');
                    setMemoDate(memoDate);
                  }}
                />
              </Grid>
              <Grid item xs={6}>
                <HAKeyboardDatePicker
                  label="Date Send"
                  value={dateSend || ''}
                  onChange={(val) => {
                    const dateSend = dayjs(val).format('DD-MMM-YYYY');
                    setDateSend(dateSend);
                  }}
                />
              </Grid>
              <Grid item xs={6}>
                <HAKeyboardDatePicker
                  label="Bill Received"
                  value={billReceived || ''}
                  onChange={(val) => {
                    const tempDate = dayjs(val).format('DD-MMM-YYYY');
                    setBillReceived(tempDate);
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  name="remarks"
                  label="Remarks"
                  variant="outlined"
                  size="small"
                  fullWidth
                  onChange={formik.handleChange}
                  value={formik.values.remarks || ''}
                />
              </Grid>
            </Grid>
          </div>
        }
        handleClose={() => setOpenAdd(false)}
        handleConfirm={formik.handleSubmit}
        isHideFooter={false}
        customerBtn={
          <Button
            color="primary"
            variant="outlined"
            autoFocus
            onClick={() => {
              console.log('clear');
              // formik.handleReset;
              formik.setFieldValue('fundParty', '');
              formik.setFieldValue('billNo', '');

              formik.setFieldValue('fundTxCode', '');
              formik.setFieldValue('totalAmount', '');

              formik.setFieldValue('remarks', '');

              setMemoDate(dayjs().format('DD-MMM-YYYY'));
              setDateSend(dayjs().format('DD-MMM-YYYY'));
              setBillReceived(dayjs().format('DD-MMM-YYYY'));
            }}
          >
            Clear
          </Button>
        }
        isHideClose
      />
    </>
  );
}
