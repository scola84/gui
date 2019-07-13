import { Snippet } from './snippet';

export class Action extends Snippet {
  constructor(options = {}) {
    super(options);

    this._act = null;
    this._err = null;
    this._ref = null;

    this.setAct(options.act);
    this.setErr(options.err);
    this.setRef(options.ref);
  }

  getOptions() {
    return Object.assign(super.getOptions(), {
      act: this._act,
      err: this._err,
      ref: this._ref
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

  getRef() {
    return this._ref;
  }

  setRef(value = []) {
    this._ref = value;
    return this;
  }

  act(...args) {
    return this.setAct(args);
  }

  err(...args) {
    return this.setErr(args);
  }

  ref(...args) {
    return this.setRef(args);
  }

  fail(box, error) {
    for (let i = 0; i < this._err.length; i += 1) {
      this.resolveValue(box, error, this._err[i]);
    }
  }

  pass(box, data) {
    this.passAct(box, data);
    this.passRef(box, data);
  }

  passAct(box, data) {
    for (let i = 0; i < this._act.length; i += 1) {
      this.resolveValue(box, data, this._act[i]);
    }
  }

  passRef(box, data) {
    let ref = null;

    for (let i = 0; i < this._ref.length; i += 1) {
      ref = this.resolveValue(null, null, this._ref[i]);

      for (let j = 0; j < ref.length; j += 1) {
        ref[j].pass(box, data);
      }
    }
  }
}
