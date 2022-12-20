import React, { memo, useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core';
import ConnectTable from './ConnectTable';
import webdpAPI from '../../../../../api/webdp/webdp';

const useStyles = makeStyles(() => ({
  main: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%'
  },
  table: {
    width: '100%',
    height: '100%'
  }
}));
const ApConnection = (props) => {
  const classes = useStyles();

  const { apList, baseData, setFieldValue, isRefresh } = props;
  const { equipid } = baseData;
  const [selectItem, SetSelectItem] = useState([]);
  const columns = [
    {
      field: 'slotID',
      headerName: 'Slot',
      width: 50,
      hideSortIcons: true
    },
    {
      field: 'portID',
      headerName: 'Port ID',
      minWidth: 80,
      hideSortIcons: true
    },
    {
      field: 'outletId',
      headerName: 'Outlet ID',
      flex: 1,
      minWidth: 200,
      hideSortIcons: true
    },
    {
      field: 'outletStatus',
      headerName: 'Outlet Status',
      flex: 1,
      minWidth: 80,
      hideSortIcons: true
    },
    {
      field: 'apipaddress',
      headerName: 'AP IP Address',
      flex: 1,
      minWidth: 120,
      hideSortIcons: true
    },
    {
      field: 'apstatus',
      headerName: 'AP Status',
      flex: 1,
      minWidth: 80,
      hideSortIcons: true
    },
    {
      field: 'project',
      headerName: 'Project',
      flex: 1,
      minWidth: 120,
      hideSortIcons: true
    }
  ];

  const getAPOutletList = (params) => {
    webdpAPI
      .getWoAPList(params)
      .then((res) => {
        const outletData = res?.data?.data?.data || [];
        setFieldValue('apList', outletData);
      })
      .finally(() => {
        // console.log('apList');
      });
  };

  useEffect(() => {
    getAPOutletList({ equipmentID: equipid });
  }, [equipid, isRefresh]);

  const onRowClick = (record) => {
    const { row } = record;
    if (row.id === selectItem[0]?.id) {
      return;
    }
    SetSelectItem([row]);
  };

  return (
    <div className={classes.main}>
      <ConnectTable
        style={{ width: '100%', height: '100%' }}
        rows={apList}
        columns={columns}
        pageSize={50}
        hideFooter
        autoHeight={false}
        selectItem={selectItem}
        onRowClick={onRowClick}
      />
    </div>
  );
};

export default memo(ApConnection);
