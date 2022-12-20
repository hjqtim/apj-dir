import React from 'react';

function RequireField() {
  return (
    <div
      style={{
        float: 'right',
        textAlign: 'right',
        width: '100%',
        lineHeight: '14px',
        height: '14px',
        fontSize: '14px',
        userSelect: 'none'
      }}
    >
      Field with <font color="red">*</font> remark is required
    </div>
  );
}

export default RequireField;
