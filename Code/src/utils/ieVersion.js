function getIEVersion() {
  const userAgent = navigator.userAgent;
  const isIE = userAgent.indexOf('compatible') > -1 && userAgent.indexOf('MSIE') > -1;
  const isEdge = userAgent.indexOf('Edge') > -1 && !isIE;
  const isIE11 = userAgent.indexOf('Trident') > -1 && userAgent.indexOf('rv:11.0') > -1;
  if (isIE) {
    // const reIE = new RegExp("MSIE (\\d+\\.\\d+);")
    // reIE.test(userAgent)
    const fIEVersion = parseFloat(RegExp.$1);
    if (fIEVersion === 7) {
      return 7;
    }
    if (fIEVersion === 8) {
      return 8;
    }
    if (fIEVersion === 9) {
      return 9;
    }
    if (fIEVersion === 10) {
      return 10;
    }
    return 6; // IE版本<=7
  }
  if (isEdge) {
    return 'edge'; // edge
  }
  if (isIE11) {
    return 11; // IE11
  }
  return -1; // 不是ie浏览器
}

export default getIEVersion;
