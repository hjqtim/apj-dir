import React, { memo } from 'react';
import { Grid, Typography } from '@material-ui/core';
import { useSelector, useDispatch } from 'react-redux';

import WebdpTextField from '../../../../components/Webdp/WebdpTextField';
import SubmitButton from '../../../../components/Webdp/SubmitButton';
import useTitleProps from '../../../../models/webdp/PropsModels/useTitleProps';
import useWebDPColor from '../../../../hooks/webDP/useWebDPColor';
import API from '../../../../api/myAction';
import { CommonTip, Loading } from '../../../../components';
import { setSentDocumentRemark } from '../../../../redux/myAction/my-action-actions';

const DocSent = () => {
  const dispatch = useDispatch();
  const TitleProps = useTitleProps();
  const webdpColor = useWebDPColor();
  const requestNo = useSelector((state) => state.myAction.requestForm?.dpRequest?.requestNo);
  const sentDocumentRemark = useSelector((state) => state.myAction.sentDocumentRemark);
  const myDprequeststatusno = useSelector((state) => state.myAction.myDprequeststatusno);
  const isN3 = useSelector((state) => state.myAction.requestForm?.isN3);
  const isN4 = useSelector((state) => state.myAction.requestForm?.isN4);
  const isN5 = useSelector((state) => state.myAction.requestForm?.isN5);
  const readOnly = useSelector((state) => state.myAction.requestForm?.readOnly) || false;
  const isCancel = useSelector((state) => state.myAction.requestForm?.isCancel) || false;
  const isPending = useSelector((state) => state.myAction.requestForm?.isPending) || false;

  const submitHandler = () => {
    const sendParams = {
      requestNo,
      sentDocumentRemark
    };
    Loading.show();
    API.sendDoc(sendParams)
      .then((res) => {
        if (res?.data?.code === 200) {
          CommonTip.success(`Request status has been set to: Document Sent`);
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

    if (myDprequeststatusno === 106 && (isN3 || isN4 || isN5)) {
      return false;
    }

    return true;
  };

  return (
    <>
      <Grid {...TitleProps}>
        <Typography variant="h6" style={{ color: webdpColor.title }}>
          <strong>Sent Bill Memo</strong>
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <WebdpTextField
          label="Remark"
          multiline
          minRows={5}
          value={sentDocumentRemark || ''}
          disabled={getButtonDisabled()}
          onChange={(e) => {
            dispatch(setSentDocumentRemark(e.target.value));
          }}
        />
      </Grid>
      <Grid item xs={12} style={{ margin: '0.5rem 0' }}>
        <SubmitButton
          label="Confirm"
          title="Sent Bill Memo"
          submitAction={submitHandler}
          message="You have already sent the bill memo, right?"
          submitLabel="Yes"
          disabled={getButtonDisabled()}
          cancelLabel="No"
        />
      </Grid>
    </>
  );
};

export default memo(DocSent);
