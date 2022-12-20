import React, { useEffect } from 'react';
import {
  FormControl,
  Select,
  MenuItem,
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
import NumberFormat from 'react-number-format';

import IPdetails from './IPdetails';

const useStyles = makeStyles(() => ({
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
    background: '#f5f5f5'
  }
}));

const StaticIP = (props) => {
  const classes = useStyles();
  const { staticIPData, setStaticIPData, setWrong } = props;

  useEffect(() => {}, [staticIPData]);

  const subnetBitValid = (param, ind) => {
    const temp = [...staticIPData];
    console.log('subnetBitValid', param, ind, temp);
    if (param.floatValue > 32) {
      temp[0].bit = 32;
    } else {
      temp[ind].bit = param.floatValue;
    }
    setStaticIPData([...temp]);
  };

  const subnetSelect = (e, ind) => {
    // console.log('subnetSelected', e.target.value, ind);
    const temp = [...staticIPData];
    temp[ind].subnetSelected = e.target.value;
    temp[ind].ipAddress = `${e.target.value}.`;
    setStaticIPData([...temp]);
  };

  return (
    <>
      <Grid container justifyContent="center">
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
                <TableCell className={classes.tableToCell0}>Room</TableCell>
                <TableCell className={classes.tableToCell0}>isPerm</TableCell>
                <TableCell className={classes.tableToCell0}>Release Date</TableCell>
                <TableCell className={classes.tableToCell0}>Data Port ID</TableCell>
                <TableCell className={classes.tableToCell0}>Equipment Type</TableCell>
                <TableCell className={classes.tableToCell0}>Purpose</TableCell>
                <TableCell className={classes.tableToCell0}>Remarks</TableCell>
                <TableCell className={classes.tableToCell0}>Mac Address</TableCell>
                <TableCell className={classes.tableToCell0}>Subnet</TableCell>
                <TableCell className={classes.tableToCell0} style={{ width: '2%' }}>
                  Bit
                </TableCell>
                <TableCell className={classes.tableToCell0} style={{ width: 420 }}>
                  IP Details
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {staticIPData.map((item, ind) => {
                const { subnetListAndOneDetail, subnetSelected } = item;
                console.log('staticIPDataTemp', item);
                return (
                  <TableRow className={classes.tableToCell2} key={ind}>
                    <TableCell className={classes.tableToCell1}>{ind + 1}</TableCell>
                    <TableCell className={classes.tableToCell1}>{item.hospital}</TableCell>
                    <TableCell className={classes.tableToCell1}>{item.block}</TableCell>
                    <TableCell className={classes.tableToCell1}>{item.floor}</TableCell>
                    <TableCell className={classes.tableToCell1}>{item.room}</TableCell>
                    <TableCell className={classes.tableToCell1}>{item.isPerm}</TableCell>
                    <TableCell className={classes.tableToCell1}>{item.releaseDate}</TableCell>
                    <TableCell className={classes.tableToCell1}>{item.outletId}</TableCell>
                    <TableCell className={classes.tableToCell1}>{item.computerType}</TableCell>
                    <TableCell className={classes.tableToCell1}>{item.purpose}</TableCell>
                    <TableCell className={classes.tableToCell1} style={{ textAlign: 'left' }}>
                      {item.remarks}
                    </TableCell>
                    <TableCell className={classes.tableToCell1}>
                      <div style={{ height: 22 }} />
                      {item.macAddress}
                    </TableCell>
                    <TableCell className={classes.tableToCell1} sort={ind}>
                      <div style={{ marginTop: 22 }}>
                        <FormControl size="small" variant="outlined">
                          <Select
                            disabled={false}
                            style={{ background: '#fff' }}
                            value={subnetSelected}
                            onChange={(e) => {
                              subnetSelect(e, ind);
                            }}
                          >
                            {subnetListAndOneDetail.map((subnetItem) => (
                              <MenuItem value={subnetItem.segment} key={item.id}>
                                {subnetItem.segment}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </div>
                    </TableCell>
                    <TableCell className={classes.tableToCell1} sort={ind}>
                      <NumberFormat
                        style={{
                          border: '1px solid #ccc',
                          borderRadius: 5,
                          width: 35,
                          height: 37,
                          textAlign: 'right',
                          marginTop: 22,
                          padding: 5
                        }}
                        allowNegative={false}
                        value={item.bit}
                        onValueChange={(val) => {
                          subnetBitValid(val, ind);
                        }}
                        // error={getMaximumError()}
                        // helperText={
                        //   getMaximumError()
                        //     ? `Maximum Cost You Commit must be greater than ${quotationtotal}`
                        //     : undefined
                        // }
                      />
                    </TableCell>
                    <TableCell className={classes.tableToCell1} sort={ind}>
                      <IPdetails
                        staticIPData={staticIPData}
                        setStaticIPData={setStaticIPData}
                        item={item}
                        sort={ind}
                        setWrong={setWrong}
                      />
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>
    </>
  );
};
export default StaticIP;
