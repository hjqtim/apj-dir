import expiryAPI from '../../../../api/expiry';

export function checkEmpty(key, value, name) {
  if (!value) {
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

export function checkFuture(value) {
  if (!value || Number.isNaN(new Date(value).getTime())) {
    return {
      error: true,
      msg: 'Invalid Date'
    };
  }
  const isFuture = new Date(value) - new Date() > 0;
  if (!isFuture) {
    return {
      error: true,
      msg: 'Accept future date only'
    };
  }
  return {
    error: false,
    msg: ''
  };
}

export function getCheckExist() {
  return async (id, tenantId) => {
    const { data } = await expiryAPI.checkExist({
      tenantId,
      id
    });
    if (data.data < 1) {
      return {
        error: false,
        msg: ''
      };
    }
    return {
      error: true,
      msg: 'This assign-user mapping is existed'
    };
  };
}
