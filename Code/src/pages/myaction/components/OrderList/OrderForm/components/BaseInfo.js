import React, { useState, memo, useEffect } from 'react';
import { Grid, makeStyles } from '@material-ui/core';
import API from '../../../../../../api/webdp/webdp';
import { WarningDialog } from '../../../../../../components';

import RenderFiled from './RenderFiled';

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: '#fff',
    padding: theme.spacing(2, 2, 0),
    '& .MuiGrid-root.MuiGrid-container': {
      margin: theme.spacing(1, 0)
    }
  }
}));

const BaseInfo = ({
  formik,
  isDetail,
  isEdict,
  detailRequestDone,
  acquisitionItem,
  setAcquisitionItem,
  currentContract,
  setCurrentContract,
  setBackboneExp
}) => {
  const classes = useStyles();
  const [contractList, setContractList] = useState([]);
  const [changeContractDialog, setChangeContractDialog] = useState(false);
  useEffect(() => {
    API.getContractList().then((res) => {
      const resContractList = res?.data?.data || [];
      setContractList(resContractList);
    });
  }, []);

  // 详情时将数处理成对象形式显示
  useEffect(() => {
    if (isDetail || isEdict) {
      if (typeof formik.values.contract === 'string') {
        const contractObj = contractList.filter((item) => item.contract === formik.values.contract);
        formik.setFieldValue('contract', contractObj[0]);
        setCurrentContract(contractObj[0]);
      }
    }
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
      disabled: isDetail || formik?.values?.reqNo,
      renderOptionLabel: (option) => `${option?.contract || ''}---${option?.vendor || ''}`,
      handleChange: (e, value) => {
        setCurrentContract(value);
        // 当 acquisitionItem 的长度为1时，表示 acquisitionItem 没有操作过无需提示
        if (acquisitionItem.length === 1) {
          formik.setFieldValue('contract', value || '');
          formik.setFieldValue('vendor', value?.vendor || '');
          return;
        }

        setChangeContractDialog(true);
      },
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
      <Grid container spacing={2} className={classes.root}>
        {fileds.map((item) => (
          <RenderFiled key={item.filed} formik={formik} item={item} />
        ))}
      </Grid>
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
