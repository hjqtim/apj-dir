class Path {
  getQueryString(str) {
    const query = str.split('?')[1];
    const items = query.split('&');
    const result = {};
    let arr = '';

    for (let i = 0; i < items.length; i += 1) {
      arr = items[i].split('=');
      const [a, b] = arr;
      result[a] = b;
    }
    return result;
  }
}

export default new Path();
