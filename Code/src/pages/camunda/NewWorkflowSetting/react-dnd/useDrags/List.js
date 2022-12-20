import { useDrag } from 'react-dnd';
import React from 'react';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import ListOutlinedIcon from '@material-ui/icons/ListOutlined';

const style = {
  width: '80%',
  padding: '1rem',
  paddingBottom: '0'
};

const ButtonStyle = {
  fontWeight: 300
};
const useStyles = makeStyles(() => ({
  CheckButton: {
    '& .MuiButton-label': {
      justifyContent: 'left'
    }
  }
}));
export const List = () => {
  const classes = useStyles();
  const [, drag] = useDrag({
    item: { type: 'list' },
    collect: (monitor) => ({
      opacity: monitor.isDragging() ? 0.4 : 1
    })
  });
  return (
    <div ref={drag} style={style}>
      <Button
        variant="outlined"
        startIcon={<ListOutlinedIcon />}
        fullWidth
        style={ButtonStyle}
        className={classes.CheckButton}
      >
        List
      </Button>
    </div>
  );
};
