import React, { memo } from 'react';
import List from './List';

const PackageList = () => {
  console.log('Meeting List');
  return (
    <>
      <div>
        <List />
      </div>
    </>
  );
};

export default memo(PackageList);
