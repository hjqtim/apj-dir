import React from 'react';
import CommonPage from '../../../components/CommonPage';
import List from './components/List';

const title = 'System Messages';

const config = {
  title,
  List
};

export default function SystemMessages() {
  return (
    <>
      <CommonPage {...config} />
    </>
  );
}
