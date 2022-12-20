import React, { useState, useRef, useEffect, forwardRef, useImperativeHandle, memo } from 'react';
import HTML5Backend from 'react-dnd-html5-backend';
import { DndProvider } from 'react-dnd';
import AppsOutlinedIcon from '@material-ui/icons/AppsOutlined';
import { Scrollbars } from 'react-custom-scrollbars';
import { Button } from '@material-ui/core';
import ListAltOutlinedIcon from '@material-ui/icons/ListAltOutlined';
import AddToPhotosOutlinedIcon from '@material-ui/icons/AddToPhotosOutlined';
import { Dustbin } from './DynamicForm';
import { Checkbox } from './useDrags/Checkbox';
import { Text } from './useDrags/Text';
import { Datepickers } from './useDrags/Datepickers';
import { List } from './useDrags/List';
import { Select } from './useDrags/Select';
import { InputCheck } from './useDrags/InputCheck';
import { Procedure } from './useDrags/Procedure';
import Property from './TabProperty';
import { Input } from '../../../../components/HADynamicForm/Components/controless';
import getStyle from '../../../../utils/dynamicForm/style';
import { L } from '../../../../utils/lang';

const MemoInput = memo(Input);

const TestStyle = {
  BoxContent: {
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    height: '100%'
  },
  leftCheck: {
    overflow: 'hidden',
    clear: 'both',
    width: '16%',
    height: '100%',
    borderRight: '1px solid rgb(241,232,232)',
    display: 'flex',
    flexWrap: 'wrap',
    alignContent: 'flex-start'
  },
  leftCheckTitle: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    fontWeight: 400,
    fontSize: '1rem',
    padding: '0.5rem 0'
  },
  ChildForm: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    fontWeight: 400,
    fontSize: '1rem',
    margin: '1rem 0 0.5rem 0'
  },
  midContent: {
    overflow: 'hidden',
    height: '100%',
    clear: 'both',
    width: '68%',
    borderRight: '1px solid rgb(241,232,232)'
  },
  rightContent: {
    height: '100%',
    clear: 'both',
    width: '16%',
    padding: '0'
  }
};

function Dorpworking(props, ref) {
  const {
    initDataList,
    parentFormKey,
    checkParentFormKey,
    onParentFormKeyChange,
    onCheckBoxChange,
    isSelected,
    checkChildFormKey,
    onChildFormKeyChange,
    childFormKey,
    changeState,
    formState
  } = props;
  // const [value, setValue] = React.useState(0);

  // const handleChange = (event, newValue) => {
  //   setValue(newValue);
  // };
  const [dataList, setDataList] = useState([]);

  useEffect(() => {
    // initDataList && setDataList(initDataList);
    if (initDataList) setDataList(initDataList);
  }, [initDataList]);

  const DustbinEl = useRef();

  const [PropertyData, setPropertyData] = useState([]);

  const clickForm = (PropertyDatas) => {
    setPropertyData(PropertyDatas);
  };

  const AllProperty = (key, value) => {
    console.log(key, value);
    DustbinEl.current.innerFn(key, value);
  };
  useImperativeHandle(ref, () => ({
    getFormList: () => DustbinEl.current.Data
  }));

  const changeForm = () => {
    changeState();
  };

  return (
    <>
      <DndProvider backend={HTML5Backend}>
        <div style={TestStyle.BoxContent}>
          <Scrollbars style={TestStyle.leftCheck}>
            <div style={TestStyle.leftCheckTitle}>
              <ListAltOutlinedIcon style={{ marginRight: '0.5rem' }} />
              <div>Form Value</div>
            </div>
            {formState ? (
              <MemoInput
                id="childFormKey"
                required
                fieldName="childFormKey"
                abbrFieldName="Child Form Key"
                defaultValue={childFormKey}
                disabled={false}
                onBlur={onChildFormKeyChange}
                asyncCheck={checkChildFormKey}
                style={getStyle('Test').commonElementForCamunda}
              />
            ) : (
              <MemoInput
                id="parentFormKey"
                required
                fieldName="parentFormKey"
                abbrFieldName="Form Key"
                defaultValue={parentFormKey}
                disabled={false}
                onBlur={onParentFormKeyChange}
                asyncCheck={checkParentFormKey}
                style={getStyle('Test').commonElementForCamunda}
              />
            )}
            <div style={TestStyle.leftCheckTitle}>
              <AppsOutlinedIcon style={{ marginRight: '0.5rem' }} />
              <div>Component library </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <Text />
              <Datepickers />
              <Checkbox />
              <List />
              <Select />
              <InputCheck />
              <Procedure />
            </div>
            <div style={TestStyle.ChildForm}>
              <AddToPhotosOutlinedIcon style={{ marginRight: '0.5rem' }} />
              <div>Child Form</div>
            </div>
            <div
              style={{
                minWidth: '140px'
              }}
            >
              <input
                type="checkbox"
                id="checkbox_hasChild"
                checked={isSelected}
                onChange={(e) => onCheckBoxChange(e)}
              />
              {/* <label
                htmlFor="checkbox_hasChild"
                style={{
                  fontSize: '1.1em'
                }}
              >
                Has Child Table
              </label> */}
              {isSelected && (
                <Button
                  variant="contained"
                  style={{
                    width: '7vw',
                    margin: '0.5vw 1vw',
                    color: '#333',
                    backgroundColor: '#eee'
                  }}
                  onClick={changeForm}
                >
                  {L('ChangeForm')}
                </Button>
              )}
            </div>
          </Scrollbars>
          <Scrollbars style={TestStyle.midContent}>
            <Dustbin
              ref={DustbinEl}
              dataList={dataList}
              clickForm={(formData) => {
                clickForm(formData);
              }}
              formState={formState}
            />
          </Scrollbars>
          <div style={TestStyle.rightContent}>
            <Property
              AllProperty={(key, value) => {
                AllProperty(key, value);
              }}
              PropertyData={PropertyData}
            />
          </div>
        </div>
      </DndProvider>
    </>
  );
}

export default forwardRef(Dorpworking);
