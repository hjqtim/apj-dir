import { useSelector } from 'react-redux';
import React, { useState, useEffect } from 'react';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import TrendingUpIcon from '@material-ui/icons/TrendingUp';
import { makeStyles, Drawer, IconButton, Typography, Tooltip } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import { CommonDataGrid, CommonDialog, CommonTip } from '../../../../../components';

const useStyles = makeStyles((theme) => ({
  list: {
    '& .MuiDrawer-paperAnchorRight': {
      width: '1200px'
    }
  },
  headerStyle: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    background: theme.palette.primary.main,
    color: '#fff',
    padding: theme.spacing(0, 5)
  },
  title: {
    padding: theme.spacing(10, 0, 5, 5)
  }
}));

const DrawerDetail = (props) => {
  const { drawerOpen, setDrawerOpen, currentRow } = props;
  const url = 'http://160.85.114.112/hs/scripts/dpms/dpmap/index.asp?AccessAP=';
  const [wirelessRows, setWirelessRows] = useState([]);
  const [externalRows, setExternalRows] = useState([]);
  const [open, setOpen] = useState(false);
  const [group, setGroup] = useState('');
  const [ipAddress, setIpAddress] = useState('');
  const classes = useStyles();
  const user = useSelector((state) => state.userReducer?.currentUser) || {};

  const toggleDrawer = () => {
    setDrawerOpen(false);
  };

  const wirelesscolumns = [
    {
      field: 'hospital',
      headerName: 'Institution',
      flex: 1
    },
    {
      field: 'block',
      headerName: 'Block',
      flex: 1
    },
    {
      field: 'floor',
      headerName: 'Floor',
      flex: 1
    },
    {
      field: 'room',
      headerName: 'Room',
      flex: 1
    },
    {
      field: 'modelDesc',
      headerName: 'Model',
      hide: group !== 'N3',
      flex: 1
    },
    {
      field: 'equipType',
      headerName: 'AP Type',
      valueFormatter: ({ row }) => {
        const { modelDesc = '' } = row;
        const modelArr = modelDesc.split(' ');
        const str = modelArr.find((item) => item?.includes('802.11'));
        let value = '';
        if (str?.includes('abg')) {
          value = `802.11 a/b/g`;
        } else if (str?.includes('n')) {
          value = `802.11 n`;
        } else if (str?.includes('ac')) {
          value = `802.11 n`;
        }
        return value;
      },
      flex: 1
    },
    {
      field: 'status',
      headerName: 'Status',
      flex: 1
    },
    {
      field: 'networkApplied',
      headerName: `Covered Area / HA or External Network(#1)`,
      renderCell: (params) => showNetworkApplied(params),
      flex: 1
    },
    {
      field: 'secondaryNw',
      headerName: 'Backup to Fixed Network(#2)',
      valueFormatter: ({ value }) => (value === 1 ? 'Y' : 'N'),
      flex: 1
    },
    {
      field: 'expDisconnect',
      headerName: 'Link will drop when move across different AP of the same floor(#3)',
      valueFormatter: ({ value }) => (value === 1 ? 'Y' : 'N'),
      flex: 1
    }
  ];

  const showNetworkApplied = (params) => {
    const { value, row } = params;
    let val = '';
    if (value?.includes('NW1')) {
      val = 'HA';
    } else if (value?.includes('NW2')) {
      val = 'MNI';
    } else if (!row?.ipAddress && !value) {
      val = '';
    }

    return val ? (
      <div>
        <span
          style={{ color: '#229FFA' }}
          onClick={() => {
            setOpen(true);
            setIpAddress(row?.ipAddress);
          }}
        >
          View
        </span>
        / {val}
      </div>
    ) : (
      <span>N / A</span>
    );
  };

  const externalRowsColumns = [
    {
      field: 'hospital',
      headerName: 'Hospital',
      flex: 1
    },
    {
      field: 'block',
      headerName: 'Block',
      flex: 1
    },
    {
      field: 'firewall',
      headerName: 'Firewall',
      valueFormatter: ({ value }) => (value === 1 ? 'Y' : 'N'),
      flex: 1
    },
    {
      field: 'statusL3',
      headerName: 'Virtual Switch',
      flex: 1
    },
    {
      field: 'remarks',
      headerName: 'Remarks',
      flex: 1
    }
  ];

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    if (user) {
      const regex = /\((.+?)\)/;
      const team = user?.displayName?.match(regex);
      setGroup(team ? team[1] : '');
    }

    setWirelessRows(currentRow?.wireless || []);
    // setWirelessRows([
    //   {
    //     id: 1,
    //     hospital: 'ABGOPC',
    //     block: 'Whole Campus (Core)',
    //     floor: 'G',
    //     room: 'CRSSC',
    //     model: 'Cisco Aironet 3500i Ctrlr-based 802.11a/g/n AP (60-MW)',
    //     aPType: '802.11 ac',
    //     status: 'Production ',
    //     coveredArea: 'HA',
    //     backupTto: 'Yes',
    //     networkApplied: 'djjdjdNW1ll',
    //     expDisconnect: 1,
    //     secondaryNw: 1,
    //     link: 'No'
    //   }
    // ]);

    setExternalRows(currentRow?.externalNetwork || []);
    // setExternalRows([
    //   {
    //     id: 1,
    //     hospital: 'ABGOPC',
    //     block: 'Whole Campus (Core)',
    //     firewall: 'N',
    //     virtualSwitch: 'Y',
    //     remarks: 'remark'
    //   }
    // ]);
  }, [currentRow]);

  return (
    <div>
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={toggleDrawer}
        classes={{ root: classes.list }}
      >
        <div className={classes.headerStyle}>
          <Typography variant="h4"> Detail</Typography>
          <IconButton onClick={toggleDrawer}>
            <CloseIcon style={{ color: '#fff' }} />
          </IconButton>
        </div>
        <div>
          <Typography variant="h3" className={classes.title}>
            Wireless Network Coverage (Data Under Verification)
          </Typography>
          <CommonDataGrid
            hideFooter
            rows={wirelessRows}
            columns={wirelesscolumns}
            minHeight="100px"
          />
        </div>
        <div>
          <Typography variant="h3" className={classes.title}>
            External Network Interface Coverage (formerly known as Medical Network)
          </Typography>
          <CommonDataGrid
            hideFooter
            rows={externalRows}
            columns={externalRowsColumns}
            minHeight="100px"
          />
        </div>
      </Drawer>

      {/* Copy prompt  */}
      <CommonDialog
        open={open}
        title="Please copy the link open in IE browser"
        content={
          <div
            style={{
              padding: '20px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            <span>{url + ipAddress || ''}</span>
            <div style={{ width: '100px' }}>
              <Tooltip placement="top" title="Go to">
                <IconButton
                  onClick={() => {
                    window.open(url + ipAddress, '_blank');
                  }}
                >
                  <TrendingUpIcon />
                </IconButton>
              </Tooltip>

              <Tooltip placement="top" title="Copy Link">
                <IconButton
                  onClick={() => {
                    navigator.clipboard.writeText(url + ipAddress || '');
                    CommonTip.success(`Copied successfully.`);
                    handleClose();
                  }}
                >
                  <FileCopyIcon />
                </IconButton>
              </Tooltip>
            </div>
          </div>
        }
        handleClose={handleClose}
      />
    </div>
  );
};
export default DrawerDetail;
