import React from 'react';
import { Grid } from '@material-ui/core';

export default function RenderItem({ label, value }) {
  return (
    <Grid container style={{ margin: '5px 0' }}>
      <Grid item xs={2} md={2} ld={2}>
        <strong>{label || ''}</strong>
      </Grid>
      <Grid item xs={10} md={10} ld={10}>
        {label === 'Connection Status:' ? (
          <span style={{ color: value === 'true' ? 'green' : 'red', fontWeight: 700 }}>
            {value === 'true' ? 'Online' : 'Offline'}
          </span>
        ) : (
          <strong>{value || ''}</strong>
        )}
      </Grid>
    </Grid>
  );
}
