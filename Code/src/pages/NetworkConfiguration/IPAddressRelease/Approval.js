import React, { memo } from 'react';
import Form from './components/index';
import DetailHeader from './components/DetailHeader';

const Approval = () => (
  <>
    <DetailHeader />
    <Form isApproval />
  </>
);

export default memo(Approval);
