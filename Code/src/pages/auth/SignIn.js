import React from 'react';
import styled from 'styled-components';
// import { useHistory } from 'react-router-dom';
import Helmet from 'react-helmet';
import {
  Avatar,
  FormControl,
  Input,
  InputLabel,
  Button as MuiButton,
  Paper,
  Typography
} from '@material-ui/core';
import { spacing } from '@material-ui/system';
import authAPI from '../../api/auth';
import webdpAPI from '../../api/webdp/webdp';
import { L } from '../../utils/lang';
import { encryptionNew } from '../../utils/encryption';
import { signIn, setUserFromLocalStorage } from '../../utils/auth';
import { BASE_VER } from '../../utils/constant';
import Loading from '../../components/Loading';

import CommonTip from '../../components/CommonTip';

const Button = styled(MuiButton)(spacing);

const Wrapper = styled(Paper)`
  padding: ${(props) => props.theme.spacing(6)}px;
  ${(props) => props.theme.breakpoints.up('md')} {
    padding: ${(props) => props.theme.spacing(10)}px;
  }
`;

function SignIn() {
  const [account, setAccount] = React.useState('');
  const [password, setPassword] = React.useState('');
  // const history = useHistory();

  const login = () => {
    const pwd = password;
    if (account && pwd) {
      Loading.show();
      authAPI
        .login({
          username: account,
          password: encryptionNew(pwd)
        })
        .then(async (response) => {
          if (!response.data || !response.data.data) {
            Loading.hide();
            CommonTip.error(L('LoginFail'));
          } else {
            await signIn(response.data.data);
            await webdpAPI
              .getCorpInfo({
                username: account
              })
              .then((res) => {
                setUserFromLocalStorage({ phone: res?.data?.data?.phone });
                Loading.hide();
                CommonTip.success(L('Success'));
                // history.push('/workflow/approval/');
                // window.location.href = '/dashboard';
                window.location.href = '/action';
              });
          }
        })
        .catch(() => {
          Loading.hide();
        });
    } else if (!account) {
      CommonTip.warning(L('Account is required'));
    } else if (!pwd) {
      CommonTip.warning(L('Password is required'));
    }
  };

  const handleChange = (event, type) => {
    if (type === 'password') {
      setPassword(event.target.value);
    } else if (type === 'account') {
      setAccount(event.target.value);
    }
  };

  const handleKeyDown = (event) => {
    if (event.keyCode === 13) {
      // 主要区别就是这里，可以直接获取到keyCode的值
      login();
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        backgroundColor: '#F7F9FC',
        height: window.innerHeight
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <Wrapper>
          <Helmet title={L('Sign In')} />
          <Avatar
            alt="Logo"
            variant="square"
            style={{
              width: '92px',
              height: '92px',
              textAlign: 'center',
              margin: '0 auto',
              top: '-5px'
            }}
            src="/static/img/logo/homePage.png"
          />
          {BASE_VER ? (
            <div style={{ marginLeft: '80%', color: '#1a70ff', transform: 'rotate(345deg)' }}>
              <div
                style={{
                  color: '#fff',
                  background: '#ff0000',
                  textAlign: 'center',
                  padding: 5,
                  borderRadius: 5
                }}
              >
                {BASE_VER}
              </div>
            </div>
          ) : null}
          <Typography component="h1" variant="h4" align="center" gutterBottom>
            {L('WelcomeToSENSE')}
          </Typography>
          <Typography component="h2" variant="body1" align="center">
            {L('signInAccount')}
          </Typography>
          <form>
            <FormControl margin="normal" required fullWidth>
              <InputLabel htmlFor="account">Account</InputLabel>
              <Input
                onChange={(event) => handleChange(event, 'account')}
                id="account"
                name="account"
                autoFocus
              />
            </FormControl>
            <FormControl margin="normal" required fullWidth>
              <InputLabel htmlFor="password">Password</InputLabel>
              <Input
                onChange={(event) => handleChange(event, 'password')}
                onKeyDown={(event) => handleKeyDown(event)}
                name="password"
                type="password"
                id="password"
                autoComplete="current-password"
              />
            </FormControl>
            <Button
              // component={Link}
              onClick={login}
              style={{ marginTop: 10 }}
              to="#"
              fullWidth
              variant="contained"
              color="primary"
              mb={2}
            >
              {L('Sign in')}
            </Button>
          </form>
        </Wrapper>
      </div>
    </div>
  );
}

export default SignIn;
