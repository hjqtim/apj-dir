import React, { useEffect, useState } from 'react';
import {
  Button as HAButton,
  Dialog as HADialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Slide
} from '@material-ui/core';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import { Input, Select } from '../../../../../components/HADynamicForm/Components/controless';
import getStyle from '../../../../../utils/dynamicForm/style';
import { L } from '../../../../../utils/lang';
import CommonTip from '../../../../../components/CommonTip';

const Transition = React.forwardRef((props, ref) => <Slide direction="up" ref={ref} {...props} />);

const ELStyle = getStyle('').commonElement;

const Dialog = withStyles(() => ({
  paper: {
    maxWidth: '900px',
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
  root: {
    height: '8vh',
    display: 'flex',
    alignItems: 'center',
    maxHeight: '60px'
  }
}))(DialogTitle);

const Content = withStyles(() => ({
  root: {
    padding: '0 4vw'
  }
}))(DialogContent);

const useStyles = makeStyles(() => ({
  content: {
    padding: '2em',
    display: 'flex',
    flexWrap: 'wrap'
  },
  buttonGroup: {
    display: 'flex',
    justifyContent: 'center'
  },
  button: {
    marginLeft: '1vw',
    marginRight: '1vw'
  }
}));

export default function FieldDialog(props) {
  const { open, initData, onClose, handleSave } = props;

  const [data, setData] = useState({});
  const [showExtend, setShowExtend] = useState(false);

  useEffect(() => {
    if (initData) {
      setData({ ...initData });
      const { inputType } = initData;
      if (inputType === 'select' || inputType === 'checkbox') {
        setShowExtend(true);
      }
    }
  }, [initData]);

  const classes = useStyles();

  const handleClose = (save = false) => {
    if (save) {
      const { error, message } = checkAllEL();
      if (error) {
        CommonTip.error(message);
        return;
      }
      if (handleSave) handleSave(data);
    }
    onClose();
  };

  const onChange = (fieldName, value) => {
    data && (data[fieldName] = value);
    if (fieldName === 'inputType') {
      if (value === 'select' || value === 'checkbox') {
        setShowExtend(true);
      } else {
        setShowExtend(false);
        data.foreignTable = null;
        data.foreignKey = null;
        data.foreignDisplayKey = null;
      }
    }
  };

  const checkEL = (props) => {
    let error = false;
    let message = '';
    const { fieldName, required, abbrFieldName, label } = props;
    if (required && !data[fieldName]) {
      error = true;
      message = `${abbrFieldName || label} is required`;
    }
    return { error, message };
  };

  const checkAllEL = () => {
    let error = false;
    let message = '';

    if (!data.fieldName) {
      error = true;
      message = 'Field Name is required';
    } else if (!data.fieldDisplayName) {
      error = true;
      message = 'Field Display Name is required';
    } else if (!data.fieldType) {
      error = true;
      message = 'Field Type is required';
    } else if (!data.inputType) {
      error = true;
      message = 'Input Type is required';
    } else if (!data.showOnRequest) {
      error = true;
      message = 'Show On Request is required';
    } else if (!data.required) {
      error = true;
      message = 'Required is required';
    } else if (!data.writable) {
      error = true;
      message = 'Writable is required';
    } else if (!data.readable) {
      error = true;
      message = 'Readable is required';
    } else if (showExtend && !data.foreignTable) {
      error = true;
      message = 'Foreign Table is required';
    } else if (showExtend && !data.foreignKey) {
      error = true;
      message = 'Foreign Key is required';
    } else if (showExtend && !data.foreignDisplayKey) {
      error = true;
      message = 'Foreign Display Key is required';
    } else if (data.indexOf) {
      const reg = /^[0-9]\d*$/;
      if (!reg.test(data.indexOf)) {
        error = true;
        message = `Sorting ${L('Only accept positive integer')}`;
      }
    }

    return { error, message };
  };

  return (
    <Dialog
      open={open}
      keepMounted
      disableBackdropClick
      disableEscapeKeyDown
      TransitionComponent={Transition}
    >
      <Title>Field Detail</Title>
      <Content dividers className={classes.content}>
        <Input
          id="fieldName"
          required
          fieldName="fieldName"
          abbrFieldName={L('Field Name')}
          defaultValue={initData && initData.fieldName}
          onBlur={onChange}
          asyncCheck={checkEL}
          style={ELStyle}
        />
        <Input
          id="fieldDisplayName"
          required
          fieldName="fieldDisplayName"
          abbrFieldName={L('Field Display Name')}
          defaultValue={data && data.fieldDisplayName}
          onBlur={onChange}
          asyncCheck={checkEL}
          style={ELStyle}
        />
        <Select
          id="fieldType"
          required
          fieldName="fieldType"
          label={L('Field Type')}
          defaultValue={data && data.fieldType}
          onChange={onChange}
          checkField={checkEL}
          labelField="id"
          valueField="value"
          itemList={[
            { id: 'string', value: 'string' },
            { id: 'int', value: 'int' },
            { id: 'date', value: 'date' }
          ]}
          style={ELStyle}
        />
        <Select
          id="inputType"
          required
          fieldName="inputType"
          label={L('Input Type')}
          defaultValue={data && data.inputType}
          onChange={onChange}
          checkField={checkEL}
          labelField="id"
          valueField="value"
          itemList={[
            { id: 'text', value: 'text' },
            { id: 'checkbox', value: 'checkbox' },
            { id: 'select', value: 'select' },
            { id: 'date', value: 'date' },
            { id: 'list', value: 'list' },
            { id: 'inputCheck', value: 'inputCheck' },
            { id: 'procedure', value: 'procedure' }
          ]}
          style={ELStyle}
        />
        <Select
          id="showOnRequest"
          required
          fieldName="showOnRequest"
          label={L('Show On Request')}
          defaultValue={data && data.showOnRequest}
          onChange={onChange}
          checkField={checkEL}
          labelField="id"
          valueField="value"
          itemList={[
            { id: 'True', value: '1' },
            { id: 'False', value: '0' }
          ]}
          style={ELStyle}
        />
        <Select
          id="required"
          required
          fieldName="required"
          label={L('Required')}
          defaultValue={data && data.required}
          onChange={onChange}
          checkField={checkEL}
          labelField="id"
          valueField="value"
          itemList={[
            { id: 'True', value: '1' },
            { id: 'False', value: '0' }
          ]}
          style={ELStyle}
        />
        <Select
          id="readable"
          required
          fieldName="readable"
          label={L('Readable')}
          defaultValue={data && data.readable}
          onChange={onChange}
          checkField={checkEL}
          labelField="id"
          valueField="value"
          itemList={[
            { id: 'True', value: '1' },
            { id: 'False', value: '0' }
          ]}
          style={ELStyle}
        />
        <Select
          id="writable"
          required
          fieldName="writable"
          label={L('Writable')}
          defaultValue={data && data.writable}
          onChange={onChange}
          checkField={checkEL}
          labelField="id"
          valueField="value"
          itemList={[
            { id: 'True', value: '1' },
            { id: 'False', value: '0' }
          ]}
          style={ELStyle}
        />
        <Input
          id="indexOf"
          required={false}
          fieldName="indexOf"
          abbrFieldName={L('Sorting')}
          defaultValue={data && data.indexOf}
          onBlur={onChange}
          asyncCheck={checkEL}
          style={ELStyle}
        />
        <Input
          id="remark"
          required={false}
          fieldName="remark"
          abbrFieldName={L('Remark')}
          defaultValue={data && data.remark}
          onBlur={onChange}
          asyncCheck={checkEL}
          style={ELStyle}
        />
        {showExtend && (
          <>
            <Input
              id="foreignTable"
              required
              fieldName="foreignTable"
              abbrFieldName={L('Foreign Table')}
              defaultValue={data && data.foreignTable}
              onBlur={onChange}
              asyncCheck={checkEL}
              style={ELStyle}
            />
            <Input
              id="foreignKey"
              required
              fieldName="foreignKey"
              abbrFieldName={L('Foreign Key')}
              defaultValue={data && data.foreignKey}
              onBlur={onChange}
              asyncCheck={checkEL}
              style={ELStyle}
            />
            <Input
              id="foreignDisplayKey"
              required
              fieldName="foreignDisplayKey"
              abbrFieldName={L('Foreign Display Key')}
              defaultValue={data && data.foreignDisplayKey}
              onBlur={onChange}
              asyncCheck={checkEL}
              style={ELStyle}
            />
          </>
        )}
      </Content>
      <Actions disableSpacing>
        <Button
          color="secondary"
          variant="contained"
          className={classes.button}
          onClick={() => handleClose(false)}
        >
          Cancel
        </Button>
        <Button
          color="primary"
          variant="contained"
          className={classes.button}
          onClick={() => handleClose(true)}
        >
          Save
        </Button>
      </Actions>
    </Dialog>
  );
}
