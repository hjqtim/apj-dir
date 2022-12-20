import React from 'react';

export default function ParentSubInfoTemplate(props) {
  const {
    id,
    code,
    budget_type,
    project_owner,
    contact_person,
    project_estimation,
    methodology_text
  } = props;
  return (
    <div
      id={id}
      style={{
        marginTop: '1vh',
        width: '100%',
        marginBottom: '1vh',
        fontSize: '16px',
        color: '#333333',
        lineHeight: '40px'
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          borderBottomStyle: 'solid',
          borderBottomWidth: '1px',
          borderBottomColor: '#CCC'
        }}
      >
        <div>{'Code: '}</div>
        <div>{code}</div>
      </div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          borderBottomStyle: 'solid',
          borderBottomWidth: '1px',
          borderBottomColor: '#CCC'
        }}
      >
        <div>{'Budget Type: '}</div>
        <div>{budget_type}</div>
      </div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          borderBottomStyle: 'solid',
          borderBottomWidth: '1px',
          borderBottomColor: '#CCC'
        }}
      >
        <div>{'Project Owner: '}</div>
        <div>{project_owner}</div>
      </div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          borderBottomStyle: 'solid',
          borderBottomWidth: '1px',
          borderBottomColor: '#CCC'
        }}
      >
        <div>{'Contact Person: '}</div>
        <div>{contact_person}</div>
      </div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          borderBottomStyle: 'solid',
          borderBottomWidth: '1px',
          borderBottomColor: '#CCC'
        }}
      >
        <div>{'Project Estimation: '}</div>
        <div>{project_estimation}</div>
      </div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          borderBottomStyle: 'solid',
          borderBottomWidth: '1px',
          borderBottomColor: '#CCC'
        }}
      >
        <div>{'Methodology Text: '}</div>
        <div>{methodology_text}</div>
      </div>
    </div>
  );
}
