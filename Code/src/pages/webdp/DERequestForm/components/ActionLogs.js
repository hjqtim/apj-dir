import React, { memo, useState, useEffect } from 'react';
import dayjs from 'dayjs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableContainer,
  CircularProgress
} from '@material-ui/core';
import { useParams } from 'react-router-dom';
import API from '../../../../api/webdp/webdp';
import WebdpAccordion from '../../../../components/Webdp/WebdpAccordion';

const ActionLog = () => {
  const { requestNo } = useParams();
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (requestNo) {
      setLoading(true);
      API.getDEActionLogByRequestNo(requestNo)
        .then((res) => {
          setRows(res?.data?.data || []);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, []);

  return (
    <div style={{ width: '100%' }}>
      <WebdpAccordion
        style={{ color: '#078080' }}
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
                        <TableCell style={{ maxWidth: '20vw' }}>{item.actionType}</TableCell>
                        <TableCell>
                          {item.actionDate
                            ? dayjs(item.actionDate).format('DD-MMM-YYYY HH:mm:ss')
                            : ''}
                        </TableCell>
                        <TableCell>{item.actionByFullName}</TableCell>
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
