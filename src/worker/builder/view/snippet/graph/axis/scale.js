import { Plot } from '../plot';

export class Scale {
  constructor(options = {}) {
    this._axis = null;
    this._count = null;
    this._domain = null;
    this._max = null;
    this._min = null;
    this._name = null;
    this._position = null;
    this._ppu = null;
    this._range = null;
    this._step = null;

    this.setAxis(options.axis);
    this.setCount(options.count);
    this.setDomain(options.domain);
    this.setMax(options.max);
    this.setMin(options.min);
    this.setName(options.name);
    this.setPosition(options.type);
    this.setPpu(options.ppu);
    this.setRange(options.range);
    this.setStep(options.step);
  }

  getAxis() {
    return this._axis;
  }

  setAxis(value = null) {
    this._axis = value;
    return this;
  }

  getCount() {
    return this._count;
  }

  setCount(value = 1) {
    this._count = value;
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

  getName() {
    return this._name;
  }

  setName(value = null) {
    this._name = value;
    return this;
  }

  getPosition() {
    return this._position;
  }

  setPosition(value = null) {
    this._position = value;
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

  axis(value) {
    return this.setAxis(value);
  }

  count(value) {
    return this.setCount(value);
  }

  bottom() {
    return this.setPosition('bottom');
  }

  endogenous() {
    return this.setType('endogenous');
  }

  exogenous() {
    return this.setType('exogenous');
  }

  left() {
    return this.setPosition('left');
  }

  max(value) {
    return this.setMax(value);
  }

  min(value) {
    return this.setMin(value);
  }

  position(value) {
    return this.setPosition(value);
  }

  right() {
    return this.setPosition('right');
  }

  step(value) {
    return this.setStep(value);
  }

  top() {
    return this.setPosition('top');
  }

  type(value) {
    return this.setType(value);
  }

  calculateDistance() {}

  calculateTicks() {}

  mapOrientation() {
    return {
      bottom: 'x',
      left: 'y',
      right: 'y',
      top: 'x'
    } [this._position];
  }

  mapPosition() {
    return {
      bottom: 'left',
      left: 'top',
      right: 'top',
      top: 'left'
    } [this._position];
  }

  mapRange() {
    return {
      bottom: 'width',
      left: 'height',
      right: 'height',
      top: 'width'
    } [this._position];
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

    const plots = this._axis.getBuilder().selector((snippet) => {
      return snippet instanceof Plot &&
        snippet.getData().getPosition().indexOf(this._position) > -1;
    }).resolve();

    let plotData = null;

    for (let i = 0; i < plots.length; i += 1) {
      plotData = plots[i].prepare(data);

      this._domain.size = plotData.size;
      this._domain.type = plotData.type;

      this.prepareDomainKeys(plotData);

      if (this._type === 'endogenous') {
        this.prepareDomainEndogenous(plotData);
      } else {
        this.prepareDomainExogenous(plotData);
      }
    }

    return this.prepareRange();
  }

  prepareDomainEndogenous(data) {
    let key = null;
    let set = null;

    const values = [];

    for (let i = 0; i < data.keys.length; i += 1) {
      key = data.keys[i];
      set = data.data[key];

      for (let j = 0; j < set.length; j += 1) {
        values[values.length] = set[j][1];
      }
    }

    this.prepareDomainMax(values);
    this.prepareDomainMin(values);
  }

  prepareDomainExogenous() {}

  prepareDomainKeys(data) {
    let key = null;

    for (let i = 0; i < data.keys.length; i += 1) {
      key = data.keys[i];

      if (this._domain.keys.indexOf(key) === -1) {
        this._domain.keys[this._domain.keys.length] = key;
      }
    }
  }

  prepareDomainMax(values) {
    let max = Math.max(this._domain.max, ...values);

    if (this._max === 'auto') {
      max = max < 0 ? 0 : max;
    } else if (typeof this._max === 'number') {
      max = max < this._max ? this._max : max;
    }

    this._domain.max = max;
  }

  prepareDomainMin(values) {
    let min = Math.min(this._domain.min, ...values);

    if (this._min === 'auto') {
      min = min > 0 ? 0 : min;
    } else if (typeof this._min === 'number') {
      min = min > this._min ? this._min : min;
    }

    this._domain.min = min;
  }

  prepareRange() {
    const node = this._axis.node().node();
    const style = window.getComputedStyle(node);

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

    return this.preparePpu();
  }

  prepareRangeFrom(style, names) {
    return names.reduce((result, name) => {
      const value = parseFloat(style[name]);
      return result === 0 ? value : result - value;
    }, 0);
  }

  preparePpu() {
    const name = this.mapRange();

    this._ppu = this._range[name] /
      (this._domain.max - this._domain.min);

    return this;
  }
}
