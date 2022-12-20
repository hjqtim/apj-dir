import React, { memo, useEffect, useState } from 'react';
import { Grid, Button, TextField, FormGroup, FormControlLabel, Checkbox } from '@material-ui/core';
import CheckIcon from '@material-ui/icons/Check';

import useWebDPColor from '../../../../hooks/webDP/useWebDPColor';

const Remark = (props) => {
  const webDPColor = useWebDPColor();
  const { approvalRemark, handleSubmit, setFieldValue } = props;
  const { remark, status } = approvalRemark;
  const { setEAM, setEquip } = approvalRemark?.configs;
  const [submitDisabled, setSubmitDisabled] = useState(true);
  const [checkboxDisabled, setCheckboxDisabled] = useState(false);
  const handleSubmitDisabled = () => {
    if (setEAM && setEquip) {
      setSubmitDisabled(false);
    } else {
      setSubmitDisabled(true);
    }
  };

  useEffect(() => {
    handleSubmitDisabled();
  }, [setEAM, setEquip]);

  useEffect(() => {
    if (status === 'Completed') {
      setCheckboxDisabled(true);
    }
  }, [status]);

  return (
    <div style={{ width: '100%' }}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            name="approvalRemarks"
            onChange={(e) => setFieldValue('approvalRemark.remark', e.target.value)}
            label="Remark"
            minRows={6}
            maxRows={10}
            variant="outlined"
            multiline
            fullWidth
            disabled={checkboxDisabled}
            value={remark}
          />
        </Grid>
        <Grid item xs={12}>
          <FormGroup>
            <FormControlLabel
              label="Updated EAM System"
              control={
                <Checkbox
                  checked={setEAM || false}
                  name="configureSwitch"
                  color="primary"
                  disabled={checkboxDisabled}
                  onChange={(e) => {
                    setFieldValue('approvalRemark.configs.setEAM', e.target.checked);
                    console.log('aa', e.target.checked);
                  }}
                />
              }
            />
            <FormControlLabel
              label="Saved Switch Configuration"
              control={
                <Checkbox
                  checked={setEquip}
                  color="primary"
                  name="configureSwitch2"
                  disabled={checkboxDisabled}
                  onChange={(e) => {
                    setFieldValue('approvalRemark.configs.setEquip', e.target.checked);
                    handleSubmitDisabled();
                  }}
                />
              }
            />
          </FormGroup>
        </Grid>
        <Grid item xs={12}>
          {status !== 'Completed' ? (
            <Button
              variant="contained"
              color="primary"
              startIcon={<CheckIcon />}
              style={{ fontWeight: 'bold', backgroundColor: webDPColor, color: 'white' }}
              onClick={handleSubmit}
              disabled={submitDisabled}
            >
              Complete This Request
            </Button>
          ) : null}
        </Grid>
      </Grid>
    </div>
  );
};

export default memo(Remark);
