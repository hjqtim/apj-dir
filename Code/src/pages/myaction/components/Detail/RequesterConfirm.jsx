import React, { memo } from 'react';
import { Grid, Typography } from '@material-ui/core';
import { useSelector, useDispatch } from 'react-redux';
import SubmitButton from '../../../../components/Webdp/SubmitButton';
import useTitleProps from '../../../../models/webdp/PropsModels/useTitleProps';
import useWebDPColor from '../../../../hooks/webDP/useWebDPColor';
import WebdpTextField from '../../../../components/Webdp/WebdpTextField';
import API from '../../../../api/myAction';
import { CommonTip, Loading } from '../../../../components';
import getBudgetHolder from '../../../../utils/getBudgetHolder';
import {
  setManagerInformation,
  setReqManBudTouch
} from '../../../../redux/myAction/my-action-actions';
import useHandleMaximum from './useHandleMaximum';

const RequesterConfirm = () => {
  const dispatch = useDispatch();

  const TitleProps = useTitleProps();
  const webdpColor = useWebDPColor();
  const myBudgetHolder = useSelector((state) => state.myAction.myBudgetHolder);
  const readOnly = useSelector((state) => state.myAction.requestForm?.readOnly) || false;
  const isCancel = useSelector((state) => state.myAction.requestForm?.isCancel) || false;
  const isPending = useSelector((state) => state.myAction.requestForm?.isPending) || false;
  const dpId = useSelector((state) => state.myAction.requestForm?.dpRequest?.id);
  const requestNo = useSelector((state) => state.myAction.requestForm?.dpRequest?.requestNo);
  const apptype = useSelector((state) => state.myAction.requestForm?.dpRequest?.apptype);
  const requestForm = useSelector((state) => state.myAction.requestForm); // 整张form
  const { isRequester } = requestForm || {};
  const dprequeststatusno = useSelector(
    (state) => state.myAction.requestForm?.dpRequest?.dprequeststatusno
  );
  const reqManBudTouch = useSelector((state) => state.myAction.reqManBudTouch);
  const managerInformation = useSelector((state) => state.myAction.managerInformation);
  const MaximumError = useHandleMaximum();

  const {
    requesterremark = '',
    isNeedManager,
    rmanagerid = '',
    rmanagertitle = '',
    rmanagerphone = '',
    rmanageremail = '',
    rmanagername = ''
  } = managerInformation || {};

  const setManagerDataByFiled = (field, value) => {
    const newData = {
      field,
      data: value
    };
    dispatch(setManagerInformation(newData));
  };

  const getFormDisabled = () => {
    if (readOnly || isCancel || isPending) {
      return true;
    }
    if (isRequester && dprequeststatusno === 100) {
      return false;
    }
    return true;
  };

  // budget holder表单是否通过验证, true表示验证不通过
  const getBudgetHolderError = () => {
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

  // manager表单是否通过验证
  const getManagerError = () => {
    if (isNeedManager && rmanageremail && rmanagerphone?.length === 8 && rmanagerid) {
      return false;
    }

    if (!isNeedManager) {
      return false;
    }

    return true;
  };

  const getApproveDisabled = () => {
    if (readOnly || isCancel || isPending) {
      return true;
    }

    if (isRequester && dprequeststatusno === 100) {
      return false;
    }

    return true;
  };

  const getRejectDisabled = () => {
    if (readOnly || isCancel || isPending) {
      return true;
    }
    if (isRequester && dprequeststatusno === 100) {
      return false;
    }
    return true;
  };

  const getManagerParams = () => ({
    id: dpId,
    requestNo,
    rmanagerphone: isNeedManager ? rmanagerphone : '',
    rmanageremail: isNeedManager ? rmanageremail : '',
    rmanagerid: isNeedManager ? rmanagerid : '',
    rmanagername: isNeedManager ? rmanagername : '',
    rmanagertitle: isNeedManager ? rmanagertitle : ''
  });

  const handleApprove = async () => {
    const newReqManBudTouch = { ...reqManBudTouch };
    Object.keys(newReqManBudTouch).forEach((item) => {
      newReqManBudTouch[item] = true;
    });
    dispatch(setReqManBudTouch(newReqManBudTouch));

    if (getBudgetHolderError() || getManagerError() || MaximumError) {
      CommonTip.warning('Please complete the required field first.');
      return;
    }

    // 先保存budget holder -> 保存manager -> 同意报价
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

      const managerParams = getManagerParams();
      const managerRes = await API.setRequesterManager(managerParams);
      if (managerRes?.data?.code !== 200) {
        Loading.hide();
        return;
      }

      const approveParams = {
        fundconfirmedstatus: 'A',
        id: dpId,
        remark: requesterremark || '',
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
    if (!requesterremark) {
      CommonTip.warning('Please fill in remarks.');
      return;
    }
    const rejectParams = {
      fundconfirmedstatus: 'R',
      id: dpId,
      remark: requesterremark || '',
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

  const getApprovlTitle = () => {
    if (isNeedManager) {
      return `The cost estimation for ${apptype}${requestNo} will be sent to your manager for approval.`;
    }

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
          <strong>Requester's Remarks</strong>
        </Typography>
      </Grid>

      <Grid item xs={12} style={{ marginTop: '5px' }}>
        <WebdpTextField
          label="Requester's Remarks"
          multiline
          minRows={5}
          disabled={getFormDisabled()}
          value={requesterremark || ''}
          onChange={(e) => {
            setManagerDataByFiled('requesterremark', e.target.value);
          }}
        />
      </Grid>

      <Grid container style={{ margin: '0.5rem 0' }}>
        <Grid item xs={12}>
          <SubmitButton
            label="Confirm and Proceed"
            title="Warning"
            message={getApprovlTitle()}
            submitAction={handleApprove}
            disabled={getApproveDisabled()}
          />

          <SubmitButton
            label="Reject"
            title="Rejection"
            message={`${apptype}${requestNo} is rejected and ended.`}
            rejectLabel="OK"
            rejectAction={handleReject}
            disabled={getRejectDisabled()}
            style={{ marginLeft: '15px' }}
          />
        </Grid>
      </Grid>
    </>
  );
};

export default memo(RequesterConfirm);
