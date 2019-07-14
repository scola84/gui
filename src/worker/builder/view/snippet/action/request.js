import { Url, createBrowser } from '@scola/http';
import { Worker } from '@scola/worker';
import defaults from 'lodash-es/defaultsDeep';
import { Action } from '../action';

export class Request extends Action {
  constructor(options = {}) {
    super(options);

    this._client = null;
    this._indicator = null;
    this._list = null;
    this._object = null;
    this._resource = null;

    this.setClient(options.client);
    this.setIndicator(options.indicator);
    this.setList(options.list);
    this.setObject(options.object);
    this.setResource(options.resource);
  }

  getOptions() {
    return Object.assign(super.getOptions(), {
      indicator: this._indicator,
      list: this._list,
      object: this._object,
      resource: this._resource
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

  getList() {
    return this._list;
  }

  setList(value = false) {
    this._list = value;
    return this;
  }

  getObject() {
    return this._object;
  }

  setObject(value = null) {
    this._object = value;
    return this;
  }

  getResource() {
    return this._resource;
  }

  setResource(value = null) {
    this._resource = value;
    return this;
  }

  client(value) {
    return this.setClient(value);
  }

  indicator(value) {
    return this.setIndicator(value);
  }

  list() {
    return this.setList(true);
  }

  object(value) {
    return this.setObject(value);
  }

  resource(value) {
    return this.setResource(value);
  }

  resolveAfter(box, data) {
    if (this._client === null) {
      this._client = createBrowser();
    }

    let options = this.resolveValue(box, data, this._resource);

    if (typeof options === 'string') {
      let [
        method,
        url = null
      ] = options.split(' ');

      if (url === null) {
        url = method;
        method = void 0;
      }

      url = Url.parse(url);

      options = {
        method,
        url: {
          path: url.path,
          query: url.query
        }
      };
    }

    options = defaults({}, options, {
      extra: {
        box
      },
      url: {
        hostname: window.location.hostname,
        port: window.location.port,
        query: {},
        scheme: window.location.protocol.slice(0, -1)
      }
    });

    if (this._list) {
      this.resolveList(box, options);
    } else if (this._object) {
      this.resolveObject(box, options);
    }

    this._client.transformer.connect(new Worker({
      act: (b, result) => {
        this._client.transformer.setWorker(null);
        this.pass(box, result);
      },
      err: (b, error) => {
        this._client.transformer.setWorker(null);
        this.fail(box, error);
      }
    }));

    this._client.connector.handle(options, data, (event) => {
      this.resolveValue(box, event, this._indicator);
    });
  }

  resolveList(box, options) {
    const names = ['count', 'offset', 'search'];
    const list = box.list || {};

    let name = null;

    for (let i = 0; i < names.length; i += 1) {
      name = names[i];

      if (typeof list[name] !== 'undefined') {
        options.url.query[name] = list[name];
      }
    }
  }

  resolveObject(box, options) {
    options.url.path += '/' + box.params[this._object];
  }
}
