import React, { memo, useMemo } from 'react';
import { TextField, Grid, Typography, TableCell, withStyles } from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { useSelector, useDispatch } from 'react-redux';
import ipassignAPI from '../../../../api/ipassign';
import {
  setApproveTouch,
  setApproveListData,
  setBaseData
} from '../../../../redux/IPAdreess/ipaddrActions';
import { useGlobalStyles } from '../../../../style';
import { validIp } from '../../../../utils/tools';

const CellTable = withStyles(() => ({
  root: {
    textAlign: 'center',
    border: '1px solid #fff',
    padding: 5
  }
}))(TableCell);

const IPdetails = (props) => {
  const dispatch = useDispatch();
  const globalClaess = useGlobalStyles();
  const { index, item, isStatic, errors, touches, setIsLoading } = props;
  const ipListSet = useSelector((state) => state.IPAdreess.ipListSet) || {};
  const {
    subnetListAndOneDetail,
    subnetSelected,
    ipAddress,
    ipaddressLast,
    gateway,
    subnetMask,
    bit
  } = item;
  const formStatus = useSelector((state) => state.IPAdreess.formStatus);

  const attr = isStatic ? 'staticIPData' : 'DHCPReservedData';
  const attrTouches = isStatic ? 'staticTouches' : 'reserverTouches';

  const fieldsUpdateHandler = (field, value) => {
    dispatch(setApproveListData({ attr, field, index, value }));
  };

  const fieldsTouchesHandler = (field, index) => {
    dispatch(setApproveTouch({ attr: attrTouches, field, index }));
  };

  const handleBitBlur = (e, ind) => {
    fieldsTouchesHandler('bit', ind);
    const bit = e.target?.value || '';
    if (bit) {
      ipassignAPI.getBit({ bit }).then((res) => {
        const mask = res.data.data?.outlet?.mask || '';
        fieldsUpdateHandler('subnetMask', mask);
      });
    } else {
      fieldsUpdateHandler('subnetMask', '');
    }

    if (bit && subnetSelected) {
      getIpBySubnetAndBit(bit, subnetSelected);
    }
  };

  const getIpBySubnetAndBit = (bit, subnet) => {
    setIsLoading(true);
    ipassignAPI
      .getIpBySubnetAndBit({ bit, subnet, ipType: isStatic ? 'STATIC' : 'DHCP RANGE', ipNum: 1 })
      .then((res) => {
        const canUseIp = res.data.data?.staticIpVoList?.[0]?.canUseIp || '';
        const ipaddressLast = canUseIp?.split('.')?.[3] || '';
        fieldsUpdateHandler('ipaddressLast', ipaddressLast);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const subnetBitValid = (e) => {
    let value = e?.target?.value || '';
    if ((value && /^[0-9]*$/.test(value)) || value === '') {
      value = value !== '' ? Number(value || '') : '';
      value = value === 0 ? 1 : value;
      value = value > 32 ? 32 : value;
      fieldsUpdateHandler('bit', value);
    }
  };

  const subnetSelect = (e, value) => {
    let subnet = value?.split('.') || [];
    subnet.pop();
    subnet = subnet?.join('.') || '';
    fieldsUpdateHandler('subnetSelected', value || '');
    fieldsUpdateHandler('ipAddress', subnet ? `${subnet}.` : '');
    fieldsUpdateHandler('ipaddressLast', '');
    fieldsUpdateHandler('gateway', subnet ? `${subnet}.254` : '');

    if (bit && value) {
      getIpBySubnetAndBit(bit, value);
    }
  };

  const ipAddressChange = (e) => {
    const value = e.target?.value || '';
    if ((value && /^[0-9]*$/.test(value) && value <= 255) || value === '') {
      fieldsUpdateHandler('ipaddressLast', value);
    }
  };

  const checkIp = (ip) => {
    if (validIp(ip) && !Object.prototype.hasOwnProperty.call(ipListSet, ip)) {
      setIsLoading(true);
      ipassignAPI
        .checkIp({ ip })
        .then((res) => {
          if (res?.data?.code === 200) {
            const isExit = res?.data?.data?.result;
            dispatch(setBaseData({ ipListSet: { ...ipListSet, [ip]: isExit } }));
          }
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  };

  const subnetList = useMemo(
    () => subnetListAndOneDetail?.map((item) => item.newSubnet) || [],
    [subnetListAndOneDetail]
  );

  return (
    <>
      <CellTable>{index + 1}</CellTable>
      <CellTable>{item.hospital}</CellTable>
      <CellTable>{item.block}</CellTable>
      <CellTable>{item.floor}</CellTable>
      <CellTable>{item.room}</CellTable>
      <CellTable>{item.isPerm}</CellTable>
      <CellTable>{item.releaseDate}</CellTable>
      <CellTable>{item.dataPortId}</CellTable>
      <CellTable>{item.equpType}</CellTable>
      <CellTable>{item.purpose}</CellTable>
      <CellTable style={{ display: 'table-cell' }} className={globalClaess.tableCelContenMax}>
        {item.remarks}
      </CellTable>
      <CellTable>{item.macAddress}</CellTable>
      <CellTable style={{ paddingTop: 25, minWidth: 140 }}>
        <Autocomplete
          onChange={subnetSelect}
          value={subnetSelected || ''}
          options={subnetList}
          style={{ background: '#fff' }}
          disabled={formStatus === 20 || formStatus === 30}
          onBlur={() => {
            fieldsTouchesHandler('subnetSelected', index);
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              variant="outlined"
              size="small"
              error={Boolean(errors?.subnetSelected) && Boolean(touches?.subnetSelected)}
            />
          )}
        />
      </CellTable>
      <CellTable>
        <TextField
          variant="outlined"
          size="small"
          style={{ width: 50, marginTop: 22, background: '#fff' }}
          disabled={formStatus === 20 || formStatus === 30}
          value={bit}
          onBlur={(e) => handleBitBlur(e, index)}
          onChange={(val) => {
            subnetBitValid(val, index);
          }}
          error={Boolean(errors?.bit) && Boolean(touches?.bit)}
        />
      </CellTable>
      <CellTable>
        <Grid
          container
          spacing={2}
          justifyContent="center"
          style={{ flexWrap: 'nowrap', padding: 5, maxWidth: 450 }}
        >
          <Grid item style={{ minWidth: 131 }}>
            <Typography variant="subtitle2">IP Address</Typography>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
              <Typography>{ipAddress}</Typography>
              &nbsp;
              <TextField
                variant="outlined"
                size="small"
                disabled={formStatus === 20 || formStatus === 30}
                style={{ background: '#fff', width: 90 }}
                value={ipaddressLast || ''}
                onChange={ipAddressChange}
                error={Boolean(errors?.ipaddressLast) && Boolean(touches?.ipaddressLast)}
                onBlur={(e) => {
                  fieldsTouchesHandler('ipaddressLast', index);
                  checkIp(`${ipAddress}${e.target.value}`);
                }}
              />
            </div>
          </Grid>
          <Grid item>
            <Typography variant="subtitle2">Subnet Mask</Typography>
            <TextField
              variant="outlined"
              size="small"
              disabled={formStatus === 20 || formStatus === 30}
              style={{ background: '#fff', minWidth: 130 }}
              value={subnetMask || ''}
              error={Boolean(errors?.subnetMask) && Boolean(touches?.subnetMask)}
              onBlur={() => {
                fieldsTouchesHandler('subnetMask', index);
              }}
              onChange={(e) => {
                if (/^[0-9.]*$/.test(e.target.value)) {
                  fieldsUpdateHandler('subnetMask', e.target.value);
                }
              }}
            />
          </Grid>
          <Grid item>
            <Typography variant="subtitle2">Gateway</Typography>
            <TextField
              variant="outlined"
              size="small"
              disabled={formStatus === 20 || formStatus === 30}
              style={{ background: '#fff', minWidth: 130 }}
              value={gateway || ''}
              error={Boolean(errors?.gateway) && Boolean(touches?.gateway)}
              onBlur={() => {
                fieldsTouchesHandler('gateway', index);
              }}
              onChange={(e) => {
                if (/^[0-9.]*$/.test(e.target.value)) {
                  fieldsUpdateHandler('gateway', e.target.value);
                }
              }}
            />
          </Grid>
        </Grid>
      </CellTable>
    </>
  );
};

export default memo(IPdetails);
