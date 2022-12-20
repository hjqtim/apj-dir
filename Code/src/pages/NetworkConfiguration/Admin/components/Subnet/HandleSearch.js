import React, { useState, useMemo } from 'react';
import { Grid, Button, TextField } from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import SearchIcon from '@material-ui/icons/Search';
import RestoreIcon from '@material-ui/icons/Restore';
import webAPI from '../../../../../api/webdp/webdp';
import ActionLogs from '../ActionLogs';

const HandleSearch = ({
  params,
  setParams,
  hospitalList,
  hospitalLoading,
  listLoading,
  getListPage
}) => {
  const [drawerOpen, setDrawerOpen] = useState(false);

  const [blockLoading, setBlockLoading] = useState(false);
  const [blockOptions, setBlockOptions] = useState([]);

  const [floorLoading, setFloorLoading] = useState(false);
  const [floorOptions, setFloorOptions] = useState([]);

  const getBlockList = (hospital) => {
    setBlockLoading(true);
    webAPI
      .getBlockByHospCodeList(hospital)
      .then((blockResult) => {
        let blockList = blockResult?.data?.data?.blockByHospCodeList || [];
        blockList = blockList.map((item) => item.block);
        setBlockOptions(blockList);
      })
      .finally(() => {
        setBlockLoading(false);
      });
  };

  const getFloorList = (block) => {
    setFloorLoading(true);
    webAPI
      .getBlockAndFloorByHospCodeList({
        hospCode: params.hospital,
        block
      })
      .then((blockResult) => {
        let floorList = blockResult?.data?.data?.blockAndFloorByHospCodeList || [];
        floorList = floorList.map((item) => item.floor);
        setFloorOptions(floorList);
      })
      .finally(() => {
        setFloorLoading(false);
      });
  };

  const hospitalVal = useMemo(
    () => hospitalList?.find((item) => item.hospital === params.hospital),
    [hospitalList, params.hospital]
  );

  const btnPros = {
    variant: 'contained',
    color: 'primary',
    style: { marginLeft: '1em', marginBottom: '0.5em' }
  };
  return (
    <>
      <Grid container spacing={3} style={{ alignItems: 'flex-end' }}>
        <Grid item xs={12} sm={6} md={2}>
          <Autocomplete
            onChange={(e, value) => {
              if (value) {
                getBlockList(value?.hospital);
              }
              setParams({
                ...params,
                hospital: value?.hospital || '',
                block: '',
                floor: ''
              });
              setFloorOptions([]);
              setBlockOptions([]);
            }}
            loading={hospitalLoading}
            name="hospital"
            value={hospitalVal || null}
            options={hospitalList || []}
            getOptionLabel={(option) => `${option.hospital}---${option.hospitalName}`}
            renderInput={(params) => <TextField {...params} label="Institution" />}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={2}>
          <Autocomplete
            onChange={(e, block) => {
              getFloorList(block);
              setParams({ ...params, block: block || '', floor: '' });
              setFloorOptions([]);
            }}
            value={params.block || ''}
            options={blockOptions || []}
            loading={blockLoading}
            renderInput={(params) => <TextField {...params} label="Block" />}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={2}>
          <Autocomplete
            onChange={(e, floor) => {
              setParams({ ...params, floor: floor || '' });
            }}
            name="floor"
            value={params.floor || ''}
            options={floorOptions || []}
            loading={floorLoading}
            renderInput={(params) => <TextField {...params} label="Floor" />}
          />
        </Grid>
        <Grid item sm={12} md={6}>
          <Button
            {...btnPros}
            disabled={listLoading}
            startIcon={<SearchIcon />}
            onClick={() => {
              getListPage({
                hospital: params?.hospital || undefined,
                block: params?.block || undefined,
                floor: params?.floor || undefined
              });
            }}
          >
            Search
          </Button>
          <Button {...btnPros} startIcon={<RestoreIcon />} onClick={() => setDrawerOpen(true)}>
            Action Log
          </Button>
        </Grid>

        <ActionLogs {...{ drawerOpen, setDrawerOpen, module: 'subnetList' }} />
      </Grid>
    </>
  );
};

export default HandleSearch;
