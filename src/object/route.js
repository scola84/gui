import defaults from 'lodash-es/defaultsDeep';

export class Route {
  static parse(route) {
    if (route instanceof Route) {
      return route;
    }

    if (typeof route === 'object') {
      return new Route(route);
    }

    if (typeof route === 'undefined') {
      return route;
    }

    const [splitPath, splitName] = route.split('@');
    const [path, rawParams = ''] = splitPath.split(':');
    const [name, rawOptions = ''] = splitName.split(':');

    const options = {
      name,
      options: {},
      params: {},
      path
    };

    const optionNames = rawOptions ? rawOptions.split(';') : [];

    for (let i = 0; i < optionNames.length; i += 1) {
      options.options[optionNames[i]] = true;
    }

    const params = rawParams ? rawParams.split(';') : [];

    for (let i = 0; i < params.length; i += 1) {
      const [paramName, paramValue] = params[i].split('=');
      options.params[paramName] = paramValue;
    }

    return new Route(options);
  }

  constructor(options = {}) {
    defaults(this, options, {
      base: null,
      default: null,
      name: null,
      options: {
        bwd: false,
        clr: false,
        his: false,
        ins: true,
        ltr: false,
        mem: false,
        rtl: false,
        slf: false
      },
      params: {},
      path: null
    });
  }

  format(filter = []) {
    let params = '';
    let options = '';

    let names = Object.keys(this.params);
    let name = null;

    for (let i = 0; i < names.length; i += 1) {
      params += params.length === 0 ? ':' : ';';
      params += names[i] + '=' + this.params[names[i]];
    }

    names = Object.keys(this.options);
    name = null;

    for (let i = 0; i < names.length; i += 1) {
      name = names[i];

      if (this.options[name] === true && filter.indexOf(name) > -1) {
        options += options.length === 0 ? ':' : ';';
        options += name;
      }
    }

    return this.path + params + '@' + this.name + options;
  }

  toJSON() {
    return this.format(['bwd', 'mem']);
  }
}
