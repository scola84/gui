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
      .selector(this._type.map((type) => `.axis.${type}`))
      .resolve();

    const xcalc = xaxis.getCalculator();
    const ycalc = yaxis.getCalculator();

    let key = null;
    let set = null;

    data = this.resolveData(data);

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
    const [from, to] = set[j];

    const negative = to < 0;
    const rangeHeight = ycalc.getRange().height;

    const xValue = data.stack ? i : (i * set.length) + j;

    const yBegin = ycalc.calculateValue(from);
    const yEnd = ycalc.calculateValue(to);

    const x = xcalc.calculateValue(xValue);
    const width = xcalc.getStep();

    const y = negative ? rangeHeight - yBegin : rangeHeight - yEnd;
    const height = negative ? yBegin - yEnd : yEnd - yBegin;

    const rect = this._node
      .append('rect')
      .attr('x', x + width * this._padding)
      .attr('width', width - width * this._padding * 2)
      .attr('y', y)
      .attr('height', height);

    rect.style('left');

    rect
      .classed('negative', negative)
      .classed('transition', true)
      .classed('in', true);
  }
}
