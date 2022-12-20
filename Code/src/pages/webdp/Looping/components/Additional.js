import React, { memo } from 'react';
import { Grid, TextField } from '@material-ui/core';
import RenderTitle from './RenderTitle';

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

const Additional = (props) => {
  const { values, handleChange, isDetail, isApproval } = props;
  console.log('Additional');

  return (
    <Grid container item spacing={2}>
      <RenderTitle title="Additional Information" />
      <Grid container item spacing={3}>
        <Grid {...itemProps}>
          <TextField
            {...inputProps}
            label="DP Request No"
            name="additional.dpRequestNo"
            value={values.dpRequestNo}
            onChange={handleChange}
            disabled={isDetail || isApproval}
          />
        </Grid>

        <Grid {...itemProps}>
          <TextField
            {...inputProps}
            label="TSR No"
            name="additional.tsrNo"
            value={values.tsrNo}
            onChange={handleChange}
            disabled={isDetail || isApproval}
          />
        </Grid>

        <Grid {...itemProps}>
          <TextField
            {...inputProps}
            label="CR No"
            name="additional.crNo"
            value={values.crNo}
            onChange={handleChange}
            disabled={isDetail || isApproval}
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            {...inputProps}
            label="Remarks"
            name="additional.adminRemarks"
            value={values.adminRemarks}
            onChange={handleChange}
            disabled={isDetail || isApproval}
          />
        </Grid>
      </Grid>
    </Grid>
  );
};

export default memo(Additional);
