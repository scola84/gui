import { Router } from '@scola/worker';
import { Route } from '../../object';

const routers = {};

export class StateRouter extends Router {
  static handle(box, data, route) {
    route = Route.parse(route);
    routers[route.slf ? box.name : route.name].handle(route, data);
  }

  constructor(options = {}) {
    super(options);

    this._base = null;
    this._default = null;
    this._global = null;
    this._history = null;
    this._name = null;
    this._stash = null;
    this._storage = null;

    this.setBase(options.base);
    this.setDefault(options.default);
    this.setGlobal(options.global);
    this.setHistory(options.history);
    this.setName(options.name);
    this.setStash(options.stash);
    this.setStorage(options.storage);

    this.loadHistory();

    routers[this._name] = this;
  }

  getBase() {
    return this._base;
  }

  setBase(value = null) {
    this._base = value;
    return this;
  }

  getDefault() {
    return this._default;
  }

  setDefault(value = null) {
    this._default = value;
    return this;
  }

  getGlobal() {
    return this._global;
  }

  setGlobal(value = window) {
    this._global = value;
    return this;
  }

  getHistory() {
    return this._history;
  }

  setHistory(value = []) {
    this._history = value;
    return this;
  }

  getName() {
    return this._name;
  }

  setName(value = null) {
    this._name = value;
    return this;
  }

  getStash() {
    return this._stash;
  }

  setStash(value = null) {
    this._stash = value;
    return this;
  }

  getStorage() {
    return this._storage;
  }

  setStorage(value = sessionStorage) {
    this._storage = value;
    return this;
  }

  act(box, data, callback) {
    if (this._base.busy === true) {
      return;
    }

    this._base.busy = true;

    box = this.processHistory(box);
    box = this.processBackward(box);

    const routes = this.parseHash();

    if (box.path === null) {
      this.processDelete(box, routes);
    } else if (
      typeof this._workers[box.path] === 'undefined' ||
      typeof routes[this._name] === 'undefined'
    ) {
      this.processDefault(box, routes);
    } else {
      this.processRoute(box, routes, box);
    }

    this.formatHash(routes);
    this.processForward(box);

    this.pass(box.path, box, data, callback);
  }

  formatHash(routes) {
    const names = Object.keys(routes);
    let hash = '#';

    for (let i = 0; i < names.length; i += 1) {
      hash += '/' + routes[names[i]].format();
    }

    this._global.history.replaceState({}, '', hash);
  }

  loadHistory() {
    this._history = JSON.parse(
      this._storage.getItem('route-' + this._name) || '[]'
    ).map((route) => Route.parse(route));
  }

  parseHash() {
    const hash = this._global.location.hash;

    let parts = hash.slice(2).split('/');
    parts = parts.filter((part) => part);

    const routes = {};
    let route = null;

    for (let i = 0; i < parts.length; i += 1) {
      route = Route.parse(parts[i]);
      routes[route.name] = route;
    }

    return routes;
  }

  processBackward(box) {
    if (box.options.bwd === false) {
      return box;
    }

    if (this._history.length <= 1) {
      return box;
    }

    const current = this._history.pop();
    const previous = this._history.pop();

    if (current.options.mem || previous.options.mem) {
      return previous;
    }

    return box;
  }

  processDefault(box, routes) {
    const path = box.options.def || this._default;

    if (path !== null) {
      this.processRoute(box, routes, { path });
    }
  }

  processDelete(box, routes) {
    delete routes[this._name];
  }

  processForward(box) {
    if (box.options.bwd === true) {
      return;
    }

    if (box.options.clr === true) {
      this._history = [];
    }

    if (box.path) {
      this._history.push(box);
    }

    this.saveHistory();
  }

  processHistory(box) {
    if (box.options.his === false) {
      return box;
    }

    if (this._history.length === 0) {
      return box;
    }

    return this._history.pop();
  }

  processRoute(box, routes, from) {
    routes[this._name] = new Route({
      base: this._base,
      name: this._name,
      options: from.options,
      params: from.params,
      path: from.path
    });

    Object.assign(box, routes[this._name]);
  }

  saveHistory() {
    this._storage.setItem(
      'route-' + this._name,
      JSON.stringify(this._history)
    );
  }

  stash() {
    const routes = this.parseHash();

    if (routes[this._name]) {
      this._stash = routes[this._name];
    }

    return this;
  }

  unstash() {
    const box = this._stash;
    this._stash = null;
    return box;
  }
}
