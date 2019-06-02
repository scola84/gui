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

  pass(box, data, spread = false) {
    for (let i = 0; i < this._act.length; i += 1) {
      this.resolveValue(box, spread ? data[i] : data, this._act[i]);
    }
  }

  fail(box, error) {
    for (let i = 0; i < this._err.length; i += 1) {
      this.resolveValue(box, error, this._err[i]);
    }
  }
}
