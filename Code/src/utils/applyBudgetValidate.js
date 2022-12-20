// DP、AP申请时验证budget holder
const budgetValidate = (budgetHolder = {}) => {
  const {
    fundtransferredtohsteam,
    fundparty,
    paymentmethod,
    cardNo,
    budgetholderid,
    budgetholderemail,
    budgetholderphone,
    extbillcompanyname,
    extbillcontactname,
    extbillcontactphone,
    extbillcompanyadd,
    otherpaymentmethod
  } = budgetHolder;

  //   如果没有选择,允许通过
  if (
    fundtransferredtohsteam === '' ||
    fundtransferredtohsteam === undefined ||
    fundtransferredtohsteam === null
  ) {
    return false;
  }

  if (parseInt(fundtransferredtohsteam) === 1 && fundparty) {
    return false;
  }
  if (parseInt(fundtransferredtohsteam) === 2) {
    return false;
  }
  if (parseInt(fundtransferredtohsteam) === 0) {
    if (
      parseInt(paymentmethod) === 1 &&
      cardNo?.join?.('')?.trim()?.length === 25 &&
      budgetholderid &&
      budgetholderemail &&
      budgetholderphone?.length === 8
    ) {
      return false;
    }

    if (
      parseInt(paymentmethod) === 3 &&
      extbillcompanyname &&
      extbillcontactname &&
      extbillcontactphone?.length === 8 &&
      extbillcompanyadd
    ) {
      return false;
    }
    if (parseInt(paymentmethod) === 2 && otherpaymentmethod) {
      return false;
    }
  }
  return true;
};

export default budgetValidate;
