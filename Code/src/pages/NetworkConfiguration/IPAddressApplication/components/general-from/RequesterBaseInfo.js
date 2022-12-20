import React, { memo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Grid, Typography, TextField } from '@material-ui/core';
import { setRequest, setTouch } from '../../../../../redux/IPAdreess/ipaddrActions';
import useTitleProps from '../../../../../models/webdp/PropsModels/useTitleProps';
import useWebDPColor from '../../../../../hooks/webDP/useWebDPColor';
import FormControlProps from '../../../../../models/webdp/PropsModels/FormControlProps';
import { FormControlInputProps } from '../../../../../models/webdp/PropsModels/FormControlInputProps';
import useValidationIPForm from './useValidationIPForm';

const RequesterBaseInfo = () => {
  const dispatch = useDispatch();
  const TitleProps = useTitleProps();
  const webdpColor = useWebDPColor();
  const errors = useValidationIPForm()?.requesterInfo || {};
  const requesterInfo = useSelector((state) => state.IPAdreess.requester);
  const touches = useSelector((state) => state.IPAdreess.touches.requester);
  const isMyRequest = useSelector((state) => state.IPAdreess.isMyRequest) || false;
  const isMyApproval = useSelector((state) => state.IPAdreess.isMyApproval) || false;

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
            disabled={isMyApproval || isMyRequest}
            onBlur={() => {
              dispatch(setTouch({ field: 'requester', data: { userPhone: true } }));
            }}
            error={Boolean(errors?.userPhone) && Boolean(touches?.userPhone)}
            value={requesterInfo.userPhone}
            onChange={phoneOnChange}
          />
        </Grid>
      </Grid>
    </Grid>
  );
};

export default memo(RequesterBaseInfo);
