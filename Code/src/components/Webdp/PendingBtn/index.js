import { TextField, IconButton, Tooltip, Typography } from '@material-ui/core';
import PendingIcon from '@material-ui/icons/PauseCircleFilled';
import { useSelector } from 'react-redux';
import { useFormik } from 'formik';
import React, { useState, memo } from 'react';
import * as Yup from 'yup';

import { CommonDialog, CommonTip, Loading } from '../../index';
import webdpAPI from '../../../api/webdp/webdp';

// MyRequest进来的 isMyRequest 为 true
// MyAction进来的 isMyAction 为 true
const PendingBtn = ({ isMyAction }) => {
  const formType = useSelector((state) => state.webDP.formType);
  const requestNo = useSelector((state) => state.webDP.requestNo);
  const APDPForm = useSelector((state) => state.webDP.requestAll) || {};
  // const readOnly = useSelector((state) => state.webDP.requestAll.readOnly);
  const [openPending, setOpenPending] = useState(false);
  const [loading, setLoading] = useState(false);

  const formik = useFormik({
    initialValues: {
      remark: ''
    },
    validationSchema: Yup.object({
      remark: Yup.string().required('Please input remark.')
    }),
    onSubmit: () => {
      pendingHandler();
    }
  });

  const pendingHandler = () => {
    if (loading) {
      return;
    }

    const pendingExamineFlag = isMyAction ? 'true' : 'false';
    const remark = formik.values.remark || '';
    setLoading(true);
    Loading.show();
    webdpAPI
      .applyExaminePendingRequest({ requestNo, pendingExamineFlag, remark })
      .then((res) => {
        if (res?.data?.status === 200) {
          CommonTip.success('Success');
          setOpenPending(false);
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

  const getPendingShow = () => {
    const { dpRequest = {} } = APDPForm;

    // if (readOnly) {
    //   return false;
    // }

    if (dpRequest?.dprequeststatusno < 160 && dpRequest?.dprequeststatusno !== 1) {
      return true;
    }

    return false;
  };

  return (
    <>
      {getPendingShow() && (
        <Tooltip title="Pending" placement="top">
          <IconButton
            onClick={() => {
              setOpenPending(true);
            }}
          >
            <PendingIcon color="primary" />
          </IconButton>
        </Tooltip>
      )}
      <CommonDialog
        title="Pending"
        open={openPending}
        maxWidth="sm"
        handleClose={() => setOpenPending(false)}
        isHideFooter={false}
        handleConfirm={formik.handleSubmit}
        ConfirmText="OK"
        themeColor="#155151"
        isHideCloseIcon
        content={
          <div style={{ padding: '1em' }}>
            <Typography variant="h6">
              You request to pending{` ${formType}${requestNo}`}.
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
export default memo(PendingBtn);
