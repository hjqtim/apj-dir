import React from 'react';
import PropTypes from 'prop-types';
import CssBaseline from '@material-ui/core/CssBaseline';
import useScrollTrigger from '@material-ui/core/useScrollTrigger';
import Box from '@material-ui/core/Box';
import Container from '@material-ui/core/Container';
import Slide from '@material-ui/core/Slide';
import { Scrollbars } from 'react-custom-scrollbars';
import { ChenckForm } from './FormProperty/ChenckForm';
import { TextForm } from './FormProperty/TextForm';
import { DateForm } from './FormProperty/DateForm';
import { ListForm } from './FormProperty/ListForm';
import { SelectForm } from './FormProperty/SelectForm';
import { InputCheckFrom } from './FormProperty/InputCheckFrom';
import { ProcedureForm } from './FormProperty/ProcedureForm';

const PropertyStyle = {
  height: 'auto',
  // paddingTop: "0.5rem",
  marginBottom: '64px'
};

const GlobalComponent = {
  checkbox: ChenckForm,
  text: TextForm,
  date: DateForm,
  list: ListForm,
  select: SelectForm,
  inputCheck: InputCheckFrom,
  procedure: ProcedureForm
};

function HideOnScroll(props) {
  const { children, window } = props;
  // Note that you normally won't need to set the window ref as useScrollTrigger
  // will default to window.
  // This is only being set here because the demo is in an iframe.
  const trigger = useScrollTrigger({ target: window ? window() : undefined });
  return (
    <Slide appear={false} direction="down" in={!trigger}>
      {children}
    </Slide>
  );
}

HideOnScroll.propTypes = {
  children: PropTypes.element.isRequired,
  /**
   * Injected by the documentation to work in an iframe.
   * You won't need it on your project.
   */
  window: PropTypes.func
};

export default function Property(props) {
  const { PropertyData, AllProperty } = props;
  const ComponentInfo = GlobalComponent[PropertyData.inputType];
  return (
    <>
      <CssBaseline />
      <div
        style={{
          paddingLeft: '1.5rem',
          fontSize: '1.5rem',
          fontWeight: 600,
          lineHeight: '2.5rem',
          height: '3.5rem'
        }}
      >
        Attributes
      </div>
      <Scrollbars>
        <Container>
          <Box my={2}>
            <div style={PropertyStyle}>
              {PropertyData.inputType ? (
                <ComponentInfo
                  PropertyData={PropertyData}
                  AllProperty={AllProperty}
                  key={PropertyData.fieldDisplayName}
                />
              ) : (
                <></>
              )}
            </div>
          </Box>
        </Container>
      </Scrollbars>
    </>
  );
}
