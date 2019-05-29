import parallel from 'async/parallel';
import Action from '../action';

export default class Parallel extends Action {
  render(box, data) {
    const fn = [];
    let snippet = null;

    for (let i = 0; i < this._list.length; i += 1) {
      snippet = this._list[i];
      fn[fn.length] = this._createFunction(box, data, snippet);
    }

    parallel(fn, (error, results) => {
      if (error) {
        this.fail(box, error);
      } else {
        this.pass(box, results);
      }
    });
  }

  _createFunction(box, data, snippet) {
    return (callback) => {
      snippet.act((b, result) => {
        callback(null, result);
      });

      snippet.err((b, error) => {
        callback(error);
      });

      snippet.render(box, data);
    };
  }
}
