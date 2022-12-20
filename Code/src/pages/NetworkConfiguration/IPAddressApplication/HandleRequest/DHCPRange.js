import React, { useEffect, memo } from 'react';
import {
  Table,
  TableHead,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Grid,
  Paper,
  makeStyles
} from '@material-ui/core';
import { useSelector } from 'react-redux';
import useValidationApprove from './useValidationApprove';
import RangeIP from './RangeIP';

const useStyles = makeStyles(() => ({
  tableToxShadow: {
    '& .MuiTableContainer-root': {
      boxShadow: '0 0 0'
    }
  },
  tableToCell0: {
    textAlign: 'center',
    border: '1px solid #fff',
    fontWeight: 'bold',
    padding: 5
  },
  tableToCell1: {
    textAlign: 'center',
    border: '1px solid #fff',
    padding: 5
  },
  tableToCell2: {
    textAlign: 'center',
    background: '#f5f5f5',
    height: 75
  }
}));

const DHCPRange = (props) => {
  const classes = useStyles();
  const { DHCPRangeData, setDHCPRangeData, setWrong, formStatus } = props;
  useEffect(() => {
    console.log('DHCPRangeData data:', DHCPRangeData);
  }, []);

  const staticIPData = useSelector((state) => state.IPAdreess.staticIPData) || [];
  const DHCPReservedData = useSelector((state) => state.IPAdreess.DHCPReservedData) || [];
  const rangeTouches = useSelector((state) => state.IPAdreess.rangeTouches) || {};
  const { rangeError } = useValidationApprove(staticIPData, DHCPReservedData, DHCPRangeData);

  return (
    <>
      <Grid container justifyContent="center" className={classes.tableToxShadow}>
        <TableContainer
          component={Paper}
          style={{ marginBottom: '0.5rem', width: '100%', backgroundColor: 'transparent' }}
        >
          <Table
            size="small"
            aria-label="a dense table"
            padding="none"
            style={{ border: '2px solid #fff', borderCollapse: 'collapse' }}
          >
            <TableHead style={{ background: '#e6f7ff' }}>
              <TableRow style={{ height: 60 }}>
                <TableCell className={classes.tableToCell0}>No.</TableCell>
                <TableCell className={classes.tableToCell0}>Institution</TableCell>
                <TableCell className={classes.tableToCell0}>Block</TableCell>
                <TableCell className={classes.tableToCell0}>Floor</TableCell>
                <TableCell className={classes.tableToCell0}>Equipment Type</TableCell>
                <TableCell className={classes.tableToCell0}>Remarks</TableCell>
                {/* <TableCell className={classes.tableToCell0}>No.of Request</TableCell> */}
                <TableCell className={classes.tableToCell0} style={{ width: '25%' }}>
                  IP Range
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {DHCPRangeData.map((item, index) => (
                <TableRow className={classes.tableToCell2} key={`A01${index}`}>
                  <TableCell className={classes.tableToCell1}>{index + 1}</TableCell>
                  <TableCell className={classes.tableToCell1}>{item.hospital}</TableCell>
                  <TableCell className={classes.tableToCell1}>{item.block}</TableCell>
                  <TableCell className={classes.tableToCell1}>{item.floor}</TableCell>
                  <TableCell className={classes.tableToCell1} style={{ textAlign: 'center' }}>
                    {item.equpType}
                  </TableCell>
                  <TableCell
                    className={classes.tableToCell1}
                    style={{ textAlign: 'left', marginTop: 5 }}
                  >
                    {item.remarks}
                  </TableCell>

                  {/* <TableCell className={classes.tableToCell1} style={{ textAlign: 'center' }}>
                      {item.ipNumber}
                    </TableCell> */}
                  <TableCell className={classes.tableToCell1}>
                    <RangeIP
                      formStatus={formStatus}
                      item={item}
                      ind={index}
                      touches={rangeTouches[index]}
                      errors={rangeError[index]}
                      setWrong={setWrong}
                      DHCPRangeData={DHCPRangeData}
                      setDHCPRangeData={setDHCPRangeData}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>
    </>
  );
};
export default memo(DHCPRange);
