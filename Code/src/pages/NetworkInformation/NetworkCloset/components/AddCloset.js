import React, { memo, useMemo, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Grid, Select, MenuItem, FormControl, InputLabel } from '@material-ui/core';
import { PhotoCameraOutlined, DeleteOutlineOutlined } from '@material-ui/icons';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { CommonDialog, MyTextField, Loading, CommonTip } from '../../../../components';
import { textFieldProps } from '../../../../utils/tools';
import webdpAPI from '../../../../api/webdp/webdp';
import { setClosetList } from '../../../../redux/networkCloset/network-closet-actions';

const AddCloset = () => {
  const dispatch = useDispatch();
  const isOpenAddCloset = useSelector((state) => state.networkCloset.isOpenAddCloset);
  const statusList = useSelector((state) => state.networkCloset.statusList);
  const selectHospital = useSelector((state) => state.networkCloset.selectHospital);

  const getClosetList = () => {
    const queryParams = {
      hospital: selectHospital?.hospital
    };

    webdpAPI.getClosetsAndSub(queryParams).then((res) => {
      const { closets = [] } = res?.data?.data?.data || {};
      dispatch(setClosetList(closets));
    });
  };

  // 保存
  const handleSave = async (values) => {
    Loading.show();

    let fileUrl = '';
    const hasUploadFile = Boolean(values.photoFile); // 是否有文件需要上传

    try {
      if (hasUploadFile) {
        const formData = new FormData();
        formData.append('file', values.photoFile);
        const fileRes = await webdpAPI.ncsUploadFile(formData);
        fileUrl = fileRes?.data?.data?.result?.data?.[0]?.fileUrl;
      }
    } catch (error) {
      console.log('file upload failed', error);
    }

    if (hasUploadFile && !fileUrl) {
      // 文件上传失败
      Loading.hide();
      return;
    }

    let result;
    try {
      const saveParams = {
        status: values.status,
        photo: fileUrl,
        block: values.block,
        floor: values.floor,
        room: values.room,
        closetid: values.closetid,
        remark: values.remark,
        hospital: selectHospital?.hospital
      };
      result = await webdpAPI.insertCloset(saveParams);
    } catch (error) {
      console.log('add failed', error);
    }
    if (result?.data.code === 201) {
      CommonTip.error(result.data.message);
      formik.setFieldError('closetid', 'closetID');
    }
    if (result?.data?.data?.result) {
      CommonTip.success('Success');
      handleClose();
      formik.handleReset();
      getClosetList();
    }

    Loading.hide();
  };

  const formik = useFormik({
    initialValues: {
      blockList: [],
      block: '',
      floorList: [],
      floor: '',
      status: '',
      photoFile: null,
      room: '',
      remark: '',
      closetid: ''
    },
    validationSchema: Yup.object({
      status: Yup.string().required('Can not be empty'),
      block: Yup.string().required('Can not be empty'),
      floor: Yup.string().required('Can not be empty'),
      room: Yup.string().required('Can not be empty'),
      closetid: Yup.string().required('Can not be empty')
    }),
    onSubmit: (values) => {
      handleSave(values);
    }
  });

  const {
    status,
    block,
    floor,
    room,
    photoFile,
    remark,
    blockList = [],
    floorList = [],
    closetid
  } = formik.values;

  const { setFieldValue, handleBlur } = formik;

  const closetStatusList = useMemo(
    () => statusList.filter((item) => item.optionType === 'ClosetStatus'),
    [statusList]
  );

  // 根据医院获取Block
  const getBlock = () => {
    if (!selectHospital?.hospital) {
      return;
    }

    webdpAPI.getBlockByHospCodeList(selectHospital.hospital).then((res) => {
      setFieldValue('blockList', res?.data?.data?.blockByHospCodeList || []);
    });
  };

  useEffect(() => {
    if (isOpenAddCloset) {
      getBlock();
    }
  }, [isOpenAddCloset]);

  // 根据Block获取Floor
  const getFloor = (value) => {
    if (!selectHospital?.hospital || !value) {
      return;
    }

    webdpAPI
      .getBlockAndFloorByHospCodeList({
        hospCode: selectHospital.hospital,
        block: value
      })
      .then((res) => {
        setFieldValue('floorList', res?.data?.data?.blockAndFloorByHospCodeList || []);
      });
  };

  const handleClose = () => {
    const action = {
      type: 'networkCloset/setIsOpenAddCloset',
      payload: false
    };
    dispatch(action);
  };

  const handleConfirm = () => {
    formik.handleSubmit();
  };

  return (
    <>
      <CommonDialog
        open={isOpenAddCloset}
        title="Add Closet"
        isHideFooter={false}
        handleClose={handleClose}
        handleConfirm={handleConfirm}
        content={
          <div style={{ padding: 20 }}>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <FormControl
                  {...textFieldProps}
                  error={Boolean(formik.touched.status && formik.errors.status)}
                >
                  <InputLabel>Status *</InputLabel>
                  <Select
                    name="status"
                    onBlur={handleBlur}
                    label="Status *"
                    value={status || ''}
                    onChange={(e) => {
                      setFieldValue('status', e.target.value);
                    }}
                  >
                    {closetStatusList.map((item) => (
                      <MenuItem key={item.id} value={item.optionValue}>
                        {item.optionValue}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={6}>
                <MyTextField
                  label="Photo"
                  value={photoFile?.name || ''}
                  InputProps={{
                    endAdornment: (
                      <div style={{ display: 'flex' }}>
                        <input
                          accept="image/*"
                          style={{ display: 'none' }}
                          id="add-closet-file"
                          type="file"
                          onChange={(e) => {
                            setFieldValue('photoFile', e.target.files?.[0]);
                            e.target.value = '';
                          }}
                        />

                        <label htmlFor="add-closet-file" style={{ display: 'inherit' }}>
                          <PhotoCameraOutlined
                            style={{ marginRight: '5px', cursor: 'pointer', color: '#229FFA' }}
                            fontSize="small"
                          />
                        </label>

                        <DeleteOutlineOutlined
                          style={{ cursor: 'pointer', color: '#229FFA' }}
                          color="secondary"
                          fontSize="small"
                          onClick={() => {
                            setFieldValue('photoFile', null);
                          }}
                        />
                      </div>
                    )
                  }}
                />
              </Grid>

              <Grid item xs={6}>
                <FormControl
                  {...textFieldProps}
                  error={Boolean(formik.touched.block && formik.errors.block)}
                >
                  <InputLabel>Block *</InputLabel>
                  <Select
                    name="block"
                    onBlur={handleBlur}
                    label="Block *"
                    value={block || ''}
                    onChange={(e) => {
                      const { value } = e.target;
                      setFieldValue('block', value);

                      setFieldValue('floor', '');
                      setFieldValue('floorList', []);

                      getFloor(value);
                    }}
                  >
                    <MenuItem value="">None</MenuItem>
                    {blockList.map((item) => (
                      <MenuItem key={item.block} value={item.block}>
                        {item.block}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={6}>
                <FormControl
                  {...textFieldProps}
                  error={Boolean(formik.touched.floor && formik.errors.floor)}
                >
                  <InputLabel>Floor *</InputLabel>
                  <Select
                    name="floor"
                    onBlur={handleBlur}
                    label="Floor *"
                    value={floor || ''}
                    onChange={(e) => {
                      const { value } = e.target;
                      setFieldValue('floor', value);
                    }}
                  >
                    <MenuItem value="">None</MenuItem>
                    {floorList.map((item) => (
                      <MenuItem key={item.floor} value={item.floor}>
                        {item.floor}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={6}>
                <MyTextField
                  error={Boolean(formik.touched.room && formik.errors.room)}
                  name="room"
                  onBlur={handleBlur}
                  label="Room *"
                  value={room || ''}
                  onChange={(e) => setFieldValue('room', e.target.value)}
                />
              </Grid>

              <Grid item xs={6}>
                <MyTextField
                  error={Boolean(formik.touched.closetid && formik.errors.closetid)}
                  name="closetid"
                  onBlur={handleBlur}
                  label="Closet ID *"
                  value={closetid || ''}
                  onChange={(e) => setFieldValue('closetid', e.target.value)}
                />
              </Grid>

              <Grid item xs={6}>
                <MyTextField
                  label="Remark"
                  value={remark || ''}
                  onChange={(e) => setFieldValue('remark', e.target.value)}
                />
              </Grid>
            </Grid>
          </div>
        }
      />
    </>
  );
};

export default memo(AddCloset);
