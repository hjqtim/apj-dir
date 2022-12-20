export function cloneMap1(map) {
  const res = new Map();
  map.forEach((key, value) => {
    res.set(key, value);
  });
  return res;
}

export function cloneSet1(set) {
  const res = new Set();
  set.forEach((item) => {
    res.add(item);
  });
  return res;
}
