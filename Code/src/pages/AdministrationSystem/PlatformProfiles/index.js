import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Page404 from '../../auth/Page404';
import PlatformProfiles from './components/index';

export default function index() {
  return (
    <Switch>
      <Route path="/AdministrationSystem/PlatformProfiles" exact component={PlatformProfiles} />
      <Route component={Page404} />
    </Switch>
  );
}
