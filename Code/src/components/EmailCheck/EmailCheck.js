import React from 'react';
import {
  Dialog,
  List,
  DialogTitle,
  DialogActions,
  Button,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar
} from '@material-ui/core/';
import { makeStyles } from '@material-ui/core/styles';
import PersonIcon from '@material-ui/icons/Person';
import { blue } from '@material-ui/core/colors';

const useStyles = makeStyles({
  avatar: {
    backgroundColor: blue[100],
    color: blue[600]
  }
});

export default function EmailCheck(props) {
  const { open, onClose, handleEmail, emails, title } = props;
  const classes = useStyles();
  const handleListItemClick = (email) => {
    handleEmail(email);
  };
  return (
    <div>
      <Dialog onClose={onClose} aria-labelledby="simple-dialog-title" open={open}>
        <DialogTitle id="simple-dialog-title">{title}</DialogTitle>
        <List>
          {emails.map((email) => (
            <ListItem button onClick={() => handleListItemClick(email)} key={email}>
              <ListItemAvatar>
                <Avatar className={classes.avatar}>
                  <PersonIcon />
                </Avatar>
              </ListItemAvatar>
              <ListItemText primary={email} />
            </ListItem>
          ))}
        </List>
        <DialogActions>
          <Button onClick={onClose} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
