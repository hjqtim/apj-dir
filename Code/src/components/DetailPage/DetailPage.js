import React from 'react';
import CommonForm from '../CommonForm';

function DetailPage(props) {
  const {
    // formTitle,
    formFieldList,
    errorFieldList,
    onFormFieldChange,
    showBtn,
    onBtnClick,
    onFormFieldBlur,
    showRequiredField
  } = props;

  return (
    <>
      <CommonForm
        // formTitle={formTitle}
        formTitle=""
        formFieldList={formFieldList}
        errorFieldList={errorFieldList}
        onFormFieldChange={onFormFieldChange}
        showBtn={showBtn}
        onBtnClick={onBtnClick}
        onFormFieldBlur={onFormFieldBlur}
        showRequiredField={showRequiredField}
      />
    </>
  );
}

export default DetailPage;
