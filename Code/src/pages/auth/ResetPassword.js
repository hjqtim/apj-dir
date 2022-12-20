import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import Helmet from 'react-helmet';

import {
  FormControl,
  Input,
  InputLabel,
  Button as MuiButton,
  Paper,
  Typography
} from '@material-ui/core';
import { spacing } from '@material-ui/system';
import { L } from '../../utils/lang';

const Button = styled(MuiButton)(spacing);

const Wrapper = styled(Paper)`
  padding: ${(props) => props.theme.spacing(6)}px;
  width: 100%;

  ${(props) => props.theme.breakpoints.up('md')} {
    padding: ${(props) => props.theme.spacing(10)}px;
  }
`;

function ResetPassword() {
  return (
    <Wrapper>
      <Helmet title="Reset Password" />
      <Typography component="h1" variant="h4" align="center" gutterBottom>
        {L('Reset Password')}
      </Typography>
      <Typography component="h2" variant="body1" align="center">
        {L('emailRestPassword')}
      </Typography>
      <form>
        <FormControl margin="normal" required fullWidth>
          <InputLabel htmlFor="email">{L('Email Address')}</InputLabel>
          <Input id="email" name="email" autoComplete="email" autoFocus />
        </FormControl>
        <Button component={Link} to="/" fullWidth variant="contained" color="primary" mt={2}>
          {L('Reset password')}
        </Button>
      </form>
    </Wrapper>
  );
}

export default ResetPassword;
