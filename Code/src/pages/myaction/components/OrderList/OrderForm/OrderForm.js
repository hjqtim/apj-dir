import React, { useState, useRef, useEffect, useCallback, memo } from 'react';
import PropTypes from 'prop-types';
import { useFormik } from 'formik';
import { useParams } from 'react-router-dom';
import { useReactToPrint } from 'react-to-print';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import {
  Grid,
  makeStyles,
  Button,
  FormControlLabel,
  Checkbox,
  Box,
  Tabs,
  Tab,
  Typography,
  Accordion,
  AccordionDetails,
  AccordionSummary,
  TextField
} from '@material-ui/core';
import _ from 'lodash';
import dayjs from 'dayjs';
import * as Yup from 'yup';
import CommonTip from '../../../../../components/CommonTip';
import { BaseInfo, OrderInfoLeft, OrderInfoRight, AcquisitionItem } from './components';
import { FormControlProps } from '../../../../../models/rms/req/FormControlProps';
import API from '../../../../../api/webdp/webdp';
import OrderTemplate from './template/OrderTemplate';
import Loading from '../../../../../components/Loading';
import SingleDataPort from '../../GenOuteId/SingleDataPort';
import DualDataPort from '../../GenOuteId/DualDataPort';
import Backbone from '../../Backbone';
import Cabinet from '../../Cabinet';
import Panel from '../../Panel';

