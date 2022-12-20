import React, { useState, memo } from 'react';
import { Grid, Button } from '@material-ui/core';
import CheckIcon from '@material-ui/icons/Check';
import { WarningDialog } from '../../../../components';

const SubmitButton = ({ handleSubmit }) => {
  const [open, setOpen] = useState(false);
  const handleClickOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <Grid container>
      <Grid item xs={12}>
        <Button
          variant="contained"
          color="primary"
          startIcon={<CheckIcon />}
          style={{ fontWeight: 'bold' }}
          onClick={handleClickOpen}
        >
          Submit
        </Button>

        <WarningDialog
          open={open}
          title="Submitting Application"
          handleConfirm={() => {
            handleSubmit();
            handleClose();
          }}
          handleClose={handleClose}
          ConfirmText="Submit"
          content="Submit the application."
        />
      </Grid>
    </Grid>
  );
};

export default memo(SubmitButton);
