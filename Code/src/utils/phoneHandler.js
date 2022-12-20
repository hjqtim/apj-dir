const phoneHandler = (phone, inputValue) => {
  // set phone empty
  if (inputValue.length === 0 || parseInt(inputValue, 10) < 1) {
    return '';
  }

  // set phone if the input value match phone format: length not gather than 8 and is integer
  // eslint-disable-next-line no-restricted-globals
  if (!isNaN(inputValue) && inputValue.length <= 8) {
    return inputValue;
  }

  // default return current input when the condition does not match above situations, e.g. the input value contains string
  return phone;
};

export default phoneHandler;
