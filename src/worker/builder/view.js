import { Worker } from '@scola/worker';
import { select } from 'd3';
import * as token from './view/token';

export class ViewBuilder extends Worker {
  static setup() {
    ViewBuilder.attach(ViewBuilder, token);
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
