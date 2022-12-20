import React, { memo, useState } from 'react';
import { Grid, Typography, TextField } from '@material-ui/core';
import Rating from '@material-ui/lab/Rating';
import {
  SentimentVeryDissatisfied,
  SentimentDissatisfied,
  SentimentSatisfied,
  SentimentSatisfiedAltOutlined,
  SentimentVerySatisfied
} from '@material-ui/icons';
import { useFormik } from 'formik';
import { CommonDialog, CommonTip } from '../index';
import API from '../../api/webdp/webdp';

const customIcons = {
  1: {
    icon: <SentimentVeryDissatisfied style={{ fontSize: 50 }} />,
    label: 'Very Poor'
  },
  2: {
    icon: <SentimentDissatisfied style={{ fontSize: 50 }} />,
    label: 'Poor'
  },
  3: {
    icon: <SentimentSatisfied style={{ fontSize: 50 }} />,
    label: 'Fair'
  },
  4: {
    icon: <SentimentSatisfiedAltOutlined style={{ fontSize: 50 }} />,
    label: 'Good'
  },
  5: {
    icon: <SentimentVerySatisfied style={{ fontSize: 50 }} />,
    label: 'Very Good'
  }
};

const IconContainer = (props) => {
  const { value, ...other } = props;
  return <span {...other}>{customIcons[value].icon}</span>;
};

const Comment = (props) => {
  const {
    open = false,
    setOpen = () => {},
    commentObj = {},
    setCommentObj = () => {},
    getList = () => {}
  } = props;

  const formik = useFormik({
    initialValues: {
      rating: 5,
      comment: ''
    }
  });

  const [hover, setHover] = useState(-1);
  const [saving, setSaving] = useState(false);

  const handleClose = () => {
    setOpen(false);
    setCommentObj({});
    setTimeout(() => {
      formik.handleReset();
    }, 200);
  };

  const handleConfirm = () => {
    if (saving || !commentObj?.requestNo) {
      return;
    }

    const saveParams = {
      requestNo: commentObj?.requestNo,
      rating: formik.values.rating,
      comment: formik.values.comment,
      institution: commentObj?.variables?.hospital,
      appType: commentObj?.variables?.appType
    };
    setSaving(true);
    API.saveFeedback(saveParams)
      .then((res) => {
        if (res?.data?.status === 200) {
          CommonTip.success('Success');
          handleClose();
          getList();
        }
      })
      .finally(() => {
        setSaving(false);
      });
  };

  return (
    <>
      <CommonDialog
        open={open}
        title="User Feedback Survey"
        content={
          <div style={{ padding: 40 }}>
            <Grid container spacing={8}>
              <Grid item xs={12}>
                <Typography variant="h5" align="center">
                  Please rate your overall satisfaction regarding this request:
                </Typography>
                <Grid
                  container
                  item
                  xs={12}
                  justifyContent="center"
                  alignItems="center"
                  style={{ marginTop: 20 }}
                >
                  <Rating
                    name="rating"
                    value={formik.values.rating}
                    onChange={(e, newValue) => {
                      if (newValue) {
                        formik.setFieldValue('rating', newValue);
                      }
                    }}
                    onChangeActive={(e, newHover) => {
                      setHover(newHover);
                    }}
                    IconContainerComponent={IconContainer}
                  />
                  <Grid item style={{ position: 'relative', height: 50 }}>
                    {formik.values.rating && (
                      <span
                        style={{
                          fontWeight: 'bold',
                          position: 'absolute',
                          left: '10px',
                          lineHeight: '50px',
                          fontSize: '18px',
                          whiteSpace: 'nowrap'
                        }}
                      >
                        {customIcons[hover !== -1 ? hover : formik.values.rating]?.label}
                      </span>
                    )}
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  name="comment"
                  label="Comments"
                  minRows={4}
                  maxRows={6}
                  variant="outlined"
                  multiline
                  fullWidth
                  onChange={formik.handleChange}
                />
              </Grid>
            </Grid>
          </div>
        }
        handleClose={handleClose}
        handleConfirm={handleConfirm}
        isHideFooter={false}
        // isHideClose
      />
    </>
  );
};

export default memo(Comment);
