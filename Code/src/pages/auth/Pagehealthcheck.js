import React, { useEffect, useState } from 'react';
import {
  Grid,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell
} from '@material-ui/core';
import checkAPI from '../../api/healthCheck';
import envUrl from '../../utils/baseUrl';

function PageHealthCheck() {
  const [health, setHealth] = useState('');
  const [env, setEnv] = useState('');
  const [serverList, setServerList] = useState([]);

  useEffect(() => {
    checkProcessor();
  }, []);

  setTimeout(() => {
    getResult();
  }, 3000);

  const checkProcessor = () => {
    Promise.all([
      checkAPI.checkAaa(),
      checkAPI.checkProject(),
      checkAPI.checkEmail(),
      checkAPI.checkFile(),
      checkAPI.checkCamunda(),
      checkAPI.checkWebdp()
    ])
      .then(() => {
        setHealth('healthy');
        detailCheck();
      })
      .catch(() => {
        setHealth('unhealthy');
        setTimeout(() => {
          detailCheck();
        }, 4000);
      });
  };

  const detailCheck = () => {
    const tempList = [
      { id: 1, name: 'webDPServer', status: 'unalive' },
      { id: 2, name: 'CammundaServer', status: 'unalive' },
      { id: 3, name: 'filesServer', status: 'unalive' },
      { id: 4, name: 'EmailServer', status: 'unalive' },
      { id: 5, name: 'ProjectServer', status: 'unalive' },
      { id: 6, name: 'AAAServer', status: 'unalive' },
      { id: 7, name: 'DataSyncServer', status: 'unalive' },
      { id: 8, name: 'QuartzServer', status: 'unalive' }
      // { id: 9, name: 'IPassignServer', status: 'unalive' }
    ];

    checkAPI
      .checkWebdp()
      .then(() => {
        tempList[0].status = 'alive';
      })
      .finally(() => {
        setServerList([...tempList]);
      });
    checkAPI
      .checkCamunda()
      .then(() => {
        tempList[1].status = 'alive';
      })
      .finally(() => {
        setServerList([...tempList]);
      });
    checkAPI
      .checkFile()
      .then(() => {
        tempList[2].status = 'alive';
      })
      .finally(() => {
        setServerList([...tempList]);
      });
    checkAPI
      .checkEmail()
      .then(() => {
        tempList[3].status = 'alive';
      })
      .finally(() => {
        setServerList([...tempList]);
      });
    checkAPI
      .checkProject()
      .then(() => {
        tempList[4].status = 'alive';
      })
      .finally(() => {
        setServerList([...tempList]);
      });
    checkAPI
      .checkAaa()
      .then(() => {
        tempList[5].status = 'alive';
      })
      .finally(() => {
        setServerList([...tempList]);
      });
    checkAPI
      .checkDatasync()
      .then(() => {
        tempList[6].status = 'alive';
      })
      .finally(() => {
        setServerList([...tempList]);
      });
    checkAPI
      .checkQuartz()
      .then(() => {
        tempList[7].status = 'alive';
      })
      .finally(() => {
        setServerList([...tempList]);
      });
  };

  const getResult = () => {
    if (health !== '') {
      const webdpURL = envUrl.webdp;
      // console.log('envUrl', webdpURL);

      const currentUrl = webdpURL;
      const temparr = currentUrl.split('.');
      for (let i = 0; i < temparr.length; i += 1) {
        // dev
        if (temparr[i] === 'https://inbound-sense-dev') {
          setEnv(`${health} DC6`);
        }
        // st
        if (temparr[i] === 'https://inbound-sense-dev-2') {
          setEnv(`${health} DC7`);
        }
        // uat or prod
        if (temparr[i] === 'cldpaasp61') {
          setEnv(`${health} DC6`);
        }
        if (temparr[i] === 'cldpaasp71') {
          setEnv(`${health} DC7`);
        }
        if (temparr[i] === 'https://webdp-service-dev-sense-dev') {
          setEnv(`${health} DC6`);
        }
      }
    }
  };

  return (
    <>
      <div style={{ marginTop: 20, marginLeft: 5 }}>{env}</div>
      {env === '' ? (
        <></>
      ) : (
        <div style={{ marginTop: 20 }}>
          <Grid item xs={12}>
            <TableContainer>
              <Table style={{ backgroundColor: '#9acef9', border: '2px solid #fff' }}>
                <TableHead>
                  <TableRow style={{ backgroundColor: '#078080', height: 60 }}>
                    <TableCell
                      align="left"
                      colSpan={4}
                      style={{
                        width: 20,
                        color: 'white',
                        border: '2px solid #fff',
                        fontWeight: 'bold'
                      }}
                    >
                      ID
                    </TableCell>
                    <TableCell
                      align="left"
                      colSpan={4}
                      style={{
                        width: 50,
                        color: 'white',
                        border: '2px solid #fff',
                        fontWeight: 'bold'
                      }}
                    >
                      ServiceName
                    </TableCell>
                    <TableCell
                      align="left"
                      colSpan={4}
                      style={{
                        width: 100,
                        color: 'white',
                        border: '2px solid #fff',
                        fontWeight: 'bold'
                      }}
                    >
                      Status
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {serverList.map((item) => (
                    <React.Fragment key={item.id}>
                      <TableRow>
                        <TableCell
                          align="left"
                          colSpan={4}
                          style={{ width: 20, border: '2px solid #fff', color: '#000' }}
                        >
                          {item.id}
                        </TableCell>
                        <TableCell
                          align="left"
                          colSpan={4}
                          style={{ width: 50, border: '2px solid #fff', color: '#000' }}
                        >
                          {item.name}
                        </TableCell>
                        <TableCell
                          align="left"
                          colSpan={4}
                          style={{ width: 100, border: '2px solid #fff', color: '#000' }}
                        >
                          {item.status}
                        </TableCell>
                      </TableRow>
                    </React.Fragment>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        </div>
      )}
    </>
  );
}

export default PageHealthCheck;
