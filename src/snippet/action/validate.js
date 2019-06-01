import Action from '../action';
import Hint from '../node/hint';
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
      this._validate(box, data, this._list[i]);
    }
  }

  _handleError(box, error, snippet) {
    const snippets = snippet.find((s) => s instanceof Hint);

    for (let i = 0; i < snippets.length; i += 1) {
      snippets[i].resolve(box, error);
    }

    this.fail(box, error);
  }

  _handleSuccess(box, data) {
    this.pass(box, data);
  }

  _throwError(box, error) {
    const newError = new Error('400 Input invalid');
    newError.details = error;
    throw newError;
  }

  _validate(box, data, snippet) {
    const snippets = snippet.find((s) => s instanceof Input);
    const error = {};

    for (let i = 0; i < snippets.length; i += 1) {
      snippets[i].validate(box, data, error);
    }

    const hasError = Object.keys(error).length > 0;

    if (hasError) {
      if (this._throw === true) {
        this._throwError(box, error);
      } else {
        this._handleError(box, error, snippet);
      }
    } else {
      this._handleSuccess(box, data);
    }
  }
}
