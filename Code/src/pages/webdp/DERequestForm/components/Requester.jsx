import React, { useState } from 'react';
import {
  Grid,
  Typography,
  Accordion,
  AccordionDetails,
  AccordionSummary,
  TextField,
  makeStyles
} from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import API from '../../../../api/webdp/webdp';
import { Styles, Param } from './indexStyle';

const Requester = (props) => {
  const {
    requesterCorp,
    requesterName,
    setRequesterName,
    requesterNameE,
    requesterPhoneE,
    detail01,
    requesterTitle,
    setRequesterTitle,
    requesterPhone,
    setRequesterPhone
  } = props.toProps;

  const [expanded01, setExpanded01] = useState(true);
  console.log('setExpanded01: ', setExpanded01);

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

  const toSaveUserInfo = (temp) => {
    // console.log('saveUserInfo', temp);
    API.saveUserInfo({
      corp: requesterCorp,
      phone: temp
    });
    // .then((res) => {
    //   console.log(res);
    // });
  };

  // useEffect(() => {
  //   console.log('userEFFect');
  // }, []);

  return (
    <Accordion
      expanded={expanded01}
      // onChange={() => setExpanded01(!expanded01)}
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
          Requester Information
        </Typography>
      </AccordionSummary>
      <AccordionDetails style={{ display: 'block' }}>
        <Grid container>
          <Grid {...Param.FormControlProps} md={6} lg={4}>
            <TextField
              {...Param.inputProps}
              id="requesterName"
              label="Name"
              value={requesterName}
              onChange={(e) => {
                setRequesterName(e.target.value);
              }}
              required
              error={requesterNameE}
              disabled
            />
          </Grid>
          <Grid {...Param.FormControlProps} md={6} lg={4}>
            <TextField
              {...Param.inputProps}
              id="requesterTitle"
              label="Title"
              value={requesterTitle}
              onChange={(e) => {
                setRequesterTitle(e.target.value);
              }}
              disabled
            />
          </Grid>
          <Grid {...Param.FormControlProps} md={6} lg={4}>
            <TextField
              {...Param.inputProps}
              id="requesterPhone"
              label="Phone"
              value={requesterPhone}
              onChange={(e) => {
                let temp = e.target.value;
                temp = temp.replace(/[^\d]/g, '');
                setRequesterPhone(temp);
              }}
              onBlur={(e) => {
                let temp = e.target.value;
                temp = temp.replace(/[^\d]/g, '');
                toSaveUserInfo(temp);
              }}
              required
              error={requesterPhoneE}
              disabled={detail01}
              // type="number"
              inputProps={{ maxLength: 8 }}
            />
          </Grid>
        </Grid>
      </AccordionDetails>
    </Accordion>
  );
};
export default Requester;
