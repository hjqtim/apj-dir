import React from 'react';
import { Switch, Route } from 'react-router-dom';
import DeForm from './components/index';
import Page404 from '../../auth/Page404';

function DERequestForm() {
  return (
    <Switch>
      <Route path="/webdp/myDEForm/" exact component={DeForm} />
      <Route path="/webdp/deForm/detail/:apptype/:aduser/:requestNo" component={DeForm} />
      <Route component={Page404} />
    </Switch>
  );
}

export default DERequestForm;
