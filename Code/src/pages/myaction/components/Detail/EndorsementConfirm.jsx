import React, { memo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Grid, Typography } from '@material-ui/core';
import useTitleProps from '../../../../models/webdp/PropsModels/useTitleProps';
import useWebDPColor from '../../../../hooks/webDP/useWebDPColor';
import WebdpTextField from '../../../../components/Webdp/WebdpTextField';
import SubmitButton from '../../../../components/Webdp/SubmitButton';
import API from '../../../../api/myAction';
import WebdpRadioField from '../../../../components/Webdp/WebdpRadioField';
import { CommonTip, Loading } from '../../../../components';
import { setEndorsementApproval } from '../../../../redux/myAction/my-action-actions';
import { handleValidation } from '../../../../utils/tools';

const options = [
  {
    label: 'Yes',
    value: 'Y'
  },
  {
    label: 'No',
    value: 'N'
  }
];

const EndorsementConfirm = () => {
  const requestForm = useSelector((state) => state.myAction.requestForm);
  const { isEndorsement } = requestForm || {};
  const dispatch = useDispatch();
  const dpId = useSelector((state) => state.myAction.requestForm?.dpRequest?.id);
  const endorsementApproval = useSelector((state) => state.myAction.endorsementApproval);
  const requestNo = useSelector((state) => state.myAction.requestForm?.dpRequest?.requestNo);
  const dprequeststatusno = useSelector(
    (state) => state.myAction.requestForm?.dpRequest?.dprequeststatusno
  );
  const readOnly = useSelector((state) => state.myAction.requestForm?.readOnly) || false;
  const isCancel = useSelector((state) => state.myAction.requestForm?.isCancel) || false;
  const isPending = useSelector((state) => state.myAction.requestForm?.isPending) || false;
  const TitleProps = useTitleProps();
  const webdpColor = useWebDPColor();

  const setEndorsementValByfield = (field, value) => {
    dispatch(setEndorsementApproval({ [field]: value }));
  };

  const { endorsementApprovalStatus, endorsementRemark } = endorsementApproval;

  const approve = () => {
    if (!endorsementApprovalStatus) {
      handleValidation();
      return;
    }

    const approveParams = {
      externalNetworkApprovalStatus: 'A',
      endorsementRemark,
      endorsementApprovalStatus,
      id: dpId,
      requestNo
    };

    Loading.show();
    API.endorsementApproval(approveParams)
      .then((result) => {
        if (result?.data?.code === 200) {
          CommonTip.success('External Network has been confirmed');
          setTimeout(() => {
            window.location.reload();
          }, 2000);
        }
      })
      .finally(() => {
        Loading.hide();
      });
  };

  const rejectValidation = () => {
    if (endorsementApprovalStatus === 'N' && !endorsementRemark) {
      handleValidation();
      return true;
    }

    return false;
  };

  const reject = async () => {
    if (rejectValidation()) {
      return;
    }

    const data = {
      externalNetworkApprovalStatus: 'R',
      endorsementRemark,
      endorsementApprovalStatus,
      id: dpId,
      requestNo
    };
    try {
      Loading.show();
      const result = await API.endorsementApproval(data);
      if (result?.data?.code === 200) {
        CommonTip.success('External Network has been Reject for futher study');
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      }
    } catch (error) {
      CommonTip.error(error);
    }
    Loading.hide();
  };

  const backward = async () => {
    if (rejectValidation()) {
      return;
    }

    const data = {
      externalNetworkApprovalStatus: 'P',
      endorsementRemark,
      endorsementApprovalStatus,
      id: dpId,
      requestNo
    };

    try {
      Loading.show();
      const result = await API.endorsementApproval(data);
      if (result?.data?.code === 200) {
        CommonTip.success('External Network has been Reject for futher study');
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      }
    } catch (error) {
      CommonTip.error(error);
    }
    Loading.hide();
  };

  const getApprovalDisabled = () => {
    if (readOnly || !isEndorsement || isCancel || isPending) {
      return true;
    }

    if (dprequeststatusno === 21 && isEndorsement) {
      return false;
    }

    return true;
  };

  const getReStudyDisabled = () => {
    if (readOnly || !isEndorsement || isCancel || isPending) {
      return true;
    }

    if (dprequeststatusno === 21 && endorsementApprovalStatus === 'N') {
      return false;
    }

    return true;
  };

  const getFormDisabled = () => {
    if (readOnly || !isEndorsement || isCancel || isPending) {
      return true;
    }

    if (isEndorsement && dprequeststatusno === 21) {
      return false;
    }

    return true;
  };

  return (
    <>
      <Grid container item xs={12} spacing={4}>
        <Grid container item>
          <Grid {...TitleProps}>
            <Typography variant="h6" style={{ color: webdpColor.title }}>
              <strong>External Network Approval (Endorsement Person Approval)</strong>
            </Typography>
          </Grid>
        </Grid>
        <Grid container spacing={4} item>
          <Grid item xs={12}>
            <WebdpRadioField
              row
              label="Further approval from the Manager? *"
              value={endorsementApprovalStatus}
              onChange={(e, v) => setEndorsementValByfield('endorsementApprovalStatus', v)}
              options={options}
              disabled={getFormDisabled()}
            />
          </Grid>

          <Grid item xs={12}>
            <WebdpTextField
              label="Remark"
              multiline
              minRows={5}
              value={endorsementRemark || ''}
              disabled={getFormDisabled()}
              onChange={(e) => setEndorsementValByfield('endorsementRemark', e.target.value)}
            />
          </Grid>

          <Grid item xs={12}>
            <SubmitButton
              message="The External Network request will be approved, are you sure to continue?"
              title="Endorsement Person Approval"
              label="Approve"
              submitLabel="Confirm"
              submitAction={approve}
              disabled={getApprovalDisabled()}
            />
            <SubmitButton
              color="primary"
              message="The External Network request will be returned to support for requirement re-study, are you sure to continue?"
              title="Endorsement Person Approval"
              label="Re-Study"
              submitLabel="Confirm"
              submitAction={backward}
              style={{ marginLeft: '15px' }}
              disabled={getReStudyDisabled()}
            />
            <SubmitButton
              color="primary"
              message="The External Network request will be rejected and close request, are you sure to continue?"
              title="Endorsement Person Approval"
              label="Reject"
              submitLabel="Confirm"
              submitAction={reject}
              disabled={getReStudyDisabled()}
              style={{ marginLeft: '15px' }}
            />
          </Grid>
        </Grid>
      </Grid>
    </>
  );
};

export default memo(EndorsementConfirm);
