import React, { memo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Grid, Typography } from '@material-ui/core';
import useTitleProps from '../../../../models/webdp/PropsModels/useTitleProps';
import useWebDPColor from '../../../../hooks/webDP/useWebDPColor';
import WebdpTextField from '../../../../components/Webdp/WebdpTextField';
import API from '../../../../api/myAction';
import { CommonTip, Loading } from '../../../../components';
import SubmitButton from '../../../../components/Webdp/SubmitButton';
import {
  setBudgetHolderRemark,
  setReqManBudTouch
} from '../../../../redux/myAction/my-action-actions';
import getBudgetHolder from '../../../../utils/getBudgetHolder';
import useHandleMaximum from './useHandleMaximum';

const BudgetHolderConfirm = () => {
  const dispatch = useDispatch();
  const TitleProps = useTitleProps();
  const webdpColor = useWebDPColor();
  const requestNo = useSelector((state) => state.myAction.requestForm?.dpRequest?.requestNo);
  const apptype = useSelector((state) => state.myAction.requestForm?.dpRequest?.apptype);
  const budgetholderremark = useSelector((state) => state.myAction.budgetholderremark);
  const myBudgetHolder = useSelector((state) => state.myAction.myBudgetHolder);

  const dprequeststatusno = useSelector(
    (state) => state.myAction.requestForm?.dpRequest?.dprequeststatusno
  );
  const dpId = useSelector((state) => state.myAction.requestForm?.dpRequest?.id);
  const readOnly = useSelector((state) => state.myAction.requestForm?.readOnly) || false;
  const isCancel = useSelector((state) => state.myAction.requestForm?.isCancel) || false;
  const isPending = useSelector((state) => state.myAction.requestForm?.isCancel) || false;
  const requestForm = useSelector((state) => state.myAction.requestForm);
  const { isBudgetHolder } = requestForm || {};
  const reqManBudTouch = useSelector((state) => state.myAction.reqManBudTouch);
  const MaximumError = useHandleMaximum();

  const handleApprove = async () => {
    const newReqManBudTouch = { ...reqManBudTouch };
    Object.keys(newReqManBudTouch).forEach((item) => {
      newReqManBudTouch[item] = true;
    });
    dispatch(setReqManBudTouch(newReqManBudTouch));

    if (MaximumError) {
      CommonTip.warning('Please complete the required field first.');
      return;
    }

    try {
      Loading.show();
      const budgetHolderParams = {
        ...getBudgetHolder(myBudgetHolder),
        fundconfirmed: myBudgetHolder?.fundconfirmed || 0,
        id: dpId,
        requestNo
      };
      const budgetHolderRes = await API.setBudgetHolder(budgetHolderParams);
      if (budgetHolderRes?.data?.code !== 200) {
        Loading.hide();
        return;
      }

      const approveParams = {
        fundconfirmedstatus: 'A',
        id: dpId,
        remark: budgetholderremark || '',
        requestNo
      };

      const approveRes = await API.fundConfirm(approveParams);
      if (approveRes?.data?.code === 200) {
        CommonTip.success('Success');
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      }
    } catch (error) {
      console.log(error);
    }
    Loading.hide();
  };

  const handleReject = () => {
    if (!budgetholderremark) {
      CommonTip.warning('Please fill in remarks.');
      return;
    }

    const rejectParams = {
      fundconfirmedstatus: 'P',
      id: dpId,
      remark: budgetholderremark || '',
      requestNo
    };

    Loading.show();
    API.fundConfirm(rejectParams)
      .then((res) => {
        if (res?.data?.code === 200) {
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

  const getRejectDisabled = () => {
    if (readOnly || isCancel || isPending) {
      return true;
    }
    if (isBudgetHolder && dprequeststatusno === 120) {
      return false;
    }
    return true;
  };

  const getApproveDisabled = () => {
    if (readOnly || isCancel || isPending) {
      return true;
    }
    if (isBudgetHolder && dprequeststatusno === 120) {
      return false;
    }
    return true;
  };

  const getFormDisabled = () => {
    if (readOnly || isCancel || isPending) {
      return true;
    }
    if (isBudgetHolder && dprequeststatusno === 120) {
      return false;
    }
    return true;
  };

  return (
    <>
      <Grid item xs={12}>
        <Grid container>
          <Grid {...TitleProps}>
            <Typography variant="h6" style={{ color: webdpColor.title }}>
              <strong>Budget Holder's Remarks</strong>
            </Typography>
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <WebdpTextField
            id="remark"
            label="Budget Holder's Remarks"
            multiline
            minRows={5}
            value={budgetholderremark || ''}
            disabled={getFormDisabled()}
            onChange={(e) => {
              dispatch(setBudgetHolderRemark(e.target.value || ''));
            }}
          />
        </Grid>
      </Grid>
      <Grid container style={{ margin: '0.5rem 0' }} spacing={2}>
        <Grid item xs={12}>
          <SubmitButton
            title="Fund Confirmation"
            message={`Fund will be approved for request No: ${apptype}${requestNo}, are you sure to continue?`}
            label="Approve"
            submitLabel="Confirm"
            submitAction={handleApprove}
            disabled={getApproveDisabled()}
          />
          <SubmitButton
            // color="primary"
            title="Rejection"
            message={`Request No. ${apptype}${requestNo} is rejected and returned to the requester.`}
            label="Reject"
            rejectAction={handleReject}
            disabled={getRejectDisabled()}
            style={{ marginLeft: '15px' }}
          />
        </Grid>
      </Grid>
    </>
  );
};

export default memo(BudgetHolderConfirm);
