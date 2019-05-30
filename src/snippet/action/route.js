import { StateRouter } from '../../worker';
import Action from '../action';

export default class Route extends Action {
  resolve(box, data) {
    let string = null;

    for (let i = 0; i < this._list.length; i += 1) {
      string = this._resolve(box, data, this._list[i]);
      this._parseRoute(box, data, string);
    }
  }

  _parseRoute(box, data, string) {
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
      const names = params.split(';');
      current.params = this._pickParams(box, data, names);
    }
  }

  _pickParams(box, data, names) {
    const picked = {};

    let sourceName = null;
    let targetName = null;

    for (let j = 0; j < names.length; j += 1) {
      [targetName, sourceName] = names[j].split('=');
      sourceName = sourceName || targetName;

      picked[targetName] = box.params[sourceName] ||
        data && data[sourceName] || sourceName;
    }

    return picked;
  }
}
