import React, { useState } from 'react';
import { Grid, makeStyles, Typography, CircularProgress } from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import _ from 'lodash';

import theme from '../../../../utils/theme';
import { HAPaper } from '../../../../components';
import API from '../../../../api/webdp/webdp';
import DataPortList from './DataPortList';
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

export default function CheckDataPortStatus() {
  const classes = useStyles();
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = (values) => {
    const dataPortIds = _.map(values.dataPort, 'value');
    const QueryData = {
      hospital: values?.institution?.hospital || null,
      dataPortIds
    };
    setLoading(true);
    setRows([]);
    API.queryDataPortList(QueryData)
      .then((res) => {
        if (res?.data?.data) {
          const data = res?.data?.data;
          const handleData = Object.keys(data).map((item) => {
            const items = data[item]?.items?.map((val) => ({
              ...val,
              id: Date.now().toString(36) + Math.random().toString(36).substr(2),
              location:
                val.block && val.floor && val.room
                  ? `${val.block} / ${val.floor} / ${val.room}`
                  : ''
            }));
            return { ...data[item], items };
          });
          setRows(handleData);
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
            <SearchIcon style={{ fontSize: '60px' }} />
            <Typography variant="h5" style={{ textAlign: 'center' }}>
              Search ports based on criteria.
            </Typography>
          </div>
        </div>
      )}
    </>
  );
  return (
    <div className={classes.root}>
      <div className={classes.title}>Check Data Port Status</div>
      <Grid container spacing={6}>
        <Grid item xs={12}>
          <Header handleSearch={handleSearch} setRows={setRows} />
          <HAPaper>
            {rows.length > 0 ? <DataPortList rows={rows} setRows={setRows} /> : renderLoading()}
          </HAPaper>
        </Grid>
      </Grid>
    </div>
  );
}
