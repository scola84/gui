import { Axis, Plot } from '../';

export class Scale {
  constructor(options = {}) {
    this._builder = null;
    this._domain = null;
    this._max = null;
    this._min = null;
    this._range = null;
    this._step = null;
    this._type = null;

    this.setBuilder(options.builder);
    this.setDomain(options.domain);
    this.setMax(options.max);
    this.setMin(options.min);
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

  getDomain() {
    return this._domain;
  }

  setDomain(value = null) {
    this._domain = value;
    return this;
  }

  getMax() {
    return this._max;
  }

  setMax(value = null) {
    this._max = value;
    return this;
  }

  getMin() {
    return this._min;
  }

  setMin(value = null) {
    this._min = value;
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

  bottom() {
    return this.setType('bottom');
  }

  left() {
    return this.setType('left');
  }

  max(value) {
    return this.setMax(value);
  }

  min(value) {
    return this.setMin(value);
  }

  right() {
    return this.setType('right');
  }

  top() {
    return this.setType('top');
  }

  type(value) {
    return this.setType(value);
  }

  calculateDistance(value) {
    return (value - this._domain.min) * this._step;
  }

  calculateTicks() {}

  changeMax(object, value) {
    if (this._max === 'auto') {
      value = value < 0 ? 0 : value;
    } else if (Number.isFinite(this._max)) {
      value = value < this._max ? this._max : value;
    }

    object.max = Math.max(object.max, value);
  }

  changeMin(object, value) {
    if (this._min === 'auto') {
      value = value > 0 ? 0 : value;
    } else if (Number.isFinite(this._min)) {
      value = value > this._min ? this._min : value;
    }

    object.min = Math.min(object.min, value);
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
      bottom: 'right',
      left: 'top',
      right: 'top',
      top: 'right'
    } [this._type];
  }

  mapRangeName() {
    return {
      bottom: 'width',
      left: 'height',
      right: 'height',
      top: 'width'
    } [this._type];
  }

  prepare(data) {
    return this.prepareDomain(data);
  }

  prepareDomain(data) {
    this._domain = {
      keys: [],
      max: -Infinity,
      min: Infinity,
      size: 1,
      type: null
    };

    const plots = this._builder
      .selector((snippet) => {
        return snippet instanceof Plot &&
          snippet.getData().getType().indexOf(this._type) > -1;
      })
      .resolve();

    const name = this.mapOrientationName();

    let plotData = null;
    let domain = null;

    for (let i = 0; i < plots.length; i += 1) {
      plotData = plots[i].prepareData(data);
      domain = plotData[name];

      this.changeMax(this._domain, domain.max);
      this.changeMin(this._domain, domain.min);

      this._domain.keys = plotData.keys;
      this._domain.size = plotData.size;
      this._domain.type = plotData.type;
    }

    return this.prepareRange();
  }

  prepareRange() {
    const [axis] = this._builder.selector((snippet) => {
      return snippet instanceof Axis &&
        snippet.getScale().getType() === this._type;
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

  prepareStep() {
    return this;
  }
}
