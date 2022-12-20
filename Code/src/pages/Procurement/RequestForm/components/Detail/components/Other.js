import React from 'react';

import { TextField } from '@material-ui/core';

const Other = () => {
  console.log('Other');
  return (
    <>
      <TextField
        id="outlined-multiline-static"
        multiline
        variant="outlined"
        rows={10}
        fullWidth
        margin="normal"
      />
    </>
  );
};

export default Other;
