import React, { useState } from 'react';
import { Accordion, AccordionSummary, AccordionDetails, Typography } from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import useWebDPColor from '../../hooks/webDP/useWebDPColor';

const WebdpAccordion = ({ label, content, expandedSW, style, ...rest }) => {
  const [expanded, setExpanded] = useState(expandedSW || false);
  const defaultTitleColor = useWebDPColor().title;
  return (
    <Accordion
      expanded={expanded}
      onChange={() => setExpanded(!expanded)}
      style={{ width: '100%', boxShadow: 'none' }}
    >
      <AccordionSummary expandIcon={<ExpandMoreIcon style={{ color: '#078080' }} />} {...rest}>
        <Typography
          variant="h4"
          style={{ color: style?.color ? style?.color : defaultTitleColor, fontWeight: 'bold' }}
        >
          {label}
        </Typography>
      </AccordionSummary>
      <AccordionDetails>{content}</AccordionDetails>
    </Accordion>
  );
};

export default React.memo(WebdpAccordion);
