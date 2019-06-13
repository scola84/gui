import { createBrowser } from '@scola/http';
import { Worker } from '@scola/worker';
import merge from 'lodash-es/merge';
import { parse } from 'url';
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
    options = this.resolveValue(box, data, options);

    if (typeof options === 'string') {
      options = this.parseOptions(box, data, options);
    }

    merge(options, { extra: { box } });

    return (callback) => {
      this.sendRequest(box, data, callback, options);
    };
  }

  parseOptions(box, data, options) {
    const [
      method,
      url
    ] = options.split(' ');

    options = {
      method,
      url: parse(url)
    };

    const keys = Object.keys(options.url);
    let key = null;

    for (let i = 0; i < keys.length; i += 1) {
      key = keys[i];

      if (options.url[key] === null) {
        delete options.url[key];
      }
    }

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
