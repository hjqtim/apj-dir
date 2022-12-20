import API from '../../../../api/IPAssignment';

export function checkEmpty(key, value) {
  if (!value) {
    const name = key === 'ip' ? 'IP' : 'DC';
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
    const { data } = await API.checkIpExist({ id, IP: value });
    if (data.data < 1) {
      return {
        error: false,
        msg: ''
      };
    }
    return {
      error: true,
      msg: 'This IP is already existed'
    };
  };
}
