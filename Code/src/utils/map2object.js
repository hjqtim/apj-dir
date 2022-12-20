export function map2object(strMap) {
  const obj = Object.create(null);
  strMap.forEach(([k, v]) => {
    obj[k] = v;
  });
  return obj;
}

export function map2object2(strMap) {
  const obj = Object.create(null);
  strMap.forEach((v, k) => {
    obj[k] = v;
  });
  return obj;
}

export function object2map(obj) {
  const res = new Map();
  if (!obj) return res;
  obj.forEach((key) => {
    res.set(key, obj[key]);
  });
  return res;
}

// 处理数据显示问题
export function map2Label(strMap) {
  strMap.forEach((str) => {
    str.readable = str.readable ? 'True' : 'False';
    str.required = str.required ? 'True' : 'False';
    str.showOnRequest = str.showOnRequest ? 'True' : 'False';
    str.writable = str.writable ? 'True' : 'False';
  });
  return strMap;
}

// 处理数据显示渲染
export function map2Values(strMap) {
  const boolData = ['readable', 'required', 'showOnRequest', 'writable'];
  const values = [];
  strMap.forEach((maps) => {
    const data = {};
    maps.forEach((str) => {
      const model = {
        id: str,
        label: maps[str],
        value: maps[str]
      };
      if (boolData.indexOf(str) > -1) {
        model.value = maps[str] === 'True' ? '1' : '0';
      }
      data[str] = model;
    });
    values.push(data);
  });
  return values;
}
