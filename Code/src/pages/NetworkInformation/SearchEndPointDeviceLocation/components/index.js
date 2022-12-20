import React, { useState } from 'react';
import { Grid, makeStyles, Typography, CircularProgress } from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import _ from 'lodash';

import theme from '../../../../utils/theme';
import { HAPaper } from '../../../../components';
import API from '../../../../api/webdp/webdp';
import DataList from './DataList';
import Header from './Header';

const useStyles = makeStyles(() => ({
  root: {
    marginTop: '2em',
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'column'
  },
  title: {
    fontSize: theme.font.important.size,
    lineHeight: theme.font.important.lineHeight,
    fontWeight: 'bolder',
    color: theme.color.sub.mainText
  },
  searchIcon: {
    display: 'flex',
    justifyContent: 'center'
  },
  searchIconContent: {
    height: '60vh',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  }
}));

export default function SearchEndPointDeviceLocation() {
  const classes = useStyles();
  const [loading, setLoading] = useState(false);
  const [allIsNull, setAllIsNull] = useState(true);
  const [data, setData] = useState({});

  // Search
  const handleSearch = (ipOrHostName) => {
    setLoading(true);
    API.getSearchEndPointList(ipOrHostName)
      .then((res) => {
        const resData = res?.data?.data;
        if (resData) {
          setData(resData);
          setAllIsNull(
            _.isNull(resData.location) &&
              _.isNull(resData.searchResult) &&
              _.isNull(resData.deviceConnectionHistory) &&
              _.isNull(resData.administrativeInformation)
          );
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const renderLoading = () => (
    <>
      {loading ? (
        <div className={classes.searchIcon}>
          <div className={classes.searchIconContent}>
            <CircularProgress size={50} />
          </div>
        </div>
      ) : (
        <div className={classes.searchIcon}>
          <div className={classes.searchIconContent}>
            {_.isEmpty(data) && <SearchIcon style={{ fontSize: '60px' }} />}
            <Typography variant="h5" style={{ textAlign: 'center' }}>
              {!_.isEmpty(data)
                ? `No data was found for this condition`
                : `Search ports based on
              criteria.`}
            </Typography>
          </div>
        </div>
      )}
    </>
  );
  return (
    <div className={classes.root}>
      <div className={classes.title}>Search End-Point Device Location</div>
      <Grid container spacing={6}>
        <Grid item xs={12}>
          <Header handleSearch={handleSearch} setData={setData} setAllIsNull={setAllIsNull} />
          <HAPaper style={{ padding: '30px' }}>
            {!allIsNull ? <DataList data={data} /> : renderLoading()}
          </HAPaper>
        </Grid>
      </Grid>
    </div>
  );
}
