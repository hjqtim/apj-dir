import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Page404 from '../../auth/Page404';
import Dashboard from './components/index';

export default function Index() {
  return (
    <Switch>
      <Route path="/NetworkInstallation/WLANAPInstalltion" exact component={Dashboard} />
      <Route component={Page404} />
    </Switch>
  );
}
