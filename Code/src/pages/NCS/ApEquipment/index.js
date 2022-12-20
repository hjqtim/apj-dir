import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Page404 from '../../auth/Page404';
import ApEquipment from './components/index';

export default function Index() {
  return (
    <Switch>
      <Route path="/ncs/ApEquipment" exact component={ApEquipment} />
      <Route component={Page404} />
    </Switch>
  );
}
