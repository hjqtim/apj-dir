import React, { memo, useCallback, useState } from 'react';
import { Grid } from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';
import _ from 'lodash';
import { stringify } from 'qs';
import { useHistory } from 'react-router-dom';
import { MyTextField } from '../../../../components';
import webdpAPI from '../../../../api/webdp/webdp';

const Filter = (props) => {
  const history = useHistory();
  const { filterData = {}, setFieldValue, getDetailData } = props;
  const [equipLoading, setEquipLoading] = useState(false);
  const [assetNoLoading, setAssetNoLoading] = useState(false);
  const [serialLoading, setSerialLoading] = useState(false);
  const [ipAddressLoading, setIpAddressLoading] = useState(false);
  const {
    equipFilterList = [],
    equipObj,
    assetNoFilterList = [],
    assetNoObj,
    serialFilterList = [],
    serialObj,
    ipAddressFilterList = [],
    ipAddressObj
  } = filterData;

  const getEquipOptions = useCallback(
    _.debounce((inputValue) => {
      if (inputValue?.length >= 5) {
        setEquipLoading(true);
        setFieldValue('filterData.equipFilterList', []);

        webdpAPI
          .getEquipmentFilterList({ equipId: inputValue })
          .then((res) => {
            setFieldValue('filterData.equipFilterList', res?.data?.data?.data || []);
          })
          .finally(() => {
            setEquipLoading(false);
          });
      }
    }, 800),
    []
  );

  const getAssetNoOptions = useCallback(
    _.debounce((inputValue) => {
      if (inputValue?.length >= 4) {
        setAssetNoLoading(true);
        setFieldValue('filterData.assetNoFilterList', []);

        webdpAPI
          .getEquipmentFilterList({ assetNo: inputValue })
          .then((res) => {
            setFieldValue('filterData.assetNoFilterList', res?.data?.data?.data || []);
          })
          .finally(() => {
            setAssetNoLoading(false);
          });
      }
    }, 800),
    []
  );

  const getSerialOptions = useCallback(
    _.debounce((inputValue) => {
      if (inputValue?.length >= 5) {
        setSerialLoading(true);
        setFieldValue('filterData.serialFilterList', []);

        webdpAPI
          .getEquipmentFilterList({ serialNo: inputValue })
          .then((res) => {
            setFieldValue('filterData.serialFilterList', res?.data?.data?.data || []);
          })
          .finally(() => {
            setSerialLoading(false);
          });
      }
    }, 800),
    []
  );

  const getIpAddressOptions = useCallback(
    _.debounce((inputValue) => {
      if (inputValue?.length >= 6) {
        setIpAddressLoading(true);
        setFieldValue('filterData.ipAddressFilterList', []);

        webdpAPI
          .getEquipmentFilterList({ ipAddress: inputValue })
          .then((res) => {
            setFieldValue('filterData.ipAddressFilterList', res?.data?.data?.data || []);
          })
          .finally(() => {
            setIpAddressLoading(false);
          });
      }
    }, 800),
    []
  );

  // 将参数放在url
  const handleUrl = (field, value) => {
    const newParams = {
      [field]: value || ''
    };

    if (value) {
      getDetailData(newParams);
    }

    const url = `?${stringify(newParams)}`;
    history.replace(url);
  };

  return (
    <div style={{ paddingTop: '10px' }}>
      <Grid container spacing={2}>
        <Grid item xs={3}>
          <Autocomplete
            options={equipFilterList}
            value={equipObj}
            onChange={(e, v) => {
              setFieldValue('filterData.equipObj', v);

              setFieldValue('filterData.assetNoObj', null);
              setFieldValue('filterData.serialObj', null);
              setFieldValue('filterData.ipAddressObj', null);
              handleUrl('equipId', v?.equipId);
            }}
            loading={equipLoading}
            getOptionLabel={(option) => option.equipId}
            renderInput={(inputParams) => (
              <MyTextField
                {...inputParams}
                label="Ref. ID"
                onChange={(e) => {
                  getEquipOptions(e.target.value);
                }}
              />
            )}
          />
        </Grid>

        <Grid item xs={3}>
          <Autocomplete
            value={assetNoObj}
            options={assetNoFilterList}
            loading={assetNoLoading}
            getOptionLabel={(option) => option.assetNo}
            onChange={(e, v) => {
              setFieldValue('filterData.assetNoObj', v);

              setFieldValue('filterData.equipObj', null);
              setFieldValue('filterData.serialObj', null);
              setFieldValue('filterData.ipAddressObj', null);
              handleUrl('assetNo', v?.assetNo);
            }}
            renderInput={(inputParams) => (
              <MyTextField
                {...inputParams}
                label="Asset No"
                onChange={(e) => {
                  getAssetNoOptions(e.target.value);
                }}
              />
            )}
          />
        </Grid>

        <Grid item xs={3}>
          <Autocomplete
            options={ipAddressFilterList}
            value={ipAddressObj}
            loading={ipAddressLoading}
            onChange={(e, v) => {
              setFieldValue('filterData.ipAddressObj', v);

              setFieldValue('filterData.equipObj', null);
              setFieldValue('filterData.assetNoObj', null);
              setFieldValue('filterData.serialObj', null);
              handleUrl('ipAddress', v?.ipAddress);
            }}
            getOptionLabel={(option) =>
              `${option.ipAddress} ${option.unitNo ? `U ${option.unitNo}` : ''}---${option.equipId}`
            }
            renderInput={(inputParams) => (
              <MyTextField
                {...inputParams}
                label="IP Address"
                onChange={(e) => {
                  getIpAddressOptions(e.target.value);
                }}
              />
            )}
          />
        </Grid>

        <Grid item xs={3}>
          <Autocomplete
            options={serialFilterList}
            value={serialObj}
            onChange={(e, v) => {
              setFieldValue('filterData.serialObj', v);

              setFieldValue('filterData.equipObj', null);
              setFieldValue('filterData.assetNoObj', null);
              setFieldValue('filterData.ipAddressObj', null);
              handleUrl('serialNo', v?.serialNo);
            }}
            loading={serialLoading}
            getOptionLabel={(option) => `${option.serialNo}---${option.modelDesc}`}
            renderInput={(inputParams) => (
              <MyTextField
                {...inputParams}
                label="S/N"
                onChange={(e) => {
                  getSerialOptions(e.target.value);
                }}
              />
            )}
          />
        </Grid>
      </Grid>
    </div>
  );
};

export default memo(Filter);
