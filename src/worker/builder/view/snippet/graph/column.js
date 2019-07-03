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

    data = this.prepare(data);

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

    const endogenousRange = endogenous.mapRange();
    const endogenousOrientation = endogenous.mapOrientation();

    const begin = endogenous.calculateDistance(from);
    let end = endogenous.calculateDistance(to);

    if (begin === end) {
      end = endogenous.calculateDistance(3 / endogenous.getPpu());
    }

    let endogenousDistance = end;
    let endogenousSize = begin - end;

    if (begin < end) {
      endogenousDistance = begin;
      endogenousSize = end - begin;
    }

    const exogenousRange = exogenous.mapRange();
    const exogenousOrientation = exogenous.mapOrientation();

    let exogenousDistance = exogenous.calculateDistance(key);
    let exogenousSize = exogenous.getPpu();

    if (exogenous.getDomain().type === 'group') {
      exogenousSize /= exogenous.getDomain().size;
      exogenousDistance += j * exogenousSize;
      exogenousDistance -= exogenousSize;
    }

    exogenousDistance -= exogenousSize * 0.5;
    exogenousDistance += exogenousSize * this._padding;
    exogenousSize -= exogenousSize * this._padding * 2;

    const rect = this._node
      .append('rect')
      .classed('column', true)
      .classed('negative', to < 0)
      .classed('zero', to === 0);

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
