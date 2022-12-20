import React, { memo } from 'react';
import { Grid, Tooltip } from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';

import { MyTextField } from '../../../../components';

const ItemStyle = {
  padding: '5px'
};

const EquipmentLocation = (props) => {
  const {
    closet = {},
    cabinetid,
    powerBarId,
    cabinets = [],
    cabinetPowerList = [],
    setFieldValue,
    sequence,
    getCabinetPower
  } = props;

  const { closetid, hospital, block, floor, room } = closet;

  const cabinetsList = cabinets.map((item) => item.cabinetId);

  const cabinetPowerListMap = cabinetPowerList.map((item) => item.powerBarId);

  return (
    <div>
      <div style={{ color: '#078080', fontSize: '16px', paddingLeft: '4px' }}>
        <strong>Location</strong>
      </div>

      <Grid container>
        <Grid item xs={6} container>
          <Grid item xs={12} style={ItemStyle}>
            <MyTextField label="Closet ID" value={closetid || ''} disabled />
          </Grid>

          <Grid item xs={6} style={ItemStyle}>
            <MyTextField label="Institution" value={hospital || ''} disabled />
          </Grid>

          <Grid item xs={6} style={ItemStyle}>
            <MyTextField label="Block" value={block || ''} disabled />
          </Grid>
        </Grid>

        <Grid item xs={6} container>
          <Grid item xs={3} style={ItemStyle}>
            <Autocomplete
              options={cabinetsList}
              value={cabinetid || ''}
              onChange={(e, v) => {
                setFieldValue('baseData.cabinetid', v || '');

                setFieldValue('baseData.powerBarId', '');
                setFieldValue('cabinetPowerList', []);

                if (v) {
                  getCabinetPower(closetid, v);
                }
              }}
              renderInput={(inputParams) => <MyTextField {...inputParams} label="Cabinet" />}
            />
          </Grid>

          <Grid item xs={3} style={ItemStyle}>
            <MyTextField
              label="Pos. (U)"
              value={sequence ?? ''}
              onChange={(e) => {
                const { value } = e.target;
                if (/^[\d]*$/.test(value)) {
                  setFieldValue('baseData.sequence', value);
                }
              }}
            />
          </Grid>

          <Grid item xs={6} style={ItemStyle}>
            <Autocomplete
              options={cabinetPowerListMap}
              value={powerBarId || ''}
              onChange={(e, v) => {
                setFieldValue('baseData.powerBarId', v || '');
              }}
              renderInput={(inputParams) => <MyTextField {...inputParams} label="Pw Unit" />}
            />
          </Grid>

          <Grid item xs={3} style={ItemStyle}>
            <MyTextField label="Floor" value={floor || ''} disabled />
          </Grid>

          <Grid item xs={9} style={ItemStyle}>
            <Tooltip title={room || ''} placement="top">
              <span>
                <MyTextField label="Room" value={room || ''} disabled />
              </span>
            </Tooltip>
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
};

export default memo(EquipmentLocation);
