import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Page404 from '../../auth/Page404';
import RPApplication from './components/index';

export default function Index() {
  return (
    <Switch>
      <Route path="/resourcemanage/Application" exact component={RPApplication} />
      <Route component={Page404} />
    </Switch>
  );
}
