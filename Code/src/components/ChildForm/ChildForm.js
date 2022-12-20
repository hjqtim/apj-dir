import React from 'react';
import {
  Button as HAButton,
  Dialog as HADialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Slide,
  ButtonGroup
} from '@material-ui/core/';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import DIYForm from '../DIYForm';

const Transition = React.forwardRef((props, ref) => <Slide direction="up" ref={ref} {...props} />);

const Dialog = withStyles(() => ({
  paper: {
    minWidth: '75vw',
    minHeight: '90vh'
  }
}))(HADialog);

const Actions = withStyles(() => ({
  root: {
    display: 'flex',
    height: '10vh',
    width: '100%',
    margin: '0',
    padding: '2vh 0',
    justifyContent: 'center',
    alignItems: 'center'
  }
}))(DialogActions);

const Button = withStyles(() => ({
  root: {
    width: '5vw'
  }
}))(HAButton);

const Title = withStyles(() => ({
  root: {}
}))(DialogTitle);

const Content = withStyles(() => ({
  root: {
    padding: '0 4vw'
  }
}))(DialogContent);

const useStyles = makeStyles(() => ({
  buttonGroup: {
    display: 'flex',
    justifyContent: 'center'
  },
  button: {
    marginLeft: '1vw',
    marginRight: '1vw'
  }
}));

export default function ChildForm(props) {
  const {
    open,
    formDetail,
    buttonList,
    onClose,
    onChange,
    childFormTitle,
    defaultValues,
    pid,
    isNew
  } = props;

  const classes = useStyles();

  return (
    <div>
      <Dialog open={open} TransitionComponent={Transition} keepMounted onClose={onClose}>
        <Title>{childFormTitle}</Title>
        <Content dividers>
          <DIYForm
            pid={pid}
            dataList={formDetail}
            defaultValues={defaultValues}
            hideTitle
            onChange={onChange}
            formTitle={childFormTitle}
            isNew={isNew}
          />
        </Content>
        <Actions disableSpacing>
          <ButtonGroup className={classes.buttonGroup}>
            {buttonList &&
              buttonList.map((el, i) => (
                <Button
                  className={classes.button}
                  key={`${i}__${el.id}`}
                  variant="contained"
                  color={el.color}
                  onClick={el.onClick ? (e) => el.onClick(e) : null}
                  disabled={el.disabled}
                >
                  {el.label}
                </Button>
              ))}
          </ButtonGroup>
        </Actions>
      </Dialog>
    </div>
  );
}
