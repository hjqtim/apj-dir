const getFiscalYearOptions = () => {
  const fullYear = new Date().getFullYear();
  const shortYear = Number(fullYear.toString().slice(2));
  const options = [
    { label: `${fullYear - 1}/${shortYear}`, value: `${shortYear - 1}${shortYear}` },
    { label: `${fullYear}/${shortYear + 1}`, value: `${shortYear}${shortYear + 1}` },
    { label: `${fullYear + 1}/${shortYear + 2}`, value: `${shortYear + 1}${shortYear + 2}` }
  ];
  return options;
};

export default getFiscalYearOptions;
