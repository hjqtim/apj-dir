import React from 'react';
import { useGlobalStyles } from '../../../../../style';
import { Main } from './components';

const Create = () => {
  const globalClaess = useGlobalStyles();
  return (
    <div className={globalClaess.pageStyle} style={{ flexDirection: 'row' }}>
      {/* 页面主主体 */}
      <Main />
    </div>
  );
};

export default Create;
