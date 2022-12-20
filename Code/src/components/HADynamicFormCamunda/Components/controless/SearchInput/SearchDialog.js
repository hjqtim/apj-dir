import React from 'react';
import PersonIcon from '@material-ui/icons/Person';
import { makeStyles } from '@material-ui/core/styles';
import { blue } from '@material-ui/core/colors';
import {
  Dialog,
  List,
  DialogTitle,
  DialogActions,
  DialogContent,
  Button,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar
} from '@material-ui/core';
import { L } from '../../../../../utils/lang';

const useStyles = makeStyles({
  avatar: {
    backgroundColor: blue[100],
    color: blue[600]
  }
});

function SearchDialog(props) {
  const { open, onClose, title, dataList, onSelect } = props;
  const classes = useStyles();

  const handleSelect = (data) => {
    onSelect && onSelect(data);
    onClose && onClose();
  };

  return (
    <div>
      <Dialog aria-labelledby="simple-dialog-title" open={open}>
        <DialogTitle id="simple-dialog-title">{title}</DialogTitle>
        <DialogContent dividers>
          <List>
            {dataList.map((data, i) => (
              <ListItem button onClick={() => handleSelect(data)} key={data.toString() + i}>
                <ListItemAvatar>
                  <Avatar className={classes.avatar}>
                    <PersonIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText primary={data.display} />
              </ListItem>
            ))}
          </List>
        </DialogContent>
        <DialogActions>
          <div
            style={{
              width: '100%',
              display: 'flex',
              justifyContent: 'center'
            }}
          >
            <Button onClick={onClose} style={{ backgroundColor: blue[500], color: '#fff' }}>
              {L('Close')}
            </Button>
          </div>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default SearchDialog;
