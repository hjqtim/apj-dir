import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Page404 from '../auth/Page404';
import MessageList from './components/index';

export default function Index() {
  return (
    <Switch>
      <Route path="/message" exact component={MessageList} />
      <Route component={Page404} />
    </Switch>
  );
}
