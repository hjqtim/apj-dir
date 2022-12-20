import dayjs from 'dayjs';

const formatDateTime = (str, format) => dayjs(new Date(str)).format(format || 'DD-MMM-YYYY HH:mm');

export default formatDateTime;
