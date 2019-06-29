import { Axis, Plot } from '../../snippet';

export class Calculator {
  constructor(options = {}) {
    this._builder = null;
    this._data = null;
    this._domain = null;
    this._range = null;
    this._step = null;
    this._type = null;

    this.setBuilder(options.builder);
    this.setData(options.data);
    this.setDomain(options.domain);
    this.setRange(options.range);
    this.setStep(options.step);
    this.setType(options.type);
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

  getDomain() {
    return this._domain;
  }

  setDomain(value = null) {
    this._domain = value;
    return this;
  }

  getRange() {
    return this._range;
  }

  setRange(value = null) {
    this._range = value;
    return this;
  }

  getStep() {
    return this._step;
  }

  setStep(value = null) {
    this._step = value;
    return this;
  }

  getType() {
    return this._type;
  }

  setType(value = null) {
    this._type = value;
    return this;
  }

  mapDimensionName() {
    return {
      bottom: 'width',
      left: 'height',
      right: 'height',
      top: 'width'
    } [this._type];
  }

  mapOrientationName() {
    return {
      bottom: 'x',
      left: 'y',
      right: 'y',
      top: 'x'
    } [this._type];
  }

  mapPositionName() {
    return {
      bottom: 'left',
      left: 'top',
      right: 'top',
      top: 'left'
    } [this._type];
  }

  calculateTicks() {}

  calculateValue(value) {
    return (value - this._domain.min) * this._step;
  }

  prepare() {
    return this.prepareDomain();
  }

  prepareDomain() {
    this._domain = {
      max: -Infinity,
      min: Infinity,
      size: 1,
      stack: false
    };

    const plots = this._builder
      .selector((snippet) => {
        return snippet instanceof Plot &&
          snippet.getType().indexOf(this._type) > -1;
      })
      .resolve();

    const name = this.mapOrientationName();

    let plotData = null;
    let domain = null;

    for (let i = 0; i < plots.length; i += 1) {
      plotData = plots[i].resolveData(this._data);
      domain = plotData[name];

      this._domain.max = Math.max(this._domain.max, domain.max);
      this._domain.min = Math.min(this._domain.min, domain.min);
      this._domain.size = plotData.size;
      this._domain.stack = plotData.stack;
    }

    return this.prepareRange();
  }

  prepareStep() {
    return this;
  }

  prepareRange() {
    const [axis] = this._builder.selector((snippet) => {
      return snippet instanceof Axis &&
        snippet.getType() === this._type;
    }).resolve();

    const style = window.getComputedStyle(axis.node().node());

    this._range = {
      height: this.prepareRangeFrom(
        style,
        ['height', 'padding-top', 'padding-bottom']
      ),
      width: this.prepareRangeFrom(
        style,
        ['width', 'padding-left', 'padding-right']
      )
    };

    return this.prepareStep();
  }

  prepareRangeFrom(style, names) {
    return names.reduce((result, name) => {
      const value = parseFloat(style[name]);
      return result === 0 ? value : result - value;
    }, 0);
  }
}
