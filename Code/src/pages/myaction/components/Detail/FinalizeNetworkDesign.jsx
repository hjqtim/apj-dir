import React from 'react';
import { Grid, Typography, Button } from '@material-ui/core';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import useTitleProps from '../../../../models/webdp/PropsModels/useTitleProps';
import useWebDPColor from '../../../../hooks/webDP/useWebDPColor';
// import SubmitButton from '../../../../components/Webdp/SubmitButton';
// import WebdpTextField from '../../../../components/Webdp/WebdpTextField';
import API from '../../../../api/myAction';
import { CommonTip, Loading } from '../../../../components';

const FinalizeNetworkDesign = () => {
  const TitleProps = useTitleProps();
  const webdpColor = useWebDPColor();
  const { requestId } = useParams();

  const readOnly = useSelector((state) => state.myAction.requestForm?.readOnly) || false;
  const isCancel = useSelector((state) => state.myAction.requestForm?.isCancel) || false;
  const isPending = useSelector((state) => state.myAction.requestForm?.isPending) || false;
  const requestForm = useSelector((state) => state.myAction.requestForm);
  const { isMni, isN3, isN4, isN5 } = requestForm || {};
  const dprequeststatusno = useSelector(
    (state) => state.myAction.requestForm?.dpRequest?.dprequeststatusno
  );
  const fileList = useSelector((state) => state.myAction.networkDesignFiles);
  const apptype = useSelector((state) => state.myAction.requestForm?.dpRequest?.apptype);

  const submitHandler = () => {
    const formData = new FormData();
    formData.append('requestNo', requestId);
    Loading.show();
    API.finalizeNetworkDesign(requestId)
      .then((result) => {
        if (result?.data?.code === 200) {
          CommonTip.success(`Network design for ${apptype}${requestId} has been finalized`);
          setTimeout(() => {
            window.location.reload();
          }, 2000);
        }
      })
      .finally(() => {
        Loading.hide();
      });
  };

  const getButtonDisabled = () => {
    if (readOnly || isCancel || isPending) {
      return true;
    }

    const hasFile = fileList.find((item) => item.id); // 是否有文件上传过服务器

    if (!hasFile) {
      return true;
    }

    if (isMni) {
      if (isN5 && dprequeststatusno === 41) {
        return false;
      }

      if (isN5 && dprequeststatusno === 125) {
        return false;
      }
    }

    if (!isMni) {
      if ((isN3 || isN4) && dprequeststatusno === 41) {
        return false;
      }

      if ((isN3 || isN4) && dprequeststatusno === 125) {
        return false;
      }
    }

    return true;
  };

  return (
    <>
      <Grid {...TitleProps}>
        <Typography variant="h6">
          <strong style={{ color: webdpColor.title }}>Network Design Finalization</strong>
        </Typography>
      </Grid>
      {/* <Grid item xs={12}>
        <WebdpTextField label="Remarks" multiline minRows={5} />
      </Grid> */}
      <Grid item xs={12} style={{ marginTop: '0.5rem' }}>
        {/* <SubmitButton
          label="Finalize"
          message="The network design will be confirmed and draft will no longer to upload, are you sure to continue?"
          submitLabel="Confirm"
          submitAction={submitHandler}
          title="Finalize the network design"
          disabled={getButtonDisabled()}
        /> */}

        <Button
          variant="contained"
          color="primary"
          size="small"
          onClick={submitHandler}
          disabled={getButtonDisabled()}
        >
          Finalize
        </Button>
      </Grid>
    </>
  );
};

export default FinalizeNetworkDesign;
