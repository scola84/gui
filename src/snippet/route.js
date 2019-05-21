import { StateRouter } from '../worker';
import Action from './action';

export default class Router extends Action {
  render(box, data) {
    this._list.forEach((route) => {
      this._parse(box, data, route);
    });
  }

  _parse(box, data, string) {
    const current = StateRouter.parseRoute(string);
    const [path, params] = current.path.split('?');

    if (typeof params !== 'undefined') {
      this._parseParams(box, data, current, path, params);
    }

    const name = current.name === 'self' ? box.name : current.name;

    StateRouter.getRouter(name).handle(current, data);
  }

  _parseParams(box, data, current, path, params) {
    current.params = box.params;
    current.path = path;

    if (params.length) {
      this._pickParams(box, data, current, params);
    }
  }

  _pickParams(box, data, current, params) {
    const names = params.split(';');
    const picked = {};

    let sourceName = null;
    let targetName = null;

    for (let j = 0; j < names.length; j += 1) {
      [targetName, sourceName] = names[j].split('=');
      sourceName = sourceName || targetName;

      picked[targetName] = box.params[sourceName] ||
        data && data[sourceName] || sourceName;
    }

    current.params = picked;
  }
}
