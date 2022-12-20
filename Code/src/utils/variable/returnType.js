const U = {
  users: true,
  members: false,
  dl: false
};

const M = {
  users: false,
  members: true,
  dl: false
};

const D = {
  users: false,
  members: false,
  dl: true
};

const UD = {
  user: true,
  members: false,
  dl: true
};

const returnType = {
  U,
  M,
  D,
  UD
};
export default returnType;
