import { Node } from '../node';

import {
  BandCalculator,
  LinearCalculator
} from '../../object';

export class Axis extends Node {
  constructor(options = {}) {
    super(options);

    this._calculator = null;
    this._orientation = null;
    this._type = null;

    this.setCalculator(options.calculator);
    this.setOrientation(options.orientation);
    this.setType(options.type);
  }

  getCalculator() {
    return this._calculator;
  }

  setCalculator(value = null) {
    this._calculator = value;
    return this;
  }

  getOrientation() {
    return this._orientation;
  }

  setOrientation(value = null) {
    this._orientation = value;
    return this;
  }

  calculator(value) {
    return this.setCalculator(value);
  }

  getType() {
    return this._type;
  }

  setType(value = null) {
    this._type = value;
    return this;
  }

  band() {
    return this.setCalculator(new BandCalculator());
  }

  linear() {
    return this.setCalculator(new LinearCalculator());
  }

  bottom() {
    this.setOrientation('x');
    this.setType('bottom');
    return this.class('bottom');
  }

  left() {
    this.setOrientation('y');
    this.setType('left');
    return this.class('left');
  }

  right() {
    this.setOrientation('y');
    this.setType('right');
    return this.class('right');
  }

  top() {
    this.setOrientation('x');
    this.setType('top');
    return this.class('top');
  }

  resolveBefore(box, data) {
    this._calculator
      .setBuilder(this._builder)
      .setOrientation(this._orientation)
      .setParent(this._parent)
      .setType(this._type)
      .setData(data)
      .setup();

    return this.resolveOuter(box, data);
  }
}
