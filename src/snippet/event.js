import { event } from 'd3';
import Action from './action';

export default class Event extends Action {
  _bind(box, data, name, callback) {
    const result = [];
    let snippet = null;

    for (let i = 0; i < this._list.length; i += 1) {
      snippet = this._list[i];

      result[result.length] = this._bindOn(
        snippet,
        name,
        snippet.render(box, data),
        callback
      );
    }

    return result;
  }

  _bindOn(snippet, name, node, callback) {
    return node.on(name, () => {
      callback(snippet, event);
    });
  }

  _unbind(name) {
    let snippet = null;

    for (let i = 0; i < this._list.length; i += 1) {
      snippet = this._list[i];

      this._unbindOn(
        snippet,
        name,
        snippet.node()
      );
    }
  }

  _unbindOn(snippet, name, node) {
    node.on(name, null);
  }
}
