import { ViewRouter } from '../../../../router';
import { Action } from '../action';

export class Route extends Action {
  constructor(options = {}) {
    super(options);

    this._object = null;
    this._view = null;

    this.setObject(options.object);
    this.setView(options.view);
  }

  getOptions() {
    return Object.assign(super.getOptions(), {
      object: this._object,
      view: this._view
    });
  }

  getObject() {
    return this._object;
  }

  setObject(value = null) {
    this._object = value;
    return this;
  }

  getView() {
    return this._view;
  }

  setView(value = null) {
    this._view = value;
    return this;
  }

  object(value) {
    return this.setObject(value);
  }

  view(value) {
    return this.setView(value);
  }

  resolveAfter(box, data) {
    let route = this.resolveValue(box, data, this._view);

    if (this._object) {
      route = this.resolveObject(box, data, route);
    }

    ViewRouter.handle(box, data, route);
  }

  resolveObject(box, data, route) {
    const [path, name] = route.split('@');
    const object = `${this._object}=${data[this._object]}`;
    return `${path}:${object}@${name}`;
  }
}
