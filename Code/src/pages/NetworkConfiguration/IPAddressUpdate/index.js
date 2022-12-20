import React from 'react';
import DetailHeader from './components/DetailHeader';
import Form from './components/Form';

const IPAddressUpdate = ({ requestNo, status }) => (
  <>
    <DetailHeader requestNo={requestNo} />
    <Form requestNo={requestNo} status={status} />
  </>
);

export default IPAddressUpdate;
