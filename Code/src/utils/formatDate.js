import dayjs from 'dayjs';

const formatDate = (str, format) =>
  str ? dayjs(new Date(str)).format(format || 'YYYY-MM-DD') : str;

export default formatDate;
