import { Worker } from '@scola/worker';
import camel from 'lodash-es/camelCase';

export default class ViewBuilder extends Worker {
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
    const node = this._view.resolve(box, data);

    if (node && box.base) {
      box.base.appendChild(node.node());
    }

    this.pass(box, data, callback);
  }

  build(view) {
    return this.setView(view);
  }
}
