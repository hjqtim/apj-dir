import React from 'react';
import CommonPage from '../../../components/CommonPage';
import { List, Detail, Update, Create } from './components';
import { L } from '../../../utils/lang';

const parentTitle = L('Allocation');
const title = "Tenant's Quota";

function TenantQuotaMapping() {
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

export default TenantQuotaMapping;
