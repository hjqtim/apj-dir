import React from 'react';
import IconButton from '@material-ui/core/IconButton';
import EditIcon from '@material-ui/icons/Edit';

export default function CustomActions(params, handleEditClick) {
  return (
    <IconButton color="primary" onClick={() => handleEditClick(params)}>
      <EditIcon />
    </IconButton>
  );
}
