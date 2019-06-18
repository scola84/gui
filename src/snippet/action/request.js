import { createBrowser } from '@scola/http';
import { Worker } from '@scola/worker';
import defaults from 'lodash-es/defaultsDeep';
import merge from 'lodash-es/merge';
import { Async } from './async';

const woptions = {
  headers: {
    POST: { 'content-type': 'application/json' },
    PUT: { 'content-type': 'application/json' }
  }
};

export class Request extends Async {
  static getOptions() {
    return woptions;
  }

  static setOptions(options) {
    merge(woptions, options);
  }

  constructor(options = {}) {
    super(options);

    this._indicator = null;
    this.setIndicator(options.indicator);
  }

  getOptions() {
    return Object.assign(super.getOptions(), {
      indicator: this._indicator
    });
  }

  getIndicator() {
    return this._indicator;
  }

  setIndicator(value = null) {
    this._indicator = value;
    return this;
  }

  indicator(value) {
    return this.setIndicator(value);
  }

  asyncify(box, data, options) {
    return (callback) => {
      options = this.resolveValue(box, data, options);

      if (typeof options === 'string') {
        const [method, url] = options.split(' ');
        options = { method, url };
      }

      options = defaults({}, options, {
        extra: { box },
        headers: woptions.headers[options.method]
      });

      const {
        connector,
        transformer
      } = createBrowser();

      transformer.connect(new Worker({
        act(b, result) {
          callback(null, result);
        },
        err(b, error) {
          callback(error);
        }
      }));

      connector.handle(options, data, (event) => {
        this.resolveValue(box, event, this._indicator);
      });
    };
  }
}
