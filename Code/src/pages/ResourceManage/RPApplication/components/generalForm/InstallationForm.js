import React, { memo, useEffect, useMemo } from 'react';
import { useFormik } from 'formik';
import { Button, Grid, TextField, CircularProgress } from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';
import dayjs from 'dayjs';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router';
import _ from 'lodash';
import { setServiceForm } from '../../../../../redux/ResourceMX/resourceAction';

import FormControlProps from '../../../../../models/webdp/PropsModels/FormControlProps';
import CommonSelect from '../../../../../components/CommonSelect';
import HAKeyboardDatePicker from '../../../../../components/HAKeyboardDatePicker';

import webDPAPI from '../../../../../api/webdp/webdp';
// import { validIp } from '../../../../../utils/tools';

const Index = () => {
  let serviceForm = useSelector((state) => state.resourceMX.serviceForm);
  // console.log('INSTLL serviceForm', serviceForm);
  const resourceStatus = useSelector((state) => state.resourceMX.resourceStatus);
  // console.log('resourceStatus', resourceStatus);
  const touches = useSelector((state) => state.resourceMX.touches);
  // console.log('Installation Form Touches', touches);
  const requestNoT = useParams().requestNo;
  const orderStatus = useParams().status;
  const dispatch = useDispatch();

  const formik = useFormik({
    initialValues: {
      installationList: [
        {
          key: Date.now().toString(36) + Math.random().toString(36).substr(2),
          jobTypeValue: '1',
          statffName: '',
          staffListLoading: false,
          staffPhone: '',
          staffPhoneError: false,
          staffEmail: '',
          staffEmailError: false,
          targetAt: [dayjs('1990-01-01'), dayjs('1990-01-01')],
          rangeDate: { startDate: null, endDate: null },

          subForm1: [
            {
              key: Date.now().toString(36) + Math.random().toString(36).substr(2),
              Equipment: '',
              sourceOfGoods: '',
              orderNo: '',
              PRCode: '',
              availableDate: ''
            }
          ],

          closetID: '',
          closeListLoading: false,
          rackID: '',
          rackListLoading: false,
          position: '',
          positionListLoading: false,
          powerSource: '',
          powerSourceListLoading: false,
          ip: '',
          ipListLoading: false,

          subForm2: [
            {
              key: Date.now().toString(36) + Math.random().toString(36).substr(2),
              priBackboneID: '',
              priBackboneIDLoading: false,
              priBackboneType: '',
              secBackboneID: '',
              secBackboneIDLoading: false,
              secBackboneType: '',
              availableDate: ''
            }
          ],

          subForm3: [
            {
              key: Date.now().toString(36) + Math.random().toString(36).substr(2),
              switchPort: '',
              outletID: '',
              activate: '',
              remarks: '',
              outletIDLoading: false
            }
          ]
        }
      ],

      jobTypeList: [
        { label: 'New installation', value: '1' },
        { label: 'Configuration', value: '0' }
      ],
      staffList: [],
      EquipmentList: [
        { label: 'L2 switch', value: '1' },
        { label: 'L3 switch', value: '2' },
        { label: 'GBIC', value: '3' },
        { label: 'Others', value: '4' }
      ],
      sourceOfGoodsList: [
        { label: 'N3 stock', value: '1' },
        { label: 'New PR', value: '2' }
      ],
      closeIDList: [],
      rackIDList: [],
      positionList: [],
      powerSourceList: [],
      ipList: [],
      priBackboneIDList: [],
      secBackboneIDList: [],
      backboneTypeList: [
        { label: 'UTP - Cat5/ Cat5e', value: '1' },
        { label: 'UTP - Cat6/C6a', value: '2' },
        { label: 'Fiber - MM OM3', value: '3' },
        { label: 'Fiber - SM OS1 / SM OS2', value: '4' }
      ],
      activateList: [
        { label: 'Y', value: '1' },
        { label: 'N', value: '0' }
      ],
      outletIDList: []
    }
  });

  const checkUser2 = (value) => {
    // console.log('chekc', value);
    formik.setFieldValue('staffListLoading', true);
    const obj = {};
    obj.username = value;
    webDPAPI
      .getADUserList(obj)
      .then((res) => {
        // console.log('getADUserList', res.data.data);
        if (res.data.code === 200) {
          const tempData = res.data.data;
          formik.setFieldValue('staffList', [...tempData]);
        }
      })
      .finally(() => {
        formik.setFieldValue('staffListLoading', false);
      });
  };
  const optionsStaff = useMemo(
    () => formik.values.staffList.map((optionItem) => optionItem.display),
    [formik.values.staffList]
  );

  const setStaffInfo = (value, index) => {
    const { staffList } = formik.values;
    const staffInfo = staffList.filter((item) => item.display === value);
    if (staffInfo) {
      formik.setFieldValue(`installationList.${index}.staffPhone`, staffInfo[0]?.phone);
      formik.setFieldValue(`installationList.${index}.staffEmail`, staffInfo[0]?.mail);
    }
  };

  const handleDataChange = (val, index, status) => {
    let { startDate } = formik.values.installationList[index].rangeDate;
    let { endDate } = formik.values.installationList[index].rangeDate;

    if (status === 'startDate') {
      startDate = val;
      setFieldValue(`installationList.${index}.targetAt`, [
        formik.values.installationList[index].targetAt[0],
        startDate
      ]);
      setFieldValue(`installationList.${index}.rangeDate`, { startDate, endDate });
    }
    if (status === 'endDate') {
      endDate = val;
      setFieldValue(`installationList.${index}.rangeDate`, { startDate, endDate });
    }
  };

  const { installationList } = formik.values;
  const { handleChange, setFieldValue } = formik;

  const subForm1Add = (index) => {
    const { installationList } = formik.values;
    // console.log('subForm1Add', index, installationList);
    const { subForm1 } = installationList[index];
    const obj = {
      Equipment: '',
      sourceOfGoods: '',
      orderNo: '',
      PRCode: ''
    };
    const tempArr = [...subForm1, obj];
    installationList[index].subForm1 = tempArr;
    setFieldValue('installationList', installationList);
  };
  const subForm1Del = (index, index2) => {
    const { installationList } = formik.values;
    const { subForm1 } = installationList[index];
    if (subForm1.length > 1) {
      subForm1.splice(parseInt(index2), 1);
      // console.log('subForm1Del', index, index2, subForm1);
      installationList[index].subForm1 = subForm1;
      setFieldValue('installationList', installationList);
    }
  };

  const subForm2Add = (index) => {
    const { installationList } = formik.values;
    const { subForm2 } = installationList[index];
    const obj = {
      priBackboneID: '',
      priBackboneIDLoading: false,
      priBackboneType: '',
      secBackboneID: '',
      secBackboneIDLoading: false,
      secBackboneType: '',
      availableDate: ''
    };
    const tempArr = [...subForm2, obj];
    installationList[index].subForm2 = tempArr;
    setFieldValue('installationList', installationList);
  };
  const subForm2Del = (index, index2) => {
    const { installationList } = formik.values;
    const { subForm2 } = installationList[index];
    if (subForm2.length > 1) {
      subForm2.splice(parseInt(index2), 1);
      installationList[index].subForm2 = subForm2;
      setFieldValue('installationList', installationList);
    }
  };

  const subForm3Add = (index) => {
    const { installationList } = formik.values;
    const { subForm3 } = installationList[index];
    const obj = {
      switchPort: '',
      outletID: '',
      activate: '',
      remarks: '',
      outletIDLoading: false
    };
    const tempArr = [...subForm3, obj];
    installationList[index].subForm3 = tempArr;
    setFieldValue('installationList', installationList);
  };
  const subForm3Del = (index, index2) => {
    const { installationList } = formik.values;
    const { subForm3 } = installationList[index];
    if (subForm3.length > 1) {
      subForm3.splice(parseInt(index2), 1);
      installationList[index].subForm3 = subForm3;
      setFieldValue('installationList', installationList);
    }
  };

  const subForm4Del = (index) => {
    const { installationList } = formik.values;
    if (installationList.length > 1) {
      installationList.splice(index, 1);
      setFieldValue('installationList', installationList);
    }
  };
  const subForm4Copy = (index) => {
    const { installationList } = formik.values;
    const temp = [...installationList, _.cloneDeep(installationList[index])];
    // console.log('subForm4Copy', temp);
    setFieldValue('installationList', temp);
  };
  const subForm4Add = () => {
    const { installationList } = formik.values;
    const obj = {
      jobTypeValue: '1',
      statffName: '',
      staffListLoading: false,
      staffPhone: '',
      staffPhoneError: false,
      staffEmail: '',
      staffEmailError: false,
      targetAt: [dayjs('1990-01-01'), dayjs('1990-01-01')],
      rangeDate: { startDate: null, endDate: null },

      subForm1: [
        {
          Equipment: '',
          sourceOfGoods: '',
          orderNo: '',
          PRCode: '',
          availableDate: ''
        }
      ],
      closetID: '',
      closeListLoading: false,
      rackID: '',
      rackListLoading: false,
      position: '',
      positionListLoading: false,
      powerSource: '',
      powerSourceListLoading: false,
      ip: '',
      ipListLoading: false,
      subForm2: [
        {
          priBackboneID: '',
          priBackboneIDLoading: false,
          priBackboneType: '',
          secBackboneID: '',
          secBackboneIDLoading: false,
          secBackboneType: '',
          availableDate: ''
        }
      ],
      subForm3: [
        {
          switchPort: '',
          outletID: '',
          activate: '',
          remarks: '',
          outletIDLoading: false
        }
      ]
    };
    const temp = [...installationList, obj];
    setFieldValue('installationList', temp);
  };

  // --------------------for NCS
  const optionsCloseID = useMemo(
    () => formik.values.closeIDList.map((optionItem) => optionItem.display),
    [formik.values.closeIDList]
  );
  const optionsRackID = useMemo(
    () => formik.values.rackIDList.map((optionItem) => optionItem.display),
    [formik.values.rackIDList]
  );
  const optionsPosition = useMemo(
    () => formik.values.positionList.map((optionItem) => optionItem.display),
    [formik.values.positionList]
  );
  const optionsPowerSource = useMemo(
    () => formik.values.powerSourceList.map((optionItem) => optionItem.display),
    [formik.values.powerSourceList]
  );
  const optionsIp = useMemo(
    () => formik.values.ipList.map((optionItem) => optionItem.display),
    [formik.values.ipList]
  );
  const optionsPriBackboneID = useMemo(
    () => formik.values.priBackboneIDList.map((optionItem) => optionItem.display),
    [formik.values.priBackboneIDList]
  );
  const optionsSecBackboneID = useMemo(
    () => formik.values.secBackboneIDList.map((optionItem) => optionItem.display),
    [formik.values.secBackboneIDList]
  );
  const optionsOutletID = useMemo(
    () => formik.values.outletIDList.map((optionItem) => optionItem.display),
    [formik.values.outletIDList]
  );

  const setServiceFormReducer = (installationList) => {
    serviceForm = installationList;
    dispatch(setServiceForm(serviceForm));
  };
  useEffect(() => {
    setServiceFormReducer(installationList);
  }, [installationList]);

  const setFormikData = (serviceForm) => {
    formik.setFieldValue('installationList', serviceForm);
  };
  useEffect(() => {
    // console.log('useEffect', serviceForm);
    setFormikData(serviceForm);
  }, [serviceForm]);

  return (
    <>
      {installationList?.length > 0
        ? installationList?.map((item, index) => {
            const { subForm1, subForm2, subForm3 } = item;
            return (
              <React.Fragment key={`${item.key}`}>
                <Grid container>
                  <Grid container spacing={3} style={{ marginBottom: 10, malignItems: 'right' }}>
                    <Grid {...FormControlProps} md={4} lg={2}>
                      <CommonSelect
                        style={{ background: '#fff', width: '100%' }}
                        outlined
                        label="Job Type "
                        name=""
                        size="small"
                        // width={2.557}
                        fullWidth
                        value={item.jobTypeValue}
                        itemList={formik.values.jobTypeList}
                        onSelectChange={handleChange(`installationList.${index}.jobTypeValue`)}
                        disabled
                      />
                    </Grid>
                    <Grid {...FormControlProps} md={4} lg={2}>
                      <Autocomplete
                        style={{ width: '100%' }}
                        freeSolo
                        id="Assignstaff"
                        value={item.statffName || null}
                        options={optionsStaff || []}
                        onChange={(_, value) => {
                          // console.log('Auto 1', _, value);
                          setFieldValue(`installationList.${index}.statffName`, value);
                        }} // 选择下拉 时 触发
                        disabled={
                          (resourceStatus === 'detailSubmited' && !requestNoT) ||
                          orderStatus === 'detail' ||
                          resourceStatus === 'detailApproved' ||
                          resourceStatus === 'detailDone'
                        }
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Contact Person *"
                            variant="outlined"
                            size="small"
                            value={item.statffName || null}
                            error={Boolean(touches.installationList?.[index]?.statffName)}
                            onChange={(e) => {
                              const staffNameTemp = e.target.value;
                              if (staffNameTemp.length > 2) {
                                checkUser2(e.target.value);
                              }
                            }} // 手写时 触发
                            onBlur={(e) => {
                              setFieldValue(`installationList.${index}.statffName`, e.target.value);
                              setStaffInfo(e.target.value, index);
                            }}
                            //   error={autoError}
                            // for loading
                            InputProps={{
                              ...params.InputProps,
                              endAdornment: (
                                <>
                                  {formik.values.installationList?.[index].staffListLoading ? (
                                    <CircularProgress size={20} color="inherit" />
                                  ) : null}
                                  {params.InputProps.endAdornment}
                                </>
                              )
                            }}
                          />
                        )}
                        // disabled={!disableStatus}
                      />
                    </Grid>
                    <Grid {...FormControlProps} md={4} lg={2}>
                      <TextField
                        label="Email"
                        variant="outlined"
                        size="small"
                        fullWidth
                        value={item.staffEmail}
                        disabled
                      />
                    </Grid>
                    <Grid {...FormControlProps} md={4} lg={2}>
                      <TextField
                        label="Phone *"
                        variant="outlined"
                        size="small"
                        fullWidth
                        value={item.staffPhone}
                        onChange={(e) => {
                          let phoneTemp = e.target.value;
                          if (phoneTemp.length > 8) {
                            phoneTemp = phoneTemp.substring(0, 8);
                            setFieldValue(`installationList.${index}.staffPhone`, phoneTemp);
                          }
                          setFieldValue(`installationList.${index}.staffPhone`, phoneTemp);
                        }}
                        onBlur={(value) => {
                          if (value.length < 8) {
                            setFieldValue(`installationList.${index}.staffPhoneError`, true);
                          }
                        }}
                        error={Boolean(touches.installationList?.[index]?.staffPhone)}
                        disabled={
                          (resourceStatus === 'detailSubmited' && !requestNoT) ||
                          orderStatus === 'detail' ||
                          resourceStatus === 'detailApproved' ||
                          resourceStatus === 'detailDone'
                        }
                      />
                    </Grid>
                    <Grid {...FormControlProps} sm="auto" md="auto" lg={2}>
                      <HAKeyboardDatePicker
                        label="Start Date *"
                        minDate={item.targetAt[0]}
                        value={item.rangeDate.startDate || ''}
                        onChange={(val) => {
                          console.log('HAKeyboardDatePicker', val);
                          handleDataChange(val, index, 'startDate');
                        }}
                        error={Boolean(touches.installationList?.[index]?.rangeDate?.startDate)}
                        disabled={
                          (resourceStatus === 'detailSubmited' && !requestNoT) ||
                          orderStatus === 'detail' ||
                          resourceStatus === 'detailApproved' ||
                          resourceStatus === 'detailDone'
                        }
                      />
                    </Grid>
                    <Grid {...FormControlProps} sm="auto" md="auto" lg={2}>
                      <HAKeyboardDatePicker
                        label="Target Date *"
                        minDate={item.targetAt[1]}
                        value={item.rangeDate.endDate || ''}
                        onChange={(val) => {
                          console.log('HAKeyboardDatePicker', val);
                          handleDataChange(val, index, 'endDate');
                        }}
                        error={Boolean(touches.installationList?.[index]?.rangeDate?.endDate)}
                        disabled={
                          (resourceStatus === 'detailSubmited' && !requestNoT) ||
                          orderStatus === 'detail' ||
                          resourceStatus === 'detailApproved' ||
                          resourceStatus === 'detailDone'
                        }
                      />
                    </Grid>
                  </Grid>

                  {subForm1.map((item2, index2) => (
                    <React.Fragment key={`item2${index2}`}>
                      <Grid
                        container
                        spacing={3}
                        style={{ marginTop: -10, marginBottom: 10, malignItems: 'right' }}
                      >
                        <Grid {...FormControlProps} md={4} lg={2}>
                          <CommonSelect
                            style={{ background: '#fff', width: '100%' }}
                            outlined
                            label="Equipment *"
                            name="Equipment"
                            size="small"
                            labelWidth={80}
                            fullWidth
                            value={item2.Equipment}
                            itemList={formik.values.EquipmentList}
                            onSelectChange={handleChange(
                              `installationList.${index}.subForm1.${index2}.Equipment`
                            )}
                            error={Boolean(
                              touches.installationList?.[index]?.subForm1?.[index2]?.Equipment
                            )}
                            disabled={
                              (resourceStatus === 'detailSubmited' && !requestNoT) ||
                              orderStatus === 'detail' ||
                              resourceStatus === 'detailApproved' ||
                              resourceStatus === 'detailDone'
                            }
                          />
                        </Grid>
                        <Grid {...FormControlProps} md={4} lg={2}>
                          <CommonSelect
                            style={{ background: '#fff', width: '100%' }}
                            outlined
                            label="Source of Goods "
                            name="Source of Goods"
                            size="small"
                            labelWidth={120}
                            fullWidth
                            value={item2.sourceOfGoods}
                            itemList={formik.values.sourceOfGoodsList}
                            onSelectChange={handleChange(
                              `installationList.${index}.subForm1.${index2}.sourceOfGoods`
                            )}
                            error={Boolean(
                              touches.installationList?.[index]?.subForm1?.[index2]?.sourceOfGoods
                            )}
                            disabled={
                              (resourceStatus === 'detailSubmited' && !requestNoT) ||
                              orderStatus === 'detail' ||
                              resourceStatus === 'detailApproved' ||
                              resourceStatus === 'detailDone'
                            }
                          />
                        </Grid>
                        <Grid {...FormControlProps} md={4} lg={2}>
                          <TextField
                            label="Order No."
                            variant="outlined"
                            size="small"
                            fullWidth
                            value={item2.orderNo}
                            onChange={handleChange(
                              `installationList.${index}.subForm1.${index2}.orderNo`
                            )}
                            error={Boolean(
                              touches.installationList?.[index]?.subForm1?.[index2]?.orderNo
                            )}
                            disabled={
                              (resourceStatus === 'detailSubmited' && !requestNoT) ||
                              orderStatus === 'detail' ||
                              resourceStatus === 'detailApproved' ||
                              resourceStatus === 'detailDone'
                            }
                          />
                        </Grid>
                        <Grid {...FormControlProps} md={4} lg={2}>
                          <TextField
                            label="PR Code"
                            variant="outlined"
                            size="small"
                            fullWidth
                            value={item2.PRCode}
                            onChange={handleChange(
                              `installationList.${index}.subForm1.${index2}.PRCode`
                            )}
                            error={Boolean(
                              touches.installationList?.[index]?.subForm1?.[index2]?.PRCode
                            )}
                            disabled={
                              (resourceStatus === 'detailSubmited' && !requestNoT) ||
                              orderStatus === 'detail' ||
                              resourceStatus === 'detailApproved' ||
                              resourceStatus === 'detailDone'
                            }
                          />
                        </Grid>
                        <Grid {...FormControlProps} md={4} lg={2}>
                          <HAKeyboardDatePicker
                            label="Available Date *"
                            value={item2.availableDate || ''}
                            onChange={(val) => {
                              const memoDate = dayjs(val).format('DD-MMM-YYYY');
                              setFieldValue(
                                `installationList.${index}.subForm1.${index2}.availableDate`,
                                memoDate
                              );
                            }}
                            error={Boolean(
                              touches.installationList?.[index]?.subForm1?.[index2]?.availableDate
                            )}
                            disabled={
                              (resourceStatus === 'detailSubmited' && !requestNoT) ||
                              orderStatus === 'detail' ||
                              resourceStatus === 'detailApproved' ||
                              resourceStatus === 'detailDone'
                            }
                          />
                        </Grid>
                        {(resourceStatus === 'detailSubmited' && !requestNoT) ||
                        orderStatus === 'detail' ||
                        resourceStatus === 'detailApproved' ||
                        resourceStatus === 'detailDone' ? null : (
                          <Grid {...FormControlProps} md={4} lg={2}>
                            <Button
                              variant="contained"
                              color="secondary"
                              onClick={() => {
                                subForm1Add(index, index2);
                              }}
                              style={{ marginRight: 10 }}
                            >
                              Add
                            </Button>
                            <Button
                              variant="contained"
                              color="default"
                              onClick={() => {
                                subForm1Del(index, index2);
                              }}
                            >
                              Delete
                            </Button>
                          </Grid>
                        )}
                      </Grid>
                    </React.Fragment>
                  ))}

                  <Grid
                    container
                    spacing={3}
                    style={{ marginTop: -10, marginBottom: 10, malignItems: 'right' }}
                  >
                    <Grid {...FormControlProps} md={4} lg={2}>
                      <Autocomplete
                        style={{ width: '100%' }}
                        freeSolo
                        id="closeID"
                        value={item.closetID || null}
                        options={optionsCloseID || []}
                        onChange={(_, value) => {
                          // console.log('Auto 1', _, value);
                          setFieldValue(`installationList.${index}.closetID`, value);
                        }} // 选择下拉 时 触发
                        disabled={
                          (resourceStatus === 'detailSubmited' && !requestNoT) ||
                          orderStatus === 'detail' ||
                          resourceStatus === 'detailApproved' ||
                          resourceStatus === 'detailDone'
                        }
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Closet ID"
                            variant="outlined"
                            size="small"
                            value={item.statffName || null}
                            onChange={(e) => {
                              const { value } = e.target;
                              console.log('Closet ID', value);
                            }} // 手写时 触发
                            onBlur={(e) => {
                              setFieldValue(`installationList.${index}.closetID`, e.target.value);
                            }}
                            error={Boolean(touches.installationList?.[index]?.closetID)}
                            //   error={autoError}
                            // for loading
                            InputProps={{
                              ...params.InputProps,
                              endAdornment: (
                                <>
                                  {formik.values.installationList?.[index].closeListLoading ? (
                                    <CircularProgress size={20} color="inherit" />
                                  ) : null}
                                  {params.InputProps.endAdornment}
                                </>
                              )
                            }}
                          />
                        )}
                        // disabled={!disableStatus}
                      />
                    </Grid>
                    <Grid {...FormControlProps} md={4} lg={2}>
                      <Autocomplete
                        style={{ width: '100%' }}
                        freeSolo
                        id="RackID"
                        value={item.rackID || null}
                        options={optionsRackID || []}
                        onChange={(_, value) => {
                          // console.log('Auto 1', _, value);
                          setFieldValue(`installationList.${index}.rackID`, value);
                        }} // 选择下拉 时 触发
                        disabled={
                          (resourceStatus === 'detailSubmited' && !requestNoT) ||
                          orderStatus === 'detail' ||
                          resourceStatus === 'detailApproved' ||
                          resourceStatus === 'detailDone'
                        }
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Rack ID "
                            variant="outlined"
                            size="small"
                            value={item.rackID || null}
                            onChange={(e) => {
                              const temp = e.target.value;
                              console.log(temp);
                            }} // 手写时 触发
                            onBlur={(e) => {
                              setFieldValue(`installationList.${index}.rackID`, e.target.value);
                            }}
                            error={Boolean(touches.installationList?.[index]?.rackID)}
                            //   error={autoError}
                            // for loading
                            InputProps={{
                              ...params.InputProps,
                              endAdornment: (
                                <>
                                  {formik.values.installationList?.[index].rackListLoading ? (
                                    <CircularProgress size={20} color="inherit" />
                                  ) : null}
                                  {params.InputProps.endAdornment}
                                </>
                              )
                            }}
                          />
                        )}
                        // disabled={!disableStatus}
                      />
                    </Grid>
                    <Grid {...FormControlProps} md={4} lg={4}>
                      <Autocomplete
                        style={{ width: '100%' }}
                        freeSolo
                        id="Position"
                        value={item.position || null}
                        options={optionsPosition || []}
                        onChange={(_, value) => {
                          // console.log('Auto 1', _, value);
                          setFieldValue(`installationList.${index}.position`, value);
                        }} // 选择下拉 时 触发
                        disabled={
                          (resourceStatus === 'detailSubmited' && !requestNoT) ||
                          orderStatus === 'detail' ||
                          resourceStatus === 'detailApproved' ||
                          resourceStatus === 'detailDone'
                        }
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Position"
                            variant="outlined"
                            size="small"
                            value={item.position || null}
                            onChange={(e) => {
                              const temp = e.target.value;
                              console.log(temp);
                            }} // 手写时 触发
                            onBlur={(e) => {
                              setFieldValue(`installationList.${index}.position`, e.target.value);
                            }}
                            error={Boolean(touches.installationList?.[index]?.position)}
                            //   error={autoError}
                            // for loading
                            InputProps={{
                              ...params.InputProps,
                              endAdornment: (
                                <>
                                  {formik.values.installationList?.[index].positionListLoading ? (
                                    <CircularProgress size={20} color="inherit" />
                                  ) : null}
                                  {params.InputProps.endAdornment}
                                </>
                              )
                            }}
                          />
                        )}
                        // disabled={!disableStatus}
                      />
                    </Grid>
                    <Grid {...FormControlProps} md={4} lg={2}>
                      <Autocomplete
                        style={{ width: '100%' }}
                        freeSolo
                        id="Power Source"
                        value={item.powerSource || null}
                        options={optionsPowerSource || []}
                        onChange={(_, value) => {
                          // console.log('Auto 1', _, value);
                          setFieldValue(`installationList.${index}.powerSource`, value);
                        }} // 选择下拉 时 触发
                        disabled={
                          (resourceStatus === 'detailSubmited' && !requestNoT) ||
                          orderStatus === 'detail' ||
                          resourceStatus === 'detailApproved' ||
                          resourceStatus === 'detailDone'
                        }
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Power Source"
                            variant="outlined"
                            size="small"
                            value={item.powerSource || null}
                            onChange={(e) => {
                              const temp = e.target.value;
                              console.log(temp);
                              //   if (Temp.length > 2) {
                              //     checkUser2(e.target.value);
                              //   }
                            }} // 手写时 触发
                            onBlur={(e) => {
                              setFieldValue(
                                `installationList.${index}.powerSource`,
                                e.target.value
                              );
                            }}
                            error={Boolean(touches.installationList?.[index]?.powerSource)}
                            //   error={autoError}
                            // for loading
                            InputProps={{
                              ...params.InputProps,
                              endAdornment: (
                                <>
                                  {formik.values.installationList?.[index]
                                    .powerSourceListLoading ? (
                                    <CircularProgress size={20} color="inherit" />
                                  ) : null}
                                  {params.InputProps.endAdornment}
                                </>
                              )
                            }}
                          />
                        )}
                        // disabled={!disableStatus}
                      />
                    </Grid>
                    <Grid {...FormControlProps} md={4} lg={2}>
                      <Autocomplete
                        style={{ width: '100%' }}
                        freeSolo
                        id="IP"
                        value={item.ip || null}
                        options={optionsIp || []}
                        onChange={(_, value) => {
                          // console.log('Auto 1', _, value);
                          setFieldValue(`installationList.${index}.ip`, value);
                        }} // 选择下拉 时 触发
                        disabled={
                          (resourceStatus === 'detailSubmited' && !requestNoT) ||
                          orderStatus === 'detail' ||
                          resourceStatus === 'detailApproved' ||
                          resourceStatus === 'detailDone'
                        }
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="IP"
                            variant="outlined"
                            size="small"
                            value={item.ip || null}
                            onChange={(e) => {
                              const temp = e.target.value;
                              console.log(temp);
                              //   if (Temp.length > 2) {
                              //     checkUser2(e.target.value);
                              //   }
                            }} // 手写时 触发
                            onBlur={(e) => {
                              setFieldValue(`installationList.${index}.ip`, e.target.value);
                            }}
                            error={Boolean(touches.installationList?.[index]?.ip)}
                            //   error={autoError}
                            // for loading
                            InputProps={{
                              ...params.InputProps,
                              endAdornment: (
                                <>
                                  {formik.values.installationList?.[index].ipListLoading ? (
                                    <CircularProgress size={20} color="inherit" />
                                  ) : null}
                                  {params.InputProps.endAdornment}
                                </>
                              )
                            }}
                          />
                        )}
                        // disabled={!disableStatus}
                      />
                    </Grid>
                  </Grid>

                  {subForm2.map((item3, index3) => (
                    <React.Fragment key={`item3${index3}`}>
                      <Grid
                        container
                        spacing={3}
                        style={{ marginTop: -10, marginBottom: 10, malignItems: 'right' }}
                      >
                        <Grid {...FormControlProps} md={4} lg={2}>
                          <Autocomplete
                            style={{ width: '100%' }}
                            freeSolo
                            id="priBackboneID *"
                            value={item3.priBackboneID || null}
                            options={optionsPriBackboneID || []}
                            onChange={(_, value) => {
                              // console.log('Auto 1', _, value);
                              setFieldValue(
                                `installationList.${index}.subForm2.${index3}.priBackboneID`,
                                value
                              );
                            }} // 选择下拉 时 触发
                            disabled={
                              (resourceStatus === 'detailSubmited' && !requestNoT) ||
                              orderStatus === 'detail' ||
                              resourceStatus === 'detailApproved' ||
                              resourceStatus === 'detailDone'
                            }
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                label="Pri. Backbone ID *"
                                variant="outlined"
                                size="small"
                                value={item3.priBackboneID || null}
                                error={Boolean(
                                  touches.installationList?.[index]?.subForm2?.[index3]
                                    ?.priBackboneID
                                )}
                                onChange={(e) => {
                                  const temp = e.target.value;
                                  console.log(temp);
                                }} // 手写时 触发
                                onBlur={(e) => {
                                  setFieldValue(
                                    `installationList.${index}.subForm2.${index3}.priBackboneID`,
                                    e.target.value
                                  );
                                }}
                                //   error={autoError}
                                // for loading
                                InputProps={{
                                  ...params.InputProps,
                                  endAdornment: (
                                    <>
                                      {formik.values.installationList?.[index].subForm2?.[index3]
                                        .priBackboneIDLoading ? (
                                        <CircularProgress size={20} color="inherit" />
                                      ) : null}
                                      {params.InputProps.endAdornment}
                                    </>
                                  )
                                }}
                              />
                            )}
                            // disabled={!disableStatus}
                          />
                        </Grid>
                        <Grid {...FormControlProps} md={4} lg={2}>
                          <CommonSelect
                            style={{ background: '#fff', width: '100%' }}
                            outlined
                            label="Pri. Backbone Type "
                            name=""
                            size="small"
                            labelWidth={120}
                            fullWidth
                            value={item3.priBackboneType}
                            itemList={formik.values.backboneTypeList}
                            error={Boolean(
                              touches.installationList?.[index]?.subForm2?.[index3]?.priBackboneType
                            )}
                            onSelectChange={handleChange(
                              `installationList.${index}.subForm2.${index3}.priBackboneType`
                            )}
                            disabled={
                              (resourceStatus === 'detailSubmited' && !requestNoT) ||
                              orderStatus === 'detail' ||
                              resourceStatus === 'detailApproved' ||
                              resourceStatus === 'detailDone'
                            }
                          />
                        </Grid>
                        <Grid {...FormControlProps} md={4} lg={2}>
                          <Autocomplete
                            style={{ width: '100%' }}
                            freeSolo
                            id="secBackboneID"
                            value={item3.secBackboneID || null}
                            options={optionsSecBackboneID || []}
                            onChange={(_, value) => {
                              // console.log('Auto 1', _, value);
                              setFieldValue(
                                `installationList.${index}.subForm2.${index3}.secBackboneID`,
                                value
                              );
                            }} // 选择下拉 时 触发
                            disabled={
                              (resourceStatus === 'detailSubmited' && !requestNoT) ||
                              orderStatus === 'detail' ||
                              resourceStatus === 'detailApproved' ||
                              resourceStatus === 'detailDone'
                            }
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                label="Sec. Backbone ID"
                                variant="outlined"
                                size="small"
                                value={item3.secBackboneID || null}
                                error={Boolean(
                                  touches.installationList?.[index]?.subForm2?.[index3]
                                    ?.secBackboneID
                                )}
                                onChange={(e) => {
                                  const temp = e.target.value;
                                  console.log(temp);
                                }} // 手写时 触发
                                onBlur={(e) => {
                                  setFieldValue(
                                    `installationList.${index}.subForm2.${index3}.secBackboneID`,
                                    e.target.value
                                  );
                                }}
                                //   error={autoError}
                                // for loading
                                InputProps={{
                                  ...params.InputProps,
                                  endAdornment: (
                                    <>
                                      {formik.values.installationList?.[index].subForm2?.[index3]
                                        .secBackboneIDLoading ? (
                                        <CircularProgress size={20} color="inherit" />
                                      ) : null}
                                      {params.InputProps.endAdornment}
                                    </>
                                  )
                                }}
                              />
                            )}
                            // disabled={!disableStatus}
                          />
                        </Grid>
                        <Grid {...FormControlProps} md={4} lg={2}>
                          <CommonSelect
                            style={{ background: '#fff', width: '100%' }}
                            outlined
                            label="Sec. Backbone Type "
                            name=""
                            size="small"
                            labelWidth={120}
                            fullWidth
                            value={item3.secBackboneType}
                            itemList={formik.values.backboneTypeList}
                            error={Boolean(
                              touches.installationList?.[index]?.subForm2?.[index3]?.secBackboneType
                            )}
                            onSelectChange={handleChange(
                              `installationList.${index}.subForm2.${index3}.secBackboneType`
                            )}
                            disabled={
                              (resourceStatus === 'detailSubmited' && !requestNoT) ||
                              orderStatus === 'detail' ||
                              resourceStatus === 'detailApproved' ||
                              resourceStatus === 'detailDone'
                            }
                          />
                        </Grid>
                        <Grid {...FormControlProps} md={4} lg={2}>
                          <HAKeyboardDatePicker
                            label="Available Date *"
                            value={item3.availableDate || ''}
                            error={Boolean(
                              touches.installationList?.[index]?.subForm2?.[index3]?.availableDate
                            )}
                            onChange={(val) => {
                              const memoDate = dayjs(val).format('DD-MMM-YYYY');
                              setFieldValue(
                                `installationList.${index}.subForm2.${index3}.availableDate`,
                                memoDate
                              );
                            }}
                            disabled={
                              (resourceStatus === 'detailSubmited' && !requestNoT) ||
                              orderStatus === 'detail' ||
                              resourceStatus === 'detailApproved' ||
                              resourceStatus === 'detailDone'
                            }
                          />
                        </Grid>
                        {(resourceStatus === 'detailSubmited' && !requestNoT) ||
                        orderStatus === 'detail' ||
                        resourceStatus === 'detailApproved' ||
                        resourceStatus === 'detailDone' ? null : (
                          <Grid {...FormControlProps} md={4} lg={2}>
                            <Button
                              variant="contained"
                              color="secondary"
                              onClick={() => {
                                subForm2Add(index, index3);
                              }}
                              style={{ marginRight: 10 }}
                            >
                              Add
                            </Button>
                            <Button
                              variant="contained"
                              color="default"
                              onClick={() => {
                                subForm2Del(index, index3);
                              }}
                            >
                              Delete
                            </Button>
                          </Grid>
                        )}
                      </Grid>
                    </React.Fragment>
                  ))}

                  {subForm3.map((item4, index4) => (
                    <React.Fragment key={`item4${index4}`}>
                      <Grid
                        container
                        spacing={3}
                        style={{ marginTop: -10, marginBottom: 10, malignItems: 'right' }}
                      >
                        <Grid {...FormControlProps} md={4} lg={2}>
                          <TextField
                            label="Switch Port"
                            variant="outlined"
                            size="small"
                            fullWidth
                            value={item4.switchPort}
                            error={Boolean(
                              touches.installationList?.[index]?.subForm3?.[index4]?.switchPort
                            )}
                            onChange={(e) => {
                              setFieldValue(
                                `installationList.${index}.subForm3.${index4}.switchPort`,
                                e.target.value
                              );
                            }}
                            disabled={
                              (resourceStatus === 'detailSubmited' && !requestNoT) ||
                              orderStatus === 'detail' ||
                              resourceStatus === 'detailApproved' ||
                              resourceStatus === 'detailDone'
                            }
                          />
                        </Grid>
                        <Grid {...FormControlProps} md={4} lg={2}>
                          <Autocomplete
                            style={{ width: '100%' }}
                            freeSolo
                            id="outlet ID"
                            value={item4.outletID || null}
                            options={optionsOutletID || []}
                            onChange={(_, value) => {
                              // console.log('Auto 1', _, value);
                              setFieldValue(
                                `installationList.${index}.subForm3.${index4}.outletID`,
                                value
                              );
                            }} // 选择下拉 时 触发
                            disabled={
                              (resourceStatus === 'detailSubmited' && !requestNoT) ||
                              orderStatus === 'detail' ||
                              resourceStatus === 'detailApproved' ||
                              resourceStatus === 'detailDone'
                            }
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                label="Outlet ID"
                                variant="outlined"
                                size="small"
                                value={item4.outletID || null}
                                error={Boolean(
                                  touches.installationList?.[index]?.subForm3?.[index4]?.outletID
                                )}
                                onChange={(e) => {
                                  const temp = e.target.value;
                                  console.log('outleID', temp);
                                  // setFieldValue(
                                  //   `installationList.${index}.subForm3.${index4}.outletID`,
                                  //   temp
                                  // );
                                }} // 手写时 触发
                                onBlur={(e) => {
                                  setFieldValue(
                                    `installationList.${index}.subForm3.${index4}.outletID`,
                                    e.target.value
                                  );
                                }}
                                //   error={autoError}
                                // for loading
                                InputProps={{
                                  ...params.InputProps,
                                  endAdornment: (
                                    <>
                                      {formik.values.installationList?.[index].subForm3?.[index4]
                                        .outletIDLoading ? (
                                        <CircularProgress size={20} color="inherit" />
                                      ) : null}
                                      {params.InputProps.endAdornment}
                                    </>
                                  )
                                }}
                              />
                            )}
                            // disabled={!disableStatus}
                          />
                        </Grid>
                        <Grid {...FormControlProps} md={4} lg={2}>
                          <CommonSelect
                            style={{ background: '#fff', width: '100%' }}
                            outlined
                            label="Activate"
                            name=""
                            size="small"
                            // width={2.557}
                            fullWidth
                            value={item4.activate}
                            itemList={formik.values.activateList}
                            error={Boolean(
                              touches.installationList?.[index]?.subForm3?.[index4]?.activate
                            )}
                            onSelectChange={handleChange(
                              `installationList.${index}.subForm3.${index4}.activate`
                            )}
                            disabled={
                              (resourceStatus === 'detailSubmited' && !requestNoT) ||
                              orderStatus === 'detail' ||
                              resourceStatus === 'detailApproved' ||
                              resourceStatus === 'detailDone'
                            }
                          />
                        </Grid>
                        <Grid {...FormControlProps} md={4} lg={4}>
                          <TextField
                            label="Remarks"
                            variant="outlined"
                            size="small"
                            fullWidth
                            value={item4.remarks}
                            error={Boolean(
                              touches.installationList?.[index]?.subForm3?.[index4]?.remarks
                            )}
                            onChange={(e) => {
                              setFieldValue(
                                `installationList.${index}.subForm3.${index4}.remarks`,
                                e.target.value
                              );
                            }}
                            disabled={
                              (resourceStatus === 'detailSubmited' && !requestNoT) ||
                              orderStatus === 'detail' ||
                              resourceStatus === 'detailApproved' ||
                              resourceStatus === 'detailDone'
                            }
                          />
                        </Grid>
                        {(resourceStatus === 'detailSubmited' && !requestNoT) ||
                        orderStatus === 'detail' ||
                        resourceStatus === 'detailApproved' ||
                        resourceStatus === 'detailDone' ? null : (
                          <Grid {...FormControlProps} md={4} lg={2}>
                            <Button
                              variant="contained"
                              color="secondary"
                              onClick={() => {
                                subForm3Add(index, index4);
                              }}
                              style={{ marginRight: 10 }}
                            >
                              Add
                            </Button>
                            <Button
                              variant="contained"
                              color="default"
                              onClick={() => {
                                subForm3Del(index, index4);
                              }}
                            >
                              Delete
                            </Button>
                          </Grid>
                        )}
                      </Grid>
                    </React.Fragment>
                  ))}
                  {(resourceStatus === 'detailSubmited' && !requestNoT) ||
                  orderStatus === 'detail' ||
                  resourceStatus === 'detailApproved' ||
                  resourceStatus === 'detailDone' ? null : (
                    <Grid
                      container
                      spacing={3}
                      style={{ marginBottom: 20, malignItems: 'right', paddingLeft: 5 }}
                    >
                      <Button
                        variant="contained"
                        color="default"
                        onClick={() => {
                          subForm4Del(index);
                        }}
                        style={{ marginRight: 10 }}
                      >
                        Delete
                      </Button>
                      <Button
                        variant="contained"
                        color="secondary"
                        onClick={() => {
                          subForm4Copy(index);
                        }}
                        style={{ marginRight: 10 }}
                      >
                        Copy
                      </Button>
                      <Button
                        variant="contained"
                        color="secondary"
                        onClick={() => {
                          subForm4Add(index);
                        }}
                      >
                        Add
                      </Button>
                    </Grid>
                  )}
                </Grid>
              </React.Fragment>
            );
          })
        : null}
    </>
  );
};
export default memo(Index);
