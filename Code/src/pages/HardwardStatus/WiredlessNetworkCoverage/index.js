import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Page404 from '../../auth/Page404';
import WiredlessNetworkCoverage from './components/index';

export default function Index() {
  return (
    <Switch>
      <Route
        path="/hardwardstatus/WiredlessNetworkCoverage"
        exact
        component={WiredlessNetworkCoverage}
      />
      <Route component={Page404} />
    </Switch>
  );
}
