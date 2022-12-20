import React, { memo } from 'react';
import TopDrawerBox from './TopDrawerBox';

const HeadSearch = (props) => {
  const { eventFilter, getExcelUrlDownLoad, getActionLogPage } = props;
  return (
    <>
      {/* <div style={{ marginLeft: 240, position: 'fixed' }}> */}
      <div style={{ marginBottom: 30 }}>
        <TopDrawerBox
          eventFilter={eventFilter}
          getExcelUrlDownLoad={getExcelUrlDownLoad}
          getActionLogPage={getActionLogPage}
        />
      </div>
    </>
  );
};
export default memo(HeadSearch);
