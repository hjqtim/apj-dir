import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Page404 from '../../auth/Page404';
import WiredNetworkCoverage from './components/index';

export default function Index() {
  return (
    <Switch>
      <Route path="/hardwardstatus/WiredNetworkCoverage" exact component={WiredNetworkCoverage} />
      <Route component={Page404} />
    </Switch>
  );
}
