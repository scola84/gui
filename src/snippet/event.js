import { event } from 'd3';
import Action from './action';

export default class Event extends Action {
  bind(box, data, name, callback) {
    const result = [];
    let snippet = null;

    for (let i = 0; i < this._list.length; i += 1) {
      snippet = this._list[i];

      result[result.length] = this.bindOn(
        snippet,
        name,
        snippet.resolve(box, data),
        callback
      );
    }

    return result;
  }

  bindOn(snippet, name, node, callback) {
    return node.on(name, () => {
      event.preventDefault();
      callback(snippet, event);
    });
  }

  unbind(name) {
    let snippet = null;

    for (let i = 0; i < this._list.length; i += 1) {
      snippet = this._list[i];

      this.unbindOn(
        snippet,
        name,
        snippet.node()
      );
    }
  }

  unbindOn(snippet, name, node) {
    node.on(name, null);
  }
}
