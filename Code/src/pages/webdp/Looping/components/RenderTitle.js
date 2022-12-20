import React, { memo } from 'react';
import { Grid, Typography } from '@material-ui/core';
import useWebDPColor from '../../../../hooks/webDP/useWebDPColor';

const RenderTitle = ({ title }) => {
  const webdpColor = useWebDPColor();

  return (
    <Grid container item>
      <Typography variant="h6" style={{ color: webdpColor.title }}>
        <strong>{title}</strong>
      </Typography>
    </Grid>
  );
};

export default memo(RenderTitle);
