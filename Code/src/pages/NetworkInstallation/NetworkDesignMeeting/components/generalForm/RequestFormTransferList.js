import React, { memo, useEffect } from 'react';
import { useFormik } from 'formik';
import { Grid, Typography, makeStyles, IconButton, Tooltip } from '@material-ui/core';
import { GridToolbarContainer, GridToolbarFilterButton } from '@material-ui/data-grid';
// import _ from 'lodash';
import { useSelector } from 'react-redux'; // load from redux
import useTitleProps from '../../../../../models/webdp/PropsModels/useTitleProps';
import useWebDPColor from '../../../../../hooks/webDP/useWebDPColor';
import FormControlProps from '../../../../../models/webdp/PropsModels/FormControlProps';
// import meetingAPI from '../../../../../api/networkdesign/index';
import { CommonDataGrid } from '../../../../../components';
// import { setSelector } from '../../../../../redux/NetworkMeeting/Action';
import getIcons from '../../../../../utils/getIcons';
import CallrequestForm from './CallrequestForm';

const useStyles = makeStyles((theme) => ({
  root: {
    margin: 'auto'
  },
  paper: {
    width: '100%',
    height: 230,
    border: `1px solid #000`,
    borderRadius: 5,
    overflow: 'auto'
  },
  button: {
    margin: theme.spacing(0.5, 0)
  }
}));

const Index = () => {
  const TitleProps = useTitleProps();
  const webdpColor = useWebDPColor();
  const classes = useStyles();
  const selectorReduce = useSelector((state) => state.networkMeeting.selector); // load from redux
  // console.log('selectorReduce', selectorReduce);

  const formik = useFormik({
    initialValues: {
      loading: false,
      columns: [
        {
          field: 'id',
          headerName: 'ID',
          width: 120
        },
        {
          field: 'apptype',
          headerName: 'App Type',
          width: 120
        },
        {
          field: 'requestNo',
          headerName: 'RequestNo.',
          width: 150
        },
        {
          field: 'serviceathosp',
          headerName: 'Institution',
          width: 150
        },
        {
          field: 'project',
          headerName: 'Project Name',
          width: 280
        },
        {
          field: 'remarks',
          headerName: 'Remarks',
          // width: 280
          flex: 1
        },
        {
          field: 'actions',
          headerName: 'Actions',
          headerAlign: 'center',
          align: 'center',
          hide: false,
          width: 180,
          filterable: false,
          renderCell: ({ row }) => (
            <div>
              <Tooltip title="View">
                <IconButton
                  onClick={() => {
                    // console.log('detail', row);
                    toOPeration(row);
                  }}
                >
                  {getIcons('detaiEyeIcon')}
                </IconButton>
              </Tooltip>
            </div>
          )
        }
      ],
      pageSizeR: 10,
      apptype,
      requestNo,
      callFormOpen
    }
  });
  const { loading, columns, pageSizeR, apptype, requestNo, callFormOpen } = formik.values;
  const { setFieldValue } = formik;

  const { right } = selectorReduce;
  // console.log('selectorReduce right', right);
  // 模拟数据
  // right = [
  //   {
  //     id: 1,
  //     apptype: 'DP',
  //     requestNo: '220900769',
  //     serviceathosp: 'ABC'
  //   }
  // ];

  // operation
  const toOPeration = (row) => {
    const tempapptype = row?.apptype;
    const temprequestNo = row?.requestNo;
    console.log('toOPeration', row, tempapptype, temprequestNo);

    setCallFormClose(tempapptype, temprequestNo, true);
  };
  const setCallFormClose = (tempapptype, temprequestNo, val) => {
    setFieldValue(`apptype`, tempapptype);
    setFieldValue(`requestNo`, temprequestNo);
    setFieldValue(`callFormOpen`, val);
  };

  // DataGrid 自定义工具
  const CustomToolbar = () => (
    <GridToolbarContainer>
      <GridToolbarFilterButton />
    </GridToolbarContainer>
  );

  const customList = (rows) => (
    <>
      <CommonDataGrid
        loading={loading}
        minHeight="680px"
        style={{ height: 680, overflowY: 'auto' }}
        // checkboxSelection
        rows={rows}
        columns={columns}
        components={{
          Toolbar: CustomToolbar
        }}
        pageSize={pageSizeR}
        onPageSizeChange={(newPageSize) => {
          setFieldValue(`pageSizeR`, newPageSize);
        }}
      />
    </>
  );

  useEffect(() => {}, []);

  return (
    <>
      <Grid
        container
        // spacing={2}
        // justifyContent="left"
        alignItems="center"
        className={classes.root}
      >
        <Grid {...TitleProps}>
          <Typography variant="h6" style={{ color: webdpColor.title }}>
            <strong>Request Form List</strong>
          </Typography>
        </Grid>
        <Grid {...FormControlProps} md={6} lg={12}>
          {customList(right)}
        </Grid>
      </Grid>

      <CallrequestForm
        callFormOpen={callFormOpen}
        setCallFormClose={setCallFormClose}
        apptype={apptype}
        requestNo={requestNo}
      />
    </>
  );
};
export default memo(Index);
