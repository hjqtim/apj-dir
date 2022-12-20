import React from 'react';
import { useParams } from 'react-router-dom';
import {
  Box,
  Grid,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableBody,
  TableCell,
  DialogTitle,
  makeStyles,
  Paper
} from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import useWebDPColor from '../../../../../hooks/webDP/useWebDPColor';

const useStyles = makeStyles(() => ({
  tableToxShadow: {
    '& .MuiTableContainer-root': {
      boxShadow: '0 0 0'
    }
  }
}));

const TableHeadStyle = {
  style: { fontWeight: 'bold' },
  align: 'center'
};

const TableCellProps = {
  align: 'center'
};

const columns = [
  'Quantity of data ports',
  'Send acknowledgment to the requester upon receipt of Data Port Installation Request Form	',
  'Submit cost estimate to the requester',
  'Complete data port installation after confirmation of fund by the requester (see Note 1)',
  `Extra workdays require for installation of a new network closet after space is allocated by the requester (Optional, see Note 2)`
];

const cellData = [
  {
    amount: '1-4',
    data1: '1 Working Days',
    data2: '6 Working Days',
    data3: '12 Working Days',
    data4: '18 Working Days'
  },
  {
    amount: '5-20',
    data1: '1 Working Days',
    data2: '6 Working Days',
    data3: '18 Working Days',
    data4: '18 Working Days'
  },
  {
    amount: '21-50',
    data1: '1 Working Days',
    data2: '15 Working Days',
    data3: '24 Working Days',
    data4: '18 Working Days'
  },
  {
    amount: '51-100',
    data1: '1 Working Days',
    data2: '18 Working Days',
    data3: '30 Working Days',
    data4: '24 Working Days'
  }
];

