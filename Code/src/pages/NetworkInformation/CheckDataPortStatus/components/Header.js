import React, { useState, useEffect } from 'react';
import { makeStyles, Button, TextField } from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { CommonTip } from '../../../../components';
import API from '../../../../api/webdp/webdp';

const useStyles = makeStyles((theme) => ({
  root: {
    marginBottom: theme.spacing(8),
    display: 'flex',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    marginLeft: '1em'
  },
  clearButton: {
    color: '#229FFA',
    width: '10ch'
  },
  searchButton: {
    marginRight: '2ch',
    width: '10ch'
  },
  dataPortStyle: {
    minWidth: '250px',
    maxWidth: '800px',
    maxHeight: '92px',
    overflowX: 'hidden',
    overflowY: 'auto',
    '& .MuiInputBase-input': {
      height: '26px'
    },
    '& .MuiInputLabel-formControl': {
      marginTop: theme.spacing(2)
    },
    '& .MuiInputLabel-formControl.MuiInputLabel-shrink': {
      marginTop: 0
    },
    '& .Mui-error.MuiInput-underline:hover:not(.Mui-disabled):before': {
      borderBottom: 0
    }
  },
  institutionStyle: {
    margin: '10px 50px 0 0',
    minWidth: '250px'
  }
}));

export default function Header({ handleSearch, setRows }) {
  const classes = useStyles();

  const formik = useFormik({
    initialValues: {
      institution: null,
      dataPort: []
    },
    validationSchema: Yup.object({
      dataPort: Yup.array().required().min(1)
    }),
    onSubmit: (values) => {
      handleSearch(values);
    }
  });

  const [hospitalList, setHospitalList] = useState([]);

  useEffect(() => {
    API.getHospitalList().then((res) => {
      setHospitalList(res?.data?.data?.hospitalList || []);
    });
  }, []);

  const handleDataPortChange = (e, data) => {
    // 删除事件
    if (data.length < formik.values.dataPort.length) {
      formik.setFieldValue('dataPort', data);
    }
    let newArr = data;
    let newValue = '';
    if (typeof newArr[newArr.length - 1] === 'string') {
      const result = newArr.pop();
      if (result?.length < 3) {
        CommonTip.error('The length at least 3');
        return;
      }
      newValue = result;
      newArr = [
        ...newArr,
        {
          value: result,
          id: parseInt(Date.parse(new Date()).toString().substring(4), 10)
        }
      ];
    } else {
      newValue = newArr[newArr.length - 1]?.value;
    }
    const isExit = formik.values.dataPort.some((item) => item.value === newValue);
    // 判断是否有相同项,有则去除
    if (isExit) return;
    formik.setFieldValue('dataPort', newArr);
  };

  return (
    <form onSubmit={formik.handleSubmit}>
      <div className={classes.root}>
        <div style={{ display: 'flex' }}>
          <Autocomplete
            onChange={(event, value) => {
              formik.setFieldValue('institution', value);
            }}
            name="institution"
            value={formik.values.institution || null}
            className={classes.institutionStyle}
            options={hospitalList || []}
            getOptionLabel={(option) => `${option.hospital}---${option.hospitalName}`}
            renderInput={(params) => <TextField {...params} label="Institution" />}
          />

          <Autocomplete
            multiple
            freeSolo
            autoSelect
            limitTags={2}
            className={classes.dataPortStyle}
            name="dataPort"
            value={formik.values.dataPort || []}
            options={
              [
                // { id: 100001, value: 'QEH.F.10.CORR.AP.B' },
                // { id: 200002, value: 'PMH.RT.6.CORR.AP.01' },
                // { id: 300003, value: 'HAHO.JCKRC.G.AP.001' }
              ]
            }
            getOptionLabel={(option) => {
              if (option.inputValue) {
                return option.inputValue;
              }
              return option?.value || '';
            }}
            onChange={handleDataPortChange}
            // filterOptions={(options, params) => {
            //   const filtered = options.filter((item) =>
            //     params.inputValue === '' ? true : item.value.indexOf(params.inputValue) !== -1
            //   );
            //   if (params.inputValue !== '') {
            //     filtered.push({
            //       skillName: params.inputValue,
            //       id: parseInt(Date.parse(new Date()).toString().substring(4), 10),
            //       value: `${params.inputValue}`
            //     });
            //   }
            //   return filtered;
            // }}
            renderInput={(params) => (
              <TextField
                {...params}
                error={Boolean(formik.errors.dataPort && formik.touched.dataPort)}
                label="Data Port"
              />
            )}
          />
        </div>
        <div style={{ minWidth: '25ch' }}>
          <Button
            variant="contained"
            color="secondary"
            type="submit"
            className={classes.searchButton}
          >
            Search
          </Button>
          <Button
            color="secondary"
            variant="outlined"
            onClick={() => {
              setRows([]);
              formik.handleReset();
            }}
            className={classes.clearButton}
          >
            Clear
          </Button>
        </div>
      </div>
    </form>
  );
}
