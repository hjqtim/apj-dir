import React, { useState, useCallback, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import _ from 'lodash';
import {
  Grid,
  TextField,
  Typography,
  InputLabel,
  Select,
  FormControl,
  InputAdornment,
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  CircularProgress
} from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import AccessTimeIcon from '@material-ui/icons/AccessTime';
import { Autocomplete } from '@material-ui/lab';
import dayjs from 'dayjs';

import { useParams } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { updateDateTime, updateExternalNetwork } from '../../../../../redux/webDP/webDP-actions';
import TimePicker from './TimePicker';
import FormControlProps from '../../../../../models/webdp/PropsModels/FormControlProps';
import FormControlInputProps from '../../../../../models/webdp/PropsModels/FormControlInputProps';
import useWebDPColor from '../../../../../hooks/webDP/useWebDPColor';
import API from '../../../../../api/webdp/webdp';
import emailAPI from '../../../../../api/email/mailRecord';
import { CommonDialogTip } from '../../../../../components';
import { L } from '../../../../../utils/lang';
import CommonTip from '../../../../../components/CommonTip';
import Loading from '../../../../../components/Loading';
import EmailForm from './EmailForm';

const SubTitleProps = {
  style: {
    marginBottom: '1rem'
  }
};

const ExternalNetworkControl = () => {
  const dispatch = useDispatch();
  // local state for dialog expanding
  const [expanded, setExpanded] = useState(true);
  const [emailOpen, setEmailOpen] = useState(false);
  const [adminLoading, setAdminLoading] = useState(false);
  const [adminOptions, setAdminOptions] = useState([]);

  const [teLoading, setTeLoading] = useState(false);
  const [teOptions, setTeOptions] = useState([]);

  const params = useParams();

  // declear states
  const viewOnly = useSelector((state) => state.webDP.viewOnly);
  const adminContact = useSelector((state) => state.webDP.externalNetwork.adminContact);
  const technicalContact = useSelector((state) => state.webDP.externalNetwork.technicalContact);
  const system = useSelector((state) => state.webDP.externalNetwork.system);
  const networkTraffic = useSelector((state) => state.webDP.externalNetwork.networkTraffic);
  const vendor = useSelector((state) => state.webDP.externalNetwork.vendor);
  const error = useSelector((state) => state.webDP.error.externalNetwork);
  const projects = useSelector((state) => state.webDP.apDpDetails.items);

  let peakHourFrom = useSelector(
    (state) => state.webDP.externalNetwork.networkTraffic.peakHourFrom
  );

  let peakHourTo = useSelector((state) => state.webDP.externalNetwork.networkTraffic.peakHourTo);

  peakHourFrom = peakHourFrom ? new Date(dayjs().format(`YYYY-MM-DD ${peakHourFrom}:00`)) : null;
  peakHourTo = peakHourTo ? new Date(dayjs().format(`YYYY-MM-DD ${peakHourTo}:00`)) : null;

  // 是否有选到MNI的project
  const isMNI = projects.find(
    (item) => item.dataPortInformation?.projectInfo?.project?.remarks?.toUpperCase?.() === 'MNI'
  );

  const fieldsUpdateHandler = (e) => {
    dispatch(updateExternalNetwork(e));
  };
  const TypographyProps = {
    style: {
      color: useWebDPColor().typography
    }
  };

  const dateTimePickerHandler = (fullDateTime, time, id) => {
    // update redux
    dispatch(updateDateTime(id, time));
  };

  const checkAdminAD = useCallback(
    _.debounce((inputValue) => {
      if (inputValue && !adminLoading) {
        setAdminOptions([]);
        setAdminLoading(true);
        API.findUserList({ username: inputValue })
          .then((res) => {
            const newOptions = res?.data?.data || [];
            setAdminOptions(newOptions);
          })
          .finally(() => {
            setAdminLoading(false);
          });
      }
    }, 800),
    [adminLoading]
  );

  const checkTeAD = useCallback(
    _.debounce((inputValue) => {
      if (inputValue && !teLoading) {
        setTeOptions([]);
        setTeLoading(true);
        API.findUserList({ username: inputValue })
          .then((res) => {
            const newOptions = res?.data?.data || [];
            setTeOptions(newOptions);
          })
          .finally(() => {
            setTeLoading(false);
          });
      }
    }, 800),
    [teLoading]
  );

  const sendMail = () => {
    console.log('sendMail');
    setEmailOpen(true);
  };

  const handleClose = () => {
    setEmailOpen(false);
  };

  const formik = useFormik({
    initialValues: { toEmails: '' },
    validationSchema: Yup.object({
      toEmails: Yup.string()
        .matches('^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(.[a-zA-Z0-9_-]+)+$', 'email')
        .required('Required')
    }),
    onSubmit: (values) => {
      Loading.show();
      const data = {
        toEmails: [values.toEmails],
        subject: values.subject,
        copyTo: values.copyTo,
        emailType: 0,
        emailUse: 0,
        params: { ...values }
      };
      emailAPI.resendEmail(data).then(() => {
        Loading.hide();
        formik.handleReset();
        CommonTip.success(L('Success'));
        handleClose();
      });
    }
  });

  const webDPColor = useWebDPColor();

  const adminOptionsMemo = useMemo(
    () => adminOptions.map((optionItem) => optionItem.display),
    [adminOptions]
  );

  const teOptionsMemo = useMemo(
    () => teOptions.map((optionItem) => optionItem.display),
    [teOptions]
  );

  const getUserName = (display) => {
    const arr = display?.split?.(',') || [];
    if (arr[0]) {
      return arr[0];
    }
    return display || '';
  };

  const TipPros = {
    style: {
      fontWeight: 500,
      color: webDPColor.title,
      paddingLeft: '1rem'
    }
  };

  return (
    <>
      {isMNI && (
        <Accordion
          expanded={expanded}
          onChange={() => setExpanded(!expanded)}
          style={{ width: '100%', marginTop: '1rem' }}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon style={{ color: webDPColor.title }} />}
            aria-controls="externalNetwork-content"
            id="externalNetwork-header"
            style={{ backgroundColor: 'rgba(0, 0, 0, 0.05)' }}
          >
            <Typography variant="h6" style={{ color: webDPColor.title, paddingLeft: '0.5rem' }}>
              <strong>External Network (formerly known as MNI) User Requirement Form </strong>
            </Typography>
          </AccordionSummary>
          <AccordionDetails style={{ display: 'block' }}>
            {/* Tip */}
            <Grid>
              <Grid {...FormControlProps}>
                <Typography {...TypographyProps}>
                  <strong>Important Note</strong>
                </Typography>
              </Grid>
              <Typography {...TipPros}>
                1. You should fill and complete the User Requirement Form before go to next step.
              </Typography>
              <Typography {...TipPros}>
                2. The External Network request would not be processed without the completion of
                User Requirement Form.
              </Typography>
              <Typography {...TipPros}>
                3. If you have any query, please contact our &nbsp;
                <a
                  href="http://itip-corp-is1/hs/scripts/dataport/Contact.asp?ActiveMainMenuIndex=6"
                  rel="noreferrer"
                  target="_blank"
                  style={{ color: '#229FFA' }}
                >
                  NMS Hospital Support Staff
                </a>
                .
              </Typography>
              <Typography {...TipPros}>
                4. External Network application work flow can be found &nbsp;
                <a
                  href={`${process.env.PUBLIC_URL}/static/img/file/Workflow_diagram_of_MNI_installation.pptx`}
                  style={{ color: '#229FFA' }}
                >
                  here
                </a>
                .
              </Typography>
              <Typography {...TipPros}>
                5. The template of User Requirement Form for collecting information from vendor can
                be downloaded &nbsp;
                <a
                  href={`${process.env.PUBLIC_URL}/static/img/file/ExternalNetwork_Template.xlsx`}
                  style={{ color: '#229FFA' }}
                >
                  here
                </a>
                &nbsp;(
                <a
                  href={`${process.env.PUBLIC_URL}/static/img/file/ExternalNetworkTemplateSample.png`}
                  rel="noreferrer"
                  target="_blank"
                  style={{ color: '#229FFA' }}
                >
                  Sample
                </a>
                )
              </Typography>
            </Grid>

            {/* Administrative Contact Information */}
            <Grid container {...SubTitleProps}>
              {!viewOnly && params.requestId ? (
                <>
                  <Grid>
                    <Button variant="contained" color="primary" onClick={sendMail}>
                      SendEmail
                    </Button>
                  </Grid>
                  <CommonDialogTip
                    title="SendEmail"
                    open={emailOpen}
                    handleClose={handleClose}
                    handleConfirm={formik.handleSubmit}
                    content={<EmailForm params={params} formik={formik} />}
                  />
                </>
              ) : (
                ''
              )}

              <Grid {...FormControlProps}>
                <Typography {...TypographyProps}>
                  <strong>Administrative Contact Information</strong>
                </Typography>
              </Grid>

              <Grid {...FormControlProps} md={4} lg={4}>
                <Autocomplete
                  freeSolo
                  forcePopupIcon
                  disabled={viewOnly}
                  value={adminContact.contactPerson}
                  onChange={(event, value) => {
                    if (value) {
                      const optionItem = adminOptions.find((item) => item.display === value) || {};
                      const newName = {
                        currentTarget: {
                          id: 'adminContact-contactPerson',
                          value: getUserName(optionItem.display)
                        }
                      };
                      fieldsUpdateHandler(newName);

                      const newPhone = {
                        currentTarget: {
                          id: 'adminContact-phone',
                          value: optionItem.phone || ''
                        }
                      };
                      fieldsUpdateHandler(newPhone);

                      const newEmail = {
                        currentTarget: {
                          id: 'adminContact-email',
                          value: optionItem.mail || ''
                        }
                      };
                      fieldsUpdateHandler(newEmail);
                    } else {
                      const newTarget = {
                        currentTarget: {
                          id: 'adminContact-contactPerson',
                          value: ''
                        }
                      };
                      fieldsUpdateHandler(newTarget);
                      setAdminOptions([]);
                    }
                  }}
                  options={adminOptionsMemo || []}
                  renderInput={(inputParams) => (
                    <TextField
                      {...inputParams}
                      {...FormControlInputProps}
                      variant="outlined"
                      size="small"
                      label="End User Coordinator"
                      error={Boolean(error?.acContactPerson)}
                      InputProps={{
                        ...inputParams.InputProps,
                        endAdornment: (
                          <>
                            {adminLoading ? <CircularProgress size={20} color="inherit" /> : null}
                            {inputParams.InputProps.endAdornment}
                          </>
                        )
                      }}
                      onChange={(e) => {
                        const newValue = e?.target?.value || '';
                        const newTarget = {
                          currentTarget: {
                            id: 'adminContact-contactPerson',
                            value: newValue
                          }
                        };
                        fieldsUpdateHandler(newTarget);
                        if (!newValue) {
                          setAdminOptions([]);
                        }
                        checkAdminAD(newValue);
                      }}
                    />
                  )}
                />
              </Grid>

              <Grid {...FormControlProps} md={4} lg={4}>
                <TextField
                  {...FormControlInputProps}
                  error={Boolean(error?.acPhone)}
                  label="Phone"
                  id="adminContact-phone"
                  value={adminContact.phone}
                  // onChange={fieldsUpdateHandler}
                  onChange={(e) => {
                    if (e.target.value && /^[0-9]*$/.test(e.target.value)) {
                      fieldsUpdateHandler(e);
                    } else if (!e.target.value) {
                      fieldsUpdateHandler(e);
                    }
                  }}
                  disabled={viewOnly}
                />
              </Grid>
              <Grid {...FormControlProps} md={4} lg={4}>
                <TextField
                  {...FormControlInputProps}
                  error={error.acEmail}
                  label="Email"
                  id="adminContact-email"
                  value={adminContact.email}
                  onChange={fieldsUpdateHandler}
                  disabled={viewOnly}
                />
              </Grid>
            </Grid>
            {/*               Technical Contact Information             */}
            <Grid container {...SubTitleProps}>
              <Grid
                item
                xs={12}
                md={12}
                lg={12}
                style={{ textAlign: 'left', margin: '0 0.3rem', width: '100%' }}
              >
                <Typography {...TypographyProps}>
                  <strong>Technical Contact Information</strong>
                </Typography>
              </Grid>
              <Grid {...FormControlProps} lg={4} md={4}>
                <Autocomplete
                  freeSolo
                  forcePopupIcon
                  disabled={viewOnly}
                  value={technicalContact.contactPerson}
                  onChange={(event, value) => {
                    if (value) {
                      const optionItem = teOptions.find((item) => item.display === value) || {};
                      const newName = {
                        currentTarget: {
                          id: 'technicalContact-contactPerson',
                          value: getUserName(optionItem.display)
                        }
                      };
                      fieldsUpdateHandler(newName);

                      const newPhone = {
                        currentTarget: {
                          id: 'technicalContact-phone',
                          value: optionItem.phone || ''
                        }
                      };
                      fieldsUpdateHandler(newPhone);

                      const newEmail = {
                        currentTarget: {
                          id: 'technicalContact-email',
                          value: optionItem.mail || ''
                        }
                      };
                      fieldsUpdateHandler(newEmail);
                    } else {
                      const newTarget = {
                        currentTarget: {
                          id: 'technicalContact-contactPerson',
                          value: ''
                        }
                      };
                      fieldsUpdateHandler(newTarget);
                      setTeOptions([]);
                    }
                  }}
                  options={teOptionsMemo || []}
                  renderInput={(inputParams) => (
                    <TextField
                      {...inputParams}
                      {...FormControlInputProps}
                      variant="outlined"
                      size="small"
                      error={Boolean(error.tcContactPerson)}
                      label="Institution IT Coordinator"
                      InputProps={{
                        ...inputParams.InputProps,
                        endAdornment: (
                          <>
                            {teLoading ? <CircularProgress size={20} color="inherit" /> : null}
                            {inputParams.InputProps.endAdornment}
                          </>
                        )
                      }}
                      onChange={(e) => {
                        const newValue = e?.target?.value || '';
                        const newTarget = {
                          currentTarget: {
                            id: 'technicalContact-contactPerson',
                            value: newValue
                          }
                        };
                        fieldsUpdateHandler(newTarget);
                        if (!newValue) {
                          setTeOptions([]);
                        }
                        checkTeAD(newValue);
                      }}
                    />
                  )}
                />
              </Grid>
              <Grid {...FormControlProps} lg={4} md={4}>
                <TextField
                  {...FormControlInputProps}
                  error={Boolean(error.tcPhone)}
                  label="Phone"
                  id="technicalContact-phone"
                  value={technicalContact.phone}
                  // onChange={fieldsUpdateHandler}
                  onChange={(e) => {
                    if (e.target.value && /^[0-9]*$/.test(e.target.value)) {
                      fieldsUpdateHandler(e);
                    } else if (!e.target.value) {
                      fieldsUpdateHandler(e);
                    }
                  }}
                  disabled={viewOnly}
                />
              </Grid>
              <Grid {...FormControlProps} lg={4} md={4}>
                <TextField
                  {...FormControlInputProps}
                  error={error.tcEmial}
                  label="Email"
                  id="technicalContact-email"
                  value={technicalContact.email}
                  onChange={fieldsUpdateHandler}
                  disabled={viewOnly}
                />
              </Grid>
            </Grid>
            {/*               Project System Information             */}
            <Grid container {...SubTitleProps}>
              <Grid
                item
                xs={12}
                md={12}
                lg={12}
                style={{ textAlign: 'left', margin: '0 0.3rem', width: '100%' }}
              >
                <Typography {...TypographyProps}>
                  <strong>Project System Information</strong>
                </Typography>
              </Grid>
              <Grid {...FormControlProps} lg={3} md={3}>
                <FormControl
                  {...FormControlInputProps}
                  variant="outlined"
                  size="small"
                  fullWidth
                  disabled={viewOnly}
                >
                  <InputLabel id="existedNetwork">Local Network Exists?</InputLabel>
                  <Select
                    native
                    labelId="existedNetwork"
                    label="Local Network Exists?"
                    id="system-existedNetwork"
                    value={system.existedNetwork}
                    onChange={fieldsUpdateHandler}
                  >
                    <option aria-label="None" value="" />
                    <option value="Y">Yes</option>
                    <option value="N">No</option>
                  </Select>
                </FormControl>
              </Grid>
              <Grid {...FormControlProps} lg={3} md={3}>
                <TextField
                  {...FormControlInputProps}
                  label="Supplier"
                  id="system-supplierName"
                  value={system.supplierName}
                  onChange={fieldsUpdateHandler}
                  disabled={viewOnly}
                />
              </Grid>
              <Grid {...FormControlProps} lg={3} md={3}>
                <TextField
                  {...FormControlInputProps}
                  label="Workstation Location"
                  id="system-pcLocation"
                  value={system.pcLocation}
                  onChange={fieldsUpdateHandler}
                  disabled={viewOnly}
                />
              </Grid>
              <Grid {...FormControlProps} lg={3} md={3}>
                <TextField
                  {...FormControlInputProps}
                  label="External Network Server Location"
                  id="system-serverLocation"
                  value={system.serverLocation}
                  onChange={fieldsUpdateHandler}
                  disabled={viewOnly}
                />
              </Grid>
              <Grid {...FormControlProps} lg={3} md={3}>
                <FormControl
                  {...FormControlInputProps}
                  variant="outlined"
                  size="small"
                  fullWidth
                  disabled={viewOnly}
                >
                  <InputLabel id="demo-simple-select-outlined-label">
                    Integrate with HA System
                  </InputLabel>

                  <Select
                    native
                    labelId="demo-simple-select-outlined-label"
                    label="HA System Integrated"
                    id="system-haSystemIntegrate"
                    value={system.haSystemIntegrate}
                    onChange={fieldsUpdateHandler}
                  >
                    <option aria-label="None" value="" />
                    <option value="Y">Yes</option>
                    <option value="N">No</option>
                  </Select>
                </FormControl>
              </Grid>
              <Grid {...FormControlProps} lg={3} md={3}>
                <TextField
                  {...FormControlInputProps}
                  label="HA Project Name"
                  id="system-relatedProject"
                  value={system.relatedProject}
                  onChange={fieldsUpdateHandler}
                  disabled={viewOnly}
                />
              </Grid>
              <Grid {...FormControlProps} lg={3} md={3}>
                <TextField
                  {...FormControlInputProps}
                  label="HA Server Hostname"
                  id="system-relatedServer"
                  value={system.relatedServer}
                  onChange={fieldsUpdateHandler}
                  disabled={viewOnly}
                />
              </Grid>
              <Grid {...FormControlProps} lg={3} md={3}>
                <FormControl
                  {...FormControlInputProps}
                  variant="outlined"
                  size="small"
                  fullWidth
                  disabled={viewOnly}
                >
                  <InputLabel>Initiate Traffic To HA Network?</InputLabel>
                  <Select
                    native
                    labelId="initiate_traffic_into_ha_network"
                    label="Initiate Traffic To HA Network?"
                    id="system-initiateTraffic"
                    value={system.initiateTraffic}
                    onChange={fieldsUpdateHandler}
                  >
                    <option aria-label="None" value="" />
                    <option value="Y">Yes</option>
                    <option value="N">No</option>
                  </Select>
                </FormControl>
              </Grid>
              <Grid {...FormControlProps} lg={3} md={3}>
                <TextField
                  {...FormControlInputProps}
                  label="Destination Project"
                  id="system-projectDestination"
                  value={system.projectDestination}
                  onChange={fieldsUpdateHandler}
                  disabled={viewOnly}
                />
              </Grid>
              <Grid {...FormControlProps} lg={3} md={3}>
                <TextField
                  {...FormControlInputProps}
                  label="Destination Server IP"
                  id="system-serverDestination"
                  value={system.serverDestination}
                  onChange={fieldsUpdateHandler}
                  disabled={viewOnly}
                />
              </Grid>
              {/* <Grid {...FormControlProps} lg={3} md={3}>
                <DatePicker
                  fullWidth
                  inputVariant="outlined"
                  size="small"
                  value={expectedImplementalDate}
                  onChange={dateTimePickerHandler}
                  id="expectedImplementalDate"
                  disabled={viewOnly}
                />
              </Grid> */}
            </Grid>

            {/*               Network Traffic Information             */}
            <Grid container {...SubTitleProps}>
              <Grid
                item
                xs={12}
                md={12}
                lg={12}
                style={{ textAlign: 'left', margin: '0 0.3rem', width: '100%' }}
              >
                <Typography {...TypographyProps}>
                  <strong>Network Traffic Information</strong>
                </Typography>
              </Grid>
              <Grid {...FormControlProps} lg={3} md={3}>
                <TextField
                  type="number"
                  {...FormControlInputProps}
                  label="Number of Device"
                  id="networkTraffic-deviceAmount"
                  value={networkTraffic.deviceAmount}
                  onChange={fieldsUpdateHandler}
                  disabled={viewOnly}
                />
              </Grid>
              <Grid {...FormControlProps} lg={3} md={3}>
                <TextField
                  {...FormControlInputProps}
                  type="number"
                  label="Number of Traffic per Day"
                  id="networkTraffic-trafficPerDay"
                  value={networkTraffic.trafficPerDay}
                  onChange={fieldsUpdateHandler}
                  disabled={viewOnly}
                />
              </Grid>
              <Grid {...FormControlProps} lg={3} md={3}>
                <TextField
                  {...FormControlInputProps}
                  label="Size of file per transfer"
                  type="number"
                  InputProps={{
                    endAdornment: <InputAdornment position="end">byte</InputAdornment>
                  }}
                  variant="outlined"
                  id="networkTraffic-perFileSize"
                  value={networkTraffic.perFileSize}
                  onChange={fieldsUpdateHandler}
                  disabled={viewOnly}
                />
              </Grid>
              <Grid {...FormControlProps} lg={3} md={3}>
                <TextField
                  {...FormControlInputProps}
                  label="Expected Response Time"
                  type="number"
                  InputProps={{
                    endAdornment: <InputAdornment position="end">ms</InputAdornment>
                  }}
                  variant="outlined"
                  id="networkTraffic-expectedResponseTime"
                  value={networkTraffic.expectedResponseTime}
                  onChange={fieldsUpdateHandler}
                  disabled={viewOnly}
                />
              </Grid>
              <Grid {...FormControlProps} xs={6} md={3} lg={3}>
                <TimePicker
                  label="Peak Hour (From)"
                  fullWidth
                  inputVariant="outlined"
                  size="small"
                  icon={<AccessTimeIcon fontSize="small" />}
                  id="peakHourFrom"
                  value={peakHourFrom}
                  onChange={dateTimePickerHandler}
                  disabled={viewOnly}
                />
              </Grid>

              <Grid {...FormControlProps} xs={6} md={3} lg={3}>
                <TimePicker
                  label="Peak Hour (To)"
                  fullWidth
                  inputVariant="outlined"
                  size="small"
                  icon={<AccessTimeIcon fontSize="small" />}
                  id="peakHourTo"
                  value={peakHourTo}
                  onChange={dateTimePickerHandler}
                  disabled={viewOnly}
                />
              </Grid>
              <Grid {...FormControlProps} lg={3} md={3}>
                <FormControl
                  {...FormControlInputProps}
                  variant="outlined"
                  size="small"
                  fullWidth
                  disabled={viewOnly}
                >
                  <InputLabel>Resilient Network to HA?</InputLabel>
                  <Select
                    native
                    labelId="resilient_network_to_ha_required"
                    label="Resilient Network to HA Required?"
                    id="networkTraffic-networkResilience"
                    value={networkTraffic.networkResilience}
                    onChange={fieldsUpdateHandler}
                  >
                    <option aria-label="None" value="" />
                    <option value="Y">Required</option>
                    <option value="N">Not Required</option>
                  </Select>
                </FormControl>
              </Grid>
              <Grid {...FormControlProps} lg={3} md={3}>
                <TextField
                  {...FormControlInputProps}
                  label="Remote Maintenance Method"
                  id="networkTraffic-remoteMethod"
                  value={networkTraffic.remoteMethod}
                  onChange={fieldsUpdateHandler}
                  disabled={viewOnly}
                />
              </Grid>
            </Grid>
            {/*           Vendor Information           */}
            <Grid container {...SubTitleProps}>
              <Grid
                item
                xs={12}
                md={12}
                lg={12}
                style={{ textAlign: 'left', margin: '0 0.3rem', width: '100%' }}
              >
                <Typography {...TypographyProps}>
                  <strong>Vendor Information</strong>
                </Typography>
              </Grid>
              <Grid {...FormControlProps} lg={12} md={12}>
                <TextField
                  {...FormControlInputProps}
                  label="Company"
                  id="vendor-vendorName"
                  value={vendor.vendorName}
                  onChange={fieldsUpdateHandler}
                  disabled={viewOnly}
                />
              </Grid>
              <Grid {...FormControlProps} lg={4} md={4}>
                <TextField
                  {...FormControlInputProps}
                  label="Contact Person"
                  id="vendor-implementalPerson"
                  value={vendor.implementalPerson}
                  onChange={fieldsUpdateHandler}
                  disabled={viewOnly}
                />
              </Grid>
              <Grid {...FormControlProps} lg={4} md={4}>
                <TextField
                  {...FormControlInputProps}
                  error={error.iPhone}
                  label="Phone"
                  id="vendor-implementalPhone"
                  value={vendor.implementalPhone}
                  // onChange={fieldsUpdateHandler}
                  onChange={(e) => {
                    if (e.target.value && /^[0-9]*$/.test(e.target.value)) {
                      fieldsUpdateHandler(e);
                    } else if (!e.target.value) {
                      fieldsUpdateHandler(e);
                    }
                  }}
                  disabled={viewOnly}
                />
              </Grid>
              <Grid {...FormControlProps} lg={4} md={4}>
                <TextField
                  {...FormControlInputProps}
                  label="Email"
                  id="vendor-implementalEmail"
                  value={vendor.implementalEmail}
                  onChange={fieldsUpdateHandler}
                  disabled={viewOnly}
                />
              </Grid>
            </Grid>
            <Grid container {...SubTitleProps}>
              <Grid
                item
                xs={12}
                md={12}
                lg={12}
                style={{ textAlign: 'left', margin: '0 0.3rem', width: '100%' }}
              >
                <Typography {...TypographyProps}>
                  <strong>Maintenance Information</strong>
                </Typography>
              </Grid>
              <Grid {...FormControlProps} lg={4} md={4}>
                <TextField
                  {...FormControlInputProps}
                  label="Contact Person"
                  id="vendor-maintenancePerson"
                  value={vendor.maintenancePerson}
                  onChange={fieldsUpdateHandler}
                  disabled={viewOnly}
                />
              </Grid>
              <Grid {...FormControlProps} lg={4} md={4}>
                <TextField
                  {...FormControlInputProps}
                  error={error.mPhone}
                  label="Phone"
                  id="vendor-maintenancePhone"
                  value={vendor.maintenancePhone}
                  // onChange={fieldsUpdateHandler}
                  onChange={(e) => {
                    if (e.target.value && /^[0-9]*$/.test(e.target.value)) {
                      fieldsUpdateHandler(e);
                    } else if (!e.target.value) {
                      fieldsUpdateHandler(e);
                    }
                  }}
                  disabled={viewOnly}
                />
              </Grid>
              <Grid {...FormControlProps} lg={4} md={4}>
                <TextField
                  {...FormControlInputProps}
                  label="Email"
                  id="vendor-maintenanceEmail"
                  value={vendor.maintenanceEmail}
                  onChange={fieldsUpdateHandler}
                  disabled={viewOnly}
                />
              </Grid>
            </Grid>
          </AccordionDetails>
        </Accordion>
      )}
    </>
  );
};

export default ExternalNetworkControl;
