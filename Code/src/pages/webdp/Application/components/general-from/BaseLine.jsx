import React from 'react';
import { Grid } from '@material-ui/core';
import useWebDPColor from '../../../../../hooks/webDP/useWebDPColor';

const BaseLine = () => {
  const color = useWebDPColor();
  return (
    <Grid
      item
      xs={12}
      md={12}
      lg={12}
      style={{ backgroundColor: color, height: '3px', margin: '1rem 0' }}
    />
  );
};

export default BaseLine;
