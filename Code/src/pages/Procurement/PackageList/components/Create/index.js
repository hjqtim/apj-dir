import React, { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import { Grid, Button } from '@material-ui/core';
import _ from 'lodash';
import dayjs from 'dayjs';
import * as Yup from 'yup';
import { useHistory, useParams } from 'react-router-dom';
import { HAPaper, CommonTip } from '../../../../../components';
import Loading from '../../../../../components/Loading';
import API from '../../../../../api/webdp/webdp';
import { ContainerProps } from '../../../../../models/procurement/contract/FormControlProps';
import BaseInfo from './BaseInfo';
import ItemList from './ItemList';

export default function Create() {
  const history = useHistory();
  // 标识PackageID
  const { packageId } = useParams();
  const [isDetal, setIsDetal] = useState(true);
  const [backData, setBackData] = useState({});
  const [backList, setBackList] = useState([]);
  const url = history?.location?.pathname;

  useEffect(() => {
    // 判断当前页面
    if (url.indexOf('detail') !== -1) {
      setIsDetal(true);
    } else {
      setIsDetal(false);
    }
    // 编辑详情页面的数据获取
    if (url.indexOf('create') === -1) {
      fetchDetailData();
    }
  }, []);

  // Detal
  const fetchDetailData = () => {
    Loading.show();
    API.getPackageDetail({ packageId })
      .then((res) => {
        console.log(res);
        const { packagebag = {}, packageCablingEquipment = [] } = res?.data?.data || {};
        // 添加唯一key
        const packageItems = packageCablingEquipment.map((item) => ({
          ...item,
          key: Date.now().toString(36) + Math.random().toString(36).substr(2)
        }));

        // 备份数据，添加回相同的 No 时做对比
        setBackData({
          packagebag: JSON.parse(JSON.stringify(packagebag)),
          packageItems: JSON.parse(JSON.stringify(packageItems))
        });

        formik.setValues({
          ...formik.values,
          baseInfo: {
            ...formik.values.baseInfo,
            id: packagebag?.id || 0,
            packageName: packagebag?.packageName || '',
            startTime: packagebag?.startTime || null,
            endTime: packagebag?.endTime || null,
            createBy: packagebag?.createBy || ''
          }
        });
      })
      .finally(() => {
        Loading.hide();
      });
  };

  const formik = useFormik({
    initialValues: {
      baseInfo: {
        id: 0,
        packageName: '',
        startTime: '',
        endTime: '',
        createBy: '',
        isChecking: false,
        isExit: false
      }
    },
    // 静态校验,
    validationSchema: Yup.object({
      baseInfo: Yup.object({
        packageName: Yup.string().required('Can not be empty'),
        startTime: Yup.string().required('Can not be empty'),
        endTime: Yup.string().required('Can not be empty'),
        createBy: Yup.string().required('Can not be empty')
      })
    }),
    // 动态校验,
    // validate: (values) => {
    //   let dynamicError = {};
    //   // 校验合同编号
    //   if (values?.baseInfo?.isExit) {
    //     dynamicError = { baseInfo: { contract: 'Can not be empty Same' } };
    //   }

    //   // 校验Item的 partNo 是否存在相同
    //   const {
    //     contractItems: { items }
    //   } = values || {};
    //   const samepartNoIds = [];
    //   items.forEach((x, index) => {
    //     const flag = items.some((item, idx) => index !== idx && x.partNo === item.partNo);
    //     if (flag) {
    //       samepartNoIds.push(index);
    //     }
    //   });

    //   // 存在相同的  partNo
    //   if (samepartNoIds.length > 0) {
    //     const errorArr = items.map((item, index) => {
    //       let err;
    //       if (samepartNoIds.indexOf(index) !== -1) {
    //         err = { partNo: 'Can not be empty Same' };
    //       } else {
    //         err = undefined;
    //       }
    //       return err;
    //     });

    //     dynamicError = { ...dynamicError, contractItems: { items: [...errorArr] } };
    //   }

    //   return dynamicError;
    // },
    onSubmit: (values) => {
      handleSubmit(values);
    }
  });

  // 保存数据
  const handleSubmit = (values) => {
    const { id, packageName, startTime, endTime, createBy } = values.baseInfo;
    let queryData = {};

    const deleteData =
      backData?.contractItems?.filter(
        (x) => !values?.contractItems?.items.some((item) => x.id === item.id)
      ) || [];

    // const contractCablingEquipment = values?.contractItems?.items.map((item) => ({
    //   ...item,
    //   id: url?.indexOf('create') !== -1 ? 0 : item.id,
    //   startTime: dayjs(item.startTime).format('YYYY-MM-DD HH:mm:ss'),
    //   endTime: dayjs(item.endTime).format('YYYY-MM-DD HH:mm:ss')
    // }));

    const itemIds = _.map(deleteData, 'id');

    queryData = {
      networkDesignPackage: {
        id: url?.indexOf('create') !== -1 ? 0 : id,
        packageName,
        startTime: dayjs(startTime).format('YYYY-MM-DD HH:mm:ss'),
        endTime: dayjs(endTime).format('YYYY-MM-DD HH:mm:ss'),
        createBy
      },
      networkDesignPackageItems: backList,
      itemIds: itemIds || undefined
    };
    console.log('queryData', queryData);
    Loading.show();
    API.savePackage(queryData)
      .then((res) => {
        const resCode = res?.data?.code;
        if (resCode === 200) {
          CommonTip.success('Success');
          history.goBack();
        }
      })
      .finally(() => {
        Loading.hide();
      });
  };

  // const genNewItem = useCallback(() => {
  //   const key = Date.now().toString(36) + Math.random().toString(36).substr(2);
  //   return { ..._.cloneDeep(defaultItem), key };
  // }, []);

  const handleSubmitData = () => {
    if (formik?.values?.baseInfo?.isChecking) {
      CommonTip.warning('In the  inspection');
      return;
    }
    formik.handleSubmit();
    console.log(backList);
    console.log(backData);
    console.log(formik.values);
  };

  const getListObjcet = (params) => {
    setBackList(params);
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', marginTop: '7em' }}>
      <HAPaper style={{ padding: '20px', paddingLeft: '5vw' }}>
        <Grid {...ContainerProps}>
          <Grid item xs={12}>
            <BaseInfo
              isDetal={isDetal}
              backData={backData}
              values={formik.values.baseInfo}
              handleChange={formik.handleChange}
              handleBlur={formik.handleBlur}
              setFieldValue={formik.setFieldValue}
              errors={formik.errors.baseInfo}
              touched={formik.touched.baseInfo}
            />
          </Grid>
          <Grid item xs={12}>
            <ItemList sentObject={getListObjcet} />
          </Grid>
          <Grid item xs={12}>
            <Grid {...ContainerProps}>
              <div
                style={{
                  width: '250px',
                  display: 'flex',
                  justifyContent: 'space-around',
                  marginBottom: '20px'
                }}
              >
                <Button
                  variant="contained"
                  color="primary"
                  disabled={isDetal}
                  onClick={handleSubmitData}
                >
                  Submit
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => {
                    history.goBack();
                  }}
                >
                  Cancel
                </Button>
              </div>
            </Grid>
          </Grid>
        </Grid>
      </HAPaper>
    </div>
  );
}
