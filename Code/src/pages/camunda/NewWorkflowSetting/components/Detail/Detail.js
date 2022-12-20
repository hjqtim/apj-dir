import React, { useEffect, useState, useRef } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { Button, Paper } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { getQueryString } from '../../../../../utils/url';
import API from '../../../../../api/dynamicForm';
import Loading from '../../../../../components/Loading';
import CommonTip from '../../../../../components/CommonTip';
import { L } from '../../../../../utils/lang';
import Dorpworking from '../../react-dnd/dorpworking';
// import getStyle from "../../../../../utils/dynamicForm/style"
// const MemoInput = memo(Input)
// const MemoTable = memo(FieldTable)

export default function Detail() {
  const { id } = useParams();
  const useStyles = makeStyles(() => ({
    container: {
      backgroundColor: '#fff',
      borderRadius: '1em',
      marginTop: '1em',
      width: '85%',
      maxWidth: '1200px',
      minHeight: '60vh',
      padding: '1em 1em 1em 1em',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-start'
    },
    heardPages: {
      display: 'flex',
      flexWrap: 'wrap',
      '& > *': {
        height: '32rem',
        padding: '0.5rem',
        borderRadius: '0.5rem'
      }
    },
    bottomPages: {
      display: 'flex',
      flexWrap: 'wrap',
      '& > *': {
        display: 'flex',
        height: '4rem',
        width: '100%',
        marginTop: '0.5rem',
        alignItems: 'center',
        justifyContent: 'center'
      }
    }
  }));
  const classes = useStyles();
  const history = useHistory();
  const queryString = getQueryString();
  const name = decodeURI(queryString.get('name'));

  const [map, setMap] = useState(new Map());

  const [isSelected, setIsSelected] = useState(false);

  const [formState, setFormState] = useState(false);

  const DorpworkingEl = useRef();

  useEffect(() => {
    Loading.show();
    const initMap = new Map();
    API.workFlowDetail({ modelId: id })
      .then(({ data }) => {
        // if (!data || !data.data || !data.data.dynamicForm) {
        //   CommonTip.error(L('System busy'))
        //   return
        // }
        console.log(data.data);
        const { parentTableList, childDynamicForm, childTableList } = data.data;
        parentTableList.forEach((el) => {
          el.showOnRequest = exchange(el.showOnRequest);
          el.required = exchange(el.required);
          el.readable = exchange(el.readable);
          el.writable = exchange(el.writable);
        });
        const { childVersion, formKey } = data.data.dynamicForm;
        initMap.set('parentFormKey', formKey);
        initMap.set('parentRows', parentTableList);
        initMap.set('childVersion', parseInt(childVersion) + 1);
        if (childDynamicForm) {
          const { formKey } = childDynamicForm;
          setIsSelected(true);
          childTableList.forEach((el) => {
            el.showOnRequest = exchange(el.showOnRequest);
            el.required = exchange(el.required);
            el.readable = exchange(el.readable);
            el.writable = exchange(el.writable);
          });
          initMap.set('childFormKey', formKey);
          initMap.set('childRows', childTableList);
        }
      })
      .finally(() => {
        setMap(initMap);
        Loading.hide();
      })
      .catch((e) => {
        console.log(e);
        Loading.hide();
      });
    // eslint-disable-next-line
  }, [id]);

  const onParentFormKeyChange = (_, value) => {
    map.set('parentFormKey', value);
  };

  const onChildFormKeyChange = (_, value) => {
    map.set('childFormKey', value);
  };

  const checkParentFormKey = async () => {
    let error = false;
    let message = '';
    if (!map.get('parentFormKey')) {
      error = true;
      message = 'Form Key is required';
    }
    return { error, message };
  };

  const checkChildFormKey = async () => {
    let error = false;
    let message = '';
    if (!map.get('childFormKey')) {
      error = true;
      message = 'Child Form Key is required';
    }
    return { error, message };
  };

  const onCheckBoxChange = (e) => {
    setIsSelected(e.target.checked);
    if (!e.target.checked) {
      setFormState(e.target.checked);
    }
  };

  const handleSave = (parentRows, childRows) => {
    const form = {
      modelId: id,
      workflowName: name,
      parentFormKey: map.get('parentFormKey'),
      parentValues: parentRows,
      childVersion: map.get('childVersion') || 1,
      selectChild: isSelected,
      childValues: childRows,
      childFormKey: map.get('childFormKey')
    };
    Loading.show();
    API.createWorkFlow(form)
      .then(({ data }) => {
        if (data) {
          CommonTip.success(L('Success'));
          onClose();
          Loading.hide();
        }
      })
      .catch((e) => {
        console.log(e);
        Loading.hide();
      });
  };

  const handleCheck = () => {
    const parentFormKey = map.get('parentFormKey');
    if (!parentFormKey) {
      CommonTip.error('From Key is required');
      return;
    }

    let childRows = map.get('childRows');

    let parentRows = map.get('parentRows');

    formState
      ? (childRows = DorpworkingEl.current.getFormList())
      : (parentRows = DorpworkingEl.current.getFormList());

    if (childRows) {
      childRows.filter((item, i) => {
        item.indexOf = i + 1;
        return item;
      });
    }

    if (parentRows) {
      parentRows.filter((item, i) => {
        item.indexOf = i + 1;
        return item;
      });
    }

    handleSave(parentRows, childRows);
  };

  const onClose = () => {
    history.push({ pathname: '/' });
  };

  const parentRowsState = () => {
    const NewParentRpwState = map.get('parentRows') ? map.get('parentRows') : [];
    if (NewParentRpwState) {
      NewParentRpwState.forEach((item) => {
        item.state = false;
      });
    }
    return NewParentRpwState;
  };

  const childRowsState = () => {
    const NewchildRowsState = map.get('childRows') ? map.get('childRows') : [];
    if (NewchildRowsState) {
      NewchildRowsState.forEach((item) => {
        item.state = false;
      });
    }
    return NewchildRowsState;
  };

  const changeState = () => {
    formState
      ? map.set('childRows', DorpworkingEl.current.getFormList())
      : map.set('parentRows', DorpworkingEl.current.getFormList());
    setFormState(!formState);
  };

  return (
    <div>
      <div className={classes.heardPages}>
        <Paper elevation={3} style={{ width: '100%' }}>
          <Dorpworking
            initDataList={formState ? childRowsState : parentRowsState}
            ref={DorpworkingEl}
            parentFormKey={map.get('parentFormKey')}
            onParentFormKeyChange={onParentFormKeyChange}
            checkParentFormKey={checkParentFormKey}
            isSelected={isSelected}
            onCheckBoxChange={onCheckBoxChange}
            childFormKey={map.get('childFormKey')}
            onChildFormKeyChange={onChildFormKeyChange}
            checkChildFormKey={checkChildFormKey}
            changeState={changeState}
            formState={formState}
          />
        </Paper>
      </div>

      <div className={classes.bottomPages}>
        <Paper elevation={3}>
          <Button
            variant="contained"
            style={{
              width: '5vw',
              marginLeft: '1vw',
              marginRight: '1vw',
              color: '#fff',
              backgroundColor: '#4CAF50'
            }}
            onClick={handleCheck}
          >
            {L('Submit')}
          </Button>
          <Button
            variant="contained"
            style={{
              width: '5vw',
              marginLeft: '1vw',
              marginRight: '1vw',
              color: '#333',
              backgroundColor: '#eee'
            }}
            onClick={onClose}
          >
            {L('Cancel')}
          </Button>
        </Paper>
      </div>
    </div>
  );
}

function exchange(value) {
  if (typeof value === 'undefined' || value.constructor !== Boolean) return '';
  return value ? '1' : '0';
}
