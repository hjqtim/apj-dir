import React, { memo } from 'react';
import { Grid, Typography } from '@material-ui/core';

import FormControlProps from '../../../../../models/webdp/PropsModels/FormControlProps';
import useWebDPColor from '../../../../../hooks/webDP/useWebDPColor';

import MoreDescribe from './MoreDescribe';

const Index = () => {
  const webdpColor = useWebDPColor();

  return (
    <Grid container>
      {/* 富文本追加描述 */}
      <Typography variant="h6" style={{ color: webdpColor.title, marginTop: 18 }}>
        <strong>Detailed Description</strong>
      </Typography>
      <Grid container spacing={3}>
        <Grid {...FormControlProps} md={12} lg={12} style={{ marginTop: 18 }}>
          <MoreDescribe />
        </Grid>
      </Grid>
    </Grid>
  );
};
export default memo(Index);
