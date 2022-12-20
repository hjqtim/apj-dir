import React, { memo } from 'react';
import { Grid, Tooltip } from '@material-ui/core';
import dayjs from 'dayjs';
import { MyTextField, HAKeyboardDatePicker } from '../../../../components';
import { shortDateFormat } from '../../../../utils/tools';

const EquipmentInfo = (props) => {
  const { baseData = {}, maintenance = {}, handleChange } = props;
  const {
    equipid,
    modelCode,
    modeldesc,
    // panelid,
    serialNo,
    haEquipId,
    // portQty,
    curVer,
    nxBtVer,
    ipAddress,
    unitNo,
    defGateway,
    subnetMask,
    assetNo,
    blockDHCP,
    itemOwner,
    // reqno,
    acceptancedate,
    configFile,
    status,
    networkApplied,
    remark,
    // id,
    deliveryDate,
    deliveryNoteReceviedDate
  } = baseData;
  const { maintID, maintVendor, serviceHour, telNo, expiryDate } = maintenance;
  const { ItemStyle, GridProps, ItemProps } = props;
  return (
    <div>
      <Grid container>
        <Grid {...GridProps}>
          <Grid {...ItemProps} style={ItemStyle}>
            <MyTextField label="Ref. ID" disabled value={equipid || ''} />
          </Grid>

          <Grid {...ItemProps} style={ItemStyle}>
            <MyTextField label="Model Code" disabled value={modelCode || ''} />
          </Grid>

          <Grid {...ItemProps} style={ItemStyle}>
            <MyTextField label="Description" disabled value={modeldesc || ''} multiline rows={4} />
          </Grid>

          <Grid {...ItemProps} style={ItemStyle}>
            <MyTextField label="Serial No" disabled value={serialNo || ''} />
          </Grid>

          <Grid {...ItemProps} style={ItemStyle} container>
            <Grid item xs={6} style={{ paddingRight: '5px' }}>
              <MyTextField label="HA Equip ID" disabled value={haEquipId || ''} />
            </Grid>
            <Grid item xs={6} style={{ paddingLeft: '5px' }}>
              <MyTextField label="Asset No" disabled value={assetNo || ''} />
            </Grid>
          </Grid>
        </Grid>

        <Grid {...GridProps}>
          <Grid {...ItemProps} style={ItemStyle}>
            <MyTextField label="IP Address" value={ipAddress || ''} disabled />
          </Grid>

          <Grid {...ItemProps} style={ItemStyle}>
            <MyTextField label="Unit No" value={unitNo || ''} disabled />
          </Grid>

          <Grid {...ItemProps} style={ItemStyle}>
            <MyTextField label="Gateway" value={defGateway || ''} disabled />
          </Grid>

          <Grid {...ItemProps} style={ItemStyle}>
            {/* <Autocomplete
      options={subnetList}
      value={subnetMask || ''}
      onChange={(e, v) => {
        setFieldValue('baseData.subnetMask', v || '');
      }}
      renderInput={(inputParams) => <MyTextField {...inputParams} label="Subnet" />}
    /> */}
            <MyTextField
              label="Subnet"
              value={subnetMask || ''}
              name="subnetMask"
              onChange={handleChange}
              disabled
            />
          </Grid>

          <Grid {...ItemProps} style={ItemStyle}>
            <MyTextField
              label="Current Firmware Version"
              value={curVer || ''}
              name="baseData.curVer"
              onChange={handleChange}
              disabled
            />
          </Grid>

          <Grid {...ItemProps} style={ItemStyle}>
            <MyTextField
              label="Next Boot Firmware Version"
              value={nxBtVer || ''}
              name="baseData.nxBtVer"
              onChange={handleChange}
              disabled
            />
          </Grid>
        </Grid>

        <Grid {...GridProps}>
          <Grid {...ItemProps} style={ItemStyle}>
            {/* <Autocomplete
      options={equipStatusList}
      value={status || ''}
      onChange={(e, v) => {
        setFieldValue('baseData.status', v || '');
      }}
      renderInput={(inputParams) => <MyTextField {...inputParams} label="Status" />}
    /> */}
            <MyTextField
              label="Status"
              value={status || ''}
              name="status"
              onChange={handleChange}
              disabled
            />
          </Grid>

          <Grid {...ItemProps} style={ItemStyle}>
            {/* <Autocomplete
      options={appliedList}
      getOptionLabel={(option) => option.description}
      value={getNetworkAppliedVal()}
      onChange={(e, v) => {
        setFieldValue('baseData.networkApplied', v?.optionValue || '');
      }}
      renderInput={(inputParams) => (
        <MyTextField {...inputParams} label="Network Applied" />
      )}
    /> */}
            <MyTextField
              label="Network Applied"
              value={networkApplied || ''}
              name="networkApplied"
              onChange={handleChange}
              disabled
            />
          </Grid>

          <Grid {...ItemProps} style={ItemStyle}>
            {/* <Autocomplete
      options={dhcpList}
      value={blockDHCP || ''}
      onChange={(e, v) => {
        setFieldValue('baseData.blockDHCP', v || '');
      }}
      renderInput={(inputParams) => <MyTextField {...inputParams} label="DHCP Snooping" />}
    /> */}
            <MyTextField
              label="DHCP Snooping"
              value={blockDHCP || ''}
              name="blockDHCP"
              onChange={handleChange}
              disabled
            />
          </Grid>

          <Grid {...ItemProps} style={ItemStyle}>
            <MyTextField
              label="DOB"
              disabled
              value={acceptancedate ? dayjs(acceptancedate).format(shortDateFormat) : ''}
            />
          </Grid>

          <Grid {...ItemProps} style={ItemStyle}>
            <HAKeyboardDatePicker label="Delivery Date" value={deliveryDate || null} disabled />
          </Grid>

          <Grid {...ItemProps} style={ItemStyle}>
            <HAKeyboardDatePicker
              label="Delivery Note Received Date"
              value={deliveryNoteReceviedDate || null}
              disabled
            />
          </Grid>
        </Grid>

        <Grid {...GridProps}>
          <Grid {...ItemProps} style={ItemStyle}>
            <MyTextField label="MaintID" disabled value={maintID || ''} />
          </Grid>

          <Grid {...ItemProps} style={ItemStyle}>
            <MyTextField label="Maint. Vendor" disabled value={maintVendor || ''} />
          </Grid>

          <Grid {...ItemProps} style={ItemStyle}>
            <MyTextField label="Service Hour" disabled value={serviceHour || ''} />
          </Grid>

          <Grid {...ItemProps} style={ItemStyle}>
            <MyTextField label="Tel No" disabled value={telNo || ''} />
          </Grid>

          <Grid {...ItemProps} style={ItemStyle}>
            <MyTextField label="Expiry Date" disabled value={expiryDate || ''} />
          </Grid>

          <Grid {...ItemProps} style={ItemStyle}>
            <Tooltip title={configFile || ''} placement="top">
              <span>
                <MyTextField label="Config File" value={configFile || ''} disabled />
              </span>
            </Tooltip>
          </Grid>
        </Grid>

        <Grid item container xs={12}>
          <Grid {...GridProps}>
            <Grid {...ItemProps} style={ItemStyle}>
              <MyTextField label="Item Owner" disabled value={itemOwner || ''} />
            </Grid>
          </Grid>
          <Grid item style={{ ...ItemStyle, flex: 1 }}>
            <MyTextField
              label="Remark"
              value={remark || ''}
              name="baseData.remark"
              onChange={handleChange}
              disabled
            />
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
};

export default memo(EquipmentInfo);
