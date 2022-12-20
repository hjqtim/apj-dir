import React, { memo } from 'react';
import { useSelector } from 'react-redux';
import { Grid, Typography, TextField } from '@material-ui/core';
import useTitleProps from '../../../../models/webdp/PropsModels/useTitleProps';
import useWebDPColor from '../../../../hooks/webDP/useWebDPColor';
import FormControlProps from '../../../../models/webdp/PropsModels/FormControlProps';
import { FormControlInputProps } from '../../../../models/webdp/PropsModels/FormControlInputProps';

const RequesterBaseInfo = (props) => {
  const { values, handleChange, handleBlur, touched = {}, errors = {}, isRequest = false } = props;
  const TitleProps = useTitleProps();
  const webdpColor = useWebDPColor();
  const requesterInfo = useSelector((state) => state.IPAdreess.requester);
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
            value={values?.requesterDomain || ''}
            disabled
          />
        </Grid>
        <Grid {...FormControlProps} md={6} lg={3}>
          <TextField
            {...FormControlInputProps}
            label="Name"
            value={requesterInfo?.name || ''}
            disabled
          />
        </Grid>
        <Grid {...FormControlProps} md={6} lg={3}>
          <TextField
            {...FormControlInputProps}
            label="Title"
            value={values?.title || ''}
            disabled
          />
        </Grid>
        <Grid {...FormControlProps} md={6} lg={3}>
          <TextField
            {...FormControlInputProps}
            label="Phone *"
            // disabled={isMyApproval || isMyRequest}
            onBlur={handleBlur}
            name="requester.telNo"
            error={errors.telNo && touched.telNo}
            value={values?.telNo || ''}
            disabled={!isRequest}
            inputProps={{ maxLength: 8 }}
            onChange={(e) => {
              if (e.target.value && /^[0-9]*$/.test(e.target.value)) {
                handleChange(e);
              } else if (!e.target.value) {
                handleChange(e);
              }
            }}
          />
        </Grid>
      </Grid>
    </Grid>
  );
};

export default memo(RequesterBaseInfo);
