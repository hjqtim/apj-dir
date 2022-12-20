import React, { memo, useEffect } from 'react';
import { useFormik } from 'formik';
import { Grid, Typography, Button, makeStyles } from '@material-ui/core';
import { GridToolbarContainer, GridToolbarFilterButton } from '@material-ui/data-grid';
import _ from 'lodash';
import { useSelector, useDispatch } from 'react-redux'; // load from redux
import { useParams } from 'react-router';
import dayjs from 'dayjs';
import useTitleProps from '../../../../../models/webdp/PropsModels/useTitleProps';
import useWebDPColor from '../../../../../hooks/webDP/useWebDPColor';
import FormControlProps from '../../../../../models/webdp/PropsModels/FormControlProps';
import meetingAPI from '../../../../../api/networkdesign/index';
import { CommonDataGrid } from '../../../../../components';
import { setSelector } from '../../../../../redux/NetworkMeeting/Action';

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
  const dispatch = useDispatch();
  let isRequest = false; // true == detail or edit
  const meetingNoURL = useParams().meetingNo;
  if (typeof meetingNoURL !== 'undefined') {
    isRequest = true;
  }

  const formik = useFormik({
    initialValues: {
      loading: false,
      requestForm: [],
      choiceForm: [],
      checked: [],
      left: [],
      requestOrder: {
        right: [],
        closeLeft: []
      },

      columns1: [
        {
          field: 'requestId',
          headerName: 'ID',
          width: 120
        },
        {
          field: 'apptype',
          headerName: 'App Type',
          width: 150
        },
        {
          field: 'requestNo',
          headerName: 'Request No.',
          width: 150
        },
        {
          field: 'serviceathosp',
          headerName: 'Institution',
          // width: 150
          flex: 1
        },
        {
          field: 'submissiondate',
          headerName: 'Submission Date',
          width: 180,
          renderCell: ({ row }) => {
            const { submissiondate } = row;
            return <div>{dayjs(submissiondate).format('DD-MMM-YYYY')}</div>;
          }
        }
      ],
      columns2: [
        {
          field: 'requestId',
          headerName: 'ID',
          width: 120
        },
        {
          field: 'apptype',
          headerName: 'App Type',
          width: 150
        },
        {
          field: 'requestNo',
          headerName: 'Request No.',
          width: 150
        },
        {
          field: 'serviceathosp',
          headerName: 'Institution',
          // width: 150
          flex: 1
        }
      ],
      leftChecked: [],
      rightChecked: [],
      pageSizeL: 10,
      pageSizeR: 10
    }
  });
  const {
    loading,
    left,
    requestOrder,
    columns1,
    columns2,
    leftChecked,
    rightChecked,
    pageSizeL,
    pageSizeR
  } = formik.values;
  const { right, closeLeft } = requestOrder;
  const { setFieldValue } = formik;

  // 选中往右
  const handleCheckedRight = () => {
    let tempright = [];
    const tempLeft = _.cloneDeep(left);
    leftChecked.forEach((itemChecked) => {
      const resRightArr = tempLeft.filter((item) => item.id === itemChecked);
      tempright = [...tempright, ...resRightArr];
    });
    const rightTemp = [...right, ...tempright];
    cleanLeft(rightTemp);
  };
  // 将 左边 的 数据 过滤掉 右边
  const cleanLeft = (rightTemp) => {
    setFieldValue(`requestOrder.right`, rightTemp);
    set2Reducer('right', rightTemp);
    const leftArr = left.filter((item) => !leftChecked.includes(item.requestId));
    setFieldValue(`left`, leftArr);
  };

  // 选中往左
  const handleCheckedLeft = () => {
    let templeft = [];
    const tempright = _.cloneDeep(right);
    let closeLeftTemp = _.cloneDeep(closeLeft);
    rightChecked.forEach((itemChecked) => {
      const resLeftArr = tempright.filter((item) => item.id === itemChecked);
      templeft = [...templeft, ...resLeftArr];
      closeLeftTemp = [...closeLeftTemp, ...resLeftArr];
    });
    setFieldValue(`left`, [...left, ...templeft]);
    setFieldValue(`requestOrder.closeLeft`, closeLeftTemp); // 准备好 被移除 的 单据
    const rightArr = right.filter((item) => !rightChecked.includes(item.id));
    setFieldValue(`requestOrder.right`, rightArr);
    const obj = {};
    obj.closeLeft = closeLeftTemp;
    obj.right = rightArr;
    set2Reducer('requestOrder', obj);
  };

  const handleAllRight = () => {
    setFieldValue(`requestOrder.right`, right.concat(left));
    set2Reducer('right', right.concat(left));
    setFieldValue(`left`, []);
  };
  const handleAllLeft = () => {
    setFieldValue(`left`, left.concat(right));
    setFieldValue(`requestOrder.right`, []);
    set2Reducer('right', []);
  };

  // 获取 requestNo list
  const getRequestNo = () => {
    setFieldValue(`loading`, true);
    const obj = {};
    obj.currentPage = 1;
    obj.pageSize = 1000;
    meetingAPI
      .getRequestNoList(obj)
      .then((res) => {
        const List = res?.data?.list;
        // console.log('getRequestNoList', List);
        let temp = [];
        if (List?.length > 0) {
          List.forEach((item) => {
            let obj = {};
            obj = item;
            obj.requestId = item.id;
            temp = [...temp, obj];
          });
        }

        setFieldValue(`left`, temp);
      })
      .finally(() => {
        setFieldValue(`loading`, false);
      });
  };
  const maketest = () => {
    if (isRequest) {
      console.log('maketest', left, selectorReduce);
      const leftSource = _.cloneDeep(left);
      const rightTemp = selectorReduce.right;

      let rightRequestID = [];
      if (rightTemp?.length > 0) {
        rightTemp.forEach((item) => {
          rightRequestID = [...rightRequestID, item.requestId];
        });
      }
      let leftArr = [];
      if (rightRequestID?.length > 0) {
        leftArr = leftSource.filter((item) => !rightRequestID.includes(item.requestId));
        // console.log('maketest', leftSource, leftArr, rightRequestID);
      }
      if (JSON.stringify(leftArr) !== JSON.stringify(leftSource)) {
        // console.log('have diff');
        setFieldValue(`left`, leftArr);
      }
    }
  };

  // DataGrid 自定义工具
  const CustomToolbar = () => (
    <GridToolbarContainer>
      <GridToolbarFilterButton />
    </GridToolbarContainer>
  );

  const customList = (rows, LR) => (
    <>
      <CommonDataGrid
        loading={loading}
        minHeight="680px"
        style={{ height: 680, overflowY: 'auto' }}
        checkboxSelection
        rows={rows}
        columns={LR === 'L' ? columns1 : columns2}
        components={{
          Toolbar: CustomToolbar
        }}
        onSelectionModelChange={(ids) => {
          // console.log('onSelectionModelChange', LR, ids);
          if (LR === 'L') {
            setFieldValue(`leftChecked`, ids);
          }
          if (LR === 'R') {
            setFieldValue(`rightChecked`, ids);
          }
        }}
        pageSize={LR === 'L' ? pageSizeL : pageSizeR}
        onPageSizeChange={(newPageSize) => {
          if (LR === 'L') {
            setFieldValue(`pageSizeL`, newPageSize);
          }
          if (LR === 'R') {
            setFieldValue(`pageSizeR`, newPageSize);
          }
        }}
      />
    </>
  );

  useEffect(() => {
    getRequestNo();
  }, []);

  useEffect(() => {
    maketest();
  }, [left]);

  // 更新到 reduce
  const set2Reducer = (filed, value) => {
    let tempObj = _.cloneDeep(selectorReduce);
    if (filed === 'right') {
      tempObj.right = value;
    }
    if (filed === 'closeLeft') {
      tempObj.closeLeft = value;
    }
    if (filed === 'requestOrder') {
      tempObj = value;
    }
    // console.log('set2Reducer', tempObj);
    dispatch(setSelector(tempObj));
  };

  const setFormikData = (selectorReduce) => {
    formik.setFieldValue('requestOrder', selectorReduce);
    // 触发 一次 left 的 过滤 掉 right
    // maketest();
  };
  useEffect(() => {
    setFormikData(selectorReduce);
  }, [selectorReduce]);

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
            <strong>Request Form Selector</strong>
          </Typography>
        </Grid>
        <Grid {...FormControlProps} md={6} lg={6}>
          {customList(left, 'L')}
        </Grid>
        <Grid>
          <Grid
            {...FormControlProps}
            md={6}
            lg={1}
            container
            direction="column"
            alignItems="center"
            // style={{ marginLeft: 80, marginRight: 80 }}
          >
            <Button
              variant="outlined"
              size="small"
              className={classes.button}
              onClick={handleAllRight}
              disabled={left?.length === 0}
              aria-label="move all right"
              style={{ width: 120 }}
            >
              {`>>`}
            </Button>
            <Button
              variant="outlined"
              size="small"
              className={classes.button}
              onClick={handleCheckedRight}
              disabled={leftChecked?.length === 0}
              aria-label="move selected right"
              // style={{ width: 120 }}
            >
              {`>`}
            </Button>
            <Button
              variant="outlined"
              size="small"
              className={classes.button}
              onClick={handleCheckedLeft}
              disabled={rightChecked?.length === 0}
              aria-label="move selected left"
              // style={{ width: 120 }}
            >
              {`<`}
            </Button>
            <Button
              variant="outlined"
              size="small"
              className={classes.button}
              onClick={handleAllLeft}
              disabled={right?.length === 0}
              aria-label="move all left"
              style={{ width: 120 }}
            >
              {`<<`}
            </Button>
          </Grid>
        </Grid>
        <Grid {...FormControlProps} md={6} lg={5}>
          {customList(right, 'R')}
        </Grid>
      </Grid>
    </>
  );
};
export default memo(Index);