const useStyles = makeStyles((theme) => ({
  root: {
    padding: '0.8rem',
    backgroundColor: '#e6eaf1',
    borderRadius: '0.5rem',
    '& .MuiInputBase-input.Mui-disabled': {
      cursor: 'not-allowed'
    }
  },
  footer: {
    backgroundColor: '#FFF',
    padding: theme.spacing(4),
    '& button': {
      marginLeft: theme.spacing(4)
    }
  },
  accordion: {
    marginBottom: ' 0 !important'
  }
}));

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
      style={{ display: value === index ? 'block' : 'none' }}
    >
      <Box>{children}</Box>
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`
  };
}

const OrderForm = ({
  reqNo,
  // isAdd,
  isDetail,
  isEdict,
  controlDialog,
  getOrderList
}) => {
  const classes = useStyles();
  const {
    requestId
    // apptype
  } = useParams();
  const [currentContract, setCurrentContract] = useState();
  const [fromStaff, setFromStaff] = useState();
  const [beforeSubmit, setBeforeSubmit] = useState(0);
  const [portData] = useState([]);
  const [delPorts] = useState([]);
  const [errorList] = useState([]);
  const [backboneData] = useState([]);
  const [cabinetData] = useState([]);
  const [panelData] = useState([]);
  const [copyAcquisitionItem, setCopyAcquisitionItem] = useState([]);
  // const [outletOptions, setOutletOptions] = useState([]);
  const [genIdItems, setGenIdItems] = useState([]);
  const [backboneItems, setBackboneItems] = useState([]);
  const [cabinetItems, setCabinetItems] = useState([]);
  const [panelItems, setPanelItems] = useState([]);
  // const [hasItem, setHasItem] = useState([]);
  const [acquisitionItem, setAcquisitionItem] = useState([
    { key: new Date().getTime(), itemNoObj: {}, qty: 0 }
  ]);
  const [backboneExp, setBackboneExp] = useState(0);
  const [detailRequestDone, setDetailRequestDone] = useState(false);
  // const [isShowGenId, setIsShowGenId] = useState(false);
  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current
  });
  const [expanded, setExpanded] = useState(true);
  const [expandedTwo, setExpandedTwo] = useState(true);
  const [contractData, setContractData] = useState('');
  const [isAllCloset, setIsAllCloset] = useState(false);

  // tab切换
  const [tabValue, setTabValue] = useState(0);
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // 打开打印窗口
  const handleClickOpen = () => {
    handlePrint();
  };
  // 添加时获取基础数据
  const getReqPartInfo = () => {
    API.getReqPartInfo(requestId).then((res) => {
      const { totalIncome, expCompleteDate, hospital, noOfPort, project } = res?.data?.data || {};
      formik.setValues({
        ...formik.values,
        totalIncome,
        expCompleteDate,
        hospital,
        project,
        noOfPort
      });
    });
  };

  // 详情时获取详情数据
  const getOrderFromDetail = () => {
    Loading.show();
    API.getOrderFromDetail(reqNo)
      .then((res) => {
        if (res?.data?.data) {
          const {
            totalIncome,
            expCompleteDate,
            hospital,
            noOfPort,
            project,
            reqNoRev,
            expenditureFY,
            vendor,
            respStaff,
            respStaffCorpId,
            description,
            instDateFr,
            instDateTo,
            jobCompletionDate,
            remark,
            otherDetail,
            status,
            requestItemList,
            contract,
            invoice,
            invoiceRecdDate,
            backboneExp,
            prissued,
            prissuedDate,
            reqIssued,
            prCode,
            reqIssuedDate,
            // patchCableSent,
            // patchCableSentDate,
            // hubPortEnabled,
            // hubPortEnabledDate,
            inSpCompleted,
            inSpCompDate,
            // isNetDIagUpdated,
            // updateNetDIag,
            updateConfigDB,
            isConfigDBUpdated,
            dpLocationPortPojoList,
            backboneList,
            cabinetList,
            panelList
            // isCheck
          } = res?.data?.data || {};
          // const noItem = dpLocationPortPojoList?.find(
          //   (item) => item?.oneList?.length !== 0 || item?.portList?.length !== 0
          // );
          setContractData(contract);
          // setHasItem(Boolean(noItem));
          setCopyAcquisitionItem(requestItemList);
          // setIsShowGenId(isCheck === 'Y');
          setGenIdItems(dpLocationPortPojoList ? [...dpLocationPortPojoList] : []);
          setBackboneItems(backboneList || []);
          setCabinetItems(cabinetList || []);
          setPanelItems(panelList || []);
          formik.setValues({
            ...formik.values,
            reqNo,
            totalIncome,
            expCompleteDate,
            hospital,
            reqNoRev,
            expenditureFY,
            project,
            contract,
            description,
            instDateFr,
            instDateTo,
            jobCompletionDate,
            vendor,
            respStaff,
            respStaffCorpId,
            status,
            remark,
            otherDetail,
            invoice,
            prCode,
            invoiceRecdDate,
            noOfPort,
            prissued: !!prissued,
            prissuedDate,
            reqIssued: !!reqIssued,
            reqIssuedDate,
            // patchCableSent: !!patchCableSent,
            // patchCableSentDate,
            // hubPortEnabled: !!hubPortEnabled,
            // hubPortEnabledDate,
            inSpCompleted: !!inSpCompleted,
            inSpCompDate,
            // isNetDIagUpdated: !!isNetDIagUpdated,
            // updateNetDIag,
            isConfigDBUpdated: !!isConfigDBUpdated,
            updateConfigDB
          });
          setBackboneExp(backboneExp || 0);
          const newAcquisitionItem = requestItemList.map((item) => ({
            key: item.partNo,
            itemNoObj: item,
            qty: item.qty
          }));
          setAcquisitionItem([...newAcquisitionItem, ...acquisitionItem]);
          setDetailRequestDone(true);
        }
      })
      .finally(() => {
        Loading.hide();
      });
  };

  useEffect(() => {
    if (isDetail || isEdict) {
      // getOutletType();
      getOrderFromDetail();
      // getDataPortList();
    } else {
      getReqPartInfo();
      // console.log(isAdd, apptype);
    }
  }, []);

  // 生成本财政年度
  const generateFY = () => {
    let year = dayjs().format('YY');
    const fullYear = dayjs().format('YYYY');
    if (dayjs().valueOf() <= dayjs(`${fullYear}-03-31 23:59:59`).valueOf()) {
      year = `${year - 1}`;
    }
    const thisYear = `${year}${Number(year) + 1}`;
    return thisYear;
  };

  // 收集搜索的字段
  const formik = useFormik({
    // 初始值
    // BaseInfo
    initialValues: {
      dpReq: requestId,
      project: '',
      noOfPort: '',
      contract: '',
      hospital: '',
      expCompleteDate: '',
      totalIncome: '',
      // OrderInfoLeft
      reqNo: '',
      respStaff: '',
      respStaffCorpId: '',
      reqNoRev: 0,
      vendor: '',
      expenditureFY: generateFY(),
      description: '',
      instDateFr: null,
      instDateTo: null,
      prCode: '',
      status: '',
      jobCompletionDate: null,
      remark: '',
      otherDetail: '',
      // OrderInfoRight
      prissued: false,
      prissuedDate: null,
      reqIssued: false,
      reqIssuedDate: null,
      // patchCableSent: false,
      // patchCableSentDate: 'Not Yet',
      // hubPortEnabled: false,
      // hubPortEnabledDate: 'Not Yet',
      inSpCompleted: false,
      inSpCompDate: null,
      // isNetDIagUpdated: false,
      // updateNetDIag: 'Not Yet',
      isConfigDBUpdated: false,
      updateConfigDB: 'Not Yet',
      invoice: null,
      invoiceRecdDate: null
    },
    // 表单验证
    validationSchema: Yup.object({
      contract: Yup.object().required('Please select contract.'),
      respStaff: Yup.object().required('Please select response staff.'),
      expenditureFY: Yup.string().required('Please select expenditure fiscal year .'),
      instDateFr: Yup.string().required('Please select install date.'),
      instDateTo: Yup.string().required('Please select install date.')
    }),
    // 提交
    onSubmit: (value) => {
      setBeforeSubmit(beforeSubmit + 1);
      // 清空原数组
      portData.splice(0);
      errorList.splice(0);
      delPorts.splice(0);
      backboneData.splice(0);
      cabinetData.splice(0);
      panelData.splice(0);

      setTimeout(() => {
        const obj = errorList.find((item) => !item.flag);
        if (!_.isUndefined(obj)) {
          CommonTip.warning('Please complete the required fields first');
          return;
        }
        handleSave(value);
      }, 0);
    }
  });

  // 收集 GenOuteId 子组件数据
  const saveData = useCallback(
    (dataArr, deleteData, canSubmit) => {
      errorList.push({ flag: canSubmit });
      dataArr?.forEach((item) => {
        if (item?.outletId)
          portData.push({
            ...item,
            targetDate: dateToString(item?.targetDate),
            acceptDate: dateToString(item?.acceptDate)
          });
      });
      deleteData?.forEach((item) => {
        delPorts.push({
          ownEquipID: item.ownEquipId,
          portid: item.portid,
          outletId: item.outletId
        });
      });
    },
    [portData, errorList]
  );

  // 保存Backbone数据
  const saveBackboneData = useCallback(
    (dataArr, canSubmit) => {
      errorList.push({ flag: canSubmit });
      dataArr?.forEach((item) => {
        if (item?.backboneId && item?.onlyBackboneId) {
          backboneData.push({
            ...item,
            targetDate: dateToString(item?.targetDate),
            acceptDate: dateToString(item?.acceptDate)
          });
        }
      });
    },
    [backboneData, errorList]
  );

  // 保存Cabinetd数据
  const saveCabinetData = useCallback(
    (dataArr, canSubmit) => {
      errorList.push({ flag: canSubmit });
      dataArr?.forEach((item) => {
        if (item?.closetId)
          cabinetData.push({
            ...item,
            targetDate: dateToString(item?.targetDate),
            acceptDate: dateToString(item?.acceptDate)
          });
      });
    },
    [cabinetData, errorList]
  );

  // 保存Panel数据
  const savePanelData = useCallback(
    (dataArr, canSubmit) => {
      errorList.push({ flag: canSubmit });
      dataArr?.forEach((item) => {
        if (item?.equipid)
          panelData.push({
            ...item,
            targetDate: dateToString(item?.targetDate),
            acceptancedate: dateToString(item?.acceptancedate)
          });
      });
    },
    [panelData, errorList]
  );

  // 不用格式化的数据
  const noFormatData = [
    // 'patchCableSentDate',
    // 'hubPortEnabled',
    // 'updateNetDIag',
    'isConfigDBUpdated'
  ];
  // 将 Date 转成后端可接受的 String
  const dateToString = (value) =>
    !value || noFormatData.includes(value) ? value : dayjs(value).format('YYYY-MM-DD HH:mm:ss');

  // Save
  const handleSave = async (value) => {
    // 过滤掉 acquisitionItem 中的空 Item
    let requestItemList = acquisitionItem.filter((item) => !_.isEmpty(item.itemNoObj));
    if (requestItemList.length === 0) {
      CommonTip.error(`Please select the acquisition item.`);
      return;
    }
    // 将数据处理成相应的格式
    requestItemList = requestItemList?.map((item) => ({ ...item.itemNoObj, qty: item.qty })) || [];

    let delIds = [];
    // 编辑时判断是否有删除 Acquisition Item
    if (isEdict) {
      const filterArr = copyAcquisitionItem.filter(
        (x) => !requestItemList.some((item) => x.id === item.id)
      );
      delIds = _.map(filterArr, 'id');
    }
    // 计算总金额
    let total = 0;
    total = requestItemList.reduce((prev, cur) => cur.unitPrice * cur.qty + prev, 0);
    // 请求数据
    const data = {
      requestForm: {
        dpReq: value.dpReq,
        reqNo: isEdict ? reqNo : '',
        contract: value?.contract?.contract || null,
        respStaff: value?.respStaff?.displayName || '',
        respStaffCorpId: value?.respStaff?.username || '',
        reqNoRev: value.reqNoRev,
        vendor: value.vendor,
        expenditureFY: value?.expenditureFY || null,
        description: value.description,
        remark: value.remark,
        instDateFr: dateToString(value.instDateFr),
        instDateTo: dateToString(value.instDateTo),
        invoiceRecdDate: dateToString(value.invoiceRecdDate),
        status: value?.status?.status || '',
        prissued: value?.prissued * 1,
        prissuedDate: dateToString(value.prissuedDate),
        reqIssued: value?.reqIssued * 1,
        reqIssuedDate: dateToString(value.reqIssuedDate),
        // patchCableSent: value?.patchCableSent * 1,
        // patchCableSentDate: value.patchCableSent
        //   ? dateToString(value.patchCableSentDate)
        //   : value.patchCableSentDate,
        // hubPortEnabled: value?.hubPortEnabled * 1,
        // hubPortEnabledDate: value?.hubPortEnabled
        //   ? dateToString(value.hubPortEnabledDate)
        //   : value.hubPortEnabledDate,
        inSpCompleted: value?.inSpCompleted * 1,
        inSpCompDate: dateToString(value.inSpCompDate),
        // isNetDIagUpdated: value?.isNetDIagUpdated * 1,
        // updateNetDIag: value?.isNetDIagUpdated
        //   ? dateToString(value.updateNetDIag)
        //   : value.updateNetDIag,
        isConfigDBUpdated: value?.isConfigDBUpdated * 1,
        updateConfigDB: value.isConfigDBUpdated
          ? dayjs(value.updateConfigDB).format('DD-MMM-YY')
          : value.updateConfigDB,
        jobCompletionDate: dateToString(value.jobCompletionDate),
        invoice: value.invoice,
        backboneExp,
        totalExpense: total.toFixed(2),
        // isCheck: isShowGenId ? 'Y' : 'N',
        otherDetail: value?.otherDetail
      },
      requestItemList,
      delIds,
      outletNcsList: portData,
      delPorts,
      backboneList: backboneData,
      cabinetList: cabinetData,
      panelList: panelData
    };

    console.log('*******************************************');
    console.log(data);
    console.log('*******************************************');

    Loading.show();
    API.saveOrderFrom(data)
      .then((res) => {
        if (res?.data?.code === 200) {
          CommonTip.success('Success');
          controlDialog(false);
          getOrderList();
        } else {
          CommonTip.error('Failed');
        }
      })
      .finally(() => {
        Loading.hide();
      });
  };

  // useEffect(() => {
  //   if (isShowGenId) {
  //     // getOutletType();
  //     if (isAdd) {
  //       getDataPortList();
  //     }
  //   }
  // }, [isShowGenId]);

  // 获取 OutletType 下拉数
  // const getOutletType = () => {
  //   if (outletOptions.length <= 0) {
  //     API.getCableOrOutletType({ type: 'outlet' }).then((res) => {
  //       const outletTypeList = res?.data?.data?.outletTypeList || [];
  //       const newOutletOptions = _.map(outletTypeList, 'preDefinedValue');
  //       setOutletOptions(newOutletOptions);
  //     });
  //   }
  // };
  // 据获取 data port list
  // const getDataPortList = () => {
  //   Loading.show();
  //   API.getDataPortList({ dpReq: requestId })
  //     .then((res) => {
  //       const dataPortList = res?.data?.data || [];
  //       const noItem = dataPortList.find(
  //         (item) => item?.oneList?.length !== 0 || item?.portList?.length !== 0
  //       );
  //       setHasItem(Boolean(noItem));
  //       setGenIdItems(dataPortList);
  //       if (_.isUndefined(noItem)) {
  //         CommonTip.warning(`There's no item there.`);
  //       }
  //     })
  //     .finally(() => {
  //       Loading.hide();
  //     });
  // };

  return (
    <Grid container className={classes.root}>
      {/* BaseInfo */}
      <form
        onSubmit={(e) => {
          if (!formik.isValid) CommonTip.warning('Please complete the required fields first');
          formik.handleSubmit(e);
        }}
        style={{ width: '100%' }}
      >
        <Accordion
          className={classes.accordion}
          expanded={expanded}
          onChange={() => setExpanded(!expanded)}
          style={{ width: '100%', marginTop: '1rem' }}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1bh-content"
            id="panel1bh-header"
          >
            <Typography variant="h4">Basic Information</Typography>
          </AccordionSummary>
          <AccordionDetails style={{ display: 'block' }}>
            <Grid container>
              <BaseInfo
                formik={formik}
                isDetail={isDetail}
                isEdict={isEdict}
                currentContract={currentContract}
                acquisitionItem={acquisitionItem}
                setAcquisitionItem={setAcquisitionItem}
                detailRequestDone={detailRequestDone}
                setCurrentContract={setCurrentContract}
                setBackboneExp={setBackboneExp}
              />

              <Grid container style={{ background: '#fff' }}>
                <Grid {...FormControlProps} md={8} lg={8}>
                  <OrderInfoLeft
                    formik={formik}
                    isEdict={isEdict}
                    isDetail={isDetail}
                    setFromStaff={setFromStaff}
                    detailRequestDone={detailRequestDone}
                  />
                </Grid>
                <Grid {...FormControlProps} md={4} lg={4}>
                  <OrderInfoRight formik={formik} isDetail={isDetail} />
                </Grid>
              </Grid>
              <Grid container>
                <Grid {...FormControlProps} md={12} lg={12}>
                  <AcquisitionItem
                    isDetail={isDetail}
                    currentContract={currentContract}
                    acquisitionItem={acquisitionItem}
                    setAcquisitionItem={setAcquisitionItem}
                    backboneExp={backboneExp}
                    // setIsShowGenId={setIsShowGenId}
                    setBackboneExp={setBackboneExp}
                  />
                </Grid>
              </Grid>
            </Grid>
          </AccordionDetails>
        </Accordion>

        {/* ------------------------------- */}
        {/* {apptype === 'DP' && (
          <Grid {...FormControlProps} md={12} lg={12} style={{ background: '#fff' }}>
            <FormControlLabel
              control={
                <Checkbox
                  disabled={isDetail}
                  checked={isShowGenId}
                  onChange={(e, data) => {
                    setIsShowGenId(data);
                  }}
                  value={isShowGenId}
                />
              }
              labelPlacement="start"
              label={<strong>Outlet ID Generation</strong>}
            />
          </Grid>
        )} */}

        {(isDetail || isEdict) && (
          <Accordion
            className={classes.accordion}
            expanded={expandedTwo}
            onChange={() => setExpandedTwo(!expandedTwo)}
            style={{ width: '100%', marginTop: '1rem' }}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel2bh-content"
              id="panel2bh-header"
            >
              <Typography variant="h4">Cabling</Typography>
            </AccordionSummary>
            <AccordionDetails style={{ display: 'block' }}>
              {/* // <Grid container style={{ background: '#fff', padding: '8px', minHeight: '300px' }}>
          //   <Box sx={{ width: '100%' }}> */}
              <Grid
                container
                spacing={4}
                alignItems="flex-start"
                style={{ paddingRight: '16px' }}
                justifyContent="flex-end"
              >
                <Grid item style={{ background: '#fff' }}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        disabled={isDetail}
                        checked={isAllCloset}
                        onChange={(e, data) => {
                          setIsAllCloset(data);
                        }}
                        value={isAllCloset}
                      />
                    }
                    labelPlacement="start"
                    label={<strong>Show All Closet</strong>}
                  />
                </Grid>
                <Grid item>
                  <Button variant="contained" color="primary">
                    Print Order Form
                  </Button>
                </Grid>
              </Grid>

              <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={tabValue} onChange={handleTabChange} aria-label="basic tabs example">
                  <Tab label="Data Port" {...a11yProps(0)} />
                  <Tab label="Backbone" {...a11yProps(1)} />
                  <Tab label="Cabinet" {...a11yProps(2)} />
                  <Tab label="Panel" {...a11yProps(3)} />
                  <Tab label="Other" {...a11yProps(4)} />
                </Tabs>
              </Box>

              <TabPanel value={tabValue} index={0}>
                <Grid {...FormControlProps} md={12} lg={12}>
                  {genIdItems.map((item) => (
                    <div key={item.id}>
                      {item.serviceType === 'New Data Port' ||
                      item.serviceType === 'Data Port Relocation' ? (
                        <SingleDataPort
                          isDetail={isDetail}
                          itemData={item}
                          isAllCloset={isAllCloset}
                          beforeSubmit={beforeSubmit}
                          saveData={saveData}
                          hospital={formik.values?.hospital}
                        />
                      ) : (
                        <DualDataPort
                          isDetail={isDetail}
                          itemData={item}
                          isAllCloset={isAllCloset}
                          beforeSubmit={beforeSubmit}
                          saveData={saveData}
                          hospital={formik.values?.hospital}
                        />
                      )}
                    </div>
                  ))}
                </Grid>
              </TabPanel>
              <TabPanel value={tabValue} index={1}>
                <Backbone
                  isDetail={isDetail}
                  itemData={backboneItems}
                  saveData={saveBackboneData}
                  beforeSubmit={beforeSubmit}
                  isAllCloset={isAllCloset}
                  hospital={formik.values?.hospital}
                />
              </TabPanel>
              <TabPanel value={tabValue} index={2}>
                <Cabinet
                  isDetail={isDetail}
                  itemData={cabinetItems}
                  beforeSubmit={beforeSubmit}
                  saveData={saveCabinetData}
                  isAllCloset={isAllCloset}
                  hospital={formik.values?.hospital}
                  contract={contractData}
                />
              </TabPanel>
              <TabPanel value={tabValue} index={3}>
                <Panel
                  isDetail={isDetail}
                  itemData={panelItems}
                  beforeSubmit={beforeSubmit}
                  saveData={savePanelData}
                  isAllCloset={isAllCloset}
                  hospital={formik.values?.hospital}
                  contract={contractData}
                  reqNo={formik.values?.reqNo}
                />
              </TabPanel>
              <TabPanel value={tabValue} index={4}>
                <TextField
                  id="otherDetail"
                  multiline
                  variant="outlined"
                  rows={10}
                  fullWidth
                  margin="normal"
                  value={formik.values?.otherDetail || ''}
                  name="otherDetail"
                  disabled={isDetail}
                  onChange={formik.handleChange}
                />
              </TabPanel>
              {/* //   </Box>
          // </Grid> */}
            </AccordionDetails>
          </Accordion>
        )}

        <Grid container justifyContent="flex-end" className={classes.footer}>
          {isDetail && (
            <Button variant="contained" color="primary" onClick={handleClickOpen}>
              Print Acq List
            </Button>
          )}
          <div style={{ display: 'none' }}>
            <div ref={componentRef}>
              <OrderTemplate
                acquisitionItem={copyAcquisitionItem}
                institutio={formik.values.hospital}
                project={formik.values.project}
                currentContract={currentContract}
                fromStaff={fromStaff}
                reqNo={reqNo}
              />
            </div>
          </div>
          {!isDetail && (
            <Button variant="contained" color="primary" type="submit">
              Save
            </Button>
          )}
        </Grid>
      </form>
    </Grid>
  );
};

export default memo(OrderForm);
