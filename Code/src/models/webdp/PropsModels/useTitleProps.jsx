// import React from 'react';
import useWebDPColor from '../../../hooks/webDP/useWebDPColor';

const useTitleProps = () => {
  const color = useWebDPColor().title;
  return {
    item: true,
    xs: 12,
    md: 12,
    lg: 12,
    style: {
      padding: '0.3rem 0',
      marginTop: '1rem',
      marginBottom: '0.3rem',
      color
    }
  };
};

export default useTitleProps;
