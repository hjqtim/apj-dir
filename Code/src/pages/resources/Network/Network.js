import React from 'react';
import CommonPage from '../../../components/CommonPage';
import { List, Detail, Update, Create } from './components';
import { L } from '../../../utils/lang';

const parentTitle = L('Resource');
const title = L('Network');

function Network() {
  const props = {
    title,
    parentTitle,
    List,
    Detail,
    Update,
    Create
  };
  return (
    <>
      <CommonPage {...props} />
    </>
  );
}

export default Network;
