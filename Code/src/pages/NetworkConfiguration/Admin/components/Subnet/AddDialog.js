import React, { memo, useEffect, useState, useMemo } from 'react';
import {
  Grid,
  TextField,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  Tooltip
} from '@material-ui/core';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import InfoIcon from '@material-ui/icons/Info';
import _ from 'lodash';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { CommonDialog, Loading, CommonTip } from '../../../../../components';
import FormControlInputProps from '../../../../../models/webdp/PropsModels/FormControlInputProps';
import ipassignAPI from '../../../../../api/ipassign';
import webAPI from '../../../../../api/webdp/webdp';
import { validIp, handleValidation, bitForSubnet } from '../../../../../utils/tools';

const AddDialog = ({ addOpen, setAddOpen, hospitalList, hospitalLoading, getListPage }) => {
  const [blockLoading, setBlockLoading] = useState(false);
  const [blockOptions, setBlockOptions] = useState([]);

  const [floorLoading, setFloorLoading] = useState(false);
  const [floorOptions, setFloorOptions] = useState([]);

  const [subnetLoading, setSubnetLoading] = useState(false);
  const [subnetList, setSubnetList] = useState([]);

  const [equpTypeLoading, setEqupTypeLoading] = useState(false);
  const [equpTypeList, setEqupTypeList] = useState([]);

  const [bitLoading, setBitLoading] = useState(false);
  const [gatewayLoading, setGatewayLoading] = useState(false);

  const [siteList, setSiteList] = useState([]);
  const [siteLoading, setSiteLoading] = useState(false);

  useEffect(() => {
    getEqupmentTypeList();

    // 为了先走一次验证，否则第一次没有提示
    formik.setFieldValue('generalFlag', 1);
  }, []);

  const formik = useFormik({
    initialValues: {
      hospital: '',
      site: '',
      block: '',
      floor: '',
      subnet: '',
      equipmentType: '',
      bit: '',
      mask: '',
      gateway: '',
      generalFlag: 1,
      remarks: ''
    },
    validationSchema: Yup.object({
      hospital: Yup.string().required('Error'),
      site: Yup.string().required('Error'),
      block: Yup.string().required('Error'),
      floor: Yup.string().required('Error'),
      equipmentType: Yup.object().required('Error'),
      gateway: Yup.string().test((gateway) => validIp(gateway))
    }),
    validate: (values) => {
      const dynamicError = {};
      const { bit, equipmentType } = values;
      let { subnet } = values;

      // 验证subnet
      const count = _.countBy(subnet)['.'];
      if (count === 2 && subnet.substr(subnet?.length - 1) !== '.') subnet = `${subnet}.0`;
      if (!validIp(subnet)) {
        dynamicError.subnet = 'Error';
      }

      if (validIp(subnet) && bit) {
        const newArr = subnet.split('.');
        const limitData = bitForSubnet?.[bit];
        if (
          Number(limitData?.[0]) < Number(newArr?.[0]) ||
          Number(limitData?.[1]) < Number(newArr?.[1]) ||
          Number(limitData?.[2]) < Number(newArr?.[2]) ||
          Number(limitData?.[3]) < Number(newArr?.[3])
        ) {
          dynamicError.subnet = 'Error';
        }
      }

      // 验证bit
      if (!bit) {
        dynamicError.bit = 'Error';
      }
      if (bit && equipmentType?.loopBack === 0 && (bit < 16 || bit > 29)) {
        dynamicError.bit = 'Error';
      } else if (bit && equipmentType?.loopBack === 1 && (bit < 16 || bit > 32)) {
        dynamicError.bit = 'Error';
      }

      return dynamicError;
    },
    onSubmit: (values) => {
      if (!bitLoading && !gatewayLoading) {
        Loading.show();
        let { subnet } = values;
        const count = _.countBy(subnet)['.'];
        if (count === 2 && subnet.substr(subnet?.length - 1) !== '.') subnet = `${subnet}.0`;
        ipassignAPI
          .addSubnet({
            ...values,
            generalFlag: Boolean(values.generalFlag),
            equipmentType: equipmentType.name,
            subnet
          })
          .then((res) => {
            if (res?.data?.code === 200) {
              CommonTip.success(`Success.`);
              handleClose();
              getListPage();
            }
          })
          .finally(() => {
            Loading.hide();
          });
      } else {
        CommonTip.warning(`Request in Process.`);
      }
    }
  });

  const handleClose = () => {
    setAddOpen(false);
    formik.handleReset();
  };

  const getSiteCode = (institution) => {
    setSiteLoading(true);
    ipassignAPI
      .getSiteCode({ level: 'site', institution })
      .then((res) => {
        let resData = res?.data?.data || [];
        resData = resData.map((item) => item.siteCode);
        console.log('resData: ', resData);
        setSiteList(resData);
      })
      .finally(() => {
        setSiteLoading(false);
      });
  };

  const getBlockList = (hospital) => {
    setBlockLoading(true);
    webAPI
      .getBlockByHospCodeList(hospital)
      .then((blockResult) => {
        let blockList = blockResult?.data?.data?.blockByHospCodeList || [];
        blockList = blockList.map((item) => item.block);
        setBlockOptions(blockList);
      })
      .finally(() => {
        setBlockLoading(false);
      });
  };

  const getFloorList = (block) => {
    setFloorLoading(true);
    webAPI
      .getBlockAndFloorByHospCodeList({
        hospCode: formik.values?.hospital,
        block
      })
      .then((blockResult) => {
        let floorList = blockResult?.data?.data?.blockAndFloorByHospCodeList || [];
        floorList = floorList.map((item) => item.floor);
        setFloorOptions(floorList);
      })
      .finally(() => {
        setFloorLoading(false);
      });
  };

  const getSubnetList = (data) => {
    setSubnetLoading(true);
    ipassignAPI
      .getSubnetList(data)
      .then((res) => {
        let resSubnetList = res?.data?.data?.subnetList || [];
        resSubnetList = resSubnetList.map((item) => item.newSubnet);
        resSubnetList = resSubnetList.filter((item) => item);
        resSubnetList = _.unionBy(resSubnetList);
        resSubnetList.sort();
        setSubnetList(resSubnetList);
      })
      .finally(() => {
        setSubnetLoading(false);
      });
  };

  const getOnlySubnetFirstTwo = (data) => {
    ipassignAPI.getOnlySubnetFirstTwo(data).then((res) => {
      const adviceSubnet = res?.data?.data || '';
      formik.setFieldValue('subnet', adviceSubnet);
    });
  };

  const getEqupmentTypeList = (data) => {
    setEqupTypeLoading(true);
    ipassignAPI
      .getEqupmentTypeList(data)
      .then((res) => {
        const resList = res?.data?.data?.list || [];
        setEqupTypeList(resList);
      })
      .finally(() => {
        setEqupTypeLoading(false);
      });
  };

  const getSubnetGateway = () => {
    const { bit, equipmentType } = formik.values;
    let { subnet } = formik.values;
    const keys = Object.keys(formik?.errors || {});
    if (
      subnet &&
      bit &&
      equipmentType &&
      subnet.substr(subnet?.length - 1) !== '.' &&
      keys.indexOf('bit') === -1 &&
      keys.indexOf('equipmentType') === -1 &&
      keys.indexOf('subnet') === -1
    ) {
      const count = _.countBy(subnet)['.'];
      if (count === 2) subnet = `${subnet}.0`;
      setGatewayLoading(true);
      ipassignAPI
        .getSubnetGateway({ subnet, bit, equipmentType: equipmentType.name })
        .then((res) => {
          const gateway = res?.data?.data || '';
          formik.setFieldValue('gateway', gateway);
        })
        .finally(() => {
          setGatewayLoading(false);
        });
    }
  };

  const handleBitBlur = (e) => {
    const bit = e.target?.value;
    if (bit && bit !== formik.values.bit) {
      setBitLoading(true);
      ipassignAPI
        .getBit({ bit })
        .then((res) => {
          const mask = res.data.data?.outlet?.mask || '';
          formik.setFieldValue('mask', mask);
        })
        .finally(() => {
          setBitLoading(false);
        });
    }
  };

  const hospitalVal = useMemo(
    () => hospitalList?.find((item) => item.hospital === formik.values.hospital),
    [hospitalList, formik.values.hospital]
  );

  const {
    values: {
      hospital,
      site,
      block,
      floor,
      subnet,
      equipmentType,
      bit,
      mask,
      gateway,
      remarks,
      generalFlag
    } = {},
    handleBlur,
    handleChange,
    setValues,
    setFieldValue
  } = formik;
  return (
    <>
      <CommonDialog
        title="Add Record"
        open={addOpen}
        handleClose={handleClose}
        handleConfirm={() => {
          if (!formik.isValid) handleValidation();
          formik.handleSubmit();
        }}
        isHideFooter={false}
        maxWidth="sm"
        content={
          <div style={{ padding: '1em' }}>
            <Grid container spacing={3}>
              <Grid item xs={6}>
                <Autocomplete
                  onChange={(e, value) => {
                    if (value) {
                      getBlockList(value.hospital);
                      getSiteCode(value.hospital);
                    }
                    setValues({
                      ...formik.values,
                      hospital: value?.hospital || '',
                      site: '',
                      block: '',
                      floor: '',
                      subnet: ''
                    });
                    setBlockOptions([]);
                    setFloorOptions([]);
                    setSubnetList([]);
                    setSiteList([]);
                  }}
                  value={hospitalVal || null}
                  options={hospitalList || []}
                  loading={hospitalLoading}
                  onBlur={handleBlur}
                  getOptionLabel={(option) => `${option.hospital}---${option.hospitalName}`}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      name="hospital"
                      label="Institution *"
                      {...FormControlInputProps}
                      error={Boolean(formik.errors.hospital && formik.touched.hospital)}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={6}>
                <Autocomplete
                  onChange={(e, value) => {
                    setFieldValue('site', value || '');
                  }}
                  value={site || ''}
                  options={siteList || []}
                  loading={siteLoading}
                  onBlur={handleBlur}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      name="site"
                      label="Site *"
                      {...FormControlInputProps}
                      error={Boolean(formik.errors.site && formik.touched.site)}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={6}>
                <Autocomplete
                  onChange={(e, block) => {
                    if (block) {
                      getFloorList(block);
                    }
                    setValues({ ...formik.values, block: block || '', floor: '', subnet: '' });
                    setFloorOptions([]);
                    setSubnetList([]);
                  }}
                  value={block || ''}
                  options={blockOptions || []}
                  loading={blockLoading}
                  onBlur={handleBlur}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      name="block"
                      label="Block *"
                      {...FormControlInputProps}
                      error={Boolean(formik.errors.block && formik.touched.block)}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={6}>
                <Autocomplete
                  onChange={(e, floor) => {
                    if (floor) {
                      getSubnetList({ hospCode: hospital, block, floor });
                      getOnlySubnetFirstTwo({ hospCode: hospital, block, floor });
                    }
                    setValues({ ...formik.values, floor: floor || '', subnet: '' });
                    setSubnetList([]);
                  }}
                  name="floor"
                  value={floor || ''}
                  options={floorOptions || []}
                  loading={floorLoading}
                  onBlur={handleBlur}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      {...FormControlInputProps}
                      name="floor"
                      label="Floor *"
                      error={Boolean(formik.errors.floor && formik.touched.floor)}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={6}>
                <TextField
                  {...FormControlInputProps}
                  label="Bit *"
                  value={bit}
                  name="bit"
                  onBlur={(e) => {
                    handleBitBlur(e);
                    handleBlur(e);
                    getSubnetGateway();
                  }}
                  error={Boolean(formik.errors.bit && formik.touched.bit)}
                  onChange={(e) => {
                    let value = e?.target?.value || '';
                    if ((value && /^[0-9]*$/.test(value)) || value === '') {
                      value = Number(value || 1);
                      value = value > 32 ? 32 : value;
                      setFieldValue('bit', value);
                    }
                  }}
                  InputProps={{
                    endAdornment: (
                      <Tooltip
                        title={
                          formik?.values?.equipmentType?.loopBack === 0
                            ? 'It must be 16 to 29.'
                            : 'It must be 16 to 32.'
                        }
                      >
                        <InfoIcon style={{ color: 'rgb(255 172 87)' }} />
                      </Tooltip>
                    )
                  }}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField disabled {...FormControlInputProps} value={mask} label="Subnet Mask" />
              </Grid>

              <Grid item xs={6}>
                <Autocomplete
                  onBlur={(e) => {
                    handleBlur(e);
                    getSubnetGateway();
                  }}
                  options={equpTypeList}
                  getOptionLabel={(option) => option.name}
                  value={equipmentType || null}
                  loading={equpTypeLoading}
                  onChange={(e, value) => {
                    setFieldValue('equipmentType', value);
                  }}
                  renderInput={(inputParams) => (
                    <TextField
                      name="equipmentType"
                      {...inputParams}
                      label="Equipment Type *"
                      {...FormControlInputProps}
                      error={Boolean(formik.errors.equipmentType && formik.touched.equipmentType)}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={6}>
                <Autocomplete
                  value={subnet}
                  onBlur={(e) => {
                    handleBlur(e);
                    getSubnetGateway();
                  }}
                  options={subnetList}
                  onChange={(e, value) => {
                    setFieldValue('subnet', value || '');
                  }}
                  loading={subnetLoading}
                  renderInput={(params) => (
                    <TextField
                      name="subnet"
                      label="Subnet *"
                      {...params}
                      {...FormControlInputProps}
                      error={Boolean(formik.errors.subnet && formik.touched.subnet)}
                      onChange={(e) => {
                        const value = e.target?.value;
                        setFieldValue('subnet', value || '');
                      }}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={6}>
                <TextField
                  label="Gateway *"
                  name="gateway"
                  value={gateway}
                  {...FormControlInputProps}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={Boolean(formik.errors.gateway && formik.touched.gateway)}
                />
              </Grid>
              <Grid item xs={6}>
                <FormControl fullWidth size="small" variant="outlined">
                  <InputLabel>General Rules *</InputLabel>
                  <Select
                    label="General Rules *"
                    value={Number(generalFlag)}
                    onChange={(e, value) => {
                      setFieldValue('generalFlag', Number(value.props.value));
                    }}
                    IconComponent={() => (
                      <Tooltip
                        title={
                          formik.values.generalFlag === 1
                            ? 'This will take up [.1, .252, .253, .254, .255]'
                            : 'This will take up [.1, .255]'
                        }
                      >
                        <InfoIcon style={{ marginRight: '14px', color: 'rgb(255 172 87)' }} />
                      </Tooltip>
                    )}
                  >
                    <MenuItem value={1}>Yes </MenuItem>
                    <MenuItem value={0}>No</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  {...FormControlInputProps}
                  label="Remarks"
                  multiline
                  value={remarks}
                  minRows={2}
                  maxRows={2}
                  onChange={handleChange}
                  name="remarks"
                />
              </Grid>
            </Grid>
          </div>
        }
      />
    </>
  );
};

export default memo(AddDialog);
