import React, { useState } from 'react';
import {
  Grid,
  Button,
  makeStyles,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  TextField
} from '@material-ui/core';
import CheckIcon from '@material-ui/icons/Check';
import RestoreIcon from '@material-ui/icons/Restore';
import UndoIcon from '@material-ui/icons/Undo';
import SaveIcon from '@material-ui/icons/Save';
import SearchIcon from '@material-ui/icons/Search';
import { WarningDialog } from '../../../../components';
import CommonTip from '../../../../components/CommonTip';
import API from '../../../../api/webdp/webdp';
import ActionLogs from './ActionLogs/index';

const useStyles = makeStyles((theme) => ({
  btnStyle: {
    marginLeft: theme.spacing(4)
  }
}));

const PRPOButton = (props) => {
  const {
    undoLast,
    record = [],
    handleUndoAll,
    lanPool,
    setLanPool,
    fiscalYear,
    setFiscalYear,
    reGetDataList
  } = props;
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const exportExcel = () => {
    API.exportExcelPRPOSummary({ lanPool, fiscalYear: fiscalYear || undefined }).then((res) => {
      if (res?.data) {
        try {
          const blob = new Blob([res.data], {
            type: 'application/vnd.ms-excel;charset=utf-8'
          });
          const objectUrl = URL.createObjectURL(blob);
          const link = document.createElement('a');
          const fileName = 'PRPOSummary';
          link.href = objectUrl;
          link.setAttribute('download', fileName);
          document.body.appendChild(link);
          link.click();
        } catch (error) {
          CommonTip.error(`Export fail.`);
        }
      }
    });
  };

  const handleConfirm = () => {
    handleUndoAll();
    setOpen(false);
  };

  const handleSearch = () => {
    reGetDataList();
  };

  const commonProps = { item: true, xs: 12, md: 6, lg: 6 };
  return (
    <>
      <Grid container>
        <Grid {...commonProps}>
          <Grid container>
            <Grid item xs={2} md={2} lg={2}>
              <FormControl fullWidth size="small">
                <InputLabel>LPool</InputLabel>
                <Select
                  label="LPool"
                  value={lanPool}
                  onChange={(e) => {
                    setLanPool(e.target.value);
                  }}
                >
                  <MenuItem value={2}>All</MenuItem>
                  <MenuItem value={0}>N</MenuItem>
                  <MenuItem value={1}>Y</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={2} md={2} lg={2}>
              <TextField
                style={{ marginLeft: 10 }}
                label="Fis Yr"
                value={fiscalYear}
                fullWidth
                size="small"
                onChange={(e) => {
                  setFiscalYear(e.target.value);
                }}
              />
            </Grid>

            <Grid item xs={8} md={8} lg={8}>
              <Button
                variant="contained"
                color="primary"
                className={classes.btnStyle}
                startIcon={<SearchIcon />}
                onClick={handleSearch}
              >
                Search
              </Button>

              <Button
                variant="contained"
                color="primary"
                className={classes.btnStyle}
                startIcon={<SaveIcon />}
                onClick={exportExcel}
              >
                Export Excel
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
              onClick={() => setOpen(true)}
              disabled={!record.length}
            >
              Undo All
            </Button>
            <Button
              variant="contained"
              color="primary"
              className={classes.btnStyle}
              startIcon={<UndoIcon />}
              onClick={undoLast}
              disabled={!record.length}
            >
              Undo Last
            </Button>
          </Grid>
        </Grid>
      </Grid>

      <WarningDialog
        open={open}
        handleConfirm={handleConfirm}
        handleClose={() => setOpen(false)}
        content="All the changes will be recovered. Are you sure to continue?"
      />

      <ActionLogs {...{ drawerOpen, setDrawerOpen, module: 'poMaster' }} />
    </>
  );
};

export default PRPOButton;