const ILTIButton = () => {
  const { formType } = useParams();

  const classes = useStyles();
  const color = useWebDPColor().title;

  const APRowDatas = [
    {
      task: 'Preliminary study and arrange site survey',
      party: 'N4 Team',
      rowSpan: 1,
      first: 3,
      second: 3,
      third: 5,
      fourth: 5,
      fifth: 5
    },
    {
      task: 'Conduct site survey',
      party: 'N4 Team, Contractor',
      rowSpan: 1,
      first: 1,
      second: 1,
      third: 1,
      fourth: 2,
      fifth: 2
    },
    {
      task: 'Submit site survey report',
      party: 'Contractor',
      rowSpan: 1,
      first: 5,
      second: 5,
      third: 5,
      fourth: 8,
      fifth: 8
    },

    {
      task: 'Design network',
      party: 'N3 Team / N4 Team',
      rowSpan: 1,
      first: 3,
      second: 3,
      third: 3,
      fourth: 3,
      fifth: 3
    },
    {
      task: 'Estimate cost and notify requester',
      party: 'N4 Team',
      rowSpan: 1,
      first: 1,
      second: 1,
      third: 1,
      fourth: 1,
      fifth: 1
    },
    {
      task: 'Confirm funding',
      party: 'Requester',
      rowSpan: 1,
      first: 3,
      second: 3,
      third: 3,
      fourth: 3,
      fifth: 3
    },
    {
      task: 'Order WLAN access points',
      party: 'N4 Team',
      rowSpan: 5,
      first: 10,
      second: 10,
      third: 10,
      fourth: 25,
      fifth: 25
    },
    {
      task: 'Install data ports',
      party: 'Contractor',
      rowSpan: 0
    },
    {
      task: 'Configure network resources (L3)',
      party: 'N3 Team',
      rowSpan: 0
    },
    {
      task: 'Register WLAN access points',
      party: 'N4 Team',
      rowSpan: 0
    },
    {
      task: 'Configure network resources (L2, DHCP)',
      party: 'N3 Team / N4 Team',
      rowSpan: 0
    },
    {
      task: 'Pre-installation work for WLAN access points',
      party: 'Contractor',
      rowSpan: 1,
      first: 3,
      second: 3,
      third: 4,
      fourth: 4,
      fifth: 4
    },
    {
      task: 'Deliver and install WLAN access points',
      party: 'Contractor',
      rowSpan: 1,
      first: 3,
      second: 3,
      third: 3,
      fourth: 4,
      fifth: 4
    },
    {
      task: 'Submit test report for acceptance by HO IT&HI',
      party: 'Contractor',
      rowSpan: 1,
      first: 3,
      second: 3,
      third: 5,
      fourth: 5,
      fifth: 5
    },
    {
      task: 'footer',
      party: 'Total (working days)',
      rowSpan: 1,
      first: 35,
      second: 35,
      third: 50,
      fourth: 60,
      fifth: 60
    },
    {
      task: 'empty',
      party: 'Total (calendar weeks)',
      rowSpan: 1,
      first: 7,
      second: 7,
      third: 10,
      fourth: 12,
      fifth: 12
    }
  ];

  const getCellPros = (colSpan = 1, backgroundColor = '#F0F8FF', rowSpan = 1) => ({
    align: 'center',
    colSpan,
    rowSpan,
    style: {
      paddingLeft: 4,
      backgroundColor
    }
  });

  return (
    <>
      <div
        style={{
          position: 'fixed',
          zIndex: 9999,
          backgroundColor: '#FFF',
          inset: 0,
          overflowY: 'auto'
        }}
      >
        <DialogTitle style={{ backgroundColor: color, color: 'white', fontWeight: 'bold' }}>
          Installation Lead Time Information
        </DialogTitle>
        {formType === 'DP' && (
          <div style={{ paddingLeft: '24px' }}>
            <Typography variant="h5" style={{ padding: '1rem 0' }}>
              Lead time for installation of data ports depends on various factors (Note 1). HO IT&HI
              aims to complete 90% of data ports installation and the necessary network
              configuration work according to the following table:-
            </Typography>
            <TableContainer component={Paper} style={{ marginBottom: '0.5rem' }}>
              <Table size="small" aria-label="a dense table">
                <TableHead>
                  <TableRow>
                    {columns.map((c, index) => (
                      <TableCell key={index} {...TableHeadStyle}>
                        {c}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {cellData.map((data, index) => (
                    <TableRow key={index}>
                      <TableCell {...TableCellProps}>{data.amount}</TableCell>
                      <TableCell {...TableCellProps}>{data.data1}</TableCell>
                      <TableCell {...TableCellProps}>{data.data2}</TableCell>
                      <TableCell {...TableCellProps}>{data.data3}</TableCell>
                      <TableCell {...TableCellProps}>{data.data4}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <Typography>
              Orders with quantity exceed 40 usually involve major roll out of IT/IS applications or
              re-development/renovation projects of hospitals. HO IT&HI will prepare project plan
              and coordinate with the requester in the implementation based on the schedule defined
              in the project plan.
            </Typography>
            <Grid container style={{ paddingTop: '2rem' }}>
              <Grid item xs={12} style={{ fontWeight: 'bold' }}>
                <Typography variant="h4">Notes: </Typography>
              </Grid>
              <Grid container style={{ marginTop: '1rem' }}>
                <Grid item xs={12} style={{ marginLeft: '2rem' }}>
                  <Typography variant="h6">
                    1. Lead-time for installation of data port installation depends on various
                    factors such as:-
                  </Typography>
                  <Box component="li" style={{ marginLeft: '2rem' }}>
                    Site availability - In some locations only lunch hours or unoccupied hours are
                    allowed for the installation work. In some cases sites are not yet ready for
                    data port installation.
                  </Box>
                  <Box component="li" style={{ marginLeft: '2rem' }}>
                    Dependency of other works - In some cases installation of data ports can only be
                    started upon completion of works by others, e.g. construction of conduit and
                    dismantling of ceiling by ASD.
                  </Box>
                </Grid>
                <Grid item xs={12} style={{ marginLeft: '2rem', marginTop: '1rem' }}>
                  <Typography variant="h6">
                    2. Data ports of the same floor are normally connected to the same network
                    closet. If there is no network closet available within 90 metre of the target
                    data port location, a new network closet would be required. N3 team will visit
                    the site with the end user to select an appropriate location to accommodate the
                    new network closet. It is the responsibility of the end user to install power
                    sockets for the network closet.
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
            <Grid container style={{ paddingTop: '2rem' }}>
              <Grid item xs={12}>
                <Typography variant="h4">Examples: </Typography>
              </Grid>
              <Grid item xs={12} style={{ marginLeft: '2rem', marginTop: '1rem' }}>
                <Typography variant="h6">
                  1. If an end user requests 5 data ports and confirms that funding is available at
                  the same time, he can expect that the data ports will be ready within 15 workdays
                  (ie. 1 day for acknowledgment and 14 days for installation).
                </Typography>
                <Typography variant="h6" style={{ marginTop: '1rem' }}>
                  2. If an end user requests 5 data ports and wants to have a cost estimate before
                  actual installation work starts, she can expect that the cost estimate will be
                  ready within 7 workdays (ie. 1 day for acknowledgment and 6 days for cost
                  estimate). If she confirms funding availability on the same day she receives the
                  cost estimate, she can expect that the data ports be ready within the next 14
                  workdays.
                </Typography>
                <Typography variant="body2" style={{ marginTop: '1rem' }}>
                  * In both examples, if a new network closet is to be installed, extra 18 workdays
                  are required.
                </Typography>
              </Grid>
            </Grid>
          </div>
        )}

        {formType === 'AP' && (
          <div style={{ paddingLeft: '24px' }}>
            <Typography variant="h5" style={{ padding: '1rem 0' }}>
              Lead time for installation of wireless access point depends on various factors. HO
              IT&HI aims to complete 90% of installation and the necessary network configuration
              work according to the following:-
            </Typography>
            <Grid container style={{ margin: '1rem', marginLeft: 0 }}>
              <Grid item xs={12} style={{ marginLeft: '2rem' }}>
                <Box component="li" fontWeight={700}>
                  Cat. 1: WLAN coverage from 1 to 5 floors in the same building WITHOUT change to
                  the underlying network infrastructure
                </Box>
              </Grid>
            </Grid>
            <Grid container justifyContent="center" className={classes.tableToxShadow}>
              <TableContainer
                component={Paper}
                style={{ marginBottom: '0.5rem', width: '90%', backgroundColor: 'transparent' }}
              >
                <Table
                  size="small"
                  aria-label="a dense table"
                  padding="none"
                  style={{ borderSpacing: '2px', borderCollapse: 'separate' }}
                >
                  <TableHead>
                    <TableRow>
                      <TableCell {...getCellPros(20, '#ADD8E6', 2)} />
                      <TableCell {...getCellPros(10, '#ADD8E6')} FF6347>
                        No. of floors
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell {...getCellPros(2, '#FF6347')}>1</TableCell>
                      <TableCell {...getCellPros(2, '#FFA500')}>2</TableCell>
                      <TableCell {...getCellPros(2, '#FFFF00')}>3</TableCell>
                      <TableCell {...getCellPros(2, '#3CB371')}>4</TableCell>
                      <TableCell {...getCellPros(2, '#1E90FF')}>5</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell {...getCellPros(12, '#ADD8E6')}>Task</TableCell>
                      <TableCell {...getCellPros(8, '#ADD8E6')}>Party</TableCell>
                      <TableCell {...getCellPros(10, '#ADD8E6')}>Working days required</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {APRowDatas.map((item) => (
                      <>
                        <TableRow>
                          {item.task === 'footer' && (
                            <TableCell
                              {...getCellPros(12, '#FFF', 2)}
                              style={{ backgroundColor: 'transparent', border: 0 }}
                            />
                          )}
                          {item.task !== 'footer' && item.task !== 'empty' && (
                            <TableCell {...getCellPros(12)} align="left">
                              {item.task}
                            </TableCell>
                          )}
                          <TableCell
                            {...getCellPros(
                              8,
                              item.task === 'empty' || item.task === 'footer'
                                ? '#ADD8E6'
                                : undefined
                            )}
                            align={
                              item.task === 'empty' || item.task === 'footer' ? 'center' : 'left'
                            }
                          >
                            {item.party}
                          </TableCell>
                          {item.rowSpan === 1 && (
                            <>
                              <TableCell {...getCellPros(2)}>{item.first}</TableCell>
                              <TableCell {...getCellPros(2)}>{item.second}</TableCell>
                              <TableCell {...getCellPros(2)}>{item.third}</TableCell>
                              <TableCell {...getCellPros(2)}>{item.fourth}</TableCell>
                              <TableCell {...getCellPros(2)}>{item.fifth}</TableCell>
                            </>
                          )}
                          {item.rowSpan === 5 && (
                            <>
                              <TableCell {...getCellPros(2, undefined, 5)}>{item.first}</TableCell>
                              <TableCell {...getCellPros(2, undefined, 5)}>{item.second}</TableCell>
                              <TableCell {...getCellPros(2, undefined, 5)}>{item.third}</TableCell>
                              <TableCell {...getCellPros(2, undefined, 5)}>{item.fourth}</TableCell>
                              <TableCell {...getCellPros(2, undefined, 5)}>{item.fifth}</TableCell>
                            </>
                          )}
                        </TableRow>
                      </>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
            <Grid container style={{ marginTop: '1rem' }}>
              <Grid item xs={12} style={{ marginLeft: '2rem' }}>
                <Box component="li" fontWeight={700}>
                  Cat. 2: WLAN coverage from 1 to 5 floors in the same building WITH change to the
                  underlying network infrastructure
                </Box>
                <Box
                  component="li"
                  style={{ listStyle: 'circle', marginLeft: '3rem', marginBottom: '0.5em' }}
                >
                  Same as the Cat. 1 plus another 10 working days (2 calendar weeks) for changes to
                  the underlying network infrastructure
                </Box>
              </Grid>

              <Grid item xs={12} style={{ marginLeft: '2rem' }}>
                <Box component="li" fontWeight={700}>
                  Cat. 3: Conditions not covered by Cat. 1 & Cat. 2
                </Box>
                <Box component="li" style={{ listStyle: 'circle', marginLeft: '3rem' }}>
                  Lead time is to be separately estimated by HO IT&HI case-by-case.
                </Box>
              </Grid>
            </Grid>
          </div>
        )}
      </div>
      {/* ------------------------------- */}
    </>
  );
};

export default ILTIButton;
