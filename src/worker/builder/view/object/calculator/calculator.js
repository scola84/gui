export class Calculator {
  constructor(options = {}) {
    this._builder = null;
    this._data = null;
    this._dimension = null;
    this._orientation = null;
    this._parent = null;
    this._ppu = null;
    this._range = null;

    this.setBuilder(options.builder);
    this.setData(options.data);
    this.setDimension(options.dimension);
    this.setOrientation(options.orientation);
    this.setParent(options.parent);
    this.setPpu(options.ppu);
    this.setRange(options.range);
  }

  getBuilder() {
    return this._builder;
  }

  setBuilder(value = null) {
    this._builder = value;
    return this;
  }

  getData() {
    return this._data;
  }

  setData(value = null) {
    this._data = value;
    return this;
  }

  getDimension() {
    return this._dimension;
  }

  setDimension(value = null) {
    this._dimension = value;
    return this;
  }

  getOrientation() {
    return this._orientation;
  }

  setOrientation(value = null) {
    this._orientation = value;
    return this;
  }

  getParent() {
    return this._parent;
  }

  setParent(value = null) {
    this._parent = value;
    return this;
  }

  getPpu() {
    return this._ppu;
  }

  setPpu(value = null) {
    this._ppu = value;
    return this;
  }

  getRange() {
    return this._range;
  }

  setRange(value = null) {
    this._range = value;
    return this;
  }

  getType() {
    return this._type;
  }

  setType(value = null) {
    this._type = value;
    return this;
  }

  calculateDimension() {
    this._dimension = this._parent
      .node()
      .node()
      .getBoundingClientRect();
  }

  calculatePpu() {}

  calculateRange() {
    this._range = {
      max: -Infinity,
      min: Infinity
    };

    const plots = this._builder
      .selector((s) => {
        return s.getXtype && (
          s.getXtype() === this._type ||
          s.getYtype() === this._type
        );
      })
      .resolve();

    let plotData = null;
    let range = null;

    for (let i = 0; i < plots.length; i += 1) {
      plotData = plots[i].resolveData(this._data);
      range = plotData[this._orientation];

      this._range.max = Math.max(this._range.max, range.max);
      this._range.min = Math.min(this._range.min, range.min);
    }
  }

  setup() {
    if (this._range === null) {
      this.calculateRange();
    }

    if (this._dimension === null) {
      this.calculateDimension();
    }

    if (this._ppu === null) {
      this.calculatePpu();
    }
  }
}
