const getFundparty = (budgetHolder = {}) => {
  const { fundtransferredtohsteam, fundparty, paymentmethod, cardNo, COAoptions } = budgetHolder;

  if (parseInt(fundtransferredtohsteam) === 1) {
    return fundparty;
  }
  if (parseInt(fundtransferredtohsteam) === 2) {
    return 'LPool';
  }

  //   if (parseInt(fundtransferredtohsteam) === 0 && parseInt(paymentmethod) === 1) {
  //     const hasObj = COAoptions?.find((item) => item.erpinstitutionValue === parseInt(cardNo?.[0]));
  //     return hasObj?.erpparentCode || cardNo?.[0];
  //   }

  if (parseInt(fundtransferredtohsteam) === 0) {
    if (parseInt(paymentmethod) === 1) {
      const hasObj = COAoptions?.find((item) => item.erpinstitutionValue === parseInt(cardNo?.[0]));
      return hasObj ? hasObj.erpinstitutionCode : cardNo?.[0];
    }
    if (parseInt(paymentmethod) === 3) {
      return 'External';
    }
    if (parseInt(paymentmethod) === 2) {
      return 'Others';
    }
  }

  return '';
};

const getBudgetHolder = (budgetHolder = {}) => {
  const {
    fundtransferredtohsteam,
    paymentmethod,
    cardNo,
    budgetholdername,
    budgetholdertitle,
    budgetholderemail,
    budgetholderphone,
    budgetholderid,
    extbillcompanyname,
    extbillcontactname,
    extbillcontactphone,
    extbillcompanyadd,
    otherpaymentmethod
  } = budgetHolder;

  return {
    fundtransferredtohsteam,
    fundparty: getFundparty(budgetHolder),
    paymentmethod: parseInt(fundtransferredtohsteam) === 0 ? paymentmethod : '',
    chartofaccount:
      parseInt(fundtransferredtohsteam) === 0 && parseInt(paymentmethod) === 1
        ? cardNo?.join?.('-')
        : '',
    budgetholdername:
      parseInt(fundtransferredtohsteam) === 0 && parseInt(paymentmethod) === 1
        ? budgetholdername
        : '',
    budgetholdertitle:
      parseInt(fundtransferredtohsteam) === 0 && parseInt(paymentmethod) === 1
        ? budgetholdertitle
        : '',
    budgetholderemail:
      parseInt(fundtransferredtohsteam) === 0 && parseInt(paymentmethod) === 1
        ? budgetholderemail
        : '',
    budgetholderphone:
      parseInt(fundtransferredtohsteam) === 0 && parseInt(paymentmethod) === 1
        ? budgetholderphone
        : '',
    budgetholderid:
      parseInt(fundtransferredtohsteam) === 0 && parseInt(paymentmethod) === 1
        ? budgetholderid
        : '',
    extbillcompanyname:
      parseInt(fundtransferredtohsteam) === 0 && parseInt(paymentmethod) === 3
        ? extbillcompanyname
        : '',
    extbillcontactname:
      parseInt(fundtransferredtohsteam) === 0 && parseInt(paymentmethod) === 3
        ? extbillcontactname
        : '',
    extbillcontactphone:
      parseInt(fundtransferredtohsteam) === 0 && parseInt(paymentmethod) === 3
        ? extbillcontactphone
        : '',
    extbillcompanyadd:
      parseInt(fundtransferredtohsteam) === 0 && parseInt(paymentmethod) === 3
        ? extbillcompanyadd
        : '',
    otherpaymentmethod:
      parseInt(fundtransferredtohsteam) === 0 && parseInt(paymentmethod) === 2
        ? otherpaymentmethod
        : ''
  };
};

export default getBudgetHolder;
