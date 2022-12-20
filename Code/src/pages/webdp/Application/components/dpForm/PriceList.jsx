import React, { useEffect, useState } from 'react';
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
import { formatterMoney } from '../../../../../utils/tools';
import API from '../../../../../api/myAction/index';

const useStyles = makeStyles(() => ({
  tableToxShadow: {
    '& .MuiTableContainer-root': {
      boxShadow: '0 0 0'
    }
  }
}));

const PLButton = () => {
  const { formType } = useParams();

  const classes = useStyles();
  const color = useWebDPColor().title;

  const getCellPros = (align = 'center', colSpan = 1, rowSpan = 1) => ({
    align,
    colSpan,
    rowSpan
  });

  const [dpPriceList, setDpPriceList] = useState([
    {
      ConnectionType:
        'Data port connected to HA Network for accessing HA corporate IT systems at Hospital',
      item1: [
        {
          Unit: 'Single-port',
          Service: 'Install new data port',
          item2: [
            { ConduitType: 'Metallic', cabling: 2450, switch: 800, total: 3250 },
            // { ConduitType: 'Plastic', cabling: 1670, switch: 800, total: 2470 }, //4->3 9->7
            { ConduitType: 'No conduit', cabling: 790, switch: 800, total: 1590 }
          ]
        },
        {
          Unit: 'Single-port',
          Service: 'Relocate data port',
          item2: [
            { ConduitType: 'Metallic', cabling: 2450, switch: 0, total: 2450 },
            // { ConduitType: 'Plastic', cabling: 1670, switch: 0, total: 1670 },
            { ConduitType: 'No conduit', cabling: 790, switch: 0, total: 790 }
          ]
        }
      ]
    },
    {
      ConnectionType:
        'Data port connected to HA Network for accessing HA corporate IT systems at GOPC',
      item1: [
        {
          Unit: 'Dual-port',
          Service: 'Install new data port',
          item2: [
            { ConduitType: 'Metallic', cabling: 3240, switch: 1600, total: 4840 },
            // { ConduitType: 'Plastic', cabling: 2460, switch: 1600, total: 4060 },
            { ConduitType: 'No conduit', cabling: 1500, switch: 1600, total: 3100 }
          ]
        },
        {
          Unit: 'Dual-port',
          Service: 'Relocate data port',
          item2: [
            { ConduitType: 'Metallic', cabling: 3240, switch: 0, total: 3240 },
            // { ConduitType: 'Plastic', cabling: 2460, switch: 0, total: 2460 },
            { ConduitType: 'No conduit', cabling: 1500, switch: 0, total: 1500 }
          ]
        }
      ]
    },
    {
      ConnectionType: 'Data port connected to HA Network for use by Medical/Specialized equipment',
      item1: [
        {
          Unit: 'Single-port',
          Service: 'Install new data port',
          item2: [
            { ConduitType: 'Metallic', cabling: 2450, switch: 3200, total: 5650 },
            // { ConduitType: 'Plastic', cabling: 1670, switch: 3200, total: 4870 },
            { ConduitType: 'No conduit', cabling: 790, switch: 3200, total: 3990 }
          ]
        },
        {
          Unit: 'Single-port',
          Service: 'Relocate data port',
          item2: [
            { ConduitType: 'Metallic', cabling: 2450, switch: 0, total: 2450 },
            // { ConduitType: 'Plastic', cabling: 1670, switch: 0, total: 1670 },
            { ConduitType: 'No conduit', cabling: 790, switch: 0, total: 790 }
          ]
        }
      ]
    }
  ]);

  const [apPriceList, setApPriceList] = useState([
    {
      ConnectionType: 'Access point connected to HA Network for accessing HA corporate IT systems',
      item1: [
        {
          service: 'Install new access point',
          item2: [
            {
              ConduitType: 'Metallic',
              accessPoint: 3750,
              controller: 3000,
              cabling: 2450,
              switch: 800,
              other: 0,
              total: 10000
            },
            {
              ConduitType: 'No conduit',
              accessPoint: 3750,
              controller: 3000,
              cabling: 790,
              switch: 800,
              other: 0,
              total: 8340
            }
          ]
        },
        {
          service: 'Dis-mount or re-mount existing access point',
          item2: [
            {
              ConduitType: 'N/A',
              accessPoint: 0,
              controller: 0,
              cabling: 0,
              switch: 0,
              other: 350,
              total: 350
            }
          ]
        },
        {
          service: 'Re-install access point with new data port',
          item2: [
            {
              ConduitType: 'Metallic',
              accessPoint: 0,
              controller: 0,
              cabling: 2450,
              switch: 0,
              other: 350,
              total: 2800
            },
            {
              ConduitType: 'No conduit',
              accessPoint: 0,
              controller: 0,
              cabling: 790,
              switch: 0,
              other: 350,
              total: 1140
            }
          ]
        }
      ]
    },
    {
      ConnectionType:
        'Access point connected to HA Network for use by Medical/Specialized equipment',
      item1: [
        {
          service: 'Install new access point',
          item2: [
            {
              ConduitType: 'Metallic',
              accessPoint: 3750,
              controller: 3000,
              cabling: 2450,
              switch: 3200,
              other: 0,
              total: 12400
            },
            {
              ConduitType: 'No conduit',
              accessPoint: 3750,
              controller: 3000,
              cabling: 790,
              switch: 3200,
              other: 0,
              total: 10740
            }
          ]
        },
        {
          service: 'Dis-mount or re-mount existing access point',
          item2: [
            {
              ConduitType: 'N/A',
              accessPoint: 0,
              controller: 0,
              cabling: 0,
              switch: 0,
              other: 350,
              total: 350
            }
          ]
        },
        {
          service: 'Re-install access point with new data port',
          item2: [
            {
              ConduitType: 'Metallic',
              accessPoint: 0,
              controller: 0,
              cabling: 2450,
              switch: 0,
              other: 350,
              total: 2800
            },
            {
              ConduitType: 'No conduit',
              accessPoint: 0,
              controller: 0,
              cabling: 790,
              switch: 0,
              other: 350,
              total: 1140
            }
          ]
        }
      ]
    }
  ]);

  useEffect(() => {
    // console.log('useEffect');
    API.getNewPrice().then((res) => {
      // console.log('getNewPrice', res);
      if (res.data.code === 200) {
        processData(res.data.data);
      }
    });
  }, []);

  const processData = (param) => {
    // console.log('processData', param, apPriceList);
    const temp = [...dpPriceList];
    const temp2 = [...apPriceList];
    for (let i = 0; i < param.length; i += 1) {
      // line 1
      if (param[i].keyword === 'NM-DP' && param[i].conduitType === 'Metallic') {
        temp[0].item1[0].item2[0].cabling = param[i].cabling;
        temp[0].item1[0].item2[0].switch = param[i].switchPort;
        temp[0].item1[0].item2[0].total = param[i].cabling + param[i].switchPort;
      }
      // line 2
      if (param[i].keyword === 'NN-DP' && param[i].conduitType === 'No conduit') {
        temp[0].item1[0].item2[1].cabling = param[i].cabling;
        temp[0].item1[0].item2[1].switch = param[i].switchPort;
        temp[0].item1[0].item2[1].total =
          parseFloat(param[i].cabling) + parseFloat(param[i].switchPort);
      }

      // line 3
      if (param[i].keyword === 'RM-DP' && param[i].conduitType === 'Metallic') {
        temp[0].item1[1].item2[0].cabling = param[i].cabling;
        temp[0].item1[1].item2[0].switch = param[i].switchPort;
        temp[0].item1[1].item2[0].total = param[i].cabling + param[i].switchPort;
      }
      // line 4
      if (param[i].keyword === 'RN-DP' && param[i].conduitType === 'No conduit') {
        temp[0].item1[1].item2[1].cabling = param[i].cabling;
        temp[0].item1[1].item2[1].switch = param[i].switchPort;
        temp[0].item1[1].item2[1].total = param[i].cabling + param[i].switchPort;
      }

      // line 5
      if (param[i].keyword === 'DM-DP' && param[i].conduitType === 'Metallic') {
        temp[1].item1[0].item2[0].cabling = param[i].cabling;
        temp[1].item1[0].item2[0].switch = param[i].switchPort;
        temp[1].item1[0].item2[0].total = param[i].cabling + param[i].switchPort;
      }
      // line 6
      if (param[i].keyword === 'DN-DP' && param[i].conduitType === 'No conduit') {
        temp[1].item1[0].item2[1].cabling = param[i].cabling;
        temp[1].item1[0].item2[1].switch = param[i].switchPort;
        temp[1].item1[0].item2[1].total = param[i].cabling + param[i].switchPort;
      }
      // line 7
      if (param[i].keyword === 'LM-DP' && param[i].conduitType === 'Metallic') {
        temp[1].item1[1].item2[0].cabling = param[i].cabling;
        temp[1].item1[1].item2[0].switch = param[i].switchPort;
        temp[1].item1[1].item2[0].total = param[i].cabling + param[i].switchPort;
      }
      // line 8
      if (param[i].keyword === 'LN-DP' && param[i].conduitType === 'No conduit') {
        temp[1].item1[1].item2[1].cabling = param[i].cabling;
        temp[1].item1[1].item2[1].switch = param[i].switchPort;
        temp[1].item1[1].item2[1].total = param[i].cabling + param[i].switchPort;
      }

      // line 9
      if (param[i].keyword === 'NM-External-DP' && param[i].conduitType === 'Metallic') {
        temp[2].item1[0].item2[0].cabling = param[i].cabling;
        temp[2].item1[0].item2[0].switch = param[i].switchPort;
        temp[2].item1[0].item2[0].total = param[i].cabling + param[i].switchPort;
      }
      // line 10
      if (param[i].keyword === 'NN-External-DP' && param[i].conduitType === 'No conduit') {
        temp[2].item1[0].item2[1].cabling = param[i].cabling;
        temp[2].item1[0].item2[1].switch = param[i].switchPort;
        temp[2].item1[0].item2[1].total = param[i].cabling + param[i].switchPort;
      }
      // line 11
      if (param[i].keyword === 'RM-External-DP' && param[i].conduitType === 'Metallic') {
        temp[2].item1[1].item2[0].cabling = param[i].cabling;
        temp[2].item1[1].item2[0].switch = param[i].switchPort;
        temp[2].item1[1].item2[0].total = param[i].cabling + param[i].switchPort;
      }
      // line 12
      if (param[i].keyword === 'RN-External-DP' && param[i].conduitType === 'No conduit') {
        temp[2].item1[1].item2[1].cabling = param[i].cabling;
        temp[2].item1[1].item2[1].switch = param[i].switchPort;
        temp[2].item1[1].item2[1].total = param[i].cabling + param[i].switchPort;
      }

      // AP line 1
      if (param[i].keyword === 'NM-AP' && param[i].conduitType === 'Metallic') {
        temp2[0].item1[0].item2[0].accessPoint = param[i].accessPoint;
        temp2[0].item1[0].item2[0].controller = param[i].controller;
        temp2[0].item1[0].item2[0].other = param[i].otherCharge;
        temp2[0].item1[0].item2[0].cabling = param[i].cabling;
        temp2[0].item1[0].item2[0].switch = param[i].switchPort;
        temp2[0].item1[0].item2[0].total =
          param[i].accessPoint +
          param[i].controller +
          param[i].otherCharge +
          param[i].cabling +
          param[i].switchPort;
      }
      // AP line 2
      if (param[i].keyword === 'NN-AP' && param[i].conduitType === 'No conduit') {
        temp2[0].item1[0].item2[1].accessPoint = param[i].accessPoint;
        temp2[0].item1[0].item2[1].controller = param[i].controller;
        temp2[0].item1[0].item2[1].other = param[i].otherCharge;
        temp2[0].item1[0].item2[1].cabling = param[i].cabling;
        temp2[0].item1[0].item2[1].switch = param[i].switchPort;
        temp2[0].item1[0].item2[1].total =
          param[i].accessPoint +
          param[i].controller +
          param[i].otherCharge +
          param[i].cabling +
          param[i].switchPort;
      }
      // AP line 3
      if (param[i].keyword === 'N/A-AP') {
        temp2[0].item1[1].item2[0].accessPoint = param[i].accessPoint;
        temp2[0].item1[1].item2[0].controller = param[i].controller;
        temp2[0].item1[1].item2[0].other = param[i].otherCharge;
        temp2[0].item1[1].item2[0].cabling = param[i].cabling;
        temp2[0].item1[1].item2[0].switch = param[i].switchPort;
        temp2[0].item1[1].item2[0].total =
          param[i].accessPoint +
          param[i].controller +
          param[i].otherCharge +
          param[i].cabling +
          param[i].switchPort;
      }
      // AP line 4
      if (param[i].keyword === 'RM-AP' && param[i].conduitType === 'Metallic') {
        temp2[0].item1[2].item2[0].accessPoint = param[i].accessPoint;
        temp2[0].item1[2].item2[0].controller = param[i].controller;
        temp2[0].item1[2].item2[0].other = param[i].otherCharge;
        temp2[0].item1[2].item2[0].cabling = param[i].cabling;
        temp2[0].item1[2].item2[0].switch = param[i].switchPort;
        temp2[0].item1[2].item2[0].total =
          param[i].accessPoint +
          param[i].controller +
          param[i].otherCharge +
          param[i].cabling +
          param[i].switchPort;
      }
      // AP line 5
      if (param[i].keyword === 'RN-AP' && param[i].conduitType === 'No conduit') {
        temp2[0].item1[2].item2[1].accessPoint = param[i].accessPoint;
        temp2[0].item1[2].item2[1].controller = param[i].controller;
        temp2[0].item1[2].item2[1].other = param[i].otherCharge;
        temp2[0].item1[2].item2[1].cabling = param[i].cabling;
        temp2[0].item1[2].item2[1].switch = param[i].switchPort;
        temp2[0].item1[2].item2[1].total =
          param[i].accessPoint +
          param[i].controller +
          param[i].otherCharge +
          param[i].cabling +
          param[i].switchPort;
      }

      // AP line 6
      if (param[i].keyword === 'NM-External-AP' && param[i].conduitType === 'Metallic') {
        temp2[1].item1[0].item2[0].accessPoint = param[i].accessPoint;
        temp2[1].item1[0].item2[0].controller = param[i].controller;
        temp2[1].item1[0].item2[0].other = param[i].otherCharge;
        temp2[1].item1[0].item2[0].cabling = param[i].cabling;
        temp2[1].item1[0].item2[0].switch = param[i].switchPort;
        temp2[1].item1[0].item2[0].total =
          param[i].accessPoint +
          param[i].controller +
          param[i].otherCharge +
          param[i].cabling +
          param[i].switchPort;
      }
      // AP line 7
      if (param[i].keyword === 'NN-External-AP' && param[i].conduitType === 'No conduit') {
        temp2[1].item1[0].item2[1].accessPoint = param[i].accessPoint;
        temp2[1].item1[0].item2[1].controller = param[i].controller;
        temp2[1].item1[0].item2[1].other = param[i].otherCharge;
        temp2[1].item1[0].item2[1].cabling = param[i].cabling;
        temp2[1].item1[0].item2[1].switch = param[i].switchPort;
        temp2[1].item1[0].item2[1].total =
          param[i].accessPoint +
          param[i].controller +
          param[i].otherCharge +
          param[i].cabling +
          param[i].switchPort;
      }
      // AP line 8
      if (param[i].keyword === 'N/A-External-AP') {
        temp2[1].item1[1].item2[0].accessPoint = param[i].accessPoint;
        temp2[1].item1[1].item2[0].controller = param[i].controller;
        temp2[1].item1[1].item2[0].other = param[i].otherCharge;
        temp2[1].item1[1].item2[0].cabling = param[i].cabling;
        temp2[1].item1[1].item2[0].switch = param[i].switchPort;
        temp2[1].item1[1].item2[0].total =
          param[i].accessPoint +
          param[i].controller +
          param[i].otherCharge +
          param[i].cabling +
          param[i].switchPort;
      }
      // AP line 9
      if (param[i].keyword === 'RM-External-AP' && param[i].conduitType === 'Metallic') {
        temp2[1].item1[2].item2[0].accessPoint = param[i].accessPoint;
        temp2[1].item1[2].item2[0].controller = param[i].controller;
        temp2[1].item1[2].item2[0].other = param[i].otherCharge;
        temp2[1].item1[2].item2[0].cabling = param[i].cabling;
        temp2[1].item1[2].item2[0].switch = param[i].switchPort;
        temp2[1].item1[2].item2[0].total =
          param[i].accessPoint +
          param[i].controller +
          param[i].otherCharge +
          param[i].cabling +
          param[i].switchPort;
      }
      // AP line 10
      if (param[i].keyword === 'RN-External-AP' && param[i].conduitType === 'No conduit') {
        temp2[1].item1[2].item2[1].accessPoint = param[i].accessPoint;
        temp2[1].item1[2].item2[1].controller = param[i].controller;
        temp2[1].item1[2].item2[1].other = param[i].otherCharge;
        temp2[1].item1[2].item2[1].cabling = param[i].cabling;
        temp2[1].item1[2].item2[1].switch = param[i].switchPort;
        temp2[1].item1[2].item2[1].total =
          param[i].accessPoint +
          param[i].controller +
          param[i].otherCharge +
          param[i].cabling +
          param[i].switchPort;
      }
    }
    setDpPriceList(temp);
    setApPriceList(temp2);
  };

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
          Installation Price List
        </DialogTitle>
        {formType === 'DP' && (
          <div style={{ paddingLeft: '24px', overflowY: 'auto', minHeight: 720 }}>
            <Typography variant="h5" style={{ padding: '1rem 0' }}>
              The charges of the below items are for reference only. The actual cost estimation may
              vary due to many factors.
            </Typography>

            <Grid container justifyContent="center" className={classes.tableToxShadow}>
              <TableContainer
                component={Paper}
                style={{ marginBottom: '0.5rem', width: '95%', backgroundColor: 'transparent' }}
              >
                <Table
                  size="small"
                  aria-label="a dense table"
                  padding="none"
                  style={{ border: '2px solid #fff' }}
                >
                  <TableHead>
                    <TableRow>
                      <TableCell
                        {...getCellPros('center', 1, 1)}
                        style={{
                          width: '20%',
                          background: '#ADD8E6',
                          border: '2px solid #fff',
                          height: 60
                        }}
                      >
                        Connection Type
                      </TableCell>
                      <TableCell
                        {...getCellPros('center', 1, 1)}
                        style={{ width: '20%', background: '#ADD8E6', border: '2px solid #fff' }}
                      >
                        Unit
                      </TableCell>
                      <TableCell
                        {...getCellPros('center', 1, 1)}
                        style={{ width: '15%', background: '#ADD8E6', border: '2px solid #fff' }}
                      >
                        Service
                      </TableCell>
                      <TableCell
                        {...getCellPros('center')}
                        style={{ width: '15%', background: '#ADD8E6', border: '2px solid #fff' }}
                      >
                        Conduit Type
                      </TableCell>
                      <TableCell
                        {...getCellPros('center')}
                        style={{ width: '10%', background: '#ADD8E6', border: '2px solid #fff' }}
                      >
                        Cabling (HK$)
                      </TableCell>
                      <TableCell
                        {...getCellPros('center')}
                        style={{ width: '10%', background: '#ADD8E6', border: '2px solid #fff' }}
                      >
                        Switch Port (HK$)
                      </TableCell>
                      <TableCell
                        {...getCellPros('center')}
                        style={{ width: '10%', background: '#ADD8E6', border: '2px solid #fff' }}
                      >
                        Total (HK$)
                      </TableCell>
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {dpPriceList.map((item, index) => {
                      const unitItem = item.item1;
                      // console.log('dpPriceList-----', item, unitItem);

                      const unit = unitItem.map((item1, index1) => {
                        const objItem = item1.item2;
                        // console.log('unit', item1);
                        const objhtml = objItem.map((item2, index2) => (
                          // console.log('objitem', item2);
                          <React.Fragment key={`DPitem2${index2}`}>
                            <TableRow>
                              <TableCell
                                {...getCellPros('left', 1, 1)}
                                style={{
                                  background: '#e6f7ff',
                                  padding: 5,
                                  border: '2px solid #fff',
                                  height: 60
                                }}
                              >
                                {item2.ConduitType}
                              </TableCell>
                              <TableCell
                                {...getCellPros('right', 1, 1)}
                                style={{
                                  background: '#e6f7ff',
                                  padding: 5,
                                  border: '2px solid #fff',
                                  height: 60
                                }}
                              >
                                {formatterMoney(item2.cabling)}
                              </TableCell>
                              <TableCell
                                {...getCellPros('right', 1, 1)}
                                style={{
                                  background: '#e6f7ff',
                                  padding: 5,
                                  border: '2px solid #fff',
                                  height: 60
                                }}
                              >
                                {item2.switch === 0 ? '-' : formatterMoney(item2.switch)}
                              </TableCell>
                              <TableCell
                                {...getCellPros('right', 1, 1)}
                                style={{
                                  background: '#e6f7ff',
                                  padding: 5,
                                  border: '2px solid #fff',
                                  height: 60
                                }}
                              >
                                {formatterMoney(item2.total)}
                              </TableCell>
                            </TableRow>
                          </React.Fragment>
                        ));

                        return (
                          <React.Fragment key={`DPitem1${index1}`}>
                            <TableRow>
                              <TableCell
                                {...getCellPros('left', 1, 3)}
                                style={{
                                  background: '#e6f7ff',
                                  padding: 5,
                                  border: '2px solid #fff'
                                }}
                              >
                                {item1.Unit}
                              </TableCell>
                              <TableCell
                                {...getCellPros('left', 1, 3)}
                                style={{
                                  background: '#e6f7ff',
                                  padding: 5,
                                  border: '2px solid #fff'
                                }}
                              >
                                {item1.Service}
                              </TableCell>
                            </TableRow>
                            {objhtml}
                          </React.Fragment>
                        );
                      });

                      return (
                        <React.Fragment key={`DPitem${index}`}>
                          <TableRow>
                            <TableCell
                              {...getCellPros('left', 1, 7)}
                              style={{
                                background: '#e6f7ff',
                                padding: 5,
                                border: '2px solid #fff'
                              }}
                            >
                              {item.ConnectionType}
                            </TableCell>
                          </TableRow>
                          {unit}
                        </React.Fragment>
                      );
                    })}

                    <TableRow>
                      <TableCell
                        {...getCellPros('left', 1, 1)}
                        style={{ background: '#e6f7ff', padding: 5, border: '2px solid #fff' }}
                      >
                        Migration of data port from HA Network to Medical/Specialized Network
                      </TableCell>
                      <TableCell
                        {...getCellPros('left', 5, 1)}
                        style={{ background: '#e6f7ff', padding: 5, border: '2px solid #fff' }}
                      />
                      <TableCell
                        {...getCellPros('right', 1, 1)}
                        style={{
                          background: '#e6f7ff',
                          padding: 5,
                          border: '2px solid #fff',
                          height: 60
                        }}
                      >
                        {formatterMoney(3970)}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>

            <Grid container style={{ marginTop: '1rem', fontSize: '1.125rem' }}>
              <Grid item xs={12}>
                <Box fontWeight={500} style={{ marginTop: 25 }}>
                  Notes
                </Box>
                <Box style={{ marginLeft: '2rem', marginBottom: '0.5em' }}>
                  1. Price review will be carried out once a year or when necessary.
                </Box>
                <Box style={{ marginLeft: '2rem', marginBottom: '0.5em' }}>
                  2. The above standard unit prices do not apply to buildings that without HA
                  network presence.
                </Box>
                <Box style={{ marginLeft: '2rem', marginBottom: '0.5em' }}>
                  3. Some hospital development or renovation projects require relocating the
                  existing network cabinets/server rooms, re-laying of backbone cables or setup of
                  new network infrastructure at buildings that have no network. To ensure proper
                  planning of network setup and that quotations from HOIT&HI can be provided in time
                  for requesters to seek budget, requesters are advised to inform HOIT&HI N3 Team in
                  the early planning stage.
                </Box>

                <Box fontWeight={500} style={{ marginTop: 25 }}>
                  Price Structure
                </Box>
                <Box fontWeight={500} style={{ marginTop: 5 }}>
                  Price of a data port includes the following:-
                </Box>
                <Box style={{ marginLeft: '2rem' }}>
                  1. The data port itself and the data cable that connects the data port to the
                  nearest network closet.
                </Box>
                <Box style={{ marginLeft: '2rem' }}>
                  2. If necessary, the conduit that protects the data cable.
                </Box>
                <Box style={{ marginLeft: '2rem' }}>
                  3. One 3-metre patch cable for connection of the PC workstation to the data port.
                </Box>
                <Box style={{ marginLeft: '2rem' }}>
                  4. A portion of the network equipment cost. We call this the 'switch port' charge.
                  Please read further if you are interested to know the concept of this 'switch
                  port' charge.
                </Box>

                <Box fontWeight={500} style={{ marginTop: 25 }}>
                  About the 'Switch Port' Charge
                </Box>
                <Box fontWeight={500} style={{ marginTop: 5 }}>
                  'Switch port' charge is required for each data port installation. It operates in a
                  sharing basis. That means, every data port user has to pay the 'switch port' cost
                  in addition to the cabling cost. This contribution will be accumulated in a share
                  vote and will be used to purchase network resources to enable connection of data
                  ports to the HA data network. The following scenarios used to happen before the
                  implementation of this 'switch port' charge can be minimized:-
                </Box>
                <Box style={{ marginLeft: '2rem' }}>
                  1. A network switch usually provides 24 or 48 ports. f all free ports of the
                  existing network switch are occupied, an individual data port user has to pay for
                  a new network switch and the related cabling accessories. he cost is about 8 times
                  than just installing a data port.
                </Box>
                <Box style={{ marginLeft: '2rem' }}>
                  2. If a user requests a data port to be installed at a location that has not been
                  covered by the HA network, the user has to pay for all the network infrastructure
                  cost. The cost is about 25 times than just installing a data port.
                </Box>

                <Box fontWeight={500} style={{ marginTop: 25 }}>
                  This 'switch port' concept is very similar to setting up public antenna in
                  residential building. Every owner of the building is required to contribute a
                  portion of the antenna cost otherwise each one has to install and maintain his own
                  antenna. It will be uneconomical and impractical at floor space and on-going
                  maintenance aspects.
                </Box>
              </Grid>
            </Grid>
          </div>
        )}

        {formType === 'AP' && (
          <div style={{ paddingLeft: '24px' }}>
            <Typography variant="h5" style={{ padding: '1rem 0' }}>
              The charges of the below items are for reference only. The actual cost estimation may
              vary due to many factors.
            </Typography>

            <Grid container justifyContent="center" className={classes.tableToxShadow}>
              <TableContainer
                component={Paper}
                style={{ marginBottom: '0.5rem', width: '95%', backgroundColor: 'transparent' }}
              >
                <Table
                  size="small"
                  aria-label="a dense table"
                  padding="none"
                  style={{ border: '2px solid #fff' }}
                >
                  <TableHead>
                    <TableRow>
                      <TableCell
                        {...getCellPros('center', 1, 1)}
                        style={{
                          width: '15%',
                          background: '#ADD8E6',
                          border: '2px solid #fff',
                          height: 60
                        }}
                      >
                        Connection Type
                      </TableCell>
                      <TableCell
                        {...getCellPros('center', 1, 1)}
                        style={{
                          width: '15%',
                          background: '#ADD8E6',
                          border: '2px solid #fff',
                          height: 60
                        }}
                      >
                        Service (per Access Point)
                      </TableCell>
                      <TableCell
                        {...getCellPros('center', 1, 1)}
                        style={{
                          width: '10%',
                          background: '#ADD8E6',
                          border: '2px solid #fff',
                          height: 60
                        }}
                      >
                        Conduit Type
                      </TableCell>

                      <TableCell
                        {...getCellPros('center', 1, 1)}
                        style={{
                          width: '10%',
                          background: '#ADD8E6',
                          border: '2px solid #fff',
                          height: 60
                        }}
                      >
                        Access Point (HK)$
                      </TableCell>
                      <TableCell
                        {...getCellPros('center', 1, 1)}
                        style={{
                          width: '10%',
                          background: '#ADD8E6',
                          border: '2px solid #fff',
                          height: 60
                        }}
                      >
                        Controller (HK)$
                      </TableCell>
                      <TableCell
                        {...getCellPros('center', 1, 1)}
                        style={{
                          width: '10%',
                          background: '#ADD8E6',
                          border: '2px solid #fff',
                          height: 60
                        }}
                      >
                        Cabling (HK)$
                      </TableCell>
                      <TableCell
                        {...getCellPros('center', 1, 1)}
                        style={{
                          width: '10%',
                          background: '#ADD8E6',
                          border: '2px solid #fff',
                          height: 60
                        }}
                      >
                        Switch Port (HK)$
                      </TableCell>
                      <TableCell
                        {...getCellPros('center', 1, 1)}
                        style={{
                          width: '10%',
                          background: '#ADD8E6',
                          border: '2px solid #fff',
                          height: 60
                        }}
                      >
                        Other Charge (HK)$
                      </TableCell>
                      <TableCell
                        {...getCellPros('center', 1, 1)}
                        style={{
                          width: '10%',
                          background: '#ADD8E6',
                          border: '2px solid #fff',
                          height: 60
                        }}
                      >
                        Total (HK)$
                      </TableCell>
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {apPriceList.map((item, index) => {
                      const tempItem1 = item.item1;
                      // console.log('apPriceList ---', item, tempItem1);

                      const tempHtml01 = tempItem1.map((item1, index1) => {
                        const tempItem2 = item1.item2;
                        let rowValue = 2;
                        let heightValue = 120;
                        if (tempItem2.length > 1) {
                          rowValue = 3;
                          heightValue = 60;
                        }
                        // console.log('tempItem1--', item1, tempItem2);

                        const tempHtml02 = tempItem2.map((item2, index2) => (
                          // console.log('tempItem2', item2);
                          <React.Fragment key={`APitem2${index2}`}>
                            <TableRow>
                              <TableCell
                                {...getCellPros('left', 1, 1)}
                                style={{
                                  background: '#e6f7ff',
                                  padding: 5,
                                  border: '2px solid #fff',
                                  height: heightValue
                                }}
                              >
                                {item2.ConduitType}
                              </TableCell>
                              <TableCell
                                {...getCellPros('right', 1, 1)}
                                style={{
                                  background: '#e6f7ff',
                                  padding: 5,
                                  border: '2px solid #fff'
                                }}
                              >
                                {item2.accessPoint === 0 ? '-' : formatterMoney(item2.accessPoint)}
                              </TableCell>
                              <TableCell
                                {...getCellPros('right', 1, 1)}
                                style={{
                                  background: '#e6f7ff',
                                  padding: 5,
                                  border: '2px solid #fff'
                                }}
                              >
                                {item2.controller === 0 ? '-' : formatterMoney(item2.controller)}
                              </TableCell>
                              <TableCell
                                {...getCellPros('right', 1, 1)}
                                style={{
                                  background: '#e6f7ff',
                                  padding: 5,
                                  border: '2px solid #fff'
                                }}
                              >
                                {item2.cabling === 0 ? '-' : formatterMoney(item2.cabling)}
                              </TableCell>
                              <TableCell
                                {...getCellPros('right', 1, 1)}
                                style={{
                                  background: '#e6f7ff',
                                  padding: 5,
                                  border: '2px solid #fff'
                                }}
                              >
                                {item2.switch === 0 ? '-' : formatterMoney(item2.switch)}
                              </TableCell>
                              <TableCell
                                {...getCellPros('right', 1, 1)}
                                style={{
                                  background: '#e6f7ff',
                                  padding: 5,
                                  border: '2px solid #fff'
                                }}
                              >
                                {item2.other === 0 ? '-' : formatterMoney(item2.other)}
                              </TableCell>
                              <TableCell
                                {...getCellPros('right', 1, 1)}
                                style={{
                                  background: '#e6f7ff',
                                  padding: 5,
                                  border: '2px solid #fff'
                                }}
                              >
                                {formatterMoney(item2.total)}
                              </TableCell>
                            </TableRow>
                          </React.Fragment>
                        ));

                        return (
                          <React.Fragment key={`APitem1${index1}`}>
                            <TableRow>
                              <TableCell
                                {...getCellPros('left', 1, rowValue)}
                                style={{
                                  background: '#e6f7ff',
                                  padding: 5,
                                  border: '2px solid #fff'
                                }}
                              >
                                {item1.service}
                              </TableCell>
                            </TableRow>
                            {tempHtml02}
                          </React.Fragment>
                        );
                      });

                      return (
                        <React.Fragment key={`APitem${index}`}>
                          <TableRow>
                            <TableCell
                              {...getCellPros('left', 1, 9)}
                              style={{
                                background: '#e6f7ff',
                                padding: 5,
                                border: '2px solid #fff'
                              }}
                            >
                              {item.ConnectionType}
                            </TableCell>
                          </TableRow>
                          {tempHtml01}
                        </React.Fragment>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>

            <Grid container style={{ marginTop: '1rem', fontSize: '1.125rem' }}>
              <Grid item xs={12}>
                <Box fontWeight={500} style={{ marginTop: 25 }}>
                  Notes
                </Box>
                <Box style={{ marginLeft: '2rem', marginBottom: '0.5em' }}>
                  1. Price review will be carried out once a year or when necessary.
                </Box>
                <Box style={{ marginLeft: '2rem', marginBottom: '0.5em' }}>
                  2. The above standard unit prices do not apply to buildings that without HA
                  network presence.
                </Box>

                <Box fontWeight={500} style={{ marginTop: 25 }}>
                  Some hospital development or renovation projects require relocating the existing
                  network cabinets/server rooms, re-laying of backbone cables or setup of new
                  network infrastructure at buildings that have no network. To ensure proper
                  planning of network setup and that cost estimation from HOIT&HI can be provided in
                  time for requesters to seek budget, requesters are advised to inform HOIT&HI N3
                  Team in the early planning stage.
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

export default PLButton;
