import React from 'react';
import { Tooltip } from '@material-ui/core';

export default (row, placement = 'top') => {
  const { value } = row || {};
  return (
    <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
      <Tooltip title={value || ''} placement={placement}>
        <span>{value || ''}</span>
      </Tooltip>
    </span>
  );
};
