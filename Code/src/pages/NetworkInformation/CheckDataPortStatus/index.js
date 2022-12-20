import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Page404 from '../../auth/Page404';
import CheckDataPortStatus from './components/index';

export default function Index() {
  return (
    <Switch>
      <Route path="/NetworkInformation/CheckDataPortStatus" exact component={CheckDataPortStatus} />
      <Route component={Page404} />
    </Switch>
  );
}
