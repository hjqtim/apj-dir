import React from 'react';
import CommonPage from '../../../components/CommonPage';
import { List, Detail } from './components';

const title = 'Logging - API';

const Log = () => {
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
};

export default Log;
