import React, { useState } from 'react';
import { Grid, Button, TextField, makeStyles } from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';
import CheckIcon from '@material-ui/icons/Check';
import RestoreIcon from '@material-ui/icons/Restore';
import UndoIcon from '@material-ui/icons/Undo';
import SearchIcon from '@material-ui/icons/Search';
import { WarningDialog } from '../../../../components';
import ActionLogs from '../../../rms/Preparation/components/ActionLogs/index';

const useStyles = makeStyles((theme) => ({
  btnStyle: {
    marginLeft: theme.spacing(4)
  }
}));

const FTXButton = (props) => {
  const { undoLast, cancelChange, searchCondition, setParams, editRow, stepRow } = props;
  const classes = useStyles();
  const [fiscalYear, setFiscalYear] = useState();
  const [openCancel, setOpenCancel] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const statusList = [
    { values: 1920, label: '1920' },
    { values: 2021, label: '2021' },
    { values: 2122, label: '2122' },
    { values: 2223, label: '2223' }
  ];

  const handleSearch = () => {
    searchCondition(fiscalYear);
    setParams({ page: 1, pageSize: 10 });
  };

  const handleCancel = () => {
    if (editRow?.length !== 0) {
      cancelChange();
    }
    setOpenCancel(false);
  };

  const commonProps = { item: true, xs: 12, md: 6, lg: 6 };
  return (
    <>
      <Grid container>
        <Grid {...commonProps}>
          <Grid container>
            <Grid item xs={4} md={4} lg={4} style={{ marginTop: -10 }}>
              <Autocomplete
                id="fiscalYear"
                options={statusList}
                getOptionLabel={(option) => `${option.label}`}
                onChange={(e, data) => {
                  if (data === null) {
                    setFiscalYear(undefined);
                  } else {
                    const fiscalYear = data.values;
                    setFiscalYear(fiscalYear.toString());
                  }
                }}
                renderInput={(inputParams) => <TextField {...inputParams} label="Fiscal Year" />}
              />
            </Grid>
            <Grid item xs={6} md={8} lg={8}>
              <Button
                variant="contained"
                color="primary"
                className={classes.btnStyle}
                startIcon={<SearchIcon />}
                onClick={handleSearch}
              >
                Search
              </Button>
            </Grid>
          </Grid>
        </Grid>

        <Grid {...commonProps}>
          <Grid container justifyContent="flex-end">
            <Button
              variant="contained"
              color="primary"
              startIcon={<CheckIcon />}
              onClick={() => setDrawerOpen(true)}
            >
              Action Log
            </Button>
            <Button
              variant="contained"
              color="primary"
              className={classes.btnStyle}
              startIcon={<RestoreIcon />}
              onClick={() => setOpenCancel(true)}
              disabled={!(stepRow.length > 0)}
            >
              Undo All
            </Button>
            <Button
              variant="contained"
              color="primary"
              className={classes.btnStyle}
              startIcon={<UndoIcon />}
              onClick={undoLast}
              disabled={!(stepRow.length > 0)}
            >
              Undo Last
            </Button>
          </Grid>
        </Grid>
      </Grid>
      <WarningDialog
        open={openCancel}
        handleConfirm={handleCancel}
        handleClose={() => setOpenCancel(false)}
        content={
          editRow?.length !== 0
            ? 'All the changes will be recovered, are you sure to continue?'
            : 'There is no change.'
        }
      />
      <ActionLogs {...{ drawerOpen, setDrawerOpen, module: 'allFundingTxMemoSummary' }} />
    </>
  );
};

export default FTXButton;
