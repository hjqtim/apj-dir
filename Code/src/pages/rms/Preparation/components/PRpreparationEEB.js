import React from 'react';
import { useFormik } from 'formik';
import { Button, makeStyles } from '@material-ui/core';
import dayjs from 'dayjs';
import SaveIcon from '@material-ui/icons/Save';
import API from '../../../../api/webdp/webdp';
import CommonTip from '../../../../components/CommonTip';

const useStyles = makeStyles(() => ({
  btnStyle: {
    background: '#fff',
    color: '#0F3E5B'
  }
}));

export default function PRpreparationEEB(props) {
  const classes = useStyles();
  const formik = useFormik({
    initialValues: {
      status: 0,
      startTime: dayjs(props.startTime).format('YYYY-MM-DD 00:00:00'),
      endTime: dayjs(props.endTime).format('YYYY-MM-DD 23:59:59')
    }
  });
  const { status, startTime, endTime } = formik.values;
  const exportExcel = () => {
    API.exportExcelPRPreparation({ status, startTime, endTime }).then((res) => {
      if (res?.data) {
        try {
          const blob = new Blob([res.data], {
            type: 'application/vnd.ms-excel;charset=utf-8'
          });
          const objectUrl = URL.createObjectURL(blob);
          const link = document.createElement('a');
          const fileName = 'PRPreparation';
          link.href = objectUrl;
          link.setAttribute('download', fileName);
          document.body.appendChild(link);
          link.click();
        } catch (error) {
          CommonTip.error(`Export fail.`);
        }
      }
    });
  };

  return (
    <Button
      variant="contained"
      className={classes.btnStyle}
      startIcon={<SaveIcon />}
      onClick={exportExcel}
    >
      Export
    </Button>
  );
}
