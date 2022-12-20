import ADGroupApi from '../../../../api/adGroup';

export function checkEmpty(key, value) {
  if (!value) {
    return {
      error: true,
      msg: 'Name is required'
    };
  }
  return {
    error: false,
    msg: ''
  };
}

export function getCheckExist() {
  return async (id, value) => {
    const { data } = await ADGroupApi.checkName(id, value);
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
