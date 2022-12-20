import React, { memo } from 'react';
import {
  Table,
  TableHead,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Grid,
  Paper,
  withStyles
} from '@material-ui/core';
import { useSelector } from 'react-redux';
import IPdetails from './IPdetails';
import useValidationApprove from './useValidationApprove';

const TableCellHeader = withStyles(() => ({
  root: {
    textAlign: 'center',
    border: '1px solid #fff',
    fontWeight: 'bold',
    padding: 5
  }
}))(TableCell);

const StaticIP = ({ isStatic, DHCPRangeData, setIsLoading }) => {
  const staticIPData = useSelector((state) => state.IPAdreess.staticIPData) || [];
  const DHCPReservedData = useSelector((state) => state.IPAdreess.DHCPReservedData) || [];
  const dataSourceList = isStatic ? staticIPData : DHCPReservedData;
  const reserverTouches = useSelector((state) => state.IPAdreess.reserverTouches) || [];
  const staticTouches = useSelector((state) => state.IPAdreess.staticTouches) || [];
  const { staticError, reserverError } = useValidationApprove(
    staticIPData,
    DHCPReservedData,
    DHCPRangeData
  );
  const errors = isStatic ? staticError : reserverError;
  const touches = isStatic ? staticTouches : reserverTouches;

  return (
    <>
      <div
        style={{ padding: '9px  5px', background: '#abe1fb', fontWeight: 'bold', marginBottom: 2 }}
      >
        {isStatic ? 'Static IP' : 'DHCP Reserved'}
      </div>
      <Grid container>
        <TableContainer component={Paper} style={{ width: '100%' }}>
          <Table>
            <TableHead style={{ background: '#e6f7ff' }}>
              <TableRow style={{ height: 60 }}>
                <TableCellHeader>No.</TableCellHeader>
                <TableCellHeader>Institution</TableCellHeader>
                <TableCellHeader>Block</TableCellHeader>
                <TableCellHeader>Floor</TableCellHeader>
                <TableCellHeader>Room</TableCellHeader>
                <TableCellHeader>isPerm</TableCellHeader>
                <TableCellHeader>Release Date</TableCellHeader>
                <TableCellHeader>Data Port ID</TableCellHeader>
                <TableCellHeader>Equipment Type</TableCellHeader>
                <TableCellHeader>Purpose</TableCellHeader>
                <TableCellHeader>Remarks</TableCellHeader>
                <TableCellHeader>Mac Address</TableCellHeader>
                <TableCellHeader>Subnet</TableCellHeader>
                <TableCellHeader>Bit</TableCellHeader>
                <TableCellHeader>IP Details</TableCellHeader>
              </TableRow>
            </TableHead>

            <TableBody>
              {dataSourceList?.map((item, index) => (
                <TableRow style={{ backgroundColor: '#f5f5f5' }} key={index}>
                  <IPdetails
                    {...{
                      item,
                      index,
                      isStatic,
                      setIsLoading,
                      errors: errors[index],
                      touches: touches[index]
                    }}
                  />
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>
    </>
  );
};
export default memo(StaticIP);
