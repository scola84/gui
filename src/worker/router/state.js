import { Router } from '@scola/worker';
const routers = {};

export class StateRouter extends Router {
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
      .filter((part) => part);

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

    this.loadHistory();

    StateRouter.setRouter(this._name, this);
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

  act(box, data, callback) {
    if (this._base.busy === true) {
      return;
    }

    this._base.busy = true;

    let hash = StateRouter.parseHash(window.location.hash);
    [hash, box] = this.processHash(hash, box);

    history.replaceState({}, '', this.formatHash(hash));
    this.pass(box.path, box, data, callback);
  }

  stash() {
    const hash = StateRouter.parseHash(window.location.hash);

    if (hash[this._name]) {
      this._stash = hash[this._name];
    }

    return this;
  }

  unstash() {
    const box = this._stash;
    this._stash = null;
    return box;
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

  processBackward(box) {
    if (box.back !== true) {
      return box;
    }

    if (this._history.length <= 1) {
      return box;
    }

    const current = this._history.pop();
    const previous = this._history.pop();

    if (current.remember || previous.remember) {
      box.name = this._name;
      box.path = previous.path;
      box.params = previous.params;
      box.remember = previous.remember;
    }

    return box;
  }

  processForward(box) {
    if (box.clear === true) {
      this._history = [];
    }

    if (box.path) {
      this._history.push(box);
    }

    this.saveHistory();

    return box;
  }

  processHash(hash, box) {
    box = this.processHistory(box);
    box = this.processBackward(box);

    if (typeof box.path !== 'undefined') {
      if (box.path === null) {
        delete hash[this._name];
      } else if (!this._workers[box.path]) {
        if (this._default) {
          hash[this._name] = this.processRoute(this._default, box.params);
        } else if (box.default) {
          hash[this._name] = this.processRoute(box.default, box.params);
        }
      } else {
        hash[this._name] = this.processRoute(box.path, box.params);
      }
    } else if (typeof hash[this._name] === 'undefined') {
      if (this._default !== null) {
        hash[this._name] = this.processRoute(this._default, box.params);
      } else if (box.default) {
        hash[this._name] = this.processRoute(box.default, box.params);
      }
    }

    if (typeof hash[this._name] !== 'undefined') {
      box.base = this._base;
      box.name = this._name;
      box.path = hash[this._name].path;
      box.params = hash[this._name].params;
    }

    if (box.fwd !== false) {
      box = this.processForward(box);
    }

    return [hash, box];
  }

  processHistory(box) {
    if (box.history !== true) {
      return box;
    }

    if (this._history.length === 0) {
      return box;
    }

    return this._history.pop();
  }

  processRoute(path, params = {}) {
    return {
      params,
      path
    };
  }

  saveHistory() {
    const history = [];
    let box = null;

    for (let i = 0; i < this._history.length; i += 1) {
      box = this._history[i];

      history[history.length] = {
        back: box.back,
        path: box.path,
        params: box.params,
        remember: box.remember
      };
    }

    sessionStorage.setItem(this.createId(), JSON.stringify(history));
  }
}
