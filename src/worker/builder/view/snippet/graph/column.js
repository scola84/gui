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
    const [
      yaxis,
      xaxis
    ] = this._builder
      .selector(this._data.getType().map((type) => {
        return `.axis.${type}`;
      }))
      .resolve();

    const xcalc = xaxis.getScale();
    const ycalc = yaxis.getScale();

    let key = null;
    let set = null;

    data = this.prepareData(data);

    for (let i = 0; i < data.keys.length; i += 1) {
      key = data.keys[i];
      set = data.data[key];

      for (let j = 0; j < set.length; j += 1) {
        this.resolveColumn(i, j, set, data, xcalc, ycalc);
      }
    }

    return this._node;
  }

  resolveColumn(i, j, set, data, xcalc, ycalc) {
    const [from, to] = set[j] || [0, 0];

    const isNegative = to < 0;
    const isZero = to === 0;

    const rangeHeight = ycalc.getRange().height;

    const xValue = data.type !== 'stack' ?
      (i * set.length) + j : i;

    const yBegin = ycalc.calculateDistance(from);
    const yEnd = ycalc.calculateDistance(to);

    const x = xcalc.calculateDistance(xValue);
    const width = xcalc.getStep();

    let y = rangeHeight - yEnd;
    let height = yEnd - yBegin;

    y = isNegative ? rangeHeight - yBegin : y;
    height = isNegative ? yBegin - yEnd : height;

    y = isZero ? y - 3 : y;
    height = isZero ? 3 : height;

    const rect = this._node
      .append('rect')
      .classed('negative', isNegative)
      .classed('zero', isZero)
      .attr('x', x + width * this._padding)
      .attr('width', width - width * this._padding * 2)
      .attr('y', y)
      .attr('height', height);

    rect.style('left');

    rect
      .classed('transition', true)
      .classed('in', true);
  }
}
