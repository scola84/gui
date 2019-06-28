import { Node } from '../node';

export class Plot extends Node {
  constructor(options = {}) {
    super(options);

    this._filter = null;
    this._x = null;
    this._xtype = null;
    this._y = null;
    this._ytype = null;

    this._stack = null;
    this._sum = null;

    this.setFilter(options.filter);
    this.setX(options.x);
    this.setXtype(options.xtype);
    this.setY(options.y);
    this.setYtype(options.ytype);
  }

  getFilter() {
    return this._filter;
  }

  setFilter(value = null) {
    this._filter = value;
    return this;
  }

  getX() {
    return this._x;
  }

  setX(value = null) {
    this._x = value;
    return this;
  }

  getXtype() {
    return this._xtype;
  }

  setXtype(value = null) {
    this._xtype = value;
    return this;
  }

  getY() {
    return this._y;
  }

  setY(value = null) {
    this._y = value;
    return this;
  }

  getYtype() {
    return this._ytype;
  }

  setYtype(value = null) {
    this._ytype = value;
    return this;
  }

  filter(value) {
    this._filter = value;
    return this;
  }

  x(value) {
    this._x = value;
    return this;
  }

  y(value) {
    this._y = value;
    return this;
  }

  stack() {
    this._stack = true;
    return this;
  }

  sum() {
    this._sum = true;
    return this;
  }

  bottom() {
    this.setXtype('bottom');
    return this.class('bottom');
  }

  left() {
    this.setYtype('left');
    return this.class('left');
  }

  right() {
    this.setYtype('right');
    return this.class('right');
  }

  top() {
    this.setXtype('top');
    return this.class('top');
  }

  resolveData(box, data) {
    data = data.filter(this._filter);

    const result = {
      data: {},
      keys: [],
      size: 0,
      maxX: -Infinity,
      minX: Infinity,
      maxY: -Infinity,
      minY: Infinity,
    };

    let x = null;
    let y = null;

    let base = null;
    let next = null;

    for (let i = 0; i < data.length; i += 1) {
      x = this._x(data[i]);
      y = this._y(data[i]);

      result.data[x] = result.data[x] || [];

      base = result.data[x];
      next = base.length;

      result.size = next + 1;

      if (next === 0) {
        base[next] = [0, y];
      } else if (this._stack) {
        base[next] = [
          base[next - 1][1],
          base[next - 1][1] + y
        ];
      } else if (this._sum) {
        next = next - 1;
        base[next] = [0, base[next][1] + y];
      } else {
        base[next] = [0, y];
      }

      result.maxX = Math.max(result.maxX, x);
      result.minX = Math.min(result.minX, x);
      result.maxY = Math.max(result.maxY, base[next][1]);
      result.minY = Math.min(result.minY, base[next][1]);
    }

    result.keys = Object.keys(result.data);

    return result;
  }
}
