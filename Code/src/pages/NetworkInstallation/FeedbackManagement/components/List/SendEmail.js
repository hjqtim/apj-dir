import React, { memo, useState } from 'react';
import { Grid, TextField } from '@material-ui/core';
// import { SaveOutlined } from '@material-ui/icons';
import { Autocomplete } from '@material-ui/lab';
import ReactWEditor from 'wangeditor-for-react';
import CommonDialog from '../../../../../components/CommonDialog';
// import { CommonDataGrid } from '../../../../../components';
// import API from '../../../../../api/webdp/webdp';
// import dataGridTooltip from '../../../../../utils/dataGridTooltip';

const SendEmail = (props) => {
  const { isEmailOpen, setIsEmailOpen } = props;

  const [recipients, setRecipients] = useState([]);
  const [CC, setCC] = useState([]);

  const handleClose = () => {
    setIsEmailOpen(false);
  };

  const handleConfirm = () => {};

  return (
    <>
      <CommonDialog
        title="Send Email"
        content={
          <div style={{ padding: 30 }}>
            <Grid container spacing={4}>
              <Grid item xs={12}>
                <Autocomplete
                  multiple
                  freeSolo
                  value={recipients}
                  options={[]}
                  onChange={(e, val) => {
                    setRecipients(val);
                  }}
                  filterSelectedOptions
                  renderInput={(params) => (
                    <TextField {...params} variant="outlined" label="To" size="small" />
                  )}
                />
              </Grid>

              <Grid item xs={12}>
                <Autocomplete
                  multiple
                  freeSolo
                  value={CC}
                  options={[]}
                  onChange={(e, val) => {
                    setCC(val);
                  }}
                  filterSelectedOptions
                  renderInput={(params) => (
                    <TextField {...params} variant="outlined" label="CC" size="small" />
                  )}
                />
              </Grid>
              <Grid item xs={12}>
                <ReactWEditor
                  // ref={myRef}
                  // defaultValue={defaultValue}
                  // value={defaultValue}
                  // className={classes.reactWEditor}
                  onChange={() => {}}
                />
              </Grid>
            </Grid>
          </div>
        }
        open={isEmailOpen}
        maxWidth="md"
        handleClose={handleClose}
        isHideFooter={false}
        handleConfirm={handleConfirm}
      />
    </>
  );
};

export default memo(SendEmail);
