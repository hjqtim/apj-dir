import { makeStyles } from '@material-ui/core/styles';
import theme from '../../utils/theme';

const useStyles = makeStyles(() => ({
  // The subject style of the page
  pageStyle: {
    marginTop: '2em',
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'column'
  },
  // Page title style
  subTitle: {
    fontSize: theme.font.important.size,
    lineHeight: theme.font.important.lineHeight,
    fontWeight: 'bolder',
    color: theme.color.sub.mainText
  },
  // paper  style
  haPaper: {
    width: '100%',
    padding: 0,
    marginTop: '4vh'
  },
  // Maximum width of table
  tableCelContenMax: {
    display: '-webkit-box',
    WebkitBoxOrient: 'vertical',
    WebkitLineClamp: 3,
    maxWidth: '150px',
    overflow: 'hidden',
    wordWrap: 'break-word',
    textOverflow: 'ellipsis'
  },
  // Modified display
  cellEditClass: {
    display: 'block',
    '& .dataChange': {
      background: 'url("/static/img/svg/tick.svg") no-repeat top right',
      backgroundSize: '10% 30%',
      backgroundColor: '#f0f8ff'
    }
  },
  // Resolve the compiled style
  fixDatagrid: {
    '& .MuiTypography-root.MuiTablePagination-caption': {
      flexShrink: 0,
      width: 'auto !important',
      margin: '0 !important',
      padding: '0 !important',
      color: '#000',
      backgroundColor: '#FFF'
    },
    '& .MuiInputBase-root.MuiTablePagination-input': {
      display: 'flex',
      flexDirection: 'row',
      marginTop: 0
    },
    '& .MuiInputBase-root.MuiTablePagination-input.MuiTablePagination-selectRoot': {
      paddingBottom: '0px !important',
      backgroundColor: '#FFF',
      fontSize: '14px',
      fontWeight: 400
    },

    '& .MuiTablePagination-input.MuiTablePagination-selectRoot:hover': {
      backgroundColor: '#fff'
    }
  }
}));

export default useStyles;
