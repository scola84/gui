import { StateRouter } from '../../worker';
import { Action } from '../action';

export class Route extends Action {
  parseParams(box, data, params) {
    const parsed = {};
    const names = params.split(';');

    let sourceName = null;
    let targetName = null;

    for (let j = 0; j < names.length; j += 1) {
      [targetName, sourceName] = names[j].split('=');
      sourceName = sourceName || targetName;

      parsed[targetName] = box.params[sourceName] ||
        data && data[sourceName] || sourceName;
    }

    return parsed;
  }

  parseRoute(box, data, string) {
    const current = StateRouter.parseRoute(string);
    const [path, params = ''] = current.path.split('?');

    current.params = box.params;
    current.path = path;

    if (params.length > 0) {
      current.params = this.parseParams(box, data, params);
    }

    const name = current.name === 'self' ? box.name : current.name;

    StateRouter.getRouter(name).handle(current, data);
  }

  resolveAfter(box, data) {
    let string = null;

    for (let i = 0; i < this._list.length; i += 1) {
      string = this.resolveValue(box, data, this._list[i]);
      this.parseRoute(box, data, string);
    }
  }
}
