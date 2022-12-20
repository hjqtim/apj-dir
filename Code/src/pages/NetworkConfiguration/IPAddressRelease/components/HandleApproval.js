import React, { useState, memo } from 'react';
import { Grid, Button, Typography, TextField } from '@material-ui/core';
import { useHistory, useParams } from 'react-router-dom';
import { Loading, WarningDialog, CommonTip } from '../../../../components';
import FormControlProps from '../../../../models/webdp/PropsModels/FormControlProps';
import useWebDPColor from '../../../../hooks/webDP/useWebDPColor';
import ipassignAPI from '../../../../api/ipassign';

const HandleApproval = ({ handleChange, remark, isApproval, isDetail, formStatus }) => {
  const { requestNo } = useParams();
  const history = useHistory();
  const [open, setOpen] = useState(false);
  const [state, setState] = useState(false);
  const handleClickOpen = () => setOpen(true);

  const handleRequest = () => {
    Loading.show();
    ipassignAPI
      .examine({ requestNo, remark, state: state ? 1 : 0 })
      .then((res) => {
        if (res?.data?.code === 200) {
          console.log('es?.data?: ', res?.data?.data);
          history.push('/action');
          CommonTip.success('Success');
        }
      })
      .finally(() => {
        Loading.hide();
      });
  };

  return (
    <Grid container>
      <Grid {...FormControlProps} xs={12}>
        <Typography variant="h6">
          <strong style={{ color: useWebDPColor().title }}> </strong>
        </Typography>
      </Grid>
      <Grid {...FormControlProps} xs={12}>
        <TextField
          variant="outlined"
          label="Remarks"
          multiline
          fullWidth
          disabled={isDetail || formStatus === 'Released' || formStatus === 'Rejected'}
          minRows={5}
          name="remark"
          value={remark || ''}
          onChange={handleChange}
        />
      </Grid>

      {isApproval && (
        <Grid {...FormControlProps} xs={12}>
          <Button
            variant="contained"
            color="primary"
            disabled={formStatus === 'Released' || formStatus === 'Rejected'}
            style={{ fontWeight: 'bold' }}
            onClick={() => {
              handleClickOpen();
              setState(true);
            }}
          >
            Approval
          </Button>

          <Button
            variant="contained"
            color="secondary"
            disabled={!remark || formStatus === 'Released' || formStatus === 'Rejected'}
            onClick={() => {
              handleClickOpen();
              setState(false);
            }}
            style={{ marginLeft: '0.5rem', fontWeight: 'bold' }}
          >
            Reject
          </Button>

          <WarningDialog
            open={open}
            handleConfirm={handleRequest}
            handleClose={() => {
              setOpen(false);
            }}
            content={`Are you sure to ${state ? 'accept' : 'reject'} the request?`}
          />
        </Grid>
      )}
    </Grid>
  );
};

export default memo(HandleApproval);
