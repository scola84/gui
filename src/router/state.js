import { Router } from '@scola/worker';

export default class StateRouter extends Router {
  constructor(methods) {
    super(methods);
    this._name = null;
  }

  setName(value) {
    this._name = value;
    return this;
  }

  act(route, data, callback) {
    let hash = this._parseHash(window.location.hash);
    [hash, route, data] = this._processHash(hash, route, data);
    window.location.hash = this._formatHash(hash);

    this.pass(route.name, route, data, callback);
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

  _processHash(hash, route, data) {
    if (typeof route.name !== 'undefined') {
      if (route.name === null) {
        delete hash[this._name];
      } else {
        hash[this._name] = this._processRoute(route.name, data);
      }
    } else if (typeof hash[this._name] === 'undefined') {
      if (route.default) {
        hash[this._name] = this._processRoute(route.default, data);
      }
    }

    if (typeof hash[this._name] !== 'undefined') {
      route.name = hash[this._name].path;
      data = hash[this._name].params;
    }

    return [hash, route, data];
  }

  _processRoute(path, params = {}) {
    return {
      params,
      path
    };
  }

  _formatHash(hash) {
    return '/' + Object
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
}
