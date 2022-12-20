const getCurrentPage = () => {
  let { pathname } = window.location;
  if (pathname[pathname.length - 1] !== '/') {
    pathname += '/';
  }
  const slicePathName = pathname.slice(1, -1).split('/');
  let rootName;
  let pageName;
  if (slicePathName.length === 1) {
    [{ rootName, pageName }] = slicePathName;
  } else {
    [rootName, pageName] = slicePathName;
  }
  const module = window.location.hash.split('/')[1];
  let moduleName;
  switch (module) {
    case 'create':
      moduleName = 'Create';
      break;
    case 'detail':
      moduleName = 'Detail';
      break;
    case 'update':
      moduleName = 'Update';
      break;
    case 'step':
      moduleName = 'Step';
      break;
    default:
      moduleName = 'List';
  }
  return { rootName, pageName, moduleName };
};

const getQueryString = () => {
  const { href } = window.location;
  const queryString = new Map();
  const query = href.split('?')[1];
  if (!query) {
    return queryString;
  }
  const queryList = query.split('&');

  queryList.forEach((query) => {
    let [key, value] = query.split('=');
    key = key.trim();
    value = value.trim();
    queryString.set(key, value);
  });
  return queryString;
};

export { getCurrentPage, getQueryString };
