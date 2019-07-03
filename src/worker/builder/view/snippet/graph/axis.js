import { Node } from '../node';
import * as axis from './axis/';

export class Axis extends Node {
  static attach() {
    Object.keys(axis).forEach((name) => {
      Axis.attachFactory(Axis, name, axis[name]);
    });
  }

  constructor(options = {}) {
    super(options);

    this._scale = null;
    this.setScale(options.scale);
  }

  getScale() {
    return this._scale;
  }

  setScale(value = new axis.Linear()) {
    this._scale = value.setAxis(this);
    return this;
  }

  scale(value) {
    return this.setScale(value(this));
  }

  resolveAfter() {
    this._node
      .classed(this._scale.mapOrientation(), true)
      .classed(this._scale.getName(), true)
      .classed(this._scale.getPosition(), true);

    return this._node;
  }

  resolveBefore(box, data) {
    this._scale.prepare(data);
    return this.resolveOuter(box, data);
  }

  resolveInner(box, data) {
    const [tick] = this._list;

    if (typeof tick === 'undefined') {
      return this._node;
    }

    const ticks = this._scale.calculateTicks();
    const position = this._scale.mapPosition();

    let distance = null;
    let value = null;

    for (let i = 0; i < ticks.length; i += 1) {
      [value, distance] = ticks[i];

      tick
        .clone()
        .styles({
          [position]: distance
        })
        .resolve(box, value);
    }

    return this.resolveAfter(box, data);
  }
}
