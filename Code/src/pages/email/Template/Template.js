import React from 'react';
import CommonPage from '../../../components/CommonPage';
import { List, Detail, Update, Create } from './components';
import { L } from '../../../utils/lang';

const title = L('template');

const Template = () => {
  const config = {
    title,
    List,
    Detail,
    Update,
    Create
  };

  return (
    <>
      <CommonPage {...config} />
    </>
  );
};

export default Template;
