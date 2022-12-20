import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

import Helmet from 'react-helmet';

import { Button as MuiButton, Typography } from '@material-ui/core';
import { spacing } from '@material-ui/system';
import { L } from '../../utils/lang';

const Button = styled(MuiButton)(spacing);

const Wrapper = styled.div`
  padding: ${(props) => props.theme.spacing(6)}px;
  text-align: center;
  background: transparent;

  ${(props) => props.theme.breakpoints.up('md')} {
    padding: ${(props) => props.theme.spacing(10)}px;
  }
`;

function Page500() {
  return (
    <Wrapper>
      <Helmet title={L('500 Error')} />
      <Typography component="h1" variant="h1" align="center" gutterBottom>
        {L('500')}
      </Typography>
      <Typography component="h2" variant="h5" align="center" gutterBottom>
        {L('Internal server error.')}
      </Typography>
      <Typography component="h2" variant="body1" align="center" gutterBottom>
        {L('notCompleteRequest')}
      </Typography>

      <Button component={Link} to="/" variant="contained" color="secondary" mt={2}>
        {L('Return to website')}
      </Button>
    </Wrapper>
  );
}

export default Page500;
