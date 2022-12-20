import React, { useCallback, useState, useEffect, useMemo } from 'react';
import { Grid, Button, Typography } from '@material-ui/core';
import { useFormik } from 'formik';
import _ from 'lodash';
import { useSelector } from 'react-redux';
import { useParams, useHistory } from 'react-router-dom';
import * as Yup from 'yup';
import dayjs from 'dayjs';
import Requester from './components/Requester';
import EndUser from './components/EndUser';
import Service from './components/Service';
import Additional from './components/Additional';
import DataPortList from './components/DataPortList';
import Remarks from './components/Remarks';
import API from '../../../api/webdp/looping';
import Loading from '../../../components/Loading';
import { CommonTip, WarningDialog } from '../../../components';

const Looping = (props) => {
  // isDetail is detail page
  // isApproval is approval page
  //  isRequest is request page
  const { isDetail = false, isApproval = false } = props;
  const isRequest = !isDetail && !isApproval;
  const urlParams = useParams();
  const history = useHistory();

  const user = useSelector((state) => state.userReducer?.currentUser) || {};
  const [open, setOpen] = useState(false);
  const [submitCount, setSubmitCount] = useState(0);
  const defaultItem = {
    id: -1,
    dataPortId: '',
    approach: 'Progress',
    dataPortRemarks: '',
    processStatus: '',
    checkStatus: '',
    isChecking: false
  };

  const FormHeaderProps = {
    variant: 'h2',
    style: {
      fontWeight: 'bold',
      padding: '0.5rem',
      paddingLeft: isDetail || isApproval ? '0.5em' : 0,
      textAlign: isDetail || isApproval ? 'center' : 'left',
      fontSize: isDetail || isApproval ? 28 : 16.5
    }
  };

  // 新增一个item所需的对象
  const genNewItem = useCallback(() => {
    const randomNum = Math.ceil(Math.random() * 10000);
    const randomKey = new Date().getTime() + randomNum;
    return { ..._.cloneDeep(defaultItem), id: randomKey };
  }, []);

  const getDisplayName = useMemo(() => {
    const arr = user?.displayName?.split?.(',') || [];
    if (arr[0]) {
      return arr[0];
    }
    return '';
  }, [user?.displayName]);

  const submit = (pass) => {
    handleClose();

    const v = formik.values;

    let otherBusiness;
    if (isApproval) {
      if (v.configureSwitch) {
        otherBusiness = 'Configure Switch';
      }

      if (v.configureSwitch2 && otherBusiness) {
        otherBusiness += '|Save Switch Configuration';
      } else if (v.configureSwitch2 && !otherBusiness) {
        otherBusiness = 'Save Switch Configuration';
      }
    }

    const dpLoopingProtection = {
      ...v.requester,
      ...v.endUser,
      ...v.service,
      exemptFrom: v.service?.requestType === 'Disable' ? v.service.exemptFrom : '',
      exemptTo: v.service?.requestType === 'Disable' ? v.service.exemptTo : '',
      purpose: v.service?.requestType === 'Disable' ? v.service.purpose : '',
      requestHosp: v.service?.requestHosp?.hospital || '',
      ...v.additional,
      id: isApproval ? v.detailData.id : 0,
      requestNo: isApproval ? v.detailData?.requestNo : undefined,
      requesterEmail: isApproval ? undefined : user?.mail,
      respStaffEmail: isApproval ? user?.mail : undefined
    };
    const dpLoopingProtectionDetails = [];

    v?.dataPortList?.items?.forEach((dataPortItem) => {
      if (dataPortItem.dataPortId) {
        let saveParams = { dataPortId: dataPortItem.dataPortId };
        if (isApproval) {
          saveParams = dataPortItem;
        }
        dpLoopingProtectionDetails.push(saveParams);
      }
    });

    const params = {
      dpLoopingProtection,
      dpLoopingProtectionDetails,
      isApproval
    };

    if (isApproval) {
      params.pass = pass;
      params.approvalRemarks = v.approvalRemarks;
      params.otherBusiness = otherBusiness;
    } else {
      params.userInfo = { loginUser: user?.username || '', requester: user?.username || '' };
      params.displayName = user?.displayName;
    }

    Loading.show();
    API.saveLoop(params)
      .then((res) => {
        if (res?.data?.code === 200) {
          CommonTip.success('Success');
          setTimeout(() => {
            if (isApproval) {
              history.goBack();
            } else {
              history.push('/request');
            }
          }, 500);
        }
      })
      .finally(() => {
        Loading.hide();
      });
  };

  // console.log('LP userinfo', user);
  const { displayName } = user;
  const temparr = displayName ? displayName.split(',') : '';

  const formik = useFormik({
    initialValues: {
      requester: {
        requesterName: isRequest ? getDisplayName : '',
        // requesterTitle: isRequest ? user?.title || '' : '',
        requesterTitle: isRequest ? temparr[1] : '',
        requesterPhone: isRequest ? user?.phone || '' : '',
        requesterId: isRequest ? user?.username || '' : ''
      },
      endUser: {
        endRequesterName: '',
        endRequesterTitle: '',
        endRequesterPhone: '',
        endRequesterRemarks: ''
      },
      service: {
        requestHosp: {},
        requestType: '',
        exemptFrom: dayjs().format('YYYY-MM-DD 00:00:00'),
        exemptTo: dayjs().add(6, 'month').format('YYYY-MM-DD 23:59:59'),
        purpose: ''
      },
      additional: {
        dpRequestNo: '',
        tsrNo: '',
        crNo: '',
        adminRemarks: ''
      },
      dataPortList: {
        items: [defaultItem]
      },
      configureSwitch: false,
      configureSwitch2: false,
      approvalRemarks: '',
      detailData: {}
    },
    // 静态校验
    validationSchema: Yup.object({
      requester: Yup.object({
        requesterName: Yup.string().required('Can not be empty'),
        // requesterTitle: Yup.string().required('Can not be empty'),
        requesterPhone: Yup.string()
          .required('Can not be empty')
          .length(8, 'The length of the phone must be 8')
      }),
      service: Yup.object({
        requestHosp: Yup.object({
          hospital: Yup.string().required('Can not be empty')
        }),
        requestType: Yup.string().required('Can not be empty')
      })
    }),
    // 动态校验
    validate: (values) => {
      const dynamicError = {};
      const { requestType, exemptFrom, exemptTo, purpose } = values.service || {};
      if (requestType === 'Disable') {
        if (!exemptFrom) {
          dynamicError.exemptFrom = 'Can not be empty';
        }
        if (!exemptTo) {
          dynamicError.exemptTo = 'Can not be empty';
        }
        if (!purpose) {
          dynamicError.purpose = 'Can not be empty';
        }
      }

      // data port list validate start ↓↓↓↓↓↓↓↓↓↓↓↓
      const len = values.dataPortList?.items?.length;
      dynamicError.dataPortItems = [];
      if (len <= 1) {
        dynamicError.dataPortItems.push(true);
      } else {
        values.dataPortList?.items?.forEach((dataPortRecord, index) => {
          if (index === len - 1) {
            // last item
            dynamicError.dataPortItems.push(false);
          } else if (dataPortRecord.dataPortId && dataPortRecord.checkStatus === 'true') {
            dynamicError.dataPortItems.push(false);
          } else {
            dynamicError.dataPortItems.push(true);
          }
        });
      }
      const noError = dynamicError.dataPortItems.every((item) => !item);
      if (noError) {
        delete dynamicError.dataPortItems;
      }
      // data port list validate end ↑↑↑↑↑↑↑↑↑↑↑

      if (values.endUser?.endRequesterName) {
        if (!values.endUser?.endRequesterTitle) {
          dynamicError.endRequesterTitle = 'Can not be empty';
        }
        if (values.endUser?.endRequesterPhone?.length !== 8) {
          dynamicError.endRequesterPhone = 'Can not be empty and the length of the phone must be 8';
        }
      }

      return dynamicError;
    }
  });

  const handleClose = () => {
    setOpen(false);
  };

  const handleConfirm = () => {
    submit();
  };

  const handleData = (val = {}) => {
    const requester = {
      requesterName: val.requesterName || '',
      requesterTitle: val.requesterTitle || '',
      requesterPhone: val.requesterPhone || '',
      requesterId: val.requesterId || ''
    };
    const endUser = {
      endRequesterName: val.endRequesterName || '',
      endRequesterTitle: val.endRequesterTitle || '',
      endRequesterPhone: val.endRequesterPhone || '',
      endRequesterRemarks: val.endRequesterRemarks || ''
    };

    const service = {
      requestHosp: {
        hospital: val.requestHosp
      },
      requestType: val.requestType,
      exemptFrom: val.exemptFrom || '',
      exemptTo: val.exemptTo || '',
      purpose: val.purpose || ''
    };

    const additional = {
      dpRequestNo: val.dpRequestNo || '',
      tsrNo: val.tsrNo || '',
      crNo: val.crNo || '',
      adminRemarks: val.adminRemarks || ''
    };

    const items = val.dpLoopingProtectionDetails?.map((item) => ({
      ...defaultItem,
      ...item,
      approach: item.approach || defaultItem.approach,
      dataPortRemarks: item.dataPortRemarks || ''
    }));

    let configureSwitch = false;
    let configureSwitch2 = false;

    const otherBusinessArr = val.otherBusiness?.split('|') || [];

    if (otherBusinessArr.includes('Configure Switch')) {
      configureSwitch = true;
    }

    if (otherBusinessArr.includes('Save Switch Configuration')) {
      configureSwitch2 = true;
    }

    formik.setValues({
      ...formik.values,
      requester,
      endUser,
      service,
      additional,
      dataPortList: {
        items
      },
      approvalRemarks: val.approvalRemarks || '',
      detailData: val,
      configureSwitch,
      configureSwitch2
    });
  };

  const queryDetail = () => {
    if (urlParams?.requestNo) {
      Loading.show();
      const queryParams = {
        requestNo: urlParams.requestNo
      };
      API.getLoopDetail(queryParams)
        .then((res) => {
          handleData(res?.data?.data || {});
        })
        .finally(() => {
          Loading.hide();
        });
    }
  };

  useEffect(() => {
    if (isDetail || isApproval) {
      queryDetail();
    }
  }, []);

  useEffect(() => {
    if (submitCount && Object.keys(formik.errors)?.length > 0) {
      CommonTip.warning('Please complete the required fields first');
      setOpen(false);
    } else if (submitCount && Object.keys(formik.errors)?.length === 0) {
      setOpen(true);
    }
  }, [submitCount]);

  const serviceErrors = useMemo(
    () => ({
      exemptFrom: formik.errors.exemptFrom,
      exemptTo: formik.errors.exemptTo,
      purpose: formik.errors.purpose,
      hospital: formik.errors.service?.requestHosp?.hospital,
      requestType: formik.errors.service?.requestType
    }),
    [
      formik.errors.exemptFrom,
      formik.errors.exemptTo,
      formik.errors.purpose,
      formik.errors.service?.requestHosp?.hospital,
      formik.errors.service?.requestType
    ]
  );

  const endUserErrors = useMemo(
    () => ({
      endRequesterName: formik.errors.endRequesterName,
      endRequesterPhone: formik.errors.endRequesterPhone,
      endRequesterTitle: formik.errors.endRequesterTitle
    }),
    [
      formik.errors.endRequesterPhone,
      formik.errors.endRequesterTitle,
      formik.errors.endRequesterName
    ]
  );

  const status = formik.values.detailData.status || ''; // form status

  const isCompleted = useMemo(
    () =>
      status.toLowerCase().includes('completed') ||
      status.toLowerCase().includes('reject') ||
      false,
    [status]
  );

  return (
    <div
      style={{
        width: '100%',
        backgroundColor: '#fff',
        padding: '0.8rem',
        borderRadius: '0.5rem',
        marginTop: '1rem'
      }}
    >
      <Grid container spacing={4}>
        <Grid item xs={12}>
          {isDetail || isApproval ? (
            <Typography {...FormHeaderProps}>LP{urlParams?.requestNo}</Typography>
          ) : null}
          <Typography {...FormHeaderProps}>Data Port Looping Protection</Typography>
        </Grid>
        <Requester
          values={formik.values.requester}
          handleChange={formik.handleChange}
          isDetail={isDetail}
          handleBlur={formik.handleBlur}
          touched={formik.touched.requester}
          errors={formik.errors.requester}
          isApproval={isApproval}
        />

        <EndUser
          values={formik.values.endUser}
          handleChange={formik.handleChange}
          handleBlur={formik.handleBlur}
          isDetail={isDetail}
          setFieldValue={formik.setFieldValue}
          errors={endUserErrors}
          touched={formik.touched.endUser}
          isApproval={isApproval}
        />

        <Service
          values={formik.values.service}
          handleChange={formik.handleChange}
          isDetail={isDetail}
          handleBlur={formik.handleBlur}
          touched={formik.touched.service}
          errors={serviceErrors}
          isApproval={isApproval}
          // dataPortValues={formik.values.dataPortList.items}
          setFieldValue={formik.setFieldValue}
          formik={formik}
        />

        <Additional
          values={formik.values.additional}
          handleChange={formik.handleChange}
          isDetail={isDetail}
          isApproval={isApproval}
        />

        {formik.values.service.requestHosp?.hospital && formik.values.service.requestType ? (
          <DataPortList
            values={formik.values.dataPortList}
            setFieldValue={formik.setFieldValue}
            genNewItem={genNewItem}
            isDetail={isDetail}
            handleBlur={formik.handleBlur}
            touched={formik.touched.dataPortList?.items}
            setFieldTouched={formik.setFieldTouched}
            errors={formik.errors.dataPortItems}
            handleChange={formik.handleChange}
            isApproval={isApproval}
            requestType={formik.values.service.requestType}
            isCompleted={isCompleted}
            detailData={formik.values.detailData}
            formik={formik}
          />
        ) : null}

        {(isApproval || isDetail) && (
          <Remarks
            approvalRemarks={formik.values.approvalRemarks}
            configureSwitch={formik.values.configureSwitch}
            configureSwitch2={formik.values.configureSwitch2}
            handleChange={formik.handleChange}
            isApproval={isApproval}
            isDetail={isDetail}
            isCompleted={isCompleted}
            detailData={formik.values.detailData}
            formik={formik}
          />
        )}

        {isApproval && !isCompleted && (
          <Grid item container spacing={2} xs={12} style={{ paddingTop: '20px' }}>
            <Button
              color="primary"
              variant="contained"
              disabled={formik.values.detailData?.readOnly || false}
              onClick={() => {
                const hasItem = formik.values.dataPortList.items.find((item) => {
                  if (item.approach === 'Progress') {
                    CommonTip.warning('Each record must be approach a processing method');
                    return true;
                  }

                  if (
                    item.approach === 'Manual' &&
                    (!formik.values.configureSwitch || !formik.values.configureSwitch2)
                  ) {
                    CommonTip.warning(
                      'You have to choose Configure Switch and Save Switch Configuration'
                    );
                    return true;
                  }

                  return false;
                });

                if (!hasItem) {
                  submit(true);
                }
              }}
            >
              Process/Complete This Request
            </Button>

            <Button
              variant="contained"
              style={{ marginLeft: 20 }}
              disabled={formik.values.detailData?.readOnly || false}
              onClick={() => {
                if (!formik.values.approvalRemarks) {
                  CommonTip.warning('Please fill in the reason for refusal');
                  return;
                }
                submit(false);
              }}
            >
              Reject This Request
            </Button>
          </Grid>
        )}

        {isRequest && (
          <Grid item container spacing={2} xs={12} style={{ paddingTop: '20px' }}>
            <Button
              color="primary"
              variant="contained"
              onClick={() => {
                formik.handleSubmit();
                const hasLoading = formik.values.dataPortList.items.find((item) => item.isChecking);
                if (hasLoading) {
                  CommonTip.warning('Checking the data port id, Please try again later');
                } else {
                  setTimeout(() => {
                    setSubmitCount(submitCount + 1);
                  }, 0);
                }
              }}
            >
              Submit
            </Button>
          </Grid>
        )}

        <WarningDialog
          handleConfirm={handleConfirm}
          handleClose={handleClose}
          content="Are you sure to submit the application ?"
          open={open}
        />
      </Grid>
    </div>
  );
};

export default Looping;
