const proPrefix = {
  aaa: '/AAA',
  logging: '/logging',
  workflow: '/workflow',
  resource: '/resource',
  camunda: '/camunda',
  email: '/email',
  file: '/file',
  project: '/project',
  webdp: '/webdp',
  timer: '/timer',
  sync: '/sync',
  ipassign: '/ipassign',
  message: '/message',
  resourcem: '/ResourceService',
  gis: '/gis/api'
};

const devPrefix = {
  aaa: '',
  logging: '',
  workflow: '',
  resource: '',
  camunda: '',
  email: '',
  file: '',
  project: '',
  webdp: '',
  timer: '',
  sync: '',
  ipassign: '',
  message: '',
  resourcem: '',
  gis: '/gis/api'
};

// eslint-disable-next-line
export default process.env.REACT_APP_ENV === 'production' ? proPrefix : devPrefix;
