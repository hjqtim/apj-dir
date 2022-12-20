import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Preparation from './components/index';
import Page404 from '../../auth/Page404';

function Index() {
  return (
    <Switch>
      <Route path="/Procurement/Preparation" exact component={Preparation} />
      <Route component={Page404} />
    </Switch>
  );
}

export default Index;
