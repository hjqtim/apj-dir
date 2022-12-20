import React from 'react';
import { Grid, Typography } from '@material-ui/core';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import SubmitButton from '../../../../components/Webdp/SubmitButton';
import API from '../../../../api/myAction';
import { CommonTip, Loading } from '../../../../components';
import useTitleProps from '../../../../models/webdp/PropsModels/useTitleProps';
import useWebdpColor from '../../../../hooks/webDP/useWebDPColor';

const TaskCompleted = () => {
  const { requestId } = useParams();
  const TitleProps = useTitleProps();
  const readOnly = useSelector((state) => state.myAction.requestForm?.readOnly) || false;
  const isCancel = useSelector((state) => state.myAction.requestForm?.isCancel) || false;
  const isPending = useSelector((state) => state.myAction.requestForm?.isPending) || false;

  const dprequeststatusno = useSelector(
    (state) => state.myAction.requestForm?.dpRequest?.dprequeststatusno
  );
  const submitHandler = async () => {
    try {
      Loading.show();
      const result = await API.taskComplete({ requestNo: requestId });
      if (result.data.code === 200) {
        CommonTip.success('Task has been set to completed');
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      }
    } catch (error) {
      console.log(error);
    }
    Loading.hide();
  };

  const getButtonDisabled = () => {
    if (readOnly || isCancel || isPending) {
      return true;
    }

    if (dprequeststatusno === 145) {
      return false;
    }
    return true;
  };

  return (
    <>
      <Grid {...TitleProps}>
        <Typography variant="h6">
          <strong style={{ color: useWebdpColor().title }}>Complete Cabling Task</strong>
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <SubmitButton
          color="primary"
          message="The task will be set to all complete, are you sure to continue?"
          title="Complete"
          label="Task Complete"
          submitLabel="Confirm"
          submitAction={submitHandler}
          disabled={getButtonDisabled()}
        />
      </Grid>
    </>
  );
};

export default TaskCompleted;
