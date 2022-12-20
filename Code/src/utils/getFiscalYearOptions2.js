const getFiscalYearOptions = () => {
  const fullYear = new Date().getFullYear();
  const shortYear = Number(fullYear.toString().slice(2));
  const options = [
    { label: `${shortYear - 2}${shortYear - 1}`, value: `${shortYear - 2}${shortYear - 1}` },
    { label: `${shortYear - 1}${shortYear}`, value: `${shortYear - 1}${shortYear}` },
    { label: `${shortYear}${shortYear + 1}`, value: `${shortYear}${shortYear + 1}` },
    { label: `${shortYear + 1}${shortYear + 2}`, value: `${shortYear + 1}${shortYear + 2}` },
    { label: `${shortYear + 2}${shortYear + 3}`, value: `${shortYear + 2}${shortYear + 3}` }
  ];
  return options;
};

export default getFiscalYearOptions;
