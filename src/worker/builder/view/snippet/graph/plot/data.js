export class Data {
  constructor(options = {}) {
    this._filter = null;
    this._exogenous = null;
    this._endogenous = null;
    this._position = null;

    this.setFilter(options.filter);
    this.setExogenous(options.exogenous);
    this.setEndogenous(options.endogenous);
    this.setPosition(options.position);
  }

  getFilter() {
    return this._filter;
  }

  setFilter(value = null) {
    this._filter = value;
    return this;
  }

  getExogenous() {
    return this._exogenous;
  }

  setExogenous(value = null) {
    this._exogenous = value;
    return this;
  }

  getEndogenous() {
    return this._endogenous;
  }

  setEndogenous(value = null) {
    this._endogenous = value;
    return this;
  }

  getPosition() {
    return this._position;
  }

  setPosition(value = []) {
    this._position = value;
    return this;
  }

  addPosition(value) {
    this._position[this._position.length] = value;
    return this;
  }

  bottom() {
    return this.addPosition('bottom');
  }

  filter(value) {
    return this.setFilter(value);
  }

  left() {
    return this.addPosition('left');
  }

  right() {
    return this.addPosition('right');
  }

  top() {
    return this.addPosition('top');
  }

  exogenous(value) {
    return this.setExogenous(value);
  }

  endogenous(value) {
    return this.setEndogenous(value);
  }

  prepare(data) {
    const result = {
      data: {},
      keys: [],
      type: null
    };

    data = data.filter(this._filter);

    for (let i = 0; i < data.length; i += 1) {
      this.prepareValue(result, data[i]);
    }

    return result;
  }

  prepareValue() {}
}
