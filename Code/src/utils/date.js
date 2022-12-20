const getDate = () => {
  const date = new Date();
  const globalDate = date.toDateString();
  const dataArray = globalDate.split(' ');
  const week = getDayName(dataArray[0]);
  const mon = getMonName(dataArray[1]);
  const newDate = { week, mon, day: dataArray[2], year: dataArray[3] };
  return newDate;
};

const getDayName = (str) => {
  const dayName = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const name = dayName.filter((name) => {
    if (name.indexOf(str) !== -1) {
      return name;
    }
    return '';
  });
  return name[0];
};

const getMonName = (str) => {
  const monName = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
  ];
  const name = monName.filter((name) => {
    if (name.indexOf(str) !== -1) {
      return name;
    }
    return '';
  });
  return name[0];
};

const getDateChina = (param) => {
  const yy = new Date(param).getFullYear();
  const mm = new Date(param).getMonth() + 1;
  const dd = new Date(param).getDate();
  return `${yy}-${mm}-${dd}`;
};

const getToday = () => {
  const date = new Date();
  const yy = date.getFullYear();
  const mm = date.getMonth() + 1;
  const dd = date.getDate();
  return `${yy}/${mm}/${dd}`;
};

const getDayNumber = () => {
  const date = new Date();
  const yy = date.getFullYear();
  const mm = date.getMonth() + 1;
  const dd = date.getDate();
  return `${yy}${mm}${dd}`;
};

const getDayNumber01 = () => {
  const date = new Date();
  const yy = date.getFullYear();
  const mm = date.getMonth() + 1;
  const dd = date.getDate();
  const HH = date.getHours();
  const MM = date.getMinutes();
  const SS = date.getSeconds();
  return `${yy}${mm}${dd}${HH}${MM}${SS}`;
};

export { getDate, getDayName, getMonName, getDateChina, getToday, getDayNumber, getDayNumber01 };
