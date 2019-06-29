import { Node } from '../node';

export class Plot extends Node {
  constructor(options = {}) {
    super(options);

    this._filter = null;
    this._type = null;
    this._x = null;
    this._y = null;

    this._stack = null;
    this._sum = null;

    this.setFilter(options.filter);
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
    this._stack = true;
    return this;
  }

  sum() {
    this._sum = true;
    return this;
  }

  x(value) {
    return this.setX(value);
  }

  y(value) {
    return this.setY(value);
  }

  resolveData(data) {
    data = data.filter(this._filter);

    const result = {
      data: {},
      keys: [],
      size: 0,
      stack: false,
      x: {
        max: -Infinity,
        min: Infinity
      },
      y: {
        max: -Infinity,
        min: Infinity
      }
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
        result.stack = true;
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

      result.x.max = Math.max(result.x.max, x);
      result.x.min = Math.min(result.x.min, x);
      result.y.max = Math.max(result.y.max, base[next][1]);
      result.y.min = Math.min(result.y.min, base[next][1]);
    }

    result.keys = Object.keys(result.data);

    return result;
  }
}
