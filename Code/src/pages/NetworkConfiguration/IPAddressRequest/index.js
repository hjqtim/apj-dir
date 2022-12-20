import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Page404 from '../../auth/Page404';
import IPAddressRequest from './components/index';

export default function Index() {
  return (
    <Switch>
      <Route path="/NetworkConfiguration/IPAddressRequest" exact component={IPAddressRequest} />
      <Route component={Page404} />
    </Switch>
  );
}
