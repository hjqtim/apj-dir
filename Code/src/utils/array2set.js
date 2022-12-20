function array2set(array) {
  const res = new Set();
  array.forEach((el) => {
    res.add(el);
  });
  return res;
}

export default array2set;
