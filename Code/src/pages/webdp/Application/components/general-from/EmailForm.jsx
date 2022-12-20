import React, { useEffect, useState } from 'react';
import { TextField } from '@material-ui/core';
import API from '../../../../../api/email/templateManage';

const EmailForm = (props) => {
  const { params, formik } = props;
  const [label, setLabel] = useState({});

  useEffect(() => {
    API.searchTemplateById('272').then((res) => {
      if (res.data?.data?.label) {
        const labelData = res.data.data.label;
        Object.keys(labelData).forEach((element) => {
          labelData[element] = '';
        });
        formik.setValues({
          ...formik.values,
          ...labelData,
          templateId: '272',
          subject: `${res.data.data.mouldName} ${params.requestId}`
        });
        setLabel(labelData);
      }
    });
  }, []);

  return (
    <>
      <TextField
        autoFocus
        margin="dense"
        id="toEmails"
        name="toEmails"
        onChange={formik.handleChange}
        value={formik.values.toEmails}
        label="To Email Address"
        type="email"
        error={formik.errors.toEmails && formik.touched.toEmails}
        helperText={formik.touched.toEmails && formik.errors.toEmails}
        fullWidth
        variant="standard"
      />
      {Object.keys(label).map((item) => (
        <TextField
          key={item}
          autoFocus
          margin="dense"
          id={item}
          label={item}
          name={item}
          value={formik.values?.[item]}
          onChange={formik.handleChange}
          fullWidth
          variant="standard"
        />
      ))}
    </>
  );
};

export default EmailForm;
