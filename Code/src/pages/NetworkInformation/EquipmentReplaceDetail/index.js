import React, { useEffect } from 'react';
import { useFormik } from 'formik';
import { useParams } from 'react-router-dom';
import { Typography } from '@material-ui/core';
import ReplaceApproval from './components/ReplaceApproval';
import { CommonTip, Loading } from '../../../components';
import webdpAPI from '../../../api/webdp/webdp';

export default function Index() {
  const localParams = useParams();
  const { requestNo } = localParams;
  const searchParam = {
    requestNo
  };
  const formik = useFormik({
    initialValues: {
      approvalRemark: {
        remark: '',
        configs: {
          setEAM: false,
          setEquip: false
        },
        status: ''
      },
      baseData: {}, // equipment基础数据
      cabinets: [], // closet对应的cabinet数据
      closet: {}, // closet数据
      maintenance: {}, // 保修单数据
      historyEquip: {} // 历史记录
    },
    // validate: (values) => {
    //   const errors = {};
    //   console.log('errors', values);
    //   return errors;
    // },
    onSubmit: (values) => {
      console.log(values);
      const { approvalRemark } = values;
      const saveData = {
        requestNo,
        remark: approvalRemark?.remark
      };
      Loading.show();
      webdpAPI
        .saveActionInfo(saveData)
        .then((res) => {
          console.log(res);
          CommonTip.success('Success');
          setTimeout(() => {
            window.location.reload();
          }, 1000);
        })
        .finally(() => {
          Loading.hide();
        });
    }
  });

  const { setFieldValue, handleChange, handleSubmit } = formik;

  // 获取detailapi数据
  const getDetailData = (params) => {
    Loading.show();
    webdpAPI
      .getActionHistoryDetail(params)
      .then((res) => {
        const newData = res?.data?.data?.data || {};
        setFieldValue('baseData', newData.baseData || {});
        setFieldValue('maintenance', newData.maintenance || {});
        setFieldValue('historyEquip', newData.historyEquip);
        setFieldValue('approvalRemark.remark', newData?.historyEquip?.remark);
        setFieldValue('approvalRemark.status', newData?.historyEquip?.status);
        // 如果status是completed，默认勾选
        if (newData?.historyEquip?.status === 'Completed') {
          setFieldValue('approvalRemark.configs.setEAM', true);
          setFieldValue('approvalRemark.configs.setEquip', true);
        }
      })
      .finally(() => {
        Loading.hide();
      });
  };

  useEffect(() => {
    getDetailData(searchParam);
  }, []);

  const { approvalRemark, baseData, maintenance, historyEquip } = formik.values;
  return (
    <div>
      <Typography variant="h2" style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
        RP{requestNo} {approvalRemark.status === 'Completed' ? '( Completed )' : null}
      </Typography>
      <ReplaceApproval
        setFieldValue={setFieldValue}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
        history={historyEquip}
        baseData={baseData}
        maintenance={maintenance}
        approvalRemark={approvalRemark}
      />
    </div>
  );
}
