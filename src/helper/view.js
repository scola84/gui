const views = {};

function getView(name) {
  return views[name];
}

function setView(name, view) {
  views[name] = view;
  return view;
}

export {
  getView,
  setView
};
