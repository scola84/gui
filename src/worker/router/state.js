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

    this._loadHistory();
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
    [hash, route] = this._processHash(hash, route);

    history.replaceState({}, '', this._formatHash(hash));
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

  _formatHash(hash) {
    return '#/' + Object
      .keys(hash)
      .map((name) => {
        return this._formatRoute(hash, name);
      })
      .join('/');
  }

  _formatRoute(hash, name) {
    const params = Object
      .keys(hash[name].params)
      .map((paramName, index) => {
        return (index === 0 ? ':' : '') +
          paramName + '=' + hash[name].params[paramName];
      })
      .join(';');

    return hash[name].path + params + '@' + name;
  }

  _loadHistory() {
    const history = sessionStorage.getItem('history-' + this._id);
    this._history = history === null ? [] : JSON.parse(history);
  }

  _processBackward(route) {
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

  _processForward(route) {
    if (route.clear === true) {
      this._history = [];
    }

    if (route.path) {
      this._history.push(route);
    }

    this._saveHistory();

    return route;
  }

  _processHash(hash, route) {
    route = this._processHistory(route);
    route = this._processBackward(route);

    if (typeof route.path !== 'undefined') {
      if (route.path === null) {
        delete hash[this._name];
      } else if (!this._workers[route.path]) {
        if (this._default) {
          hash[this._name] = this._processRoute(this._default, route.params);
        } else if (route.default) {
          hash[this._name] = this._processRoute(route.default, route.params);
        }
      } else {
        hash[this._name] = this._processRoute(route.path, route.params);
      }
    } else if (typeof hash[this._name] === 'undefined') {
      if (this._default !== null) {
        hash[this._name] = this._processRoute(this._default, route.params);
      } else if (route.default) {
        hash[this._name] = this._processRoute(route.default, route.params);
      }
    }

    if (typeof hash[this._name] !== 'undefined') {
      route.base = this._base;
      route.name = this._name;
      route.path = hash[this._name].path;
      route.params = hash[this._name].params;
    }

    if (route.fwd !== false) {
      route = this._processForward(route);
    }

    return [hash, route];
  }

  _processHistory(route) {
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

  _processRoute(path, params = {}) {
    return {
      params,
      path
    };
  }

  _saveHistory() {
    const history = this._history.map((route) => {
      return {
        back: route.back,
        path: route.path,
        params: route.params,
        remember: route.remember
      };
    });

    sessionStorage.setItem('history-' + this._id, JSON.stringify(history));
  }
}
