import React, { memo } from 'react';
import { Grid, Typography } from '@material-ui/core';
import { useSelector, useDispatch } from 'react-redux';
import SubmitButton from '../../../../components/Webdp/SubmitButton';
import useTitleProps from '../../../../models/webdp/PropsModels/useTitleProps';
import useWebDPColor from '../../../../hooks/webDP/useWebDPColor';
import WebdpTextField from '../../../../components/Webdp/WebdpTextField';
import API from '../../../../api/myAction';
import { CommonTip, Loading } from '../../../../components';
import { setManagerRemark, setReqManBudTouch } from '../../../../redux/myAction/my-action-actions';
import getBudgetHolder from '../../../../utils/getBudgetHolder';
import useHandleMaximum from './useHandleMaximum';

const ManagerConfirm = () => {
  const dispatch = useDispatch();
  const TitleProps = useTitleProps();
  const webdpColor = useWebDPColor();
  const myBudgetHolder = useSelector((state) => state.myAction.myBudgetHolder);
  const managerRemark = useSelector((state) => state.myAction.managerRemark);
  const isCancel = useSelector((state) => state.myAction.requestForm?.isCancel) || false;
  const isPending = useSelector((state) => state.myAction.requestForm?.isPending) || false;
  const readOnly = useSelector((state) => state.myAction.requestForm?.readOnly) || false;
  const fundconfirmed = useSelector((state) => state.myAction.myBudgetHolder?.fundconfirmed);
  const quotationtotal = useSelector(
    (state) => state.myAction.requestForm?.dpRequest?.quotationtotal
  );
  // const readOnly = false;
  const apptype = useSelector((state) => state.myAction.requestForm?.dpRequest?.apptype);
  const dprequeststatusno = useSelector(
    (state) => state.myAction.requestForm?.dpRequest?.dprequeststatusno
  );
  const requestNo = useSelector((state) => state.myAction.requestForm?.dpRequest?.requestNo);
  const dpId = useSelector((state) => state.myAction.requestForm?.dpRequest?.id);
  const requestForm = useSelector((state) => state.myAction.requestForm);
  const { isManager, isBudgetHolder } = requestForm || {};
  const reqManBudTouch = useSelector((state) => state.myAction.reqManBudTouch);
  const MaximumError = useHandleMaximum();

  const handleReject = () => {
    if (!managerRemark) {
      CommonTip.warning('Please fill in remarks.');
      return;
    }

    const rejectParams = {
      fundconfirmedstatus: 'P',
      id: dpId,
      remark: managerRemark || '',
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
    if (isManager && dprequeststatusno === 110) {
      return false;
    }
    return true;
  };

  // budget holder表单是否通过
  const budgetHolderValidate = () => {
    // 如果审批人是manager又是budget holder，金额必须大于预算的金额
    if (isBudgetHolder && isManager && fundconfirmed < quotationtotal) {
      return true;
    }

    const {
      fundtransferredtohsteam,
      fundparty,
      paymentmethod,
      cardNo,
      budgetholderid,
      budgetholderemail,
      budgetholderphone,
      extbillcompanyname,
      extbillcontactname,
      extbillcontactphone,
      extbillcompanyadd,
      otherpaymentmethod
    } = myBudgetHolder;
    if (parseInt(fundtransferredtohsteam) === 1 && fundparty) {
      return false;
    }
    if (parseInt(fundtransferredtohsteam) === 2) {
      return false;
    }
    if (parseInt(fundtransferredtohsteam) === 0) {
      if (
        parseInt(paymentmethod) === 1 &&
        cardNo?.join?.('')?.trim()?.length === 25 &&
        budgetholderid &&
        budgetholderemail &&
        budgetholderphone?.length === 8
      ) {
        return false;
      }

      if (
        parseInt(paymentmethod) === 3 &&
        extbillcompanyname &&
        extbillcontactname &&
        extbillcontactphone?.length === 8 &&
        extbillcompanyadd
      ) {
        return false;
      }
      if (parseInt(paymentmethod) === 2 && otherpaymentmethod) {
        return false;
      }
    }
    return true;
  };

  const getFormDisabled = () => {
    if (readOnly || isCancel || isPending) {
      return true;
    }
    if (isManager && dprequeststatusno === 110) {
      return false;
    }
    return true;
  };

  const getApproveDisabled = () => {
    if (readOnly || isCancel || isPending) {
      return true;
    }

    if (isManager && dprequeststatusno === 110) {
      return false;
    }

    return true;
  };

  const handleApprove = async () => {
    const newReqManBudTouch = { ...reqManBudTouch };
    Object.keys(newReqManBudTouch).forEach((item) => {
      newReqManBudTouch[item] = true;
    });
    dispatch(setReqManBudTouch(newReqManBudTouch));

    if (budgetHolderValidate() || MaximumError) {
      CommonTip.warning('Please complete the required field first.');
      return;
    }

    // 先保存budget holder -> 同意报价
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
        remark: managerRemark || '',
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

  const getApprovlTitle = () => {
    if (
      parseInt(myBudgetHolder.paymentmethod) === 3 &&
      parseInt(myBudgetHolder.fundtransferredtohsteam) === 0
    ) {
      return `The external company will be billed for the cost estimation of ${apptype}${requestNo} before the actual installation begins.`;
    }

    return `The cost estimation for ${apptype}${requestNo} will be sent to your budget holder for approval.`;
  };

  return (
    <>
      <Grid {...TitleProps}>
        <Typography variant="h6" style={{ color: webdpColor.title }}>
          <strong>Manager's Remarks</strong>
        </Typography>
      </Grid>

      <Grid item xs={12} style={{ marginTop: '5px' }}>
        <WebdpTextField
          label="Manager's Remarks"
          multiline
          minRows={5}
          value={managerRemark || ''}
          disabled={getFormDisabled()}
          onChange={(e) => {
            dispatch(setManagerRemark(e?.target?.value || ''));
          }}
        />
      </Grid>

      <Grid container style={{ margin: '0.5rem 0' }}>
        <Grid item xs={12}>
          <SubmitButton
            label="Approve"
            title="Confirm and Proceed"
            message={getApprovlTitle()}
            submitAction={handleApprove}
            disabled={getApproveDisabled()}
          />

          <SubmitButton
            label="Reject"
            title="Rejection"
            message={`Request No. ${apptype}${requestNo} is rejected and returned to the requester.`}
            rejectLabel="Reject"
            rejectAction={handleReject}
            disabled={getRejectDisabled()}
            style={{ marginLeft: '15px' }}
          />
        </Grid>
      </Grid>
    </>
  );
};

export default memo(ManagerConfirm);
