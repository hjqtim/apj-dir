import React, { useState, memo } from 'react';
import {
  Grid,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails
  // Button
} from '@material-ui/core';
import { useSelector } from 'react-redux';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import DPQuotation from './DPQuotation';
import useWebDPColor from '../../../../../hooks/webDP/useWebDPColor';
import APQuotation from './APQuotation';

const CostEstimation = (props) => {
  const { isRequest = false } = props;
  const [expanded, setExpanded] = useState(!isRequest);
  const formType = useSelector((state) => state.webDP.formType);

  return (
    <Accordion
      expanded={expanded}
      onChange={() => setExpanded(!expanded)}
      style={{ width: '100%', boxShadow: 'none' }}
    >
      <AccordionSummary
        expandIcon={<ExpandMoreIcon style={{ color: useWebDPColor().title }} />}
        aria-controls="panel1bh-content"
        id="panel1bh-header"
        style={{ padding: 0 }}
      >
        <Typography variant="h4" style={{ color: useWebDPColor().title, fontWeight: 'bold' }}>
          Cost Estimation
        </Typography>
      </AccordionSummary>
      <AccordionDetails style={{ padding: 0 }}>
        <Grid container>
          {formType === 'DP' && <DPQuotation isRequest={isRequest} />}
          {formType === 'AP' && <APQuotation isRequest={isRequest} />}
          {/* below component for N3 only */}

          {/* <WebdpTextField multiline minRows={5} label="Cost Estmiation Remark" /> */}
          {/* <Grid item xs={12} style={{ marginTop: '1rem' }}>
            <SubmitButton
              title="Quotation Approval"
              message="The quotation will be confirmed and sent to user, are you sure to continue?"
              label="Approve"
              submitLabel="Confirm"
              onClick={() => console.log('click action')}
            />
          </Grid> */}
        </Grid>
      </AccordionDetails>
    </Accordion>
  );
};

export default memo(CostEstimation);
