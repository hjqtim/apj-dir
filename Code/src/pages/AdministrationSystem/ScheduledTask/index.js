import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Page404 from '../../auth/Page404';
import { List } from './components/index';

export default function index() {
  return (
    <Switch>
      {/* <Route path="/AdministrationSystem/ScheduledTask/create" exact component={Create} /> */}
      <Route path="/AdministrationSystem/ScheduledTask" exact component={List} />
      <Route component={Page404} />
    </Switch>
  );
}
