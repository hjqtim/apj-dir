import React, { memo, useMemo } from 'react';
import { Grid, Button, Tooltip } from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';
import { DeleteOutlineOutlined, CloudUploadOutlined, GetAppOutlined } from '@material-ui/icons';
import dayjs from 'dayjs';
import { MyTextField, HAKeyboardDatePicker } from '../../../../components';
import TypeEnum from './TypeEnum';
import { shortDateFormat } from '../../../../utils/tools';
import webdpAPI from '../../../../api/webdp/webdp';
import downBySharedDisk from '../../../../utils/downBySharedDisk';

const subnetList = [
  '255.255.255.0',
  '255.255.255.128',
  '255.255.255.192',
  '255.255.255.224',
  '255.255.255.240',
  '255.255.255.248',
  '255.255.255.252',
  '255.255.0.0'
];

const EquipmentBase = (props) => {
  const {
    setFieldValue,
    baseData = {},
    maintenance = {},
    statusList = [],
    handleChange,
    handleSave
  } = props;
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
    id,
    deliveryDate,
    deliveryNoteReceviedDate
  } = baseData;

  const { maintID, maintVendor, serviceHour, telNo, expiryDate } = maintenance;

  const GridProps = {
    xs: 12,
    sm: 6,
    md: 4,
    lg: 3,
    item: true,
    container: true
  };

  const ItemProps = {
    item: true,
    xs: 12
  };

  const ItemStyle = {
    padding: '5px'
  };

  // replace, relocate, history 按钮点击事件
  const handleClick = (val) => {
    setFieldValue('history.type', val);
  };

  const dhcpList = useMemo(
    () =>
      statusList
        .filter((item) => item.optionType === 'BlockDHCP')
        .map((mapItem) => mapItem.optionValue),
    [statusList]
  );

  const equipStatusList = useMemo(
    () =>
      statusList
        .filter((item) => item.optionType === 'EquipStatus')
        .map((mapItem) => mapItem.optionValue),
    [statusList]
  );

  const appliedList = useMemo(
    () => statusList.filter((item) => item.optionType === 'NetworkApplied'),
    [statusList]
  );

  const getNetworkAppliedVal = () => {
    const hasFind = appliedList.find((item) => item.optionValue === networkApplied);

    if (hasFind) {
      return hasFind;
    }

    if (networkApplied && appliedList.length) {
      return { description: 'Unknown' };
    }

    return null;
  };

  const isNoId = !id;

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
            <MyTextField
              label="IP Address"
              value={ipAddress || ''}
              onChange={(e) => {
                const { value } = e.target;
                if (/^[\d.]*$/.test(value)) {
                  setFieldValue('baseData.ipAddress', value);
                }
              }}
            />
          </Grid>

          <Grid {...ItemProps} style={ItemStyle}>
            <MyTextField
              label="Unit No"
              value={unitNo || ''}
              onChange={(e) => {
                const { value } = e.target;
                if (/^[\d]*$/.test(value) && value.length <= 2) {
                  setFieldValue('baseData.unitNo', value);
                }
              }}
            />
          </Grid>

          <Grid {...ItemProps} style={ItemStyle}>
            <MyTextField
              label="Gateway"
              value={defGateway || ''}
              onChange={(e) => {
                const { value } = e.target;
                if (/^[\d.]*$/.test(value)) {
                  setFieldValue('baseData.defGateway', value);
                }
              }}
            />
          </Grid>

          <Grid {...ItemProps} style={ItemStyle}>
            <Autocomplete
              options={subnetList}
              value={subnetMask || ''}
              onChange={(e, v) => {
                setFieldValue('baseData.subnetMask', v || '');
              }}
              renderInput={(inputParams) => <MyTextField {...inputParams} label="Subnet" />}
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
            <Autocomplete
              options={equipStatusList}
              value={status || ''}
              onChange={(e, v) => {
                setFieldValue('baseData.status', v || '');
              }}
              renderInput={(inputParams) => <MyTextField {...inputParams} label="Status" />}
            />
          </Grid>

          <Grid {...ItemProps} style={ItemStyle}>
            <Autocomplete
              options={appliedList}
              getOptionLabel={(option) => option.description}
              value={getNetworkAppliedVal()}
              onChange={(e, v) => {
                setFieldValue('baseData.networkApplied', v?.optionValue || '');
              }}
              renderInput={(inputParams) => (
                <MyTextField {...inputParams} label="Network Applied" />
              )}
            />
          </Grid>

          <Grid {...ItemProps} style={ItemStyle}>
            <Autocomplete
              options={dhcpList}
              value={blockDHCP || ''}
              onChange={(e, v) => {
                setFieldValue('baseData.blockDHCP', v || '');
              }}
              renderInput={(inputParams) => <MyTextField {...inputParams} label="DHCP Snooping" />}
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
            <HAKeyboardDatePicker
              label="Delivery Date"
              value={deliveryDate || null}
              onChange={(dateVal) => {
                setFieldValue(
                  'baseData.deliveryDate',
                  dateVal ? dayjs(dateVal).format('YYYY-MM-DD 00:00:00') : ''
                );
              }}
            />
          </Grid>

          <Grid {...ItemProps} style={ItemStyle}>
            <HAKeyboardDatePicker
              label="Delivery Note Received Date"
              value={deliveryNoteReceviedDate || null}
              onChange={(dateVal) => {
                setFieldValue(
                  'baseData.deliveryNoteReceviedDate',
                  dateVal ? dayjs(dateVal).format('YYYY-MM-DD 00:00:00') : ''
                );
              }}
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
                <MyTextField
                  label="Config File"
                  value={configFile || ''}
                  InputProps={{
                    endAdornment: (
                      <div style={{ display: isNoId ? 'none' : 'flex' }}>
                        <input
                          style={{ display: 'none' }}
                          id="equip-upload-file"
                          type="file"
                          onChange={(e) => {
                            const formData = new FormData();
                            formData.append('file', e.target.files?.[0]);
                            webdpAPI.ncsUploadFile(formData).then((res) => {
                              const fileUrl = res?.data?.data?.result?.data?.[0]?.fileUrl || '';
                              setFieldValue('baseData.configFile', fileUrl);
                            });
                            e.target.value = '';
                          }}
                        />

                        <label htmlFor="equip-upload-file" style={{ display: 'inherit' }}>
                          <CloudUploadOutlined
                            style={{ cursor: 'pointer', color: '#229FFA' }}
                            fontSize="small"
                          />
                        </label>

                        {Boolean(configFile) && (
                          <>
                            <GetAppOutlined
                              style={{ cursor: 'pointer', color: '#229FFA', margin: '0 5px' }}
                              color="secondary"
                              fontSize="small"
                              onClick={() => downBySharedDisk(configFile)}
                            />

                            <DeleteOutlineOutlined
                              style={{ cursor: 'pointer', color: '#229FFA' }}
                              color="secondary"
                              fontSize="small"
                              onClick={() => setFieldValue('baseData.configFile', '')}
                            />
                          </>
                        )}
                      </div>
                    )
                  }}
                />
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
            />
          </Grid>
        </Grid>

        <Grid item container xs={12} justifyContent="flex-end">
          <Grid item style={ItemStyle}>
            <Button
              variant="outlined"
              color="secondary"
              onClick={() => handleSave()}
              disabled={isNoId}
            >
              Save
            </Button>
          </Grid>

          <Grid item style={ItemStyle}>
            <Button variant="outlined" color="secondary" disabled={isNoId}>
              Report
            </Button>
          </Grid>

          <Grid item style={ItemStyle}>
            <Button variant="outlined" color="secondary" disabled={isNoId}>
              Get Port Connections
            </Button>
          </Grid>

          <Grid item style={ItemStyle}>
            <Button
              variant="outlined"
              color="secondary"
              disabled={isNoId}
              onClick={() => handleClick(TypeEnum.replace)}
            >
              Replace
            </Button>
          </Grid>

          <Grid item style={ItemStyle}>
            <Button
              variant="outlined"
              color="secondary"
              disabled={isNoId}
              onClick={() => handleClick(TypeEnum.relocate)}
            >
              Relocate
            </Button>
          </Grid>

          <Grid item style={ItemStyle}>
            <Button
              variant="outlined"
              color="secondary"
              disabled={isNoId}
              onClick={() => handleClick(TypeEnum.history)}
            >
              History
            </Button>
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
};

export default memo(EquipmentBase);
