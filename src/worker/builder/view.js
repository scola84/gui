import { Worker } from '@scola/worker';
import { select } from 'd3';
import camel from 'lodash-es/camelCase';
import * as setup from './view/helper/setup';
import * as token from './view/token';

export class ViewBuilder extends Worker {
  static attach() {
    Object.keys(token).forEach((prefix) => {
      Object.keys(token[prefix]).forEach((name) => {
        ViewBuilder.attachFactory(ViewBuilder, prefix, name,
          token[prefix][name]);
      });
    });
  }

  static attachFactory(to, prefix, name, object, options = {}) {
    to.prototype[
      camel(to.prototype[name] ? `${prefix}-${name}` : name)
    ] = function create(...list) {
      return new object(Object.assign({}, options, {
        class: prefix === 'dom' ? null : camel(name),
        builder: this,
        list,
        name: prefix === 'dom' ? name : 'div'
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

  node() {
    return select(this._parent.getBase());
  }

  act(box, data, callback) {
    data = this.filter(box, data);
    this._view.resolve(box, data);
    this.pass(box, data, callback);
  }

  build(view) {
    return this.setView(view.setParent(this));
  }
}
