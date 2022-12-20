import React, { useState, useCallback, forwardRef, useImperativeHandle, useEffect } from 'react';
import { useDrop } from 'react-dnd';
import update from 'immutability-helper';
import { Card } from './Card';

import { unForeignType, ForeignType } from './ComponentClass';

let thisindex = 0;

function getStyle() {
  return {
    // backgroundColor,
    // textAlign: "center",
    float: 'left',
    fontSize: '1rem',
    width: '100%',
    height: '100%'
  };
}

const style = {
  display: 'flex',
  flexWrap: 'wrap',
  width: '100%'
};

export const Dustbin = forwardRef(({ greedy, clickForm, dataList, formState }, ref) => {
  const [Data, setData] = useState([]);

  useEffect(() => {
    dataList && setData(dataList);
    dataList && dataList.length > 0 && chenckWhich(dataList.length, dataList);
    // eslint-disable-next-line
  }, [dataList]);

  // 移动项的时候触发的方法
  const moveCard = useCallback(
    (dragIndex, hoverIndex) => {
      console.log(Data);
      const dragCard = Data[dragIndex];
      setData(
        update(Data, {
          $splice: [
            [dragIndex, 1],
            [hoverIndex, 0, dragCard]
          ]
        })
      );
    },
    [Data]
  );

  // 删除
  const deleteDom = (index) => {
    Data.splice(index, 1);
    const newData = JSON.parse(JSON.stringify(Data));
    setData(newData);
  };

  useImperativeHandle(
    ref,
    () => ({
      innerFn: (key, value) => {
        if (Data.length === 0) return;
        Data[thisindex][key] = value;
        const innerFnData = JSON.parse(JSON.stringify(Data));
        setData(innerFnData);
      },
      Data
    }),
    [Data]
  );

  // 选中
  const chenckWhich = (index, dataList = []) => {
    let checkData = Data;
    if (dataList.length !== 0) {
      index = dataList.length - 1;
      checkData = dataList;
    }
    thisindex = index;
    if (checkData.length === 0) return;
    // checkData.map((item) => (item.state = false));
    checkData.forEach((item) => {
      item.state = false;
    });
    checkData[index] ? (checkData[index].state = true) : (checkData[index - 1].state = true);
    clickForm(checkData[index] ? checkData[index] : checkData[index - 1]);
    const StateData = JSON.parse(JSON.stringify(checkData));
    setData(StateData);
  };

  const renderCard = (card, index) => (
    <Card
      key={index}
      index={index}
      id={card.id}
      text={card.inputType}
      moveCard={moveCard}
      deleteDom={deleteDom}
      chenckWhich={chenckWhich}
      state={card.state}
      card={card}
    />
  );

  const [, drop] = useDrop(
    {
      accept: ['date', 'text', 'checkbox', 'list', 'select', 'inputCheck', 'procedure'],
      drop(item) {
        if (item.type === 'checkbox' || item.type === 'select') {
          Data.push(ForeignType(item.type));
        } else {
          Data.push(unForeignType(item.type));
        }
        chenckWhich(Data.length - 1);
      },
      collect: () => ({
        // monitor
        // isOver: monitor.isOver(),
        // isOverCurrent: monitor.isOver({ shallow: true }),
      })
    },
    [greedy, Data]
  );

  return (
    <div ref={drop} style={getStyle()}>
      <div
        style={{
          paddingLeft: '1.5rem',
          fontSize: '2rem',
          fontWeight: 600,
          lineHeight: '3rem',
          height: '3rem'
        }}
      >
        {formState ? 'Child Form Field' : 'Form Field'}
      </div>
      <div style={style}>{Data.map((card, i) => renderCard(card, i))}</div>
    </div>
  );
});
