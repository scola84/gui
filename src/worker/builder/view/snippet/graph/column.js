import { Plot } from './plot';

export class Column extends Plot {
  constructor(options = {}) {
    super(options);

    this._padding = null;
    this.setPadding(options.padding);

    this
      .name('g')
      .class('plot');
  }

  getPadding() {
    return this._padding;
  }

  setPadding(value = 0) {
    this._padding = value;
    return this;
  }

  padding(value) {
    return this.setPadding(value);
  }

  resolveAfter(box, data) {
    const endogenous = this.findScale('endogenous');
    const exogenous = this.findScale('exogenous');

    let key = null;
    let set = null;

    data = this.prepareData(data);

    for (let i = 0; i < data.keys.length; i += 1) {
      key = data.keys[i];
      set = data.data[key];

      for (let j = 0; j < set.length; j += 1) {
        this.resolveColumn(key, j, set, data, endogenous, exogenous);
      }
    }

    return this._node;
  }

  resolveColumn(key, j, set, data, endogenous, exogenous) {
    const [from, to] = set[j] || [0, 0];

    const isNegative = to < 0;
    const isZero = to === 0;

    const endogenousRange = endogenous.mapRange();
    const endogenousOrientation = endogenous.mapOrientation();

    const begin = endogenous.calculateDistance(from);
    const end = endogenous.calculateDistance(to);

    let endogenousDistance = endogenous.normalizeDistance(end);
    let endogenousSize = end - begin;

    if (isNegative) {
      endogenousDistance = endogenous.normalizeDistance(begin);
      endogenousSize = begin - end;
    }

    if (isZero) {
      endogenousDistance -= 3;
      endogenousSize = 3;
    }

    const exogenousRange = exogenous.mapRange();
    const exogenousOrientation = exogenous.mapOrientation();

    let exogenousDistance = exogenous.calculateDistance(key);
    // console.log(value, exogenousDistance);
    let exogenousSize = exogenous.getPpu();

    if (data.type === 'group') {
      exogenousDistance += j * exogenousSize;
    }

    exogenousDistance += exogenousSize * this._padding;
    exogenousSize -= exogenousSize * this._padding * 2;

    const rect = this._node
      .append('rect')
      .classed('negative', isNegative)
      .classed('zero', isZero);

    rect
      .attr(endogenousOrientation, endogenousDistance)
      .attr(endogenousRange, endogenousSize)
      .attr(exogenousOrientation, exogenousDistance)
      .attr(exogenousRange, exogenousSize);

    rect.style('left');

    rect
      .classed('transition', true)
      .classed('in', true);
  }
}
