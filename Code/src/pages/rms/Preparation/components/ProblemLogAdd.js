import React, { useEffect, useState } from 'react';
import * as Yup from 'yup';
import { useFormik } from 'formik';
// import { alpha } from '@material-ui/core/styles';
import { Grid, TextField, Button } from '@material-ui/core';
import dayjs from 'dayjs';
import { TimePicker } from '@material-ui/pickers';
import { CommonTip, CommonDialog, HAKeyboardDatePicker } from '../../../../components';
import API from '../../../../api/webdp/webdp';

export default function AddRecordDialog({ openAdd, setOpenAdd, getDataList, setStepRow }) {
  const formik = useFormik({
    initialValues: {
      refNo: '',
      value: 0,
      description: ''
    },

    // 表单验证
    validationSchema: Yup.object({
      refNo: Yup.string().required('error')
    }),
    onSubmit: (values) => {
      handleSave(values);
    }
  });

  const handleSave = (values) => {
    API.saveProblemLog([
      {
        id: 0,
        date:
          memoDate === 'Invalid Date'
            ? '0000-00-00 00:00:00'
            : dayjs(memoDate).format('YYYY-MM-DD HH:mm:ss'),
        time: dayjs(dateSend).format('YYYY-MM-DD HH:mm:ss'),
        refNo: values.refNo,
        value: parseFloat(values.value).toFixed(2),
        description: values.description
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

  const [memoDate, setMemoDate] = useState(dayjs().format('DD-MMM-YYYY'));
  const [dateSend, setDateSend] = useState(dayjs().format('DD-MMM-YYYY'));

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
                <HAKeyboardDatePicker
                  label="Date"
                  value={memoDate || ''}
                  onChange={(val) => {
                    const memoDate = dayjs(val).format('YYYY-MM-DD HH:mm:ss');
                    setMemoDate(memoDate);
                  }}
                />
              </Grid>
              <Grid item xs={6}>
                <TimePicker
                  autoOk
                  ampm={false}
                  variant="inline"
                  inputVariant="outlined"
                  size="small"
                  label="Time"
                  format="HH:mm"
                  value={dateSend || ''}
                  fullWidth
                  onChange={(value) => {
                    const temp = dayjs(value).format('YYYY-MM-DD HH:mm:ss');
                    // console.log('time', value, temp);
                    setDateSend(temp);
                  }}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  name="refNo"
                  label="Ref No."
                  variant="outlined"
                  size="small"
                  fullWidth
                  onChange={formik.handleChange}
                  value={formik.values.refNo || ''}
                  error={Boolean(formik.errors.refNo && formik.touched.refNo)}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  name="Value"
                  label="Value"
                  variant="outlined"
                  size="small"
                  fullWidth
                  onChange={(e) => {
                    let temp = '';
                    temp = e.target.value;
                    temp = temp.replace(/[^\d.]/g, '');
                    temp = temp.replace(/\.{2,}/g, '');
                    temp = temp.replace('.', '$#$').replace(/\./g, '').replace('$#$', '.');
                    temp = temp.replace(/^(-)*(\d+)\.(\d\d).*$/, '$1$2.$3');
                    console.log('Value', temp);
                    formik.setFieldValue('value', temp);
                  }}
                  value={formik.values.value || ''}
                  error={Boolean(formik.errors.value && formik.touched.value)}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  name="description"
                  label="Description"
                  variant="outlined"
                  size="small"
                  fullWidth
                  onChange={formik.handleChange}
                  value={formik.values.description || ''}
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
              formik.setFieldValue('refNo', '');
              formik.setFieldValue('value', '');
              formik.setFieldValue('description', '');
              setMemoDate(dayjs().format('DD-MMM-YYYY'));
              setDateSend(dayjs().format('DD-MMM-YYYY'));
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
