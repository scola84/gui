export class Data {
  constructor(options = {}) {
    this._filter = null;
    this._type = null;
    this._x = null;
    this._y = null;

    this.setFilter(options.filter);
    this.setType(options.type);
    this.setX(options.x);
    this.setY(options.y);
  }

  getFilter() {
    return this._filter;
  }

  setFilter(value = null) {
    this._filter = value;
    return this;
  }

  getType() {
    return this._type;
  }

  setType(value = []) {
    this._type = value;
    return this;
  }

  addType(value) {
    this._type[this._type.length] = value;
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
    return this.addType('bottom');
  }

  filter(value) {
    return this.setFilter(value);
  }

  left() {
    return this.addType('left');
  }

  right() {
    return this.addType('right');
  }

  top() {
    return this.addType('top');
  }

  x(value) {
    return this.setX(value);
  }

  y(value) {
    return this.setY(value);
  }

  changeMax(object, value) {
    object.max = Math.max(object.max, value);
  }

  changeMin(object, value) {
    object.min = Math.min(object.min, value);
  }

  prepare(data) {
    const result = {
      data: {},
      keys: [],
      size: 0,
      type: null,
      x: {
        max: -Infinity,
        min: Infinity
      },
      y: {
        max: -Infinity,
        min: Infinity
      }
    };

    let datum = null;
    let index = null;
    let key = null;
    let type = null;

    let x = null;
    let y = null;

    data = data.filter(this._filter);

    for (let i = 0; i < data.length; i += 1) {
      datum = data[i];

      x = this._x(datum);
      y = this._y(datum);

      [index, type] = this.prepareValue(result, x, y, datum);

      result.size = index + 1;
      result.type = type;

      this.changeMax(result.y, result.data[x][index][1]);
      this.changeMin(result.y, result.data[x][index][1]);
    }

    for (let i = 0; i < result.keys.length; i += 1) {
      key = result.keys[i];
      key = typeof key === 'string' ? i + 1 : key;

      this.changeMax(result.x, key);
      this.changeMin(result.x, key);
    }

    return result;
  }

  prepareValue() {}
}
