import { Grid, Typography } from '@material-ui/core';
import React from 'react';
import { useParams } from 'react-router-dom';

const FormHeader = ({ statusNo }) => {
  const { requestId, apptype } = useParams();

  return (
    <Grid>
      <Typography
        variant="h2"
        style={{
          fontWeight: 'bold',
          textAlign: 'center'
        }}
      >
        {apptype}
        {requestId}
        {statusNo === 180 && <span>&nbsp;(Cancelled)</span>}
      </Typography>
    </Grid>
  );
};
export default FormHeader;
