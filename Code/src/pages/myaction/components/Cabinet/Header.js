import React from 'react';
import { Grid, Button, makeStyles } from '@material-ui/core';
import { HeaderRightProps } from './FormControlProps';

const useStyles = makeStyles((theme) => ({
  buttonStyle: {
    marginRight: theme.spacing(2)
  }
}));
export default function Header({ isDetail, handleSubmit }) {
  const classes = useStyles();
  const btnProps = { color: 'primary', variant: 'contained', className: classes.buttonStyle };

  return (
    <Grid container spacing={3} justifyContent="space-between" style={{ marginBottom: '5px' }}>
      <Grid {...HeaderRightProps}>
        {!isDetail && (
          <Button {...btnProps} onClick={handleSubmit}>
            Add
          </Button>
        )}
      </Grid>
    </Grid>
  );
}
