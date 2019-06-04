import Action from '../action';
import Input from '../input';

export default class Validate extends Action {
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
      const newError = new Error('400 Input invalid');
      newError.details = error;
      this.fail(box, newError);
    } else {
      this.pass(box, data);
    }
  }
}
