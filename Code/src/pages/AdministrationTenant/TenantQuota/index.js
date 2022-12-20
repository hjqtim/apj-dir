import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Page404 from '../../auth/Page404';
import TenantQuota from './components/index';

export default function FeedBack() {
  return (
    <Switch>
      <Route path="/AdministrationTenant/TenantQuota" exact component={TenantQuota} />
      <Route component={Page404} />
    </Switch>
  );
}
