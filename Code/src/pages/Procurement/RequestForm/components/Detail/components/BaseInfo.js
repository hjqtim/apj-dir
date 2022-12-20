import React, { useState, memo, useEffect } from 'react';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import {
  Grid,
  makeStyles,
  Typography,
  Accordion,
  AccordionDetails,
  AccordionSummary
} from '@material-ui/core';
import { useFormik } from 'formik';
// import _ from 'lodash';
import dayjs from 'dayjs';
import * as Yup from 'yup';
import API from '../../../../../../api/webdp/webdp';
import { WarningDialog, Loading } from '../../../../../../components';
import { OrderInfoLeft, OrderInfoRight } from '.';
import { FormControlProps } from '../../../../../../models/rms/req/FormControlProps';

import RenderFiled from './RenderFiled';

const useStyles = makeStyles(() => ({
  root: {
    marginBottom: ' 0 !important'
  }
}));

const BaseInfo = ({
  // formik,
  reqNo
  // isDetail,
  // isEdict
}) => {
  const classes = useStyles();
  const [expanded, setExpanded] = useState(true);
  const [contractList, setContractList] = useState([]);
  const [changeContractDialog, setChangeContractDialog] = useState(false);
  const [currentContract, setCurrentContract] = useState();
  const [detailRequestDone, setDetailRequestDone] = useState(false);
  const [backboneExp, setBackboneExp] = useState(0);
  const [acquisitionItem, setAcquisitionItem] = useState([
    { key: new Date().getTime(), itemNoObj: {}, qty: 0 }
  ]);

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
      dpReq: '',
      project: '',
      noOfPort: '',
      contract: '',
      hospital: '',
      expCompleteDate: '',
      totalIncome: '',
      // OrderInfoLeft
      reqNo,
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
      console.log(value);
      // setBeforeSubmit(beforeSubmit + 1);
      // // 清空原数组
      // portData.splice(0);
      // errorList.splice(0);
      // delPorts.splice(0);

      // setTimeout(() => {
      //   const obj = errorList.find((item) => !item.flag);
      //   if (!_.isUndefined(obj)) {
      //     CommonTip.warning('Please complete the required fields first');
      //     return;
      //   }
      //   handleSave(value);
      // }, 0);
    }
  });

  useEffect(() => {
    Loading.show();
    API.getContractList().then((res) => {
      const resContractList = res?.data?.data || [];
      setContractList(resContractList);
    });
    const params = {
      reqNo
    };
    console.log(params);
    API.getRequestFormNCSInfo(params)
      .then((res) => {
        console.log(res);
        if (res?.data?.data) {
          const {
            dpReq,
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
            status,
            // requestItemList,
            contract,
            invoice,
            invoiceRecdDate,
            // backboneExp,
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
            isConfigDBUpdated
            // dpLocationPortPojoList,
            // isCheck
          } = res?.data?.data || {};
          // const noItem = dpLocationPortPojoList?.find(
          //   (item) => item?.oneList?.length !== 0 || item?.portList?.length !== 0
          // );
          // setHasItem(Boolean(noItem));
          // setCopyAcquisitionItem(requestItemList);
          // setIsShowGenId(isCheck === 'Y');
          // setGenIdItems(dpLocationPortPojoList ? [...dpLocationPortPojoList] : []);
          formik.setValues({
            ...formik.values,
            dpReq,
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
          const newAcquisitionItem = [];
          // if (requestItemList.length > 0) {
          //   newAcquisitionItem = requestItemList.map((item) => ({
          //     key: item.partNo,
          //     itemNoObj: item,
          //     qty: item.qty
          //   }));
          // }
          setAcquisitionItem([...newAcquisitionItem, ...acquisitionItem]);
          setDetailRequestDone(true);
        }
      })
      .finally(() => {
        Loading.hide();
      });
    // console.log(
    //   isEdict,
    //   detailRequestDone,
    //   setAcquisitionItem,
    //   setCurrentContract,
    //   currentContract,
    //   setCurrentContract,
    //   setBackboneExp,
    //   setChangeContractDialog
    // );
  }, []);

  // 详情时将数处理成对象形式显示
  useEffect(() => {
    // if (isDetail || isEdict) {
    if (typeof formik.values.contract === 'string') {
      const contractObj = contractList.filter((item) => item.contract === formik.values.contract);
      formik.setFieldValue('contract', contractObj[0]);
      setCurrentContract(contractObj[0]);
    }
    // }
  }, [contractList, detailRequestDone]);

  const fileds = [
    {
      filed: 'dpReq',
      labelName: 'DP_REQ#',
      type: 'string',
      disabled: true,
      itemFormControlProps: { md: 3, lg: 3 }
    },
    {
      filed: 'project',
      labelName: 'Project',
      type: 'string',
      disabled: true,
      itemFormControlProps: { md: 3, lg: 3 }
    },
    {
      filed: 'noOfPort',
      labelName: 'No. Data Port ',
      type: 'string',
      disabled: true,
      itemFormControlProps: { md: 3, lg: 3 }
    },
    {
      filed: 'contract',
      labelName: 'Contract *',
      type: 'autoSelect',
      // disabled: isDetail || formik?.values?.reqNo,
      renderOptionLabel: (option) => `${option?.contract || ''}---${option?.vendor || ''}`,
      data: contractList,
      listensData: acquisitionItem,
      itemFormControlProps: { md: 3, lg: 3 }
    },
    {
      filed: 'hospital',
      labelName: 'Institution',
      type: 'string',
      disabled: true,
      itemFormControlProps: { md: 3, lg: 3 }
    },
    {
      filed: 'expCompleteDate',
      labelName: `Exp Compl'n Date`,
      type: 'string',
      disabled: true,
      itemFormControlProps: { md: 3, lg: 3 }
    },
    {
      filed: 'totalIncome',
      labelName: `Total Income`,
      type: 'string',
      disabled: true,
      itemFormControlProps: { md: 3, lg: 3 }
    }
  ];
  return (
    <>
      <Accordion
        className={classes.root}
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
            <Grid container spacing={2}>
              {fileds.map((item) => (
                <RenderFiled key={item.filed} formik={formik} item={item} />
              ))}
            </Grid>
          </Grid>

          <Grid container style={{ background: '#fff' }}>
            <Grid {...FormControlProps} md={8} lg={8}>
              <OrderInfoLeft
                formik={formik}
                //   isEdict={isEdict}
                //   isDetail={isDetail}
                //   setFromStaff={setFromStaff}
                detailRequestDone={detailRequestDone}
              />
            </Grid>
            <Grid {...FormControlProps} md={4} lg={4}>
              <OrderInfoRight formik={formik} />
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>
      <WarningDialog
        open={changeContractDialog}
        handleConfirm={() => {
          formik.setFieldValue('vendor', currentContract?.vendor || '');
          formik.setFieldValue('contract', currentContract);
          setAcquisitionItem([{ key: new Date().getTime(), itemNoObj: {}, qty: 1 }]);
          setBackboneExp(0);
          setChangeContractDialog(false);
        }}
        handleClose={() => setChangeContractDialog(false)}
        content="Unsaved order will be discarded and cannot be recovered."
      />
    </>
  );
};

export default memo(BaseInfo);
