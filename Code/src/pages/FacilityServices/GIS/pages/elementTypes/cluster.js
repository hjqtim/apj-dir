import React, { useEffect, useState } from 'react';
import Button from '@material-ui/core/Button';
import Checkbox from '@material-ui/core/Checkbox';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import api from '../../../../../api/gis';
import DataGrid from '../../../../../components/CommonDataGrid';
import Snackbar from '../../../../../components/CommonTip';
import Paper from '../../../../../components/HAPager';
import Loading from '../../../../../components/Loading';
import ElementAction from '../../components/ElementAction';
import ElementToolbar from '../../components/ElementToolbar';
import Header from '../../components/Header';

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

export default function Cluster() {
  const classes = useStyles();
  const [rows, setRows] = useState([]);
  const [method, setMethod] = useState('');
  const [formId, setFormId] = useState('');
  const [formData, setFormData] = useState({ code: '', name: '', active: true });
  const [isFormChanged, setIsFormChanged] = useState(false);
  const [pageSize, setPageSize] = useState(10);

  const columns = [
    { field: 'id', headerName: 'ID', flex: 1, type: 'string' },
    { field: 'code', headerName: 'Code', flex: 1, type: 'string' },
    { field: 'name', headerName: 'Name', flex: 1, type: 'string' },
    { field: 'active', headerName: 'Active', flex: 1, type: 'boolean' },
    { field: 'lastUpdatedBy', headerName: 'Last Updated By', flex: 1, type: 'string' },
    { field: 'lastUpdatedOn', headerName: 'Last Updated On', flex: 1, type: 'dateTime' },
    {
      field: 'actions',
      headerName: 'Actions',
      flex: 1,
      renderCell: (params) => ElementAction(params, handleEditClick),
      disableExport: true
    }
  ];

  useEffect(() => {
    Loading.show();
    api.cluster.getAll().then((response) => {
      setRows(response.data);
      Loading.hide();
    });
  }, []);

  const handleAddRecordClick = () => {
    setMethod('Add');
  };

  const handleEditClick = (params) => {
    Loading.show();
    setMethod('Edit');
    api.cluster
      .getById(params.id)
      .then((response) => {
        setFormId(response.data.id);
        setFormData({
          code: response.data.code,
          name: response.data.name,
          active: response.data.active
        });
        Loading.hide();
      })
      .catch((error) => {
        const newRows = JSON.parse(JSON.stringify(rows)).filter((row) => row.id !== params.id);
        setRows(newRows);
        closeForm();
        Loading.hide();
        Snackbar.showtip({
          severity: 'error',
          msg: `${error.data.message} (${error.data.status})`
        });
      });
  };

  const handleFormSubmit = (event) => {
    event.preventDefault();

    if (method === 'Add') {
      Loading.show();
      api.cluster
        .create(formId, formData)
        .then((response) => {
          const newRows = JSON.parse(JSON.stringify(rows));
          newRows.push(response.data);
          setRows(newRows);
          closeForm();
          Loading.hide();
          Snackbar.showtip({ severity: 'success', msg: 'A cluster has been created successfully' });
        })
        .catch((error) => {
          Loading.hide();
          Snackbar.showtip({
            severity: 'error',
            msg: `${error.data.message} (${error.data.status})`
          });
        });
    }

    if (method === 'Edit') {
      Loading.show();
      api.cluster
        .update(formId, formData)
        .then((response) => {
          const newRows = JSON.parse(JSON.stringify(rows));
          const index = newRows.findIndex((row) => row.id === formId);
          newRows.splice(index, 1, response.data);
          setRows(newRows);
          closeForm();
          Loading.hide();
          Snackbar.showtip({
            severity: 'success',
            msg: 'The cluster has been updated successfully'
          });
        })
        .catch((error) => {
          Loading.hide();
          Snackbar.showtip({
            severity: 'error',
            msg: `${error.data.message} (${error.data.status})`
          });
        });
    }
  };

  const handleFormClose = () => {
    closeForm();
  };

  const closeForm = () => {
    setMethod('');
    setFormId('');
    setFormData({ code: '', name: '', active: true });
    setIsFormChanged(false);
  };

  return (
    <>
      {/* Form View */}
      <Dialog fullWidth onClose={handleFormClose} open={method !== ''}>
        <form onSubmit={handleFormSubmit}>
          <DialogTitle>{method} a Cluster</DialogTitle>
          <DialogContent>
            <Grid container spacing={3}>
              <Grid item xs={6}>
                <TextField
                  color="primary"
                  disabled={method === 'Edit'}
                  fullWidth
                  id="cluster-id"
                  label="ID"
                  onChange={(event) => {
                    setFormId(event.target.value);
                    setIsFormChanged(true);
                  }}
                  required
                  size="small"
                  value={formId}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={6}>
                {/* Grid Break */}
              </Grid>
              {/* Details */}
              <Grid item xs={12}>
                <Typography gutterBottom variant="subtitle1">
                  <strong>Cluster Information</strong>
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <TextField
                  color="primary"
                  fullWidth
                  id="cluster-code"
                  label="Code"
                  onChange={(event) => {
                    setFormData((prevState) => ({ ...prevState, code: event.target.value }));
                    setIsFormChanged(true);
                  }}
                  required
                  size="small"
                  value={formData.code}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  color="primary"
                  fullWidth
                  id="cluster-name"
                  label="Name"
                  onChange={(event) => {
                    setFormData((prevState) => ({ ...prevState, name: event.target.value }));
                    setIsFormChanged(true);
                  }}
                  required
                  size="small"
                  value={formData.name}
                  variant="outlined"
                />
              </Grid>
              <br />
              {/* Status */}
              <Grid item xs={12}>
                <Typography gutterBottom variant="subtitle1">
                  <strong>Status</strong>
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formData.active}
                      color="primary"
                      onChange={(event) => {
                        setFormData((prevState) => ({
                          ...prevState,
                          active: event.target.checked
                        }));
                        setIsFormChanged(true);
                      }}
                    />
                  }
                  label="Active"
                  labelPlacement="start"
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button type="submit" color="primary" disabled={!isFormChanged}>
              Submit
            </Button>
            <Button color="primary" onClick={handleFormClose}>
              Cancel
            </Button>
          </DialogActions>
        </form>
      </Dialog>
      {/* Main View */}
      <div className={classes.root}>
        <Grid container spacing={3}>
          {/* Element Header */}
          <Grid item xs={12}>
            <Header subtitle="Clusters" />
          </Grid>
          {/* Data Grid */}
          <Grid item xs={12}>
            <Paper>
              <DataGrid
                columns={columns}
                rows={rows}
                components={{
                  Toolbar: () => ElementToolbar(handleAddRecordClick)
                }}
                onPageSizeChange={(pageSize) => setPageSize(pageSize)}
                pageSize={pageSize}
              />
            </Paper>
          </Grid>
        </Grid>
      </div>
    </>
  );
}
