import { createBrowser } from '@scola/http';
import { Worker } from '@scola/worker';
import defaults from 'lodash-es/defaultsDeep';
import merge from 'lodash-es/merge';
import Async from './async';

const woptions = {
  headers: {
    POST: { 'content-type': 'application/json' },
    PUT: { 'content-type': 'application/json' }
  }
};

export default class Request extends Async {
  static getOptions() {
    return woptions;
  }

  static setOptions(options) {
    merge(woptions, options);
  }

  constructor(options = {}) {
    super(options);

    this._loading = null;
    this.setLoading(options.loading);
  }

  getOptions() {
    return Object.assign(super.getOptions(), {
      loading: this._loading
    });
  }

  getLoading() {
    return this._loading;
  }

  setLoading(value = null) {
    this._loading = value;
    return this;
  }

  loading(value) {
    return this.setLoading(value);
  }

  each(box, data, options) {
    options = this.resolveValue(box, data, options);

    if (typeof options === 'string') {
      const [method, url] = options.split(' ');
      options = { method, url };
    }

    defaults(options, {
      extra: { box },
      headers: woptions.headers[options.method]
    });

    return (callback) => {
      this.sendRequest(box, data, callback, options);
    };
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
      this.resolveValue(requestBox, event, this._loading);
    });
  }
}
