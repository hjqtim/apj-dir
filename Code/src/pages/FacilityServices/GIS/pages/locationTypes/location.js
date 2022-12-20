import React, { useEffect, useState } from 'react';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import api from '../../../../../api/gis';
import DataGrid from '../../../../../components/CommonDataGrid';
import Paper from '../../../../../components/HAPager';
import Loading from '../../../../../components/Loading';
import Header from '../../components/Header';
import LocationToolbar from '../../components/LocationToolbar';

const useStyles = makeStyles(() => ({
  root: {
    flexGrow: 1,
    '& .Mui-odd': {
      backgroundColor: '#f5f5f5',
      '&:hover': {
        backgroundColor: '#ebebeb'
      }
    },
    '& .Mui-even': {
      '&:hover': {
        backgroundColor: '#ebebeb'
      }
    }
  }
}));

export default function Location() {
  const classes = useStyles();
  const [rows, setRows] = useState([]);
  const [pageSize, setPageSize] = useState(10);

  const columns = [
    { field: 'dataset', headerName: 'Dataset', flex: 1, type: 'string' },
    {
      field: 'id',
      headerName: 'ID',
      flex: 1,
      type: 'number',
      renderCell: (params) => params.id
    },
    { field: 'siteCode', headerName: 'Site Code', flex: 1, type: 'string' },
    { field: 'buildingName', headerName: 'Building Name', flex: 1, type: 'string' },
    { field: 'floorName', headerName: 'Floor Name', flex: 1, type: 'string' },
    { field: 'roomName', headerName: 'Room Name', flex: 1, type: 'string' },
    { field: 'erpArea', headerName: 'ERP Area', flex: 1, type: 'string' },
    { field: 'erpLocationCode', headerName: 'ERP Location Code', flex: 1, type: 'string' },
    { field: 'statusName', headerName: 'Status Name', flex: 1, type: 'string' }
  ];

  useEffect(async () => {
    await Loading.show();
    const { data } = await api.api.locationQuery();
    console.log(data);
    const rows = data.map((d) => ({ ...d, dataset: 'Location' }));
    await setRows(rows);
    await Loading.hide();
  }, []);

  return (
    <div className={classes.root}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Header subtitle="Locations" />
        </Grid>
        <Grid item xs={12}>
          <Paper>
            <DataGrid
              columns={columns}
              rows={rows}
              components={{
                Toolbar: () => LocationToolbar()
              }}
              onPageSizeChange={(pageSize) => setPageSize(pageSize)}
              pageSize={pageSize}
            />
          </Paper>
        </Grid>
      </Grid>
    </div>
  );
}
