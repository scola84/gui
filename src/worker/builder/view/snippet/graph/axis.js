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

  setScale(value = null) {
    this._scale = value;

    if (value) {
      value.setBuilder(this._builder);
    }

    return this;
  }

  scale(value) {
    return this.setScale(value(this));
  }

  resolveAfter() {
    this._node
      .classed(this._scale.constructor.name.toLowerCase(), true)
      .classed(this._scale.mapOrientationName(), true)
      .classed(this._scale.getType(), true);
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

    const ticks = this._scale.calculateTicks(
      tick.getStep(),
      tick.getCount()
    );

    const rangeName = this._scale.mapRangeName();
    const positionName = this._scale.mapPositionName();
    const start = this._scale.getRange()[rangeName];

    let distance = null;
    let value = null;

    for (let i = 0; i < ticks.length; i += 1) {
      [value, distance] = ticks[i];

      tick
        .clone()
        .styles({
          [positionName]: start - distance
        })
        .resolve(box, value);
    }

    return this.resolveAfter(box, data);
  }
}
