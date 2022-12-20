import React from 'react';
import CommonPage from '../../../components/CommonPage';
import { List } from './components';

const FeedbackManagement = () => {
  const config = {
    title: 'Feedback Management',
    List
  };
  return (
    <>
      <CommonPage {...config} />
    </>
  );
};

export default FeedbackManagement;
