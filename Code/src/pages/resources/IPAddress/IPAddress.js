import React from 'react';
import CommonPage from '../../../components/CommonPage';
import { List, Create, Update, Detail } from './components';
import { L } from '../../../utils/lang';

const parentTitle = L('Resource');
const title = L('IP Address');

function IPAddress() {
  const props = {
    title,
    parentTitle,
    Detail,
    Update,
    Create,
    List
  };
  return (
    <>
      <CommonPage {...props} />
    </>
  );
}

export default IPAddress;
