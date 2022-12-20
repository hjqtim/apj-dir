import React from 'react';
import { Switch, Route } from 'react-router-dom';

import { Detail } from './components';
import List from './components/List';
import Page404 from '../auth/Page404';

function MyRequest() {
  return (
    <Switch>
      {/* <CommonPage {...props} /> */}
      <Route path="/myrequest/" exact component={List} />
      <Route path="/myrequest/detail/:requestId/:apptype" component={Detail} />
      <Route component={Page404} />
    </Switch>
  );
}

export default MyRequest;
