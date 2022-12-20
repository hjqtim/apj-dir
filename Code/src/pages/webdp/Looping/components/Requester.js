import React, { memo } from 'react';
import { Grid, TextField } from '@material-ui/core';
import { useSelector } from 'react-redux';
import RenderTitle from './RenderTitle';
import phoneOnBlur from '../../../../utils/phoneOnBlur';

const inputProps = {
  variant: 'outlined',
  fullWidth: true,
  size: 'small'
};

const itemProps = {
  xs: 12,
  sm: 6,
  md: 4,
  item: true
};

const Requester = (props) => {
  const {
    values,
    handleChange,
    isDetail,
    handleBlur,
    touched = {},
    errors = {},
    isApproval
  } = props;
  const user = useSelector((state) => state.userReducer?.currentUser) || {};

  console.log('requester');

  return (
    <Grid container item spacing={2}>
      <RenderTitle title="Requester Information" />
      <Grid container item spacing={3}>
        <Grid {...itemProps}>
          <TextField
            {...inputProps}
            label="Name *"
            name="requester.requesterName"
            value={values.requesterName}
            onChange={handleChange}
            disabled
            onBlur={handleBlur}
            error={errors.requesterName && touched.requesterName}
          />
        </Grid>

        <Grid {...itemProps}>
          <TextField
            {...inputProps}
            label="Title"
            name="requester.requesterTitle"
            value={values.requesterTitle}
            onBlur={handleBlur}
            onChange={handleChange}
            disabled
            error={errors.requesterTitle && touched.requesterTitle}
          />
        </Grid>

        <Grid {...itemProps}>
          <TextField
            {...inputProps}
            label="Phone *"
            name="requester.requesterPhone"
            value={values.requesterPhone}
            onBlur={(e) => {
              handleBlur(e);
              if (!isDetail) {
                phoneOnBlur(user?.username, values.requesterPhone);
              }
            }}
            onChange={(e) => {
              if (e.target.value && /^[0-9]*$/.test(e.target.value)) {
                handleChange(e);
              } else if (!e.target.value) {
                handleChange(e);
              }
            }}
            disabled={isDetail || isApproval}
            error={errors.requesterPhone && touched.requesterPhone}
            inputProps={{ maxLength: 8 }}
          />
        </Grid>
      </Grid>
    </Grid>
  );
};

export default memo(Requester);
