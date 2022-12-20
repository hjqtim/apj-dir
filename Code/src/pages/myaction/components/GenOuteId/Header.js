import React from 'react';
import { Grid, Typography, withStyles, Chip, Button } from '@material-ui/core';
import { HeaderLeftProps } from './FormControlProps';

const MyChip = withStyles({
  root: {
    margin: '0 20px'
  }
})(Chip);

export default function Header({
  isDetail,
  hospital,
  block,
  floor,
  type,
  department,
  room,
  numOfDP,
  handleSubmit
}) {
  const btnProps = { color: 'primary', variant: 'contained' };

  return (
    <Grid container spacing={1} justifyContent="space-between" style={{ marginBottom: '5px' }}>
      {/* {...HeaderLeftProps} */}
      <Grid {...HeaderLeftProps}>
        <Typography variant="h6">
          <Grid container spacing={2} alignItems="center" style={{ margin: '0 0 5px' }}>
            <Grid item>
              Institution :
              <MyChip label={hospital || '-'} />
            </Grid>
            <Grid item>
              Block:
              <MyChip label={block || '-'} />
            </Grid>
            <Grid item>
              Floor:
              <MyChip label={floor || '-'} />
            </Grid>
            <Grid item>
              Department:
              <MyChip label={department || '-'} />
            </Grid>
            <Grid item>
              Room:
              <MyChip label={room || '-'} />
            </Grid>
            <Grid item>
              Type:
              <MyChip label={`${type}(${numOfDP})` || '-'} />
            </Grid>
          </Grid>
        </Typography>
      </Grid>

      {/* <Grid {...HeaderRightProps}> */}
      <Grid item>
        {(type === 'New Data Port' || type === 'New Dual Data Port') && !isDetail && (
          <Button {...btnProps} onClick={handleSubmit}>
            Gen All Outlet ID
          </Button>
        )}
      </Grid>
    </Grid>
  );
}
