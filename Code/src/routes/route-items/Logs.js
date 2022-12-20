import getIcons from '../../utils/getIcons';
import LogsList from '../../pages/logs/Log';

const Logs = {
  id: 'Logs',
  name: 'Logs',
  path: '/logs',
  icon: getIcons('logsServiceIcon'),
  component: LogsList,
  children: null
  // children: [
  //   {
  //     name: 'Logs',
  //     path: '/logs/logsList',
  //     component: LogsList
  //   }
  // ]
};

export default Logs;
