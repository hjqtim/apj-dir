import React, { memo, useEffect, useState, useRef } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { Button, DialogActions, Paper } from '@material-ui/core';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import { getQueryString } from '../../../../../utils/url';
import API from '../../../../../api/dynamicForm';
import Loading from '../../../../../components/Loading';
import CommonTip from '../../../../../components/CommonTip';
import { L } from '../../../../../utils/lang';
import { Input } from '../../../../../components/HADynamicForm/Components/controless';
import FieldTable from '../FieldTable';
import getStyle from '../../../../../utils/dynamicForm/style';

const MemoInput = memo(Input);
const MemoTable = memo(FieldTable);

const Actions = withStyles(() => ({
  root: {
    display: 'flex',
    height: '10vh',
    width: '100%',
    margin: '0',
    padding: '2vh 0',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: '1em'
  }
}))(DialogActions);

export default function Detail() {
  const { id } = useParams();
  const useStyles = makeStyles({
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
    }
  });
  const classes = useStyles();
  const history = useHistory();
  const queryString = getQueryString();
  const name = decodeURI(queryString.get('name'));

  const [map, setMap] = useState(new Map());

  const [isSelected, setIsSelected] = useState(false);

  const parentTableEl = useRef();
  const childTableEl = useRef();

  useEffect(() => {
    Loading.show();
    const initMap = new Map();
    API.workFlowDetail({ modelId: id })
      .then(({ data }) => {
        // if (!data || !data.data || !data.data.dynamicForm) {
        //   CommonTip.error(L('System busy'))
        //   return
        // }
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
    const parentRows = parentTableEl && parentTableEl.current ? parentTableEl.current.dataList : [];
    const childRows = childTableEl && childTableEl.current ? childTableEl.current.dataList : [];
    // const parentRows = map.get('parentRows')
    if (!parentRows.length) {
      CommonTip.error('From Field List can not be null');
      return;
    }
    if (isSelected) {
      const childFormKey = map.get('childFormKey');
      if (!childFormKey) {
        CommonTip.error('Child From Key is required');
        return;
      }
      // const childRows = map.get('childRows')
      if (!childRows.length) {
        CommonTip.error('Child From Field List can not be null');
        return;
      }
    }
    handleSave(parentRows, childRows);
  };

  const onClose = () => {
    history.push({ pathname: '/' });
  };

  return (
    <div>
      <Paper className={classes.container}>
        <div
          style={{
            margin: '2em 0 0 0',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <MemoInput
            id="parentFormKey"
            required
            fieldName="parentFormKey"
            abbrFieldName="Form Key"
            defaultValue={map.get('parentFormKey')}
            disabled={false}
            onBlur={onParentFormKeyChange}
            asyncCheck={checkParentFormKey}
            style={getStyle('').commonElement}
          />
          <div
            style={{
              minWidth: '140px',
              marginTop: '-2em'
            }}
          >
            <input
              type="checkbox"
              id="checkbox_hasChild"
              checked={isSelected}
              onChange={(e) => onCheckBoxChange(e)}
            />
            <label
              htmlFor="checkbox_hasChild"
              style={{
                fontSize: '1.1em'
              }}
            >
              Has Child Table
            </label>
          </div>
          {isSelected && (
            <MemoInput
              id="childFormKey"
              required
              fieldName="childFormKey"
              abbrFieldName="Child Form Key"
              defaultValue={map.get('childFormKey')}
              disabled={false}
              onBlur={onChildFormKeyChange}
              asyncCheck={checkChildFormKey}
              style={getStyle('').commonElement}
            />
          )}
        </div>
        <MemoTable
          ref={parentTableEl}
          tableTitle="Form Field List"
          initDataList={map.get('parentRows')}
        />
        {isSelected && <div style={{ height: '2em' }} />}
        <MemoTable
          ref={childTableEl}
          hide={!isSelected}
          tableTitle="Child Form Field List"
          initDataList={map.get('childRows')}
        />
        <Actions disableSpacing>
          <Button
            // color='primary'
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
        </Actions>
      </Paper>
    </div>
  );
}

function exchange(value) {
  if (typeof value === 'undefined' || value.constructor !== Boolean) return '';
  return value ? '1' : '0';
}

// function formatValue(list) {
//   list.forEach(item => {
//     for (let key in item) {
//       item[key] = { value: item[key] }
//     }
//   })
//   return list
// }
