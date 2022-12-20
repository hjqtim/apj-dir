import React, { useState, useEffect } from 'react';
import {
  Grid,
  Typography,
  Accordion,
  AccordionDetails,
  AccordionSummary,
  TextField,
  // RadioGroup,
  // Radio,
  // FormControlLabel,
  makeStyles
  // FormGroup,
  // Checkbox,
  // IconButton
} from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
// import SearchIcon from '@material-ui/icons/Search';
import API from '../../../../api/webdp/webdp';
import { Styles, Param } from './indexStyle';

const Enduser = (props) => {
  const {
    endUserName,
    endUserTitle,
    endUserPhone,
    endUserRemarks,
    detail01,
    setEndUserName,
    setEndUserTitle,
    setEndUserPhone,
    setEndUserRemarks,
    endUserNameE,
    endUserPhoneE
  } = props.toProps;

  const [expanded02, setExpanded02] = useState(true);
  console.log('setExpanded02: ', setExpanded02);

  const [open, setOpen] = useState(false);
  console.log('open: ', open);
  const [aduserList, setAduserList] = useState([]);

  const useStyles = makeStyles(() => ({
    radio: {
      '&$checked': {
        color: '#155151'
      }
    },
    checked: {},
    checkBox: {
      '&$checked': {
        color: '#155151'
      }
    },
    muiAccordinSummaryRoot: {
      //   borderBottom: '1px solid #155151',
      marginBottom: 5,
      minHeight: 'unset!important',
      height: '48px'
    },
    muiAccordinSummaryContent: {
      margin: '12px 0'
    },
    inputValidation: {
      '& .MuiOutlinedInput-root': {
        borderColor: '#ff0000',
        borderWidth: '2px'
      }
    },
    inputDefult: {
      '& .MuiOutlinedInput-root': {
        borderColor: '#ff0000',
        borderWidth: '1px'
      }
    }
  }));
  const classes = useStyles();

  useEffect(() => {
    // console.log('Enduser Effect:', aduserList);
  }, [aduserList]);

  // EndUser Check
  // const checkUser = () => {
  //   // console.log('chekc', endUserName);
  //   if (endUserName !== '') {
  //     const obj = {};
  //     obj.username = endUserName;
  //     Loading.show();
  //     API.getADUserList(obj).then((res) => {
  //       Loading.hide();
  //       // console.log('getADUserList', res.data.data);
  //       if (res.data.code === 200) {
  //         const tempData = res.data.data;
  //         setAduserList([...tempData]);
  //         setOpen(true);
  //       }
  //     });
  //   } else {
  //     CommonTip.warning('No keyWords!');
  //   }
  // };
  const checkUser2 = (value) => {
    // console.log('chekc', value);
    const obj = {};
    obj.username = value;
    // Loading.show();
    API.getADUserList(obj).then((res) => {
      // Loading.hide();
      // console.log('getADUserList', res.data.data);
      if (res.data.code === 200) {
        const tempData = res.data.data;
        setAduserList([...tempData]);
        setOpen(true);
      }
    });
  };

  const handleEnduserName = (value) => {
    // console.log('handleEnduserName', value, value.length, endUserName);
    if (value.length === 2) {
      checkUser2(value);
    }
    setEndUserName(value);
  };

  return (
    <Accordion
      expanded={expanded02}
      // onChange={() => setExpanded02(!expanded02)}
      style={{ width: '100%', marginTop: '1rem' }}
    >
      <AccordionSummary
        expandIcon={<ExpandMoreIcon style={{ ...Styles.title }} />}
        aria-controls="panel1bh-content"
        id="panel1bh-header"
        classes={{
          root: classes.muiAccordinSummaryRoot
        }}
      >
        <Typography variant="h4" style={{ ...Styles.typography }}>
          End-user Information (Optional)
        </Typography>
      </AccordionSummary>
      <AccordionDetails style={{ display: 'block' }}>
        <Grid container {...Param.SubTitleProps}>
          <Grid {...Param.FormControlProps} md={6} lg={4}>
            <TextField
              {...Param.inputProps}
              label="Name"
              id="endUserName"
              value={endUserName}
              // onBlur={(e) => {
              //   console.log('username', e.target.value);
              //   setEndUserName(e.target.value);
              // }}
              disabled={detail01}
              style={detail01 ? { display: 'block' } : { display: 'none' }}
            />

            <Autocomplete
              id="endUserName"
              freeSolo
              // value={aduserList[0] || null}
              options={aduserList}
              getOptionLabel={(option) => `${option.display}`}
              // open={open}
              openOnFocus
              forcePopupIcon
              includeInputInList
              // fullWidth
              onChange={(e, value) => {
                console.log('Autocomplete1', e, value);
                const displayName = value.display;
                const temparr = displayName.split(',');
                if (value !== null) {
                  setEndUserName(value.display || '');
                  // setEndUserTitle(value.title || '');
                  setEndUserTitle(temparr[1] || '');
                  setEndUserPhone(value.phone || '');
                }
                // setOpen(false);
              }}
              // onBlur={checkUser}
              renderInput={(inputParams) => (
                <TextField
                  {...inputParams}
                  {...Param.inputProps}
                  label="Name"
                  // value={endUserName}

                  onChange={(e) => {
                    // const endUserName = e.target.value;
                    // console.log('Autocomplete', endUserName, endUserName.length);
                    handleEnduserName(e.target.value);
                    // setEndUserName(endUserName);
                    // if (endUserName.length < 2) {
                    //   checkUser();
                    // }
                  }}
                  error={endUserNameE}
                />
              )}
              disabled={detail01}
              style={detail01 ? { display: 'none' } : { display: 'block' }}
            />
          </Grid>
          {/* <Grid {...Param.FormControlProps} md={6} lg={1}>
            <IconButton onClick={checkUser} size="small" disabled={detail01}>
              <SearchIcon fontSize="small" style={{ fontSize: 30 }} />
            </IconButton>
          </Grid> */}
          <Grid {...Param.FormControlProps} md={6} lg={4}>
            <TextField
              {...Param.inputProps}
              id="endUserTitle"
              label="Title"
              value={endUserTitle}
              onChange={(e) => {
                setEndUserTitle(e.target.value);
              }}
              disabled={detail01}
            />
          </Grid>
          <Grid {...Param.FormControlProps} md={6} lg={4}>
            <TextField
              {...Param.inputProps}
              id="endUserPhone"
              label="Phone"
              value={endUserPhone}
              onChange={(e) => {
                let temp = e.target.value;
                temp = temp.replace(/[^\d]/g, '');
                setEndUserPhone(temp);
              }}
              disabled={detail01}
              // type="number"
              inputProps={{ maxLength: 8 }}
              error={endUserPhoneE}
            />
          </Grid>
          <Grid {...Param.FormControlProps} md={6} lg={12}>
            <TextField
              {...Param.inputProps}
              id="endUserRemarks"
              label="Remarks"
              value={endUserRemarks}
              multiline
              rows={4}
              onChange={(e) => {
                setEndUserRemarks(e.target.value);
              }}
              disabled={detail01}
            />
          </Grid>
        </Grid>
      </AccordionDetails>
    </Accordion>
  );
};
export default Enduser;
