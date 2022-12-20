import React, { useRef } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { IconButton } from '@material-ui/core';

import DeleteIcon from '@material-ui/icons/Delete';
import {
  Checkboxs,
  TextFields,
  Datepickers,
  List,
  Selects,
  InputCheck,
  Procedure
} from './compent';

const style = {
  paddingTop: '0.5rem',
  cursor: 'move',
  padding: '0rem 1rem',
  position: 'relative'
};

const GlobalComponent = {
  checkbox: Checkboxs,
  text: TextFields,
  date: Datepickers,
  list: List,
  select: Selects,
  inputCheck: InputCheck,
  procedure: Procedure
};

export const Card = ({ text, index, moveCard, deleteDom, state, chenckWhich, card }) => {
  const ComponentInfo = GlobalComponent[text];
  const ref = useRef(null);

  const [{ handlerId }, drop] = useDrop({
    accept: 'card',
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId()
      };
    },
    hover(item, monitor) {
      if (!ref.current) {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = index;
      // Don't replace items with themselves
      if (dragIndex === hoverIndex) {
        return;
      }
      // Determine rectangle on screen(确定屏幕上的矩形)
      const hoverBoundingRect = ref.current?.getBoundingClientRect();
      // Get vertical middle(得到垂直中间)
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      // Determine mouse position(确定鼠标位置)
      const clientOffset = monitor.getClientOffset();
      // Get pixels to the top(把像素放到顶部)
      const hoverClientY = clientOffset.y - hoverBoundingRect.top;
      // Only perform the move when the mouse has crossed half of the items height
      // When dragging downwards, only move when the cursor is below 50%
      // When dragging upwards, only move when the cursor is above 50%
      // Dragging downwards
      // 只有当鼠标越过物品高度的一半时才执行移动
      // 向下拖动时，只在光标低于50%时移动
      // 向上拖动时，只在光标超过50%时移动
      // 向下拖动
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }
      // Dragging upwards
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }
      // Time to actually perform the action
      moveCard(dragIndex, hoverIndex);
      // Note: we're mutating the monitor item here!
      // Generally it's better to avoid mutations,
      // but it's good here for the sake of performance
      // to avoid expensive index searches.
      item.index = hoverIndex;
    }
  });

  const [{ isDragging }, drag] = useDrag({
    item: { type: 'card', index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging()
    })
  });

  const opacity = isDragging ? 0.7 : 1;
  const ComponentWidth = card.inputType === 'checkbox' ? '100%' : '50%';

  drag(drop(ref));
  return (
    <div
      ref={ref}
      style={{ ...style, opacity, width: ComponentWidth }}
      data-handler-id={handlerId}
      onClick={() => {
        chenckWhich(index);
      }}
    >
      <ComponentInfo card={card} />
      {state ? (
        <div
          style={{
            cursor: 'pointer',
            position: 'absolute',
            right: '0',
            top: '-1rem'
          }}
          onClick={() => {
            deleteDom(index);
          }}
        >
          <IconButton aria-label="delete" style={{ color: '#f50057' }}>
            <DeleteIcon fontSize="small" />
          </IconButton>
        </div>
      ) : (
        <></>
      )}
    </div>
  );
};
