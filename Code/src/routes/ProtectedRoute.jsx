import React from 'react';
import { Redirect, Route } from 'react-router-dom';

const ProtectedRoute = ({ isLogin, component: Component, ...rest }) => (
  // console.log('Protecte:', Component);
  <Route
    {...rest}
    render={(props) =>
      isLogin ? <Component {...props} /> : <Redirect to={{ pathname: '/auth/sign-in' }} />
    }
  />
);
export default ProtectedRoute;
