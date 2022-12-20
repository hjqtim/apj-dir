import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Page404 from '../../auth/Page404';
import DetailApplication from './components/DetailApplication';

export default function Index() {
  return (
    <Switch>
      <Route path="/resourcemanage/:status/:requestNo" component={DetailApplication} />
      <Route component={Page404} />
    </Switch>
  );
}
