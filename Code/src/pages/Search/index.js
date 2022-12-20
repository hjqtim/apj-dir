import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Page404 from '../auth/Page404';
import Search from './components/index';

export default function Index() {
  return (
    <Switch>
      <Route path="/search" exact component={Search} />
      <Route component={Page404} />
    </Switch>
  );
}
