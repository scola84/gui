import { ViewRouter } from '../../../../router';
import { Action } from '../action';

export class Route extends Action {
  constructor(options = {}) {
    super(options);

    this._view = null;
    this.setView(options.view);
  }

  getOptions() {
    return Object.assign(super.getOptions(), {
      view: this._view
    });
  }

  getView() {
    return this._view;
  }

  setView(value = null) {
    this._view = value;
    return this;
  }

  view(value) {
    return this.setView(value);
  }

  resolveAfter(box, data) {
    const route = this.resolveValue(box, data, this._view);
    ViewRouter.handle(box, data, route);
  }
}
