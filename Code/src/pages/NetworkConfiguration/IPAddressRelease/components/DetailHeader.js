import { Grid, Typography } from '@material-ui/core';
import React from 'react';
import { useParams } from 'react-router-dom';

const DetailHeader = (props) => {
  let { requestNo } = props;
  const requestNoURL = useParams().requestNo;
  if (requestNoURL) {
    requestNo = requestNoURL;
  }

  return (
    <Grid>
      <Typography
        variant="h2"
        style={{
          fontWeight: 'bold',
          textAlign: 'center'
        }}
      >
        {requestNo && requestNo ? `IPR${requestNo}` : ''}
      </Typography>
    </Grid>
  );
};
export default DetailHeader;
