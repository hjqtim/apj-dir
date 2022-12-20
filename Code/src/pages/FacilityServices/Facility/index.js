import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Page404 from '../../auth/Page404';
import Facility from './components/index';

export default function Index() {
  return (
    <Switch>
      <Route path="/FacilityServices/Facility" exact component={Facility} />
      <Route component={Page404} />
    </Switch>
  );
}
