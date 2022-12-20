import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Page404 from '../../auth/Page404';
import PackageList from './components/index';
import Create from './components/Create/index';

export default function Index() {
  return (
    <Switch>
      <Route path="/Procurement/PackageList" exact component={PackageList} />
      <Route path="/Procurement/PackageList/detail/:id" exact component={Create} />
      <Route path="/Procurement/PackageList/update/:id" exact component={Create} />
      <Route path="/Procurement/PackageList/create" exact component={Create} />
      <Route component={Page404} />
    </Switch>
  );
}
