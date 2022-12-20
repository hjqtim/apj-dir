import React from 'react';
import CommonPage from '../../../components/CommonPage';
import { List, Create } from './components';
import { L } from '../../../utils/lang';

const parentTitle = L('Workflow');
const title = L('Non-Personal Account');

function MyRequest() {
  const props = {
    title,
    parentTitle,
    List,
    Create,
    CreateWithId: true
  };
  return (
    <>
      <CommonPage {...props} />
    </>
  );
}

export default MyRequest;
