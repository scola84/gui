import Action from '../action';
import Err from '../node';
import Input from '../input';

export default class Validate extends Action {
  resolve(box, data) {
    for (let i = 0; i < this._list.length; i += 1) {
      this._validate(box, data, this._list[i]);
    }
  }

  _handleError(box, data, snippet) {
    const snippets = snippet.find((s) => s instanceof Err);

    for (let i = 0; i < snippets.length; i += 1) {
      snippets[i].resolve(box, data);
    }

    this.fail(box, data);
  }

  _handleSuccess(box, data) {
    this.pass(box, data);
  }

  _validate(box, data, snippet) {
    const snippets = snippet.find((s) => s instanceof Input);

    for (let i = 0; i < snippets.length; i += 1) {
      snippets[i].validate(box, data);
    }

    const hasErrors = Object.keys(data).some((key) => {
      return data[key] instanceof Error;
    });

    if (hasErrors) {
      this._handleError(box, data, snippet);
    } else {
      this._handleSuccess(box, data);
    }
  }
}
