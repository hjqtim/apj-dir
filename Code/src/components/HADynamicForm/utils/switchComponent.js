import React, { memo } from 'react';
import {
  Input,
  Select,
  SearchInput,
  CheckBox,
  SearchList,
  DatePicker,
  Procedure
} from '../Components/controless';
import formatField from '../../../utils/formatField';

const MemoInput = memo(Input);
const MemoSelect = memo(Select);
const ProcedureSelect = memo(Procedure);
const MemoSearchInput = memo(SearchInput);
const MemoCheckBox = memo(CheckBox);
const MemoSearchList = memo(SearchList);
const MemoDatePicker = memo(DatePicker);

/* eslint-disable no-nested-ternary */
const switchComponent = (el, i, logic, style, isParent) => {
  const field = formatField(el);
  switch (field.type) {
    case 'procedure':
      return (
        <ProcedureSelect
          key={`${field.id}_${i}`}
          {...field}
          onChange={
            logic ? (isParent ? logic.onParentFieldChange : logic.onChildFieldChange) : undefined
          }
          checkField={
            logic ? (isParent ? logic.checkParentField : logic.checkChildField) : undefined
          }
          style={style[field.fieldName] ? style[field.fieldName] : style.commonElement}
          isParent={isParent}
        />
      );
    case 'select':
      return (
        <MemoSelect
          key={`${field.id}_${i}`}
          {...field}
          onChange={
            logic ? (isParent ? logic.onParentFieldChange : logic.onChildFieldChange) : undefined
          }
          checkField={
            logic ? (isParent ? logic.checkParentField : logic.checkChildField) : undefined
          }
          style={style[field.fieldName] ? style[field.fieldName] : style.commonElement}
          isParent={isParent}
        />
      );
    case 'checkbox':
      return (
        <MemoCheckBox
          key={`${field.id}_${i}`}
          {...field}
          getCheckBoxStatus={logic ? logic.getCheckBoxStatus : undefined}
          onChange={
            logic ? (isParent ? logic.onParentFieldChange : logic.onChildFieldChange) : undefined
          }
          checkField={
            logic ? (isParent ? logic.checkParentField : logic.checkChildField) : undefined
          }
          style={style[field.fieldName] ? style[field.fieldName] : style.commonElement}
          isParent={isParent}
          getCurrentValue={logic ? logic.getCurrentValue : undefined}
        />
      );
    case 'inputCheck':
      return (
        <MemoSearchInput
          key={`${field.id}_${i}`}
          {...field}
          onBlur={
            logic ? (isParent ? logic.onParentFieldChange : logic.onChildFieldChange) : undefined
          }
          checkField={
            logic ? (isParent ? logic.checkParentField : logic.checkChildField) : undefined
          }
          asyncCheck={logic ? logic.asyncCheck : undefined}
          style={style[field.fieldName] ? style[field.fieldName] : style.commonElement}
          isParent={isParent}
          buttonText={field.buttonText}
          getDisplayName={logic.stepName !== 'create'}
        />
      );
    case 'list':
      return (
        <MemoSearchList
          key={`${field.id}_${i}`}
          {...field}
          onChange={
            logic ? (isParent ? logic.onParentFieldChange : logic.onChildFieldChange) : undefined
          }
          asyncCheck={logic ? logic.asyncCheck : undefined}
          style={style[field.fieldName] ? style[field.fieldName] : style.commonElement}
          isParent={isParent}
          buttonText={field.buttonText}
          getDisplayName={logic.stepName !== 'create'}
        />
      );
    case 'date':
      return (
        <MemoDatePicker
          key={`${field.id}_${i}`}
          {...field}
          onChange={
            logic ? (isParent ? logic.onParentFieldChange : logic.onChildFieldChange) : undefined
          }
          asyncCheck={logic ? logic.asyncCheck : undefined}
          style={style[field.fieldName] ? style[field.fieldName] : style.commonElement}
          isParent={isParent}
        />
      );
    default:
      return (
        <MemoInput
          key={`${field.id}_${i}`}
          {...field}
          asyncCheck={logic ? logic.asyncCheck : undefined}
          onBlur={
            logic ? (isParent ? logic.onParentFieldChange : logic.onChildFieldChange) : undefined
          }
          checkField={
            logic ? (isParent ? logic.checkParentField : logic.checkChildField) : undefined
          }
          style={style[field.fieldName] ? style[field.fieldName] : style.commonElement}
          isParent={isParent}
          placeholder={field.placeholder}
        />
      );
  }
};

export default switchComponent;
