import * as codec from '@scola/codec';
import { createBrowser } from '@scola/http';
import { Worker } from '@scola/worker';
import Async from './async';

export default class Request extends Async {
  constructor(options = {}) {
    super(options);

    this._progress = null;
    this.setProgress(options.progress);
  }

  getProgress() {
    return this._progress;
  }

  setProgress(value = null) {
    this._progress = value;
    return this;
  }

  progress(value) {
    return this.setProgress(value);
  }

  _createFunction(box, data, options) {
    options = this._parseOptions(box, data, options);

    return (callback) => {
      this._sendRequest(box, data, callback, options);
    };
  }

  _parseOptions(box, data, options) {
    options = this._resolve(box, data, options);

    if (typeof options === 'string') {
      const [method, path] = options.split(' ');
      options = { method, url: { path } };
    }

    options.extra = { box };

    return options;
  }

  _sendRequest(box, data, callback, options) {
    const {
      connector,
      transformer
    } = createBrowser(codec);

    transformer.connect(new Worker({
      act(b, responseData) {
        callback(null, responseData);
      },
      err(b, error) {
        callback(error);
      }
    }));

    connector.handle(options, data, (event) => {
      this._resolve(box, event, this._progress);
    });
  }
}
