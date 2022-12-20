import API from '../../../../api/vm';

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

export function checkEmptyAre(key, value) {
  if (!value) {
    return {
      error: true,
      msg: `${key} are required`
    };
  }
  return {
    error: false,
    msg: ''
  };
}

export function getCheckExist() {
  return async (id, value) => {
    const { data } = await API.checkSerialNumber(id, value);
    if (data.data < 1) {
      return {
        error: false,
        msg: ''
      };
    }
    return {
      error: true,
      msg: `'${value}' is already existed`
    };
  };
}
