import { Node } from '../node';

import {
  LinearCalculator,
  OrdinalCalculator
} from './axis/';

export class Axis extends Node {
  constructor(options = {}) {
    super(options);

    this._calculator = null;
    this._max = null;
    this._min = null;
    this._type = null;

    this.setCalculator(options.calculator);
    this.setMax(options.max);
    this.setMin(options.min);
    this.setType(options.type);
  }

  getCalculator() {
    return this._calculator;
  }

  setCalculator(value = new LinearCalculator()) {
    this._calculator = value;
    return this;
  }

  getMax() {
    return this._max;
  }

  setMax(value = null) {
    this._max = value;
    return this;
  }

  getMin() {
    return this._min;
  }

  setMin(value = null) {
    this._min = value;
    return this;
  }

  getType() {
    return this._type;
  }

  setType(value = null) {
    this._type = value;
    return this;
  }

  calculator(value) {
    return this.setCalculator(value);
  }

  type(value) {
    return this.setType(value);
  }

  linear() {
    return this.setCalculator(new LinearCalculator());
  }

  ordinal() {
    return this.setCalculator(new OrdinalCalculator());
  }

  max(value) {
    return this.setMax(value);
  }

  min(value) {
    return this.setMin(value);
  }

  bottom() {
    return this
      .setType('bottom')
      .class('x bottom');
  }

  left() {
    return this
      .setMax('auto')
      .setMin('auto')
      .setType('left')
      .class('y left');
  }

  right() {
    return this
      .setMax('auto')
      .setMin('auto')
      .setType('right')
      .class('y right');
  }

  top() {
    return this
      .setType('top')
      .class('x top');
  }

  resolveBefore(box, data) {
    this._calculator
      .setBuilder(this._builder)
      .setMax(this._max)
      .setMin(this._min)
      .setType(this._type)
      .setData(data)
      .prepare();

    return this.resolveOuter(box, data);
  }

  resolveInner(box, data) {
    const [tick] = this._list;

    if (typeof tick === 'undefined') {
      return this._node;
    }

    const ticks = this._calculator.calculateTicks(
      tick.getStep(),
      tick.getCount()
    );

    const rangeName = this._calculator.mapRangeName();
    const positionName = this._calculator.mapPositionName();
    const start = this._calculator.getRange()[rangeName];

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
