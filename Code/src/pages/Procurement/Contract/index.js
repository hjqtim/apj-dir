import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Page404 from '../../auth/Page404';
import { List } from './components/index';
import Create from './components/Create/index';

export default function Index() {
  return (
    <Switch>
      <Route path="/Procurement/Contract" exact component={List} />
      <Route path="/Procurement/Contract/detail/:contractId" exact component={Create} />
      <Route path="/Procurement/Contract/update/:contractId" exact component={Create} />
      <Route path="/Procurement/Contract/create" exact component={Create} />
      <Route component={Page404} />
    </Switch>
  );
}
