import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { Grid, Typography, Accordion, AccordionDetails, AccordionSummary } from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import DataPortInformationControl from './DataPortInformationControl';
import LocationDetailsControl from './LocationDetailsControl';
import SiteContactControl from './SiteContactControl';
import AdditionalDPControl from './AdditionalDPControl';
import BaseLine from '../general-from/BaseLine';
import useWebDPColor from '../../../../../hooks/webDP/useWebDPColor';
// import API from '../../../../../api/webdp/webdp';
// import { setServiceConduits } from '../../../../../redux/webDP/webDP-actions';

const DataPortForm = ({ InputProps, ButtonProps, isDetail }) => {
  const items = useSelector((state) => state.webDP.apDpDetails.items);
  const formType = useSelector((state) => state.webDP.formType);
  const [expanded, setExpanded] = useState(true);

  return (
    <>
      <Accordion
        expanded={expanded}
        onChange={() => setExpanded(!expanded)}
        style={{ width: '100%', marginTop: '1rem' }}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon style={{ color: useWebDPColor().title }} />}
          aria-controls="panel1bh-content"
          id="panel1bh-header"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.05)' }}
        >
          <Typography variant="h4" style={{ color: useWebDPColor().title, fontWeight: 'bold' }}>
            {formType === 'AP'
              ? 'WLAN AP Installation Request Information'
              : 'Data Port Request Information'}
          </Typography>
        </AccordionSummary>
        <AccordionDetails style={{ display: 'block' }}>
          {items.map((dfi, index) => (
            <Grid container component="div" key={dfi.key || index} style={{ marginBottom: '1rem' }}>
              <DataPortInformationControl dfi={dfi} index={index} />
              <LocationDetailsControl dfi={dfi} index={index} />
              <SiteContactControl
                dfi={dfi}
                index={index}
                length={items.length}
                ButtonProps={ButtonProps}
                isDetail={isDetail}
              />
              <BaseLine />
            </Grid>
          ))}
          <AdditionalDPControl InputProps={InputProps} />
        </AccordionDetails>
      </Accordion>
    </>
  );
};

DataPortForm.propTypes = {
  InputProps: PropTypes.object,
  ButtonProps: PropTypes.object
};

export default DataPortForm;
