import React, { memo } from 'react';
import Form from './components/index';
import DetailHeader from './components/DetailHeader';

const Detail = ({ requestNo }) => (
  <>
    <DetailHeader requestNo={requestNo} />
    <Form isDetail requestNo={requestNo} />
  </>
);

export default memo(Detail);
