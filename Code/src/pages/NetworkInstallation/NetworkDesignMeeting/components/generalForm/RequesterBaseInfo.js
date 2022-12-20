import React, { memo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Grid, Typography, TextField } from '@material-ui/core';
import { useParams } from 'react-router';
import { setRequest, setTouch } from '../../../../../redux/NetworkMeeting/Action';
import useTitleProps from '../../../../../models/webdp/PropsModels/useTitleProps';
import useWebDPColor from '../../../../../hooks/webDP/useWebDPColor';
import FormControlProps from '../../../../../models/webdp/PropsModels/FormControlProps';
import { FormControlInputProps } from '../../../../../models/webdp/PropsModels/FormControlInputProps';
import useValidationForm from './useValidationForm';

const RequesterBaseInfo = () => {
  // const { requester } = props;
  const dispatch = useDispatch();
  const TitleProps = useTitleProps();
  const webdpColor = useWebDPColor();
  const errors = useValidationForm()?.requesterInfo || {};

  // const resourceStatus = useSelector((state) => state.networkMeeting.resourceStatus);
  const requesterInfo = useSelector((state) => state.networkMeeting.requestInfo);
  const touches = useSelector((state) => state.networkMeeting.touches);
  const fromStatusURL = useParams().status;
  let fromStatus = 'add';
  if (typeof fromStatusURL !== 'undefined') {
    fromStatus = fromStatusURL;
  }

  const fieldsUpdateHandler = (data) => {
    dispatch(setRequest(data));
  };

  const phoneOnChange = (e) => {
    if (e.target.value && /^[0-9]*$/.test(e.target.value) && e.target?.value?.length < 9) {
      fieldsUpdateHandler({ field: 'userPhone', data: e.target.value });
    } else if (e.target.value && /^[0-9]*$/.test(e.target.value) && e.target?.value?.length === 9) {
      fieldsUpdateHandler({ field: 'userPhone', data: requesterInfo.userPhone });
    } else if (!e.target.value) {
      fieldsUpdateHandler({ field: 'userPhone', target: e.target.value });
    }
  };

  return (
    <Grid container>
      <Grid {...TitleProps}>
        <Typography variant="h6" style={{ color: webdpColor.title }}>
          <strong>Requester's Information</strong>
        </Typography>
      </Grid>
      <Grid container spacing={3}>
        <Grid {...FormControlProps} md={6} lg={3}>
          <TextField
            {...FormControlInputProps}
            label="Institution / Department"
            value={requesterInfo.logonDomain}
            disabled
          />
        </Grid>
        <Grid {...FormControlProps} md={6} lg={3}>
          <TextField {...FormControlInputProps} label="Name" value={requesterInfo.name} disabled />
        </Grid>
        <Grid {...FormControlProps} md={6} lg={3}>
          <TextField
            {...FormControlInputProps}
            label="Title"
            value={requesterInfo.title}
            disabled
          />
        </Grid>
        <Grid {...FormControlProps} md={6} lg={3}>
          <TextField
            {...FormControlInputProps}
            label="Phone *"
            disabled={fromStatus === 'detail' || false}
            onBlur={() => {
              dispatch(setTouch({ field: 'requesterInfo', data: { userPhone: true } }));
            }}
            error={Boolean(errors?.userPhone) && Boolean(touches?.requesterInfo?.userPhone)}
            value={requesterInfo.userPhone}
            onChange={phoneOnChange}
            style={{ background: '#fff' }}
          />
        </Grid>
      </Grid>
    </Grid>
  );
};

export default memo(RequesterBaseInfo);
