import React, { memo } from 'react';
import { Grid } from '@material-ui/core';
import dayjs from 'dayjs';
import { MyTextField } from '../../../../components';
import { shortDateFormat } from '../../../../utils/tools';

const Replacehistory = (props) => {
  const { history } = props;
  const { titleStyle, PlaceGridProps, ItemStyle } = props;
  const {
    actionDate,
    assetNoFr,
    caseRef,
    modelCodeFr,
    modelDescFr,
    // networkAppliedFr,
    reason,
    // requestNo,
    respStaff,
    serialNoFr
  } = history;

  return (
    <div>
      <div style={{ ...titleStyle, marginTop: '1rem' }}>
        <strong>Equipment Replace Infomation</strong>
      </div>
      <Grid container style={{ flexGrow: 1 }}>
        <Grid {...PlaceGridProps} style={ItemStyle}>
          <MyTextField label="Old Serial No" disabled value={serialNoFr || ''} />
        </Grid>
        <Grid {...PlaceGridProps} style={ItemStyle}>
          <MyTextField label="Old Asset No" disabled value={assetNoFr || ''} />
        </Grid>
        <Grid {...PlaceGridProps} style={ItemStyle}>
          <MyTextField label="Old Desciption" disabled value={modelDescFr || ''} />
        </Grid>
        <Grid {...PlaceGridProps} style={ItemStyle}>
          <MyTextField label="Old Model Code" disabled value={modelCodeFr || ''} />
        </Grid>
        <Grid {...PlaceGridProps} style={ItemStyle}>
          <MyTextField label="Case Reference" disabled value={caseRef || ''} />
        </Grid>
        <Grid item sx={12} sm={9} style={ItemStyle}>
          <MyTextField label="Reason" disabled value={reason || ''} />
        </Grid>
        <Grid item sx={12} sm={6} style={ItemStyle}>
          <MyTextField label="Action By" disabled value={respStaff || ''} />
        </Grid>
        <Grid item sx={12} sm={6} style={ItemStyle}>
          <MyTextField
            label="Action Date"
            disabled
            value={actionDate ? dayjs(actionDate).format(shortDateFormat) : ''}
          />
        </Grid>
      </Grid>
    </div>
  );
};

export default memo(Replacehistory);
