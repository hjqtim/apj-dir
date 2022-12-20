import React, { useState } from 'react';
import dayjs from 'dayjs';
import { Grid, Button, TextField, makeStyles } from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import CheckIcon from '@material-ui/icons/Check';
import RestoreIcon from '@material-ui/icons/Restore';
import UndoIcon from '@material-ui/icons/Undo';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { WarningDialog } from '../../../../components';
import ActionLogs from './ActionLogs/index';

const useStyles = makeStyles((theme) => ({
  btnStyle: {
    marginLeft: theme.spacing(4)
  }
}));

const ProblemLogButton = (props) => {
  const { undoLast, cancelChange, saveChange, searchCondition, setParams, editRow, stepRow } =
    props;
  const classes = useStyles();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const getYearOptions = () => {
    let year = dayjs().format('YY');
    const fullYear = dayjs().format('YYYY');
    if (dayjs().valueOf() <= dayjs(`${fullYear}-03-31 23:59:59`).valueOf()) {
      year = `${year - 1}`;
    }
    const towYearAgo = `${Number(year) - 2}${Number(year) - 1}`;
    const lastYear = `${Number(year) - 1}${year}`;
    const thisYear = `${year}${Number(year) + 1}`;
    const nextYear = `${Number(year) + 1}${Number(year) + 2}`;
    const nextTwoYear = `${Number(year) + 2}${Number(year) + 3}`;
    const yearOptions = [towYearAgo, lastYear, thisYear, nextYear, nextTwoYear];
    return yearOptions;
  };

  const statusList = getYearOptions();

  const [fiscalYear, setFiscalYear] = useState();

  const [openSave, setOpenSave] = useState(false);
  const [openCancel, setOpenCancel] = useState(false);

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
  const handleSave = () => {
    if (editRow?.length !== 0) {
      saveChange();
    }
    setOpenSave(false);
  };

  const commonProps = { item: true, xs: 12, md: 6, lg: 6 };
  return (
    <>
      <Grid container>
        <Grid {...commonProps}>
          <Grid container>
            <Grid item xs={6} md={4} lg={4} style={{ marginTop: -10 }}>
              <Autocomplete
                id="status"
                options={statusList}
                onChange={(e, data) => {
                  if (data === null) {
                    setFiscalYear(undefined);
                  } else {
                    setFiscalYear(data);
                  }
                }}
                renderInput={(inputParams) => (
                  <TextField {...inputParams} label="Problem Log by FY" />
                )}
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
        open={openSave}
        handleConfirm={handleSave}
        handleClose={() => setOpenSave(false)}
        // content="The Changes will be Save, are you sure to continue?"
        content={
          editRow?.length !== 0
            ? 'The Changes will be Save, are you sure to continue'
            : 'There is no change.'
        }
      />
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

      <ActionLogs {...{ drawerOpen, setDrawerOpen, module: 'problemLog' }} />
    </>
  );
};

export default ProblemLogButton;
