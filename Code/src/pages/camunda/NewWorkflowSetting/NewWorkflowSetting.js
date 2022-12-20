import React from 'react';
import CommonPage from '../../../components/CommonPage';
import { List, Detail } from './components';
import { L } from '../../../utils/lang';

const parentTitle = L('Workflow');
const title = 'Workflows';

function WorkflowSetting() {
  const props = {
    title,
    parentTitle,
    List,
    Detail
  };
  return (
    <>
      <CommonPage {...props} />
    </>
  );
}

export default WorkflowSetting;
