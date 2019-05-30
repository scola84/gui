import series from 'async/series';
import Action from '../action';

export default class Series extends Action {
  resolve(box, data) {
    const fn = [];
    let snippet = null;

    for (let i = 0; i < this._list.length; i += 1) {
      snippet = this._list[i];
      fn[fn.length] = this._createFunction(box, data, snippet);
    }

    series(fn, (error, results) => {
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

      snippet.resolve(box, data);
    };
  }
}
