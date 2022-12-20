import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Grid, Typography, TextField } from '@material-ui/core';
import { updateRequester } from '../../../../../redux/webDP/webDP-actions';
import useTitleProps from '../../../../../models/webdp/PropsModels/useTitleProps';
import useWebDPColor from '../../../../../hooks/webDP/useWebDPColor';
import FormControlProps from '../../../../../models/webdp/PropsModels/FormControlProps';
import phoneOnBlur from '../../../../../utils/phoneOnBlur';

const RequesterForm = (props) => {
  const { isDetail } = props;
  const viewOnly = useSelector((state) => state.webDP.viewOnly);
  const requesterInformation = useSelector((state) => state.webDP.requester);
  const phoneError = useSelector((state) => state.webDP.error.requester.phone);
  const user = useSelector((state) => state.userReducer?.currentUser) || {};
  const TitleProps = useTitleProps();
  const webdpColor = useWebDPColor();
  const dispatch = useDispatch();
  const fieldsUpdateHandler = (e) => {
    dispatch(updateRequester(e));
  };
  // console.log('requesterInformation', requesterInformation, temparr);

  // useEffect(() => {
  //   console.log(requesterInformation.phone);
  // }, [requesterInformation.phone]);

  const InputProps = {
    variant: 'outlined',
    fullWidth: true,
    size: 'small'
  };

  return (
    <Grid container>
      <Grid {...TitleProps}>
        <Typography variant="h6" style={{ color: webdpColor.title }}>
          <strong>Requester's Information</strong>
        </Typography>
      </Grid>
      <Grid container spacing={3}>
        <Grid {...FormControlProps} md={6} lg={3}>
          <TextField
            {...InputProps}
            label="Institution / Department"
            value={requesterInformation.hospital}
            id="hospital"
            // onChange={fieldsUpdateHandler}
            disabled
          />
        </Grid>
        <Grid {...FormControlProps} md={6} lg={3}>
          <TextField
            {...InputProps}
            label="Name"
            id="name"
            value={requesterInformation.name}
            // onChange={fieldsUpdateHandler}
            disabled
          />
        </Grid>
        <Grid {...FormControlProps} md={6} lg={3}>
          <TextField
            {...InputProps}
            label="Title"
            id="title"
            value={requesterInformation.title}
            // value={temparr[1]}
            // onChange={fieldsUpdateHandler}
            disabled
          />
        </Grid>
        <Grid {...FormControlProps} md={6} lg={3}>
          <TextField
            {...InputProps}
            label="Phone *"
            onBlur={() => {
              if (!isDetail) {
                phoneOnBlur(user.username, requesterInformation.phone);
              }
            }}
            id="phone"
            error={phoneError}
            value={requesterInformation.phone}
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
      </Grid>
    </Grid>
  );
};

export default RequesterForm;
