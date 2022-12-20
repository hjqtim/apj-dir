import React from 'react';
import CommonPage from '../../../components/CommonPage';
import { List, Detail } from './components/index';

const title = 'Order Summary';

function Index() {
  const config = {
    title,
    List,
    Detail
  };
  return (
    <>
      <CommonPage {...config} />
    </>
  );
}

export default Index;
