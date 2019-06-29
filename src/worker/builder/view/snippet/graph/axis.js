import { Node } from '../node';

import {
  BandCalculator,
  LinearCalculator
} from './axis/';

export class Axis extends Node {
  constructor(options = {}) {
    super(options);

    this._calculator = null;
    this._type = null;

    this.setCalculator(options.calculator);
    this.setType(options.type);
  }

  getCalculator() {
    return this._calculator;
  }

  setCalculator(value = new LinearCalculator()) {
    this._calculator = value;
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

  band() {
    return this.setCalculator(new BandCalculator());
  }

  linear() {
    return this.setCalculator(new LinearCalculator());
  }

  bottom() {
    this.setType('bottom');
    return this.class('bottom');
  }

  left() {
    this.setType('left');
    return this.class('left');
  }

  right() {
    this.setType('right');
    return this.class('right');
  }

  top() {
    this.setType('top');
    return this.class('top');
  }

  resolveBefore(box, data) {
    this._calculator
      .setBuilder(this._builder)
      .setType(this._type)
      .setData(data)
      .prepare();

    const ticks = this._calculator.calculateTicks();
    const name = this._calculator.mapPositionName();

    let style = null;
    let text = null;

    for (let i = 0; i < ticks.length; i += 1) {
      [style, text] = ticks[i];

      this._node
        .append('div')
        .style(name, style)
        .text(this._format(text));
    }

    return this.resolveOuter(box, data);
  }
}
