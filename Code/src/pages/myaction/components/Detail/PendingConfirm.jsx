import React, { memo, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { Grid, TextField, Button, Typography } from '@material-ui/core';
import API from '../../../../api/webdp/webdp';
import useTitleProps from '../../../../models/webdp/PropsModels/useTitleProps';
import { CommonTip, WarningDialog, Loading } from '../../../../components';
import useWebdpColor from '../../../../hooks/webDP/useWebDPColor';
import { setPendingRemark } from '../../../../redux/webDP/webDP-actions';

const PendingConfirm = ({ isRequest }) => {
  const { requestId: requestNo } = useParams();
  const TitleProps = useTitleProps();
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [openRestore, setOpenRestore] = useState(false);
  const [error, setError] = useState(false);
  const [examineFlag, setExamineFlag] = useState(false);
  const readOnly = useSelector((state) => state.myAction.requestForm?.readOnly) || false;
  const reason = useSelector((state) => state.webDP?.pendingRemark?.reason) || '';
  const remark = useSelector((state) => state.webDP?.pendingRemark?.remark) || '---';

  const dprequeststatusno = useSelector(
    (state) => state.webDP?.requestAll?.dpRequest?.dprequeststatusno
  );

  const handlePending = () => {
    setOpen(false);
    if (!reason && !examineFlag) {
      setError(true);
      CommonTip.warning('Please complete the required field first.');
      return;
    }

    Loading.show();
    setError(false);
    API.examinePendingRequest({ requestNo, examineFlag, reason })
      .then((res) => {
        if (res?.data?.status === 200) {
          CommonTip.success('Success');
          setTimeout(() => {
            window.location.reload();
          }, 2000);
        }
      })
      .finally(() => {
        Loading.hide();
      });
  };

  const handleRestore = () => {
    setOpenRestore(false);
    Loading.show();
    API.examinePendingRequestReally({ requestNo, examineFlag })
      .then((res) => {
        if (res?.data?.status === 200) {
          CommonTip.success('Success');
          setTimeout(() => {
            window.location.reload();
          }, 2000);
        }
      })
      .finally(() => {
        Loading.hide();
      });
  };

  const getDisabledInput = () => {
    if (readOnly || dprequeststatusno !== 140 || isRequest) {
      return true;
    }

    return false;
  };

  const getDisabledBtn = () => {
    if (readOnly || dprequeststatusno !== 140) {
      return true;
    }

    return false;
  };

  const reasonChange = (e) => {
    const inputVal = e?.target?.value || '';

    if (inputVal) setError(false);
    dispatch(setPendingRemark({ reason: inputVal }));
  };

  return (
    <>
      <Grid {...TitleProps}>
        <Typography variant="h6">
          <strong style={{ color: useWebdpColor().title }}> Pending</strong>
        </Typography>
      </Grid>

      <Grid {...TitleProps}>
        <div style={{ display: 'flex', color: '#000' }}>
          <div style={{ minWidth: '160px' }}>Reason for Pending : </div>
          <div>{remark}</div>
        </div>
      </Grid>

      <Grid container style={{ margin: '0.5rem 0' }}>
        <Grid item xs={12}>
          <TextField
            variant="outlined"
            label="reason"
            disabled={getDisabledInput()}
            multiline
            fullWidth
            minRows={5}
            value={reason || ''}
            error={error}
            onChange={reasonChange}
          />
        </Grid>

        {!isRequest && dprequeststatusno === 140 && (
          <Grid item xs={12} style={{ marginTop: '0.5rem' }}>
            <Button
              variant="contained"
              color="primary"
              disabled={getDisabledBtn()}
              onClick={() => {
                setOpen(true);
                setExamineFlag(true);
              }}
              size="small"
            >
              Approve
            </Button>
            <Button
              variant="contained"
              color="secondary"
              disabled={getDisabledBtn()}
              onClick={() => {
                setOpen(true);
                setExamineFlag(false);
              }}
              size="small"
              style={{ marginLeft: '0.5rem' }}
            >
              Reject
            </Button>
          </Grid>
        )}

        {!isRequest && dprequeststatusno === 141 && (
          <Grid item xs={12} style={{ marginTop: '0.5rem' }}>
            <Button
              variant="contained"
              color="primary"
              onClick={() => {
                setOpenRestore(true);
                setExamineFlag(false);
              }}
              size="small"
            >
              Restore
            </Button>
            <Button
              variant="contained"
              color="secondary"
              onClick={() => {
                setOpenRestore(true);
                setExamineFlag(true);
              }}
              size="small"
              style={{ marginLeft: '0.5rem' }}
            >
              Cancel
            </Button>
          </Grid>
        )}
      </Grid>

      <WarningDialog
        open={open}
        title="Pending"
        handleConfirm={handlePending}
        handleClose={() => {
          setOpen(false);
        }}
        content={`Are you sure to ${examineFlag ? 'accept' : 'reject'} the pending?`}
      />

      <WarningDialog
        open={openRestore}
        title={`${examineFlag ? 'Cancellation' : 'Restoration '} of request`}
        handleConfirm={handleRestore}
        handleClose={() => {
          setOpenRestore(false);
        }}
        content={`Are you sure to ${examineFlag ? 'cancel' : 'restore'} this request?`}
      />
    </>
  );
};

export default memo(PendingConfirm);
