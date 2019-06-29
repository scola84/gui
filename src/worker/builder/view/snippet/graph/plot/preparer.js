export class Preparer {
  constructor(options = {}) {
    this._filter = null;
    this._x = null;
    this._y = null;

    this.setFilter(options.filter);
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

  max(object, value) {
    object.max = Math.max(object.max, value);
  }

  min(object, value) {
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

    let index = null;
    let key = null;
    let type = null;

    let x = null;
    let y = null;

    data = data.filter(this._filter);

    for (let i = 0; i < data.length; i += 1) {
      x = this._x(data[i]);
      y = this._y(data[i]);

      [index, type] = this.prepareValue(result, x, y);

      result.size = index + 1;
      result.type = type;

      this.max(result.y, result.data[x][index][1]);
      this.min(result.y, result.data[x][index][1]);
    }

    for (let i = 0; i < result.keys.length; i += 1) {
      key = result.keys[i];
      key = typeof key === 'string' ? i + 1 : key;

      this.max(result.x, key);
      this.min(result.x, key);
    }

    return result;
  }

  prepareValue() {}
}
