let register = {};

function views(value) {
  register = value;
  return register;
}

function view(name) {
  return register[name];
}

export {
  view,
  views
};
