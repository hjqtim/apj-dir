function unForeignType(inputType) {
  return {
    deletedAt: '',
    fieldDisplayName: 'defaultFieldDisplayName',
    fieldName: 'defaultFieldName',
    fieldType: 'string',
    inputType,
    readable: '1',
    remark: '',
    required: '0',
    showOnRequest: '1',
    writable: '1',
    state: false
  };
}

function ForeignType(inputType) {
  return {
    deletedAt: '',
    fieldDisplayName: 'defaultFieldDisplayName',
    fieldName: 'defaultFieldName',
    fieldType: 'string',
    inputType,
    readable: '0',
    remark: '',
    required: '0',
    showOnRequest: '0',
    writable: '0',
    state: false,
    foreignDisplayKey: 'type',
    foreignKey: 'id',
    foreignTable: 'yes_no'
  };
}

export { unForeignType, ForeignType };
