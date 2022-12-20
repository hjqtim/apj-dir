import React, { useState } from 'react';
import {
  Box,
  Table,
  Collapse,
  TableRow,
  TableCell,
  TableBody,
  TableHead,
  IconButton,
  makeStyles,
  Tooltip,
  Typography,
  CircularProgress
} from '@material-ui/core';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import ErrorIcon from '@material-ui/icons/Error';

import { HAPaper, CommonDataGrid } from '../../../../components';
import { useGlobalStyles } from '../../../../style';
import API from '../../../../api/webdp/webdp';
import getIcons from '../../../../utils/getIcons';

const useStyles = makeStyles((theme) => ({
  tableHeader: {
    fontWeight: 700
  },
  mainRowStyle: {
    color: theme.palette.secondary.main,
    fontWeight: 700
  },
  actions: {
    '& .MuiIconButton-root.Mui-disabled': {
      cursor: 'not-allowed !important',
      pointerEvents: 'all'
    }
  },
  footer: {
    marginTop: theme.spacing(10)
  }
}));

const Row = ({ setOpen, open, columns, row, showId }) => {
  const classes = useStyles();
  const globalclasses = useGlobalStyles();

  const [params, setParams] = useState({ page: 1, pageSize: 10 });

  const onPageSizeChange = (pageSize) => {
    const newParams = {
      ...params,
      page: 1,
      pageSize: Number(pageSize)
    };
    setParams(newParams);
  };

  const onPageChange = (page) => {
    const newParams = {
      ...params,
      page
    };
    setParams(newParams);
  };
  return (
    <>
      <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
        <TableCell component="th" scope="row" className={classes.mainRowStyle}>
          {row.query}
        </TableCell>
        <TableCell colSpan={2} />
        <TableCell />
        <TableCell />
        <TableCell className={classes.mainRowStyle} align="right">
          {row.total}
        </TableCell>
        <TableCell align="right" width={100}>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(showId === open ? -1 : showId)}
          >
            {open === showId ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </IconButton>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={7}>
          <Collapse in={open === showId} timeout="auto" unmountOnExit>
            <Box padding={5} className={globalclasses.fixDatagrid}>
              <CommonDataGrid
                minHeight="200px"
                rows={row.items || []}
                columns={columns}
                disableColumnMenu
                page={params.page}
                getRowId={(row) => row?.id}
                pageSize={params.pageSize}
                rowsPerPageOptions={[10, 20, 50]}
                onPageSizeChange={onPageSizeChange}
                onPageChange={onPageChange}
                disableSelectionOnClick
              />
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
};

const DataPortList = ({ rows, setRows }) => {
  const classes = useStyles();
  const [open, setOpen] = React.useState(0);
  const [checkState, setCheckState] = useState({ id: '', loading: false });

  const columns = [
    {
      field: 'requestNo',
      headerName: 'DP Request#',
      flex: 1
    },
    {
      field: 'dataPortId',
      headerName: 'DP ID',
      flex: 1
    },
    {
      field: 'hospital',
      headerName: 'Institution',
      flex: 1
    },
    {
      field: 'location',
      headerName: 'Location',
      flex: 1
    },
    {
      field: 'Data Port Type',
      headerName: 'Type',
      flex: 1
    },
    {
      field: 'project',
      headerName: 'Project',
      flex: 1
    },
    {
      field: 'status',
      headerName: 'Current Status',
      flex: 1
    },
    {
      field: 'enable',
      headerName: 'Enable',
      flex: 1,
      renderCell: (params) => renderEnableStatus(params)
    },
    {
      field: 'action',
      headerName: 'Get status',
      cellClassName: classes.actions,
      flex: 1,
      renderCell: (params) => {
        const { row } = params;
        return (
          <>
            {!checkState.loading ? (
              <Tooltip title="Get status">
                <IconButton
                  disabled={checkState.loading}
                  onClick={() => getStatus(row.dataPortId, row.id)}
                >
                  {getIcons('gpsFixedIcon', '#229FFA')}
                </IconButton>
              </Tooltip>
            ) : (
              <IconButton disabled>{getIcons('gpsFixedIcon', '#229FFA')}</IconButton>
            )}
          </>
        );
      }
    }
  ];

  const renderEnableStatus = (params) => {
    const { id, value } = params;
    let content;
    if (checkState.id === id && checkState.loading) {
      content = (
        <IconButton size="small">
          <CircularProgress color="inherit" size={30} />
        </IconButton>
      );
    } else if (value === true) {
      content = (
        <Tooltip placement="right" title="Current state enable">
          <CheckCircleIcon color="primary" size={45} />
        </Tooltip>
      );
    } else if (value === false) {
      content = (
        <Tooltip placement="right" title="Current state disable">
          <ErrorIcon color="primary" size={30} />
        </Tooltip>
      );
    } else if (value === '') {
      content = (
        <Tooltip placement="right" title="This data port ID is not exist.">
          <ErrorIcon style={{ color: '#ff8a80' }} size={30} />
        </Tooltip>
      );
    }

    return content;
  };

  const getStatus = (outletID, id) => {
    setCheckState({ id, loading: true });
    API.deRequestCheckIDStatus({ outletID })
      .then((res) => {
        const status = res?.data?.data;
        const newRows = rows.map((values) => {
          const newItems = values.items.map((item) => {
            let itemTemp = item;
            if (item.id === id) {
              itemTemp = { ...itemTemp, enable: status };
            }
            return itemTemp;
          });
          return { ...values, items: newItems };
        });
        setRows(newRows);
      })
      .finally(() => {
        setCheckState({ id: '', loading: false });
      });
  };
  return (
    <HAPaper style={{ padding: '30px' }}>
      <Table aria-label="collapsible table">
        <TableHead>
          <TableRow>
            <TableCell className={classes.tableHeader}>Query data port params</TableCell>
            <TableCell colSpan={2} />
            <TableCell />
            <TableCell />
            <TableCell align="right" className={classes.tableHeader}>
              Total
            </TableCell>
            <TableCell align="right" width={100} />
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row, index) => (
            <Row
              key={row.query}
              row={row}
              open={open}
              setOpen={setOpen}
              showId={index}
              columns={columns}
            />
          ))}
        </TableBody>
      </Table>
      <div className={classes.footer}>
        <Typography variant="h6">Report Discrepancies</Typography>
        <br />
        <Typography>
          We have made every attempt to ensure that the information contained in this site has been
          obtained from reliable sources. As intelligent cable management system is still in its
          infancy, the information shown above was collected and maintained manually.
        </Typography>
        <br />
        <Typography>
          Please report discrepancies to us &nbsp;
          <a
            href="mailto:sample@fly63.com?subject=test&cc=sample@hotmail.com&subject=Hello&body=Hi"
            style={{ color: '#229FFA' }}
          >
            by email
          </a>
          . Thank you.
        </Typography>
      </div>
    </HAPaper>
  );
};
export default DataPortList;
