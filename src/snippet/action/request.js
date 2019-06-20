import { createBrowser } from '@scola/http';
import { Worker } from '@scola/worker';
import defaults from 'lodash-es/defaultsDeep';
import { Async } from './async';

export class Request extends Async {
  constructor(options = {}) {
    super(options);

    this._client = null;
    this._indicator = null;

    this.setClient(options.client);
    this.setIndicator(options.indicator);
  }

  getOptions() {
    return Object.assign(super.getOptions(), {
      indicator: this._indicator
    });
  }

  getClient() {
    return this._client;
  }

  setClient(value = null) {
    this._client = value;
    return this;
  }

  getIndicator() {
    return this._indicator;
  }

  setIndicator(value = null) {
    this._indicator = value;
    return this;
  }

  client(value) {
    return this.setClient(value);
  }

  indicator(value) {
    return this.setIndicator(value);
  }

  asyncify(box, data, options) {
    if (this._client === null) {
      this.setupClient();
    }

    options = this.resolveValue(box, data, options);

    if (typeof options === 'string') {
      const [method, url] = options.split(' ');
      options = url ? { method, url } : { url: method };
    }

    options = defaults({}, options, {
      extra: { box }
    });

    return (callback) => {
      this._client.handler
        .setAct((b, result) => callback(null, result))
        .setErr((b, error) => callback(error));

      this._client.connector.handle(options, data, (event) => {
        this.resolveValue(box, event, this._indicator);
      });
    };
  }

  setupClient() {
    const {
      connector,
      transformer
    } = createBrowser();

    const handler = transformer
      .connect(new Worker());

    this._client = {
      connector,
      handler
    };
  }
}
