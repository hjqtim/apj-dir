import React from 'react';
import CommonPage from '../../../components/CommonPage';
import { List, Detail, Step } from './components';
import { L } from '../../../utils/lang';

const path = '/workflow/request';
const parentTitle = L('Workflow');
const title = '';

function MyRequest() {
  const props = {
    path,
    title,
    parentTitle,
    List,
    Detail,
    Step
  };
  return (
    <>
      <CommonPage {...props} />
    </>
  );
}

export default MyRequest;
