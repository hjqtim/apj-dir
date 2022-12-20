const proUrl = {
  ver: process.env.REACT_APP_BASE_VER,
  aaa: process.env.REACT_APP_BASE_API,
  logging: process.env.REACT_APP_BASE_API,
  workflow: process.env.REACT_APP_BASE_API,
  resource: process.env.REACT_APP_BASE_API,
  camunda: process.env.REACT_APP_BASE_API,
  email: process.env.REACT_APP_BASE_API,
  project: process.env.REACT_APP_BASE_API,
  file: process.env.REACT_APP_BASE_API,
  webdp: process.env.REACT_APP_BASE_API,
  sync: process.env.REACT_APP_BASE_API,
  ipassign: process.env.REACT_APP_BASE_API,
  message: process.env.REACT_APP_BASE_API,
  resourcem: process.env.REACT_APP_BASE_API,
  gis: process.env.REACT_APP_BASE_API
};
const devUrl = {
  aaa: 'https://inbound-sense-dev.cldpaast71.server.ha.org.hk/AAA',
  logging: 'https://logging-service-sense-dev.cldpaast71.server.ha.org.hk',
  workflow: 'https://workflow-service-sense-dev.cldpaast71.server.ha.org.hk',
  resource: 'https://resource-management-dev-sense-dev.cldpaast71.server.ha.org.hk',
  camunda: 'https://camunda-services-sense-dev.cldpaast71.server.ha.org.hk',
  // webdp: 'https://webdp-service-dev-sense-dev.cldpaast71.server.ha.org.hk',
  file: 'https://file-service-dev-sense-dev.cldpaast71.server.ha.org.hk',
  email: 'https://email-service-dev-sense-dev.cldpaast71.server.ha.org.hk',
  project: 'https://project-service-dev-sense-dev.cldpaast71.server.ha.org.hk',
  timer: 'https://quartz-service-dev-sense-dev.cldpaast71.server.ha.org.hk',
  sync: 'https://data-sync-service-dev-sense-dev.cldpaast71.server.ha.org.hk',
  ipassign: 'https://ipassign-service-sense-dev.cldpaast71.server.ha.org.hk',
  message: 'https://message-service-sense-dev.cldpaast71.server.ha.org.hk',
  resourcem: 'https://resource-service-sense-dev.cldpaast71.server.ha.org.hk',
  gis: 'https://gis-service-sense-dev.cldpaast71.server.ha.org.hk',

  // aaa: "http://10.240.131.123:3003",
  // logging: "http://10.240.131.123:3002",
  // workflow: "http://10.240.131.123:3004",
  webdp: 'http://172.17.167.106:8083' // Jacky
  // webdp: 'http://172.17.167.105:8083' // ethan
  // webdp: 'http://172.17.167.103:8083' // ouyan
  // camunda: 'http://172.17.167.105:8080',
  // ipassign: 'http://172.17.167.105:8091'  //ethan
  // ipassign: 'http://172.17.167.119:8091', // kim
  // message: 'http://172.17.167.119:8092' // kim
  // message: 'http://172.17.167.109:8092' // yancy
  // resourcem: 'http://172.17.167.119:8065' // kim

  // email: 'http://172.17.167.115:8088',
  // project: 'http://172.17.167.104:8089',
  // file: 'http://172.17.167.106:8085'
  // timer: 'http://172.17.167.115:8089',
  // sync: 'http://172.17.167.104:8087'
};
// eslint-disable-next-line
export default process.env.REACT_APP_ENV === 'production' ? proUrl : devUrl;
