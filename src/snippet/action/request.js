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
    options = this.parseOptions(box, data, options);

    return (callback) => {
      this.sendRequest(box, data, callback, options);
    };
  }

  parseOptions(box, data, options) {
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

  sendRequest(requestBox, requestData, callback, options) {
    const {
      connector,
      transformer
    } = createBrowser();

    transformer.connect(new Worker({
      act(box, data) {
        callback(null, data);
      },
      err(box, error) {
        callback(error);
      }
    }));

    connector.handle(options, requestData, (event) => {
      this.resolveValue(requestBox, event, this._progress);
    });
  }
}
