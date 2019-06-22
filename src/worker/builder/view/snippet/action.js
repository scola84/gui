import { Snippet } from './snippet';

export class Action extends Snippet {
  constructor(options = {}) {
    super(options);

    this._act = null;
    this._err = null;

    this.setAct(options.act);
    this.setErr(options.err);
  }

  getOptions() {
    return Object.assign(super.getOptions(), {
      act: this._act,
      err: this._err
    });
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

  find(compare) {
    let result = super.find(compare);

    result = this.findRecursive(result, this._act, compare);
    result = this.findRecursive(result, this._err, compare);

    return result;
  }

  fail(box, error) {
    for (let i = 0; i < this._err.length; i += 1) {
      this.resolveValue(box, error, this._err[i]);
    }
  }

  pass(box, data) {
    for (let i = 0; i < this._act.length; i += 1) {
      this.resolveValue(box, data, this._act[i]);
    }
  }
}
