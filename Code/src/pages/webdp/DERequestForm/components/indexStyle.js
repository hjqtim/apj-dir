export const Styles = {
  title: {
    color: '#155151'
  },
  typography: {
    color: '#078080',
    fontWeight: 'bold',
    paddingLeft: '0.5rem'
  },
  validityState01: {
    border: '2px solid #ff0000',
    borderRadius: 5
  }
};
export const Param = {
  FormHeaderProps: {
    variant: 'h2',
    style: {
      fontWeight: 'bold',
      fontSize: 16.5,
      textAlign: 'left',
      padding: '0.5rem',
      paddingLeft: 16
    }
  },
  inputProps: {
    variant: 'outlined',
    fullWidth: true,
    size: 'small'
  },
  FormControlProps: {
    item: true,
    xs: 12,
    style: { padding: '0.3rem 0.3rem' }
  },
  SubTitleProps: {
    item: true,
    style: {
      marginBottom: '1rem'
    }
  },
  inputPropsDataPortID: {
    variant: 'outlined',
    fullWidth: false,
    size: 'small',
    style: { width: '60%' }
  },
  inputRemark: {
    variant: 'outlined',
    multiline: true,
    fullWidth: true,
    minRows: 6,
    maxRows: 10
  }
};
