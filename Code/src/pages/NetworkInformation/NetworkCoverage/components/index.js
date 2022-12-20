import React, { useState } from 'react';
import { makeStyles, Typography, CircularProgress } from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import { HAPaper } from '../../../../components';
import API from '../../../../api/webdp/webdp';
import { useGlobalStyles } from '../../../../style';
import theme from '../../../../utils/theme';
import Header from './Header';
import DataList from './DataList';

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

const Index = () => {
  const globalClasses = useGlobalStyles();
  const classes = useStyles();
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isSearched, setIsSearched] = useState(false);
  const [params, setParams] = useState({
    pageIndex: 1,
    pageSize: 10,
    hospital: '',
    block: '',
    floor: ''
  });

  const getNetworkCoverages = (params) => {
    setLoading(true);
    setIsSearched(true);
    API.getNetworkCoverage(params)
      .then((res) => {
        const resData = res?.data?.data?.networkCoverage || [];
        const newData = resData.map((item) => ({
          ...item,
          id: Date.now().toString(36) + Math.random().toString(36).substr(2)
        }));
        setRows(newData);
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
              {rows?.length === 0 && isSearched
                ? `No data was found for this condition`
                : ` Search based on criteria.`}
            </Typography>
          </div>
        </div>
      )}
    </>
  );

  return (
    <>
      <div className={globalClasses.subTitle}>Network Coverage </div>
      <Header
        params={params}
        setRows={setRows}
        setParams={setParams}
        setIsSearched={setIsSearched}
        getNetworkCoverages={getNetworkCoverages}
      />
      <HAPaper style={{ padding: '20px' }}>
        {rows.length > 0 ? (
          <DataList rows={rows} params={params} setParams={setParams} />
        ) : (
          renderLoading()
        )}
      </HAPaper>
    </>
  );
};

export default Index;
