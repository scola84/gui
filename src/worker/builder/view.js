import { Worker } from '@scola/worker';
import { attach } from '../../helper';

export default class ViewBuilder extends Worker {
  static attach() {
    attach(ViewBuilder);
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
