import React, { memo } from 'react';
import { Grid, FormControl, Select, MenuItem } from '@material-ui/core';
import dayjs from 'dayjs';
import FormControlProps from '../../../../models/webdp/PropsModels/FormControlProps';

import { HAKeyboardDatePicker } from '../../../../components';

const ReleaseDate = ({ releaseDate, ipListType, setFieldValue, isRequest }) => (
  <Grid container spacing={3}>
    <Grid {...FormControlProps} xs={6}>
      <HAKeyboardDatePicker
        label="Release Date"
        value={releaseDate}
        name="releaseDate"
        minDate={dayjs(new Date()).format('YYYY-MM-DD')}
        onChange={(date) => {
          setFieldValue('releaseDate', date);
        }}
        disabled={!isRequest}
      />
    </Grid>
    <Grid {...FormControlProps} xs={6}>
      <FormControl fullWidth size="small" variant="outlined">
        <Select
          disabled={!isRequest}
          value={Number(ipListType)}
          onChange={(e, value) => {
            setFieldValue('ipListType', Number(value.props.value));
          }}
        >
          <MenuItem value={1}>Raised to me</MenuItem>
          <MenuItem value={0}>Raised to my team</MenuItem>
        </Select>
      </FormControl>
    </Grid>
  </Grid>
);

export default memo(ReleaseDate);
