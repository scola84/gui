import { createBrowser } from '@scola/http';
import { Worker } from '@scola/worker';
import merge from 'lodash-es/merge';
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

  each(box, data, options) {
    options = this._parseOptions(box, data, options);

    return (callback) => {
      this._sendRequest(box, data, callback, options);
    };
  }

  _callback(callback, options, error, data) {
    if (options.extra.snippet) {
      options.extra.snippet.resolve().unlock();
    }

    callback(error, data);
  }

  _parseOptions(box, data, options) {
    options = this.resolveValue(box, data, options);

    if (typeof options === 'string') {
      const [method, path] = options.split(' ');
      options = { method, url: { path } };
    }

    merge(options, {
      extra: {
        box
      }
    });

    return options;
  }

  _sendRequest(requestBox, requestData, callback, options) {
    const {
      connector,
      transformer
    } = createBrowser();

    transformer.connect(new Worker({
      act: (box, data) => {
        this._callback(callback, options, null, data);
      },
      err: (box, error) => {
        this._callback(callback, options, error);
      }
    }));

    connector.handle(options, requestData, (event) => {
      this.resolveValue(requestBox, event, this._progress);
    });
  }
}
