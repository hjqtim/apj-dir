import React from 'react';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { Grid, TextField, Button } from '@material-ui/core';
import { CommonTip, CommonDialog } from '../../../../../components';
import API from '../../../../../api/webdp/webdp';

export default function AddRecordDialog({
  openAdd,
  setOpenAdd,
  getDataList,
  isLoading,
  setIsLoading
}) {
  const formik = useFormik({
    initialValues: {
      deliverynote: '',
      reqNo: '',
      receiptNo: '',
      remarks: ''
    },
    // 表单验证
    validationSchema: Yup.object({
      deliverynote: Yup.string().required('error'),
      reqNo: Yup.string().required('error'),
      receiptNo: Yup.string().required('error')
    }),
    onSubmit: (values) => {
      handleSave(values);
    }
  });

  const handleSave = (values) => {
    if (isLoading) {
      return;
    }
    setIsLoading(true);
    API.saveGoodReceiptDn([{ id: 0, ...values }])
      .then((res) => {
        if (res.data.code === 200) {
          setOpenAdd(false);
          CommonTip.success(` Added successfully.`);
          formik.handleReset();
          getDataList();
        } else {
          CommonTip.success(` Added fail.`);
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <>
      <CommonDialog
        open={openAdd}
        title="Add  Record "
        content={
          <div style={{ padding: 40 }}>
            <Grid container spacing={8}>
              <Grid item xs={12}>
                <TextField
                  name="deliverynote"
                  label="Delivery Note No."
                  variant="outlined"
                  size="small"
                  fullWidth
                  onChange={formik.handleChange}
                  value={formik.values.deliverynote || ''}
                  error={Boolean(formik.errors.deliverynote && formik.touched.deliverynote)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  name="reqNo"
                  label="Request Form No."
                  variant="outlined"
                  size="small"
                  fullWidth
                  onChange={formik.handleChange}
                  value={formik.values.reqNo || ''}
                  error={Boolean(formik.errors.reqNo && formik.touched.reqNo)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  name="receiptNo"
                  label="Receipt No."
                  variant="outlined"
                  size="small"
                  fullWidth
                  onChange={formik.handleChange}
                  value={formik.values.receiptNo || ''}
                  error={Boolean(formik.errors.receiptNo && formik.touched.receiptNo)}
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
          <Button color="primary" variant="outlined" autoFocus onClick={formik.handleReset}>
            Clear
          </Button>
        }
        isHideClose
      />
    </>
  );
}
