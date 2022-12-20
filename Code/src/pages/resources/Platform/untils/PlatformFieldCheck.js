import API from '../../../../api/platform';

export function checkEmpty(key, value) {
  if (!value) {
    const name = key === 'name' ? 'Name' : 'Type';
    return {
      error: true,
      msg: `${name} is required`
    };
  }
  return {
    error: false,
    msg: ''
  };
}

export function getCheckExist() {
  return async (id, value) => {
    const { data } = await API.checkName(id, value);
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
