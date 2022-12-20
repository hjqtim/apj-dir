import React from 'react';
import { Box, Collapse, TableRow, TableCell, Tooltip, IconButton } from '@material-ui/core';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import dayjs from 'dayjs';

import { CommonDataGrid } from '../../../../../components';
import { useGlobalStyles } from '../../../../../style';
import { formatterMoney } from '../../../../../utils/tools';

const Row = ({ setOpen, open, row, showId }) => {
  const globalclasses = useGlobalStyles();
  const columns = [
    {
      field: 'partNo',
      headerName: 'Item No.',
      flex: 1
    },

    {
      field: 'unit',
      headerName: 'Unit',
      flex: 1
    },
    {
      field: 'qty',
      headerName: 'Qty',
      headerAlign: 'right',
      align: 'right',
      flex: 1
    },
    {
      field: 'unitPrice',
      headerName: 'Unit Price',
      flex: 1,
      headerAlign: 'right',
      align: 'right',
      valueFormatter: (param) => formatterMoney(param?.value || 0)
    },

    {
      field: 'total',
      headerName: 'Total',
      headerAlign: 'right',
      align: 'right',
      flex: 1,
      sortable: false,
      valueFormatter: (param) => formatterMoney(param?.row?.qty * param?.row?.unitPrice || 0)
    },
    {
      field: 'description',
      headerName: 'Description.',
      flex: 1,
      renderCell: (params) => (
        <Tooltip title={params?.value}>
          <div style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{params?.value || ''}</div>
        </Tooltip>
      )
    }
  ];
  return (
    <>
      <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
        <TableCell>{row?.reqNo}</TableCell>
        <TableCell>{row?.expenditureFY}</TableCell>
        <TableCell>{row?.respStaff}</TableCell>
        <TableCell>{row?.instDateFr ? dayjs(row?.instDateFr).format('DD-MMM-YYYY') : ''}</TableCell>
        <TableCell>{row?.instDateTo ? dayjs(row?.instDateTo).format('DD-MMM-YYYY') : ''}</TableCell>
        <TableCell>{row?.status}</TableCell>
        <TableCell>
          {row?.jobCompletionDate
            ? dayjs(row?.jobCompletionDate).format('DD-MMM-YYYY HH:mm:ss')
            : ''}
        </TableCell>
        <TableCell align="right" width={100}>
          <IconButton size="small" onClick={() => setOpen(showId === open ? -1 : showId)}>
            {open === showId ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </IconButton>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={9}>
          <Collapse in={open === showId} timeout="auto" unmountOnExit>
            <Box padding={5} className={globalclasses.fixDatagrid}>
              <CommonDataGrid
                hideFooter
                minHeight="100px"
                rows={row?.requestItem || []}
                columns={columns}
                disableColumnMenu
                getRowId={(row) => row?.id}
              />
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
};

export default Row;
