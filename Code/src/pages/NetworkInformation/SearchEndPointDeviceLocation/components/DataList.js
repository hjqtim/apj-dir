import React, { useState, useEffect } from 'react';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography as MuiTypography,
  Grid,
  Tooltip,
  makeStyles,
  withStyles
} from '@material-ui/core';
import dayjs from 'dayjs';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import RenderItem from './RenderItem';
import { CommonDataGrid } from '../../../../components';

const Typography = withStyles(() => ({
  root: {
    color: 'rgb(21, 81, 81)'
  }
}))(MuiTypography);

const useStyles = makeStyles((theme) => ({
  footer: {
    marginTop: theme.spacing(5)
  }
}));

export default function DataList({ data }) {
  const classes = useStyles();
  const adminInfo = [
    { label: 'Full Location:', filed: 'fullLocation' },
    { label: 'Device MAC:', filed: 'deviceMAC' },
    { label: 'L2 Switch IP:', filed: 'l2SwitchIP' },
    { label: 'L2 Switch Port:', filed: 'l2SwitchPort' },
    { label: 'Switch Equipment ID:', filed: 'switchEquipmentID' },
    { label: 'Data Port ID:', filed: 'outletID' },
    // { label: 'L3 Last Scan Date:', filed: 'l3LastScanDate' },
    // { label: 'L2 Last Scan Date:', filed: 'l2lastScanDate' },
    { label: 'System Remark:', filed: 'systemRemark' }
  ];
  const searchResult = [
    { label: 'IP Address:', filed: 'ipaddrress' },
    { label: 'Hostname:', filed: 'hostName' },
    { label: 'Connection Status:', filed: 'connectionStatus' }
  ];
  const location = [
    // { label: 'Record Date:', filed: 'recordDate' },
    { label: 'Data Port ID:', filed: 'dataPortID' },
    { label: 'Institution:', filed: 'hospital' },
    { label: 'Block:', filed: 'block' },
    { label: 'Floor:', filed: 'floor' },
    { label: 'Room:', filed: 'room' }
  ];

  const [rows, setRows] = useState([]);
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

  const [expanded, setExpanded] = useState('adminInfo');

  const columns = [
    {
      field: 'dataPortID',
      headerName: 'Data Port ID',
      flex: 1,
      renderCell: (params) => (
        <Tooltip title={params?.value}>
          <div style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{params?.value || ''}</div>
        </Tooltip>
      )
    },
    {
      field: 'lastReordDate',
      headerName: 'Last Record Date',
      flex: 1,
      minWidth: 120,
      valueFormatter: (param) => (param?.value ? dayjs(param?.value).format('DD-MMM-YYYY') : '')
    },
    {
      field: 'l2SwitchIP',
      headerName: 'L2 Switch IP',
      minWidth: 120,
      flex: 1
    },
    {
      field: 'l2SwitchPort',
      headerName: 'L2 Switch Port',
      flex: 1
    },
    {
      field: 'hospital',
      headerName: 'Institution',
      flex: 1
    },
    {
      field: 'block',
      headerName: 'Block',
      flex: 1
    },
    {
      field: 'floor',
      headerName: 'Floor',
      flex: 1
    },
    {
      field: 'room',
      headerName: 'Room',
      flex: 1
    }
  ];

  useEffect(() => {
    let deviceConnectionHistory = data?.deviceConnectionHistory;
    if (deviceConnectionHistory?.length > 0) {
      // generate the unique id
      deviceConnectionHistory = deviceConnectionHistory.map((item) => ({
        ...item,
        id: Date.now().toString(36) + Math.random().toString(36).substr(2)
      }));
    }
    setRows(deviceConnectionHistory);
  }, [data?.deviceConnectionHistory]);

  return (
    <div>
      <Accordion expanded={expanded === 'adminInfo'} onChange={() => setExpanded('adminInfo')}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6"> Administrator Information (NMS members Only)</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container>
            {adminInfo.map((item) => (
              <RenderItem
                key={item.filed}
                label={item.label}
                value={data?.administrativeInformation?.[item.filed]}
              />
            ))}
          </Grid>
        </AccordionDetails>
      </Accordion>
      <Accordion
        expanded={expanded === 'searchresult'}
        onChange={() => setExpanded('searchresult')}
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6">Search Result</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container>
            {searchResult.map((item) => (
              <RenderItem
                key={item.filed}
                label={item.label}
                value={data?.searchResult?.[item.filed]}
              />
            ))}
          </Grid>
        </AccordionDetails>
      </Accordion>
      <Accordion expanded={expanded === 'location'} onChange={() => setExpanded('location')}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6">Location</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container>
            {location.map((item) => (
              <RenderItem
                key={item.filed}
                label={item.label}
                value={data?.location?.[item.filed]}
              />
            ))}
          </Grid>
        </AccordionDetails>
      </Accordion>
      <Accordion expanded={expanded === 'history'} onChange={() => setExpanded('history')}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6"> Device Connection History</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container>
            <Grid item xs={12} md={12} ld={12}>
              <CommonDataGrid
                minHeight="200px"
                rows={rows}
                columns={columns}
                disableColumnMenu
                page={params.page}
                pageSize={params.pageSize}
                onPageChange={onPageChange}
                getRowId={(row) => row?.id}
                rowsPerPageOptions={[10, 20, 50]}
                onPageSizeChange={onPageSizeChange}
                disableSelectionOnClick
              />
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>
      {/* <Accordion expanded={expanded === 'debugoutPut'} onChange={() => setExpanded('debugoutPut')}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6"> Debug OutPut</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <strong>Debug OutPut....</strong>
        </AccordionDetails>
      </Accordion> */}

      <div className={classes.footer}>
        <strong>
          Information provide on this page is for reference purpose . We endeavor to ensure the
          accuracy and reliability of the information but there is no guarantee on it as the
          information retrieved depends on various factors.
        </strong>
      </div>
    </div>
  );
}
