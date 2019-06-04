import Action from '../action';
import Input from '../input';

export default class Validate extends Action {
  constructor(options = {}) {
    super(options);

    this._throw = null;
    this.setThrow(options.throw);
  }

  getThrow() {
    return this._throw;
  }

  setThrow(value = false) {
    this._throw = value;
    return this;
  }

  throw () {
    return this.setThrow(true);
  }

  resolve(box, data) {
    for (let i = 0; i < this._list.length; i += 1) {
      this.validate(box, data, this._list[i]);
    }
  }

  validate(box, data, snippet) {
    const snippets = snippet.find((s) => s instanceof Input);
    const error = {};

    for (let i = 0; i < snippets.length; i += 1) {
      snippets[i].clean(box, data, error);
    }

    for (let i = 0; i < snippets.length; i += 1) {
      snippets[i].validate(box, data, error);
    }

    const hasError = Object.keys(error).length > 0;

    if (hasError) {
      if (this._throw === true) {
        this._throwError(box, error);
      } else {
        this.fail(box, error);
      }
    } else {
      this.pass(box, data);
    }
  }

  _throwError(box, error) {
    const newError = new Error('400 Input invalid');
    newError.details = error;
    throw newError;
  }
}
