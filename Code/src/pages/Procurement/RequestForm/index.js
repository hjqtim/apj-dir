import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Page404 from '../../auth/Page404';
import { List } from './components/index';

export default function Index() {
  return (
    <Switch>
      <Route path="/Procurement/RequestForm" exact component={List} />
      <Route component={Page404} />
    </Switch>
  );
}
