const getDisplayName = (displayname) => {
  if (displayname?.split(',').length > 0) {
    return displayname?.split(',')[0];
  }
  return displayname;
};

export default getDisplayName;
