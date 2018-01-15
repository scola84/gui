import { Router } from '@scola/worker';

export default class StateRouter extends Router {
  constructor(options = {}) {
    super(options);

    this._default = null;
    this._history = [];
    this._name = null;

    this.setDefault(options.default);
    this.setName(options.name);

    this._loadHistory();
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
    let hash = this._parseHash(window.location.hash);
    [hash, route] = this._processHash(hash, route);

    history.replaceState({}, '', this._formatHash(hash));
    this.pass(route.name, route, data, callback);
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

  _parseHash(hash) {
    return hash
      .slice(2)
      .split('/')
      .filter((route) => route)
      .reduce((routes, route) => {
        return this._parseRoute(routes, route);
      }, {});
  }

  _parseRoute(routes, route) {
    const [path, name] = route.split('@');
    const [realPath, params = ''] = path.split(':');

    const realParams = params
      .split(';')
      .filter((param) => param)
      .reduce((result, param) => {
        const [paramName, paramValue] = param.split('=');
        result[paramName] = paramValue;
        return result;
      }, {});

    routes[name] = {
      params: realParams,
      path: realPath
    };

    return routes;
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
      route.remember = previous.remember;
      route.name = previous.name;
      route.params = previous.params;
    }

    return route;
  }

  _processForward(route) {
    if (route.back === false) {
      this._history = [];
    }

    if (route.name) {
      this._history.push(route);
    }

    this._saveHistory();

    return route;
  }

  _processHash(hash, route) {
    route = this._processHistory(route);
    route = this._processBackward(route);

    if (typeof route.name !== 'undefined') {
      if (route.name === null) {
        delete hash[this._name];
      } else {
        hash[this._name] = this._processRoute(route.name, route.params);
      }
    } else if (typeof hash[this._name] === 'undefined') {
      if (this._default !== null) {
        hash[this._name] = this._processRoute(this._default, route.params);
      }
    }

    if (typeof hash[this._name] !== 'undefined') {
      route.name = hash[this._name].path;
      route.params = hash[this._name].params;
    }

    route = this._processForward(route);

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
        name: route.name,
        params: route.params,
        remember: route.remember
      };
    });

    sessionStorage.setItem('history-' + this._id, JSON.stringify(history));
  }
}
