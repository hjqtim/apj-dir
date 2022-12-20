import React from 'react';
import { Grid, ButtonGroup, Button } from '@material-ui/core';
import DoneIcon from '@material-ui/icons/Done';
import SaveIcon from '@material-ui/icons/Save';
import ClearIcon from '@material-ui/icons/Clear';

const ButtonProps = {
  variant: 'contained',
  style: {
    width: '6rem',
    marginRight: '0.5rem'
  }
};

const SubmitToolbar = ({ cancelEditHandler }) => {
  const a = 'a';
  return (
    <Grid container style={{ padding: '0 0.8rem', marginTop: '0.5rem' }}>
      <Button {...ButtonProps} color="primary" startIcon={<DoneIcon />}>
        Submit
      </Button>
      <Button {...ButtonProps} color="secondary" startIcon={<SaveIcon />}>
        Save
      </Button>
      <Button
        {...ButtonProps}
        color="default"
        startIcon={<ClearIcon />}
        onClick={cancelEditHandler}
      >
        Cancel
      </Button>
    </Grid>
  );
};

export default SubmitToolbar;
