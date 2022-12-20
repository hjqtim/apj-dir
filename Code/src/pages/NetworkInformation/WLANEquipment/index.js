import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Page404 from '../../auth/Page404';
import WLANEquipment from './components/index';

export default function Index() {
  return (
    <Switch>
      <Route path="/NetworkInformation/WLANEquipment" exact component={WLANEquipment} />
      <Route component={Page404} />
    </Switch>
  );
}
