import dayjs from 'dayjs';

class IPAddrItem {
  id = '';

  key = Date.now().toString(36) + Math.random().toString(36).substr(2);

  purpose = '';

  ipType = '';

  defaultIPType = '';

  ipNumber = 1;

  remarks = '';

  equpType = '';

  appType = '';

  computerName = '';

  macAddress = '';

  isPerm = 'Perm';

  releaseDate = dayjs(new Date()).format('YYYY-MM-DD');

  completeDate = dayjs(new Date()).format('YYYY-MM-DD');

  dataPortId = '';

  block = '';

  floor = '';

  room = '';
}

export default IPAddrItem;
