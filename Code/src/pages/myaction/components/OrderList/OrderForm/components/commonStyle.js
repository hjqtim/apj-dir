import { makeStyles } from '@material-ui/core/styles';

const useCommonStyle = makeStyles((theme) => ({
  sectionTitle: {
    fontWeight: 700,
    color: theme.palette.primary.main
  }
}));

export default useCommonStyle;
