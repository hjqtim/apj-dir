import React, { useEffect, useState } from 'react';
import {
  Table,
  TableRow,
  TableCell,
  TableBody,
  TableHead,
  IconButton,
  makeStyles,
  Typography,
  CircularProgress,
  Drawer
} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';

import Row from './Row';

import API from '../../../../../api/webdp/webdp';

const useStyles = makeStyles((theme) => ({
  headerStyle: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    background: theme.palette.primary.main,
    color: '#fff',
    padding: theme.spacing(0, 5)
  },
  circularProgress: {
    display: 'flex',
    justifyContent: 'center'
  },
  circularProgress2: {
    height: '80vh',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center'
  }
}));

const Index = ({ openDetail, setOpenDetail, currentRow }) => {
  const classes = useStyles();
  const [open, setOpen] = useState(-1);
  const [loading, setLoading] = useState(false);
  const [rows, setRows] = useState([]);

  useEffect(() => {
    if (currentRow?.dpReq) {
      setLoading(true);
      API.getRequestFormByDpReq({ dpReq: currentRow.dpReq })
        .then((res) => {
          const resData = res?.data?.data?.requestFormList || [];
          setRows(resData);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [currentRow?.dpReq]);

  return (
    <Drawer
      anchor="right"
      open={openDetail}
      onClose={() => setOpen(false)}
      classes={{ root: classes.list }}
    >
      <div className={classes.headerStyle}>
        <Typography variant="h4"> Detail</Typography>
        <IconButton onClick={() => setOpenDetail(false)}>
          <CloseIcon style={{ color: '#fff' }} />
        </IconButton>
      </div>

      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Request Form No.</TableCell>
            <TableCell>Fiscal Year</TableCell>
            <TableCell>Resp Staff</TableCell>
            <TableCell>Install'n Start Time </TableCell>
            <TableCell>Install'n End Time </TableCell>
            <TableCell> Status</TableCell>
            <TableCell> Status Date</TableCell>
            <TableCell align="right" width={100} />
          </TableRow>
        </TableHead>
        {loading ? (
          <TableBody>
            <TableRow>
              <TableCell colSpan={4} />
              <TableCell colSpan={1}>
                <div className={classes.circularProgress2}>
                  <CircularProgress size={50} />
                </div>
              </TableCell>
              <TableCell colSpan={4} />
            </TableRow>
          </TableBody>
        ) : (
          <TableBody>
            {rows?.map((row, index) => (
              <Row
                key={row?.requestFormVo?.id}
                row={row?.requestFormVo}
                open={open}
                setOpen={setOpen}
                showId={index}
              />
            ))}
          </TableBody>
        )}
      </Table>
    </Drawer>
  );
};
export default Index;
