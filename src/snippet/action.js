import { event } from 'd3';
import Snippet from './snippet';

export default class Action extends Snippet {
  constructor(options = {}) {
    super(options);

    this._act = null;
    this._err = null;

    this.setAct(options.act);
    this.setErr(options.err);
  }

  getAct() {
    return this._act;
  }

  setAct(value = []) {
    this._act = value;
    return this;
  }

  getErr() {
    return this._err;
  }

  setErr(value = []) {
    this._err = value;
    return this;
  }

  act(...list) {
    this._act = list;
    return this;
  }

  err(...list) {
    this._err = list;
    return this;
  }

  pass(box, data) {
    for (let i = 0; i < this._act.length; i += 1) {
      this._resolve(this._act[i], box, data);
    }
  }

  fail(box, data) {
    for (let i = 0; i < this._err.length; i += 1) {
      this._resolve(this._err[i], box, data);
    }
  }

  _bind(box, data, name, callback) {
    const result = [];
    let snippet = null;

    for (let i = 0; i < this._list.length; i += 1) {
      snippet = this._list[i];

      result[result.length] = this._bindOn(
        this._resolve(snippet, box, data),
        snippet,
        name,
        callback
      );
    }

    return result;
  }

  _bindOn(node, snippet, name, callback) {
    return node.on(name, () => {
      callback(snippet, event);
    });
  }

  _unbind(name) {
    let snippet = null;

    for (let i = 0; i < this._list.length; i += 1) {
      snippet = this._list[i];

      if (typeof snippet.node === 'function') {
        snippet.node().on(name, null);
      }
    }
  }
}
