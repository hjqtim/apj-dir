import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Page404 from '../../auth/Page404';
import SearchPDUInformation from './components/index';

export default function Index() {
  return (
    <Switch>
      <Route path="/hardwardstatus/SearchPDUInformation" exact component={SearchPDUInformation} />
      <Route component={Page404} />
    </Switch>
  );
}
