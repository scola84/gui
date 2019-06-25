import { Worker } from '@scola/worker';
import camel from 'lodash-es/camelCase';
import * as setup from './view/helper/setup';

export class ViewBuilder extends Worker {
  static attachFactory(prefix, name, object, options = {}) {
    ViewBuilder.prototype[
      camel(ViewBuilder.prototype[name] ?
        `${prefix}-${name}` : name)
    ] = function create(...list) {
      return new object(Object.assign(options, {
        builder: this,
        list
      }));
    };
  }

  static setup(...names) {
    names = names.length === 0 ? Object.keys(setup) : names;
    names.forEach((name) => setup[name]());
  }

  constructor(options = {}) {
    super(options);

    this._view = null;
    this.setView(options.view);
  }

  getView() {
    return this._view;
  }

  setView(value = null) {
    this._view = value;
    return this;
  }

  act(box, data, callback) {
    data = this.filter(box, data);
    this._view.resolve(box, data);
    this.pass(box, data, callback);
  }

  build(view) {
    return this.setView(view);
  }
}
