import API from '../../../../api/tenantQuotaMapping';

export function checkEmpty(key, value) {
  if (!value) {
    return {
      error: true,
      msg: `${key} is required`
    };
  }
  return {
    error: false,
    msg: ''
  };
}

export function getCheckExist() {
  return async (id, value) => {
    const { tenantId, year, type } = value;
    const { data } = await API.checkExist(id, tenantId, year, type);
    if (data.data < 1) {
      return {
        error: false,
        msg: ''
      };
    }
    return {
      error: true,
      msg: 'This type is already existed'
    };
  };
}

export function checkYear(year) {
  const reg = /^[2][0-9]{3}$/;
  if (!reg.test(year)) {
    return {
      error: true,
      msg: 'Invalid Year'
    };
  }
  return {
    error: false,
    msg: ''
  };
}
