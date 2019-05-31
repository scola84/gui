import parallel from 'async/parallel';
import series from 'async/series';
import Action from '../action';

export default class Async extends Action {
  constructor(options = {}) {
    super(options);

    this._handler = null;
    this.setHandler(options.handler);
  }

  getHandler() {
    return this._handler;
  }

  setHandler(value = parallel) {
    this._handler = value;
    return this;
  }

  parallel() {
    return this.setHandler(parallel);
  }

  series() {
    return this.setHandler(series);
  }

  resolve(box, data) {
    const fn = [];
    let snippet = null;

    for (let i = 0; i < this._list.length; i += 1) {
      snippet = this._list[i];
      fn[fn.length] = this._createFunction(box, data, snippet);
    }

    this._handler(fn, (error, results) => {
      if (error) {
        this.fail(box, error);
      } else {
        this.pass(box, results, true);
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
