import React, { memo } from 'react';

const NCSTitle = (props) => {
  const { title } = props;
  return (
    <div style={{ color: '#078080', fontSize: '16px', paddingLeft: '10px', paddingTop: '5px' }}>
      <strong>{title}</strong>
    </div>
  );
};

export default memo(NCSTitle);
