import { TextField, IconButton, Tooltip, Typography } from '@material-ui/core';
import CancelIcon from '@material-ui/icons/Cancel';
import { useSelector } from 'react-redux';
import { useFormik } from 'formik';
import React, { useState, memo } from 'react';
import * as Yup from 'yup';

import { CommonDialog, CommonTip, Loading } from '../../index';
import webdpAPI from '../../../api/webdp/webdp';

// MyRequest进来的 isMyRequest 为 true
// MyAction进来的 isMyAction 为 true
const CancelBtn = ({ isMyAction }) => {
  const formType = useSelector((state) => state.webDP.formType);
  const requestNo = useSelector((state) => state.webDP.requestNo);
  const APDPForm = useSelector((state) => state.webDP.requestAll) || {};
  // const readOnly = useSelector((state) => state.webDP.requestAll.readOnly);
  // console.log('readOnly', readOnly);
  const [openCancel, setOpenCancel] = useState(false);
  const [loading, setLoading] = useState(false);

  const formik = useFormik({
    initialValues: {
      remark: ''
    },
    validationSchema: Yup.object({
      remark: Yup.string().required('Please input remark.')
    }),
    onSubmit: () => {
      cancelHandler();
    }
  });

  const cancelHandler = () => {
    if (loading) {
      return;
    }

    setLoading(true);
    const directlyThroughFlag = isMyAction ? 'true' : 'false';
    const remark = formik.values.remark || '';
    Loading.show();
    webdpAPI
      .applyExamineCancelRequest({ requestNo, directlyThroughFlag, remark })
      .then((res) => {
        if (res?.data?.status === 200) {
          CommonTip.success('Success');
          setOpenCancel(false);
          setTimeout(() => {
            window.location.reload();
          }, 2000);
        }
      })
      .finally(() => {
        Loading.hide();
        setLoading(false);
      });
  };

  const getCancelShow = () => {
    const { dpRequest = {} } = APDPForm;

    // if (readOnly) {
    //   return false;
    // }

    // 不是草稿或不是申请取消状态
    if (dpRequest?.dprequeststatusno < 160 && dpRequest?.dprequeststatusno !== 1) {
      return true;
    }

    return false;
  };

  return (
    <>
      {getCancelShow() && (
        <Tooltip title="Cancel" placement="top">
          <IconButton
            onClick={() => {
              setOpenCancel(true);
            }}
          >
            <CancelIcon color="primary" />
          </IconButton>
        </Tooltip>
      )}
      <CommonDialog
        title="Cancellation"
        open={openCancel}
        maxWidth="sm"
        handleClose={() => setOpenCancel(false)}
        isHideFooter={false}
        handleConfirm={formik.handleSubmit}
        ConfirmText="OK"
        themeColor="#155151"
        isHideCloseIcon
        content={
          <div style={{ padding: '1em' }}>
            <Typography variant="h6">
              You request to terminate{` ${formType}${requestNo}`}.
            </Typography>
            <br />
            <TextField
              variant="outlined"
              label="Reason"
              multiline
              fullWidth
              minRows={6}
              maxRows={10}
              error={Boolean(formik.errors.remark && formik.touched.remark)}
              value={formik.values.remark || ''}
              name="remark"
              onChange={formik.handleChange}
            />
          </div>
        }
      />
    </>
  );
};
export default memo(CancelBtn);
