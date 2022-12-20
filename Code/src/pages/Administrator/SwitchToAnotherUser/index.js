import React from 'react';
import List from './components/List';
import CommonPage from '../../../components/CommonPage';

export default function Index() {
  const config = {
    title: 'Switch to Another User',
    List
  };

  return (
    <>
      <CommonPage {...config} />
    </>
  );
}
