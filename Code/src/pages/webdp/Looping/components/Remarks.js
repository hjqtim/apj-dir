import React, { memo } from 'react';
import { Grid, TextField, FormControlLabel, FormGroup, Checkbox } from '@material-ui/core';
import RenderTitle from './RenderTitle';

const Remarks = (props) => {
  const {
    approvalRemarks,
    configureSwitch,
    configureSwitch2,
    handleChange,
    isDetail,
    isCompleted = false,
    isApproval,
    detailData,
    formik
  } = props;

  const hasManual = formik.values.dataPortList.items.find((item) => item.approach === 'Manual');

  return (
    <Grid container item spacing={2}>
      <RenderTitle title="N3 Team Approval" />
      <Grid container item spacing={3}>
        <Grid item xs={12}>
          <TextField
            name="approvalRemarks"
            value={approvalRemarks}
            onChange={handleChange}
            label="Remarks"
            minRows={6}
            maxRows={10}
            variant="outlined"
            multiline
            fullWidth
            disabled={isDetail || isCompleted || detailData?.readOnly || false}
          />
        </Grid>

        {isApproval && (
          <Grid item xs={12}>
            <FormGroup>
              <FormControlLabel
                label="Configure Switch"
                control={
                  <Checkbox
                    checked={configureSwitch}
                    name="configureSwitch"
                    color="primary"
                    onChange={handleChange}
                    disabled={isCompleted || !hasManual || detailData?.readOnly || false}
                  />
                }
              />
              <FormControlLabel
                label="Save Switch Configuration"
                control={
                  <Checkbox
                    checked={configureSwitch2}
                    color="primary"
                    name="configureSwitch2"
                    onChange={handleChange}
                    disabled={isCompleted || !hasManual || detailData?.readOnly || false}
                  />
                }
              />
            </FormGroup>
          </Grid>
        )}
      </Grid>
    </Grid>
  );
};

export default memo(Remarks);
