import React, { memo, useState, useEffect } from 'react';
import dayjs from 'dayjs';
import { useSelector } from 'react-redux';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableContainer,
  makeStyles,
  CircularProgress
} from '@material-ui/core';
import API from '../../../api/webdp/webdp';
import WebdpAccordion from '../WebdpAccordion';

const useStyles = makeStyles(() => ({
  table: {
    '& .myCellClass': {
      width: '15vw'
    }
  }
}));

const ActionLog = () => {
  const classes = useStyles();
  const requestNo = useSelector((state) => state.webDP.requestAll?.dpRequest?.requestNo);
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (requestNo) {
      setLoading(true);
      API.getActionLogByRequestNo(requestNo)
        .then((res) => {
          setRows(res?.data?.data || []);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [requestNo]);

  const maxWidth = '20vw';

  return (
    <div style={{ width: '100%' }} className={classes.table}>
      <WebdpAccordion
        label="Action Log"
        content={
          <div style={{ width: '100%' }}>
            {loading ? (
              <div
                style={{
                  height: '200px',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center'
                }}
              >
                <CircularProgress />
              </div>
            ) : (
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Status</TableCell>
                      <TableCell>Action Date</TableCell>
                      <TableCell>Action By</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {rows.map((item) => (
                      <TableRow key={item.id}>
                        {/* <TableCell>{item.stage}</TableCell> */}
                        <TableCell style={{ maxWidth }}>{item.actionlog}</TableCell>
                        <TableCell>
                          {item.actiondate
                            ? dayjs(item.actiondate).format('DD-MMM-YYYY HH:mm:ss')
                            : ''}
                        </TableCell>
                        <TableCell>
                          {item.actionagencybyfullname ? (
                            <>
                              {item.actionagencybyfullname}
                              <span style={{ color: 'red' }}> ({item.actionbyfullname}) </span>
                            </>
                          ) : (
                            item.actionbyfullname
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </div>
        }
      />
    </div>
  );
};

export default memo(ActionLog);
