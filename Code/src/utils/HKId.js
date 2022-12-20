export default class HKId {
  constructor(id) {
    this.id = id;
    this.modifyId = this.getModifyId();
    this.rawLength = this.id.toString().length;
    this.length = this.getIdArray().length;
    this.correct = this.verification();
  }

  getModifyId() {
    return this.id.toString().replace(/[^a-zA-z0-9]/g, '');
  }

  getIdArray() {
    return Array.from(this.modifyId);
  }

  bracketCheck() {
    const otherLength = this.rawLength - this.length;
    if (otherLength !== 0 && otherLength !== 2) return false;
    const indexA = this.id.toString().indexOf('(');
    const indexB = this.id.toString().indexOf(')');
    if (indexA * indexB < 0) return false;
    return !(otherLength === 2 && (indexA !== this.rawLength - 3 || indexB !== this.rawLength - 1));
  }

  verification() {
    if (!this.bracketCheck()) return false;
    const idArray = this.getIdArray();
    switch (idArray.length) {
      case 8:
        return this.v8();
      case 9:
        return this.v9();
      default:
        return false;
    }
  }

  v8() {
    if (!/[a-zA-z]+([0-9]{6})+[a-zA-z0-9]/.test(this.modifyId)) return false;
    let _0 = this.modifyId[0].charCodeAt(0);
    if (_0 >= 97) _0 -= 32;
    const converted = _0 - 64;
    const productNum = this.getProductNum([converted]);
    const checkChar = getCheckChar(productNum);
    return this.modifyId[7].toUpperCase() === checkChar;
  }

  v9() {
    if (!/([a-zA-z]{2})+([0-9]{6})+[a-zA-z0-9]/.test(this.modifyId)) return false;
    let _0 = this.modifyId[0].charCodeAt(0);
    if (_0 >= 97) _0 -= 32;
    let _1 = this.modifyId[1].charCodeAt(0);
    if (_1 >= 97) _1 -= 32;
    const converted0 = _0 - 55;
    const converted1 = _1 - 55;
    const productNum = this.getProductNum([converted0, converted1]);
    const checkChar = getCheckChar(productNum);
    return this.modifyId[8].toUpperCase() === checkChar;
  }

  getProductNum(convertedList) {
    let productNum = 0;
    let numList;
    if (convertedList.length === 2) {
      numList = this.getIdArray().slice(2).slice(0, -1);
      productNum += 9 * convertedList[0] + 8 * convertedList[1];
    } else {
      numList = this.getIdArray().slice(1).slice(0, -1);
      productNum += 8 * convertedList[0];
    }
    productNum +=
      parseInt(numList[0]) * 7 +
      parseInt(numList[1]) * 6 +
      parseInt(numList[2]) * 5 +
      parseInt(numList[3]) * 4 +
      parseInt(numList[4]) * 3 +
      parseInt(numList[5]) * 2;
    return productNum;
  }
}

function getCheckChar(productNum) {
  const remainder = productNum % 11;
  let check = '0';
  if (remainder !== 0) {
    check = (11 - remainder).toString();
  }
  if (check === '10') {
    check = 'A';
  }
  return check;
}
