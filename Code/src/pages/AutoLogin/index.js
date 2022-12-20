import { useEffect } from 'react';
import { parse } from 'qs';
import { Loading } from '../../components';
import API from '../../api/webdp/webdp';
import { signIn, setUserFromLocalStorage } from '../../utils/auth';

const AutoLogin = () => {
  useEffect(() => {
    const { token, url } = parse(window.location.search.replace('?', ''));

    window.localStorage.clear();
    window.localStorage.setItem('token', token);

    const data = {};
    const newPhone = {};

    Loading.show();

    API.getLoginByToken()
      .then((res) => {
        const newUser = res?.data?.data?.user;
        const newLogin = res?.data?.data?.login;
        if (newUser && newLogin) {
          data.user = newUser;
          data.groups = newUser.groups;
          data.token = token;
          newPhone.phone = newLogin.phone;
        }
      })
      .finally(() => {
        Loading.hide();
        if (data.user) {
          signIn(data);
          setUserFromLocalStorage(newPhone);
          window.location.href = url;
        } else {
          window.localStorage.clear();
          window.location.href = '/auth/sign-in';
        }
      });
  }, []);

  return null;
};

export default AutoLogin;
