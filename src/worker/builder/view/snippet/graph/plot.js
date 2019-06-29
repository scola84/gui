import { Node } from '../node';

import {
  DefaultPreparer,
  StackPreparer,
  SumPreparer
} from './plot/';

export class Plot extends Node {
  constructor(options = {}) {
    super(options);

    this._filter = null;
    this._preparer = null;
    this._type = null;
    this._x = null;
    this._y = null;

    this.setFilter(options.filter);
    this.setPreparer(options.preparer);
    this.setType(options.type);
    this.setX(options.x);
    this.setY(options.y);
  }

  getType() {
    return this._type;
  }

  setType(value = []) {
    this._type = value;
    return this._type;
  }

  addType(value) {
    this._type[this._type.length] = value;
    return this;
  }

  getFilter() {
    return this._filter;
  }

  setFilter(value = null) {
    this._filter = value;
    return this;
  }

  getPreparer() {
    return this._preparer;
  }

  setPreparer(value = new DefaultPreparer()) {
    this._preparer = value;
    return this;
  }

  getX() {
    return this._x;
  }

  setX(value = null) {
    this._x = value;
    return this;
  }

  getY() {
    return this._y;
  }

  setY(value = null) {
    this._y = value;
    return this;
  }

  bottom() {
    this.addType('bottom');
    return this.class('bottom');
  }

  default () {
    return this.setPreparer(new DefaultPreparer());
  }

  filter(value) {
    return this.setFilter(value);
  }

  left() {
    this.addType('left');
    return this.class('left');
  }

  right() {
    this.addType('right');
    return this.class('right');
  }

  top() {
    this.addType('top');
    return this.class('top');
  }

  stack() {
    return this.setPreparer(new StackPreparer());
  }

  sum() {
    return this.setPreparer(new SumPreparer());
  }

  x(value) {
    return this.setX(value);
  }

  y(value) {
    return this.setY(value);
  }

  prepareData(data) {
    data = this._preparer
      .setFilter(this._filter)
      .setX(this._x)
      .setY(this._y)
      .prepare(data);

    return data;
  }
}
