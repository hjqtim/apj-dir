import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Inspection from './components/index';
import Page404 from '../../auth/Page404';

function Index() {
  return (
    <Switch>
      <Route path="/rms/inspection/" exact component={Inspection} />
      <Route component={Page404} />
    </Switch>
  );
}

export default Index;
