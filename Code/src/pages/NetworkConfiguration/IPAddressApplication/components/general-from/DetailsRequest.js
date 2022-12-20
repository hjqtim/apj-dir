import React, { memo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import {
  Grid,
  Typography,
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button
} from '@material-ui/core';
import AddBoxIcon from '@material-ui/icons/AddBox';
import useWebDPColor from '../../../../../hooks/webDP/useWebDPColor';
import FormControlProps from '../../../../../models/webdp/PropsModels/FormControlProps';
import BaseLine from '../../../../webdp/Application/components/general-from/BaseLine';
import { setAddItem } from '../../../../../redux/IPAdreess/ipaddrActions';
import Left from './Left';
import Middle from './Middle';
import Right from './Right';

const DetailsRequest = () => {
  const [expanded, setExpanded] = useState(true);
  const dispatch = useDispatch();
  const items = useSelector((state) => state.IPAdreess?.items);
  const isMyRequest = useSelector((state) => state.IPAdreess.isMyRequest) || false;
  const isMyApproval = useSelector((state) => state.IPAdreess.isMyApproval) || false;

  return (
    <Accordion
      expanded={expanded}
      onChange={() => setExpanded(!expanded)}
      style={{ width: '100%', marginTop: '1rem' }}
    >
      <AccordionSummary
        expandIcon={<ExpandMoreIcon style={{ color: useWebDPColor().title }} />}
        aria-controls="panel1bh-content"
        style={{ backgroundColor: 'rgba(0, 0, 0, 0.05)' }}
      >
        <Typography variant="h4" style={{ color: useWebDPColor().title, fontWeight: 'bold' }}>
          Details of this Request
        </Typography>
      </AccordionSummary>
      <AccordionDetails style={{ display: 'block' }}>
        {items?.map((item, index) => (
          <Grid container component="div" key={item.key} style={{ marginBottom: '1rem' }}>
            <Left values={item} index={index} />
            <Middle values={item} index={index} />
            <Right values={item} index={index} length={items?.length} />
            <BaseLine />
          </Grid>
        ))}

        {!isMyApproval && !isMyRequest && (
          <Grid {...FormControlProps} md={12} style={{ textAlign: 'center', marginBottom: '1rem' }}>
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddBoxIcon />}
              onClick={() => {
                dispatch(setAddItem());
              }}
            >
              <strong>Add</strong>
            </Button>
          </Grid>
        )}
      </AccordionDetails>
    </Accordion>
  );
};

export default memo(DetailsRequest);
