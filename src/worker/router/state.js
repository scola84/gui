import { Router } from '@scola/worker';
const routers = {};

export default class StateRouter extends Router {
  static getRouter(name) {
    return routers[name];
  }

  static setRouter(name, router) {
    routers[name] = router;
  }

  static parseHash(hash) {
    hash = hash
      .slice(2)
      .split('/')
      .filter((route) => route);

    const routes = {};
    let route = null;

    for (let i = 0; i < hash.length; i += 1) {
      route = StateRouter.parseRoute(hash[i]);

      routes[route.name] = {
        params: route.params,
        path: route.path
      };
    }

    return routes;
  }

  static parseRoute(string) {
    const [splitPath, splitName] = string.split('@');
    const [path, rawParams = ''] = splitPath.split(':');
    const [name, rawOptions = ''] = splitName.split(':');

    const route = {
      name,
      params: {},
      path
    };

    const options = rawOptions.split(';');
    const params = rawParams.split(';');

    for (let i = 0; i < options.length; i += 1) {
      route[options[i]] = true;
    }

    for (let i = 0; i < params.length; i += 1) {
      if (params[i].length > 0) {
        const [paramName, paramValue] = params[i].split('=');
        route.params[paramName] = paramValue;
      }
    }

    return route;
  }

  constructor(options = {}) {
    super(options);

    this._base = null;
    this._default = null;
    this._history = [];
    this._name = null;
    this._stash = null;

    this.setBase(options.base);
    this.setDefault(options.default);
    this.setName(options.name);

    StateRouter.setRouter(this._name, this);

    this.loadHistory();
  }

  setBase(value = null) {
    this._base = value;
    return this;
  }

  setDefault(value = null) {
    this._default = value;
    return this;
  }

  setName(value = null) {
    this._name = value;
    return this;
  }

  act(route, data, callback) {
    let hash = StateRouter.parseHash(window.location.hash);
    [hash, route] = this.processHash(hash, route);

    history.replaceState({}, '', this.formatHash(hash));
    this.pass(route.path, route, data, callback);
  }

  stash() {
    const hash = StateRouter.parseHash(window.location.hash);

    if (hash[this._name]) {
      this._stash = hash[this._name];
    }

    return this;
  }

  unstash() {
    const route = this._stash;
    this._stash = null;
    return route;
  }

  createId() {
    return 'history-' + this._id;
  }

  formatHash(hash) {
    return '#/' + Object
      .keys(hash)
      .map((name) => {
        return this.formatRoute(hash, name);
      })
      .join('/');
  }

  formatRoute(hash, name) {
    const params = Object
      .keys(hash[name].params)
      .map((paramName, index) => {
        return (index === 0 ? ':' : '') +
          paramName + '=' + hash[name].params[paramName];
      })
      .join(';');

    return hash[name].path + params + '@' + name;
  }

  loadHistory() {
    const history = sessionStorage.getItem(this.createId());
    this._history = history === null ? [] : JSON.parse(history);
  }

  processBackward(route) {
    if (route.back !== true) {
      return route;
    }

    if (this._history.length <= 1) {
      return route;
    }

    const current = this._history.pop();
    const previous = this._history.pop();

    if (current.remember || previous.remember) {
      route.name = this._name;
      route.path = previous.path;
      route.params = previous.params;
      route.remember = previous.remember;
    }

    return route;
  }

  processForward(route) {
    if (route.clear === true) {
      this._history = [];
    }

    if (route.path) {
      this._history.push(route);
    }

    this.saveHistory();

    return route;
  }

  processHash(hash, route) {
    route = this.processHistory(route);
    route = this.processBackward(route);

    if (typeof route.path !== 'undefined') {
      if (route.path === null) {
        delete hash[this._name];
      } else if (!this._workers[route.path]) {
        if (this._default) {
          hash[this._name] = this.processRoute(this._default, route.params);
        } else if (route.default) {
          hash[this._name] = this.processRoute(route.default, route.params);
        }
      } else {
        hash[this._name] = this.processRoute(route.path, route.params);
      }
    } else if (typeof hash[this._name] === 'undefined') {
      if (this._default !== null) {
        hash[this._name] = this.processRoute(this._default, route.params);
      } else if (route.default) {
        hash[this._name] = this.processRoute(route.default, route.params);
      }
    }

    if (typeof hash[this._name] !== 'undefined') {
      route.base = this._base;
      route.name = this._name;
      route.path = hash[this._name].path;
      route.params = hash[this._name].params;
    }

    if (route.fwd !== false) {
      route = this.processForward(route);
    }

    return [hash, route];
  }

  processHistory(route) {
    if (route.history !== true) {
      return route;
    }

    if (this._history.length === 0) {
      return route;
    }

    const previous = this._history.pop();

    previous.node = route.node;
    previous.reload = route.reload;
    previous.user = route.user;

    return previous;
  }

  processRoute(path, params = {}) {
    return {
      params,
      path
    };
  }

  saveHistory() {
    const history = [];
    let route = null;

    for (let i = 0; i < this._history.length; i += 1) {
      route = this._history[i];

      history[history.length] = {
        back: route.back,
        path: route.path,
        params: route.params,
        remember: route.remember
      };
    }

    sessionStorage.setItem(this.createId(), JSON.stringify(history));
  }
}
