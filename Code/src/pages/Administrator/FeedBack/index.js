import React from 'react';
import { Switch, Route } from 'react-router-dom';
import FeedbackList from './components/index';
import Page404 from '../../auth/Page404';

export default function FeedBack() {
  return (
    <Switch>
      <Route path="/admin/feedback/list" exact component={FeedbackList} />
      <Route component={Page404} />
    </Switch>
  );
}
