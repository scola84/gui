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
      xaxis,
      yaxis
    ] = this._builder
      .selector(`.axis.${this._xtype}, .axis.${this._ytype}`)
      .resolve();

    const xcalc = xaxis.getCalculator();
    const ycalc = yaxis.getCalculator();

    const dimHeight = ycalc.getDimension().height;

    let key = null;
    let set = null;

    let from = null;
    let to = null;

    let negative = null;

    let height = null;
    let width = null;

    let x = null;
    let y = null;

    let yBegin = null;
    let yEnd = null;

    let rect = null;

    data = this.resolveData(data);

    for (let i = 0; i < data.keys.length; i += 1) {
      key = data.keys[i];
      set = data.data[key];

      for (let j = 0; j < set.length; j += 1) {
        [from, to] = set[j];

        negative = to < 0;

        yBegin = ycalc.calculate(from);
        yEnd = ycalc.calculate(to);

        [x, width] = xcalc.calculate(i, j,
          set.length, data.stack, this._padding);

        y = negative ? dimHeight - yBegin : dimHeight - yEnd;
        height = negative ? yBegin - yEnd : yEnd - yBegin;

        rect = this._node
          .append('rect')
          .attr('x', x)
          .attr('width', width)
          .attr('y', y)
          .attr('height', height);

        rect.style('left');

        rect
          .classed('negative', negative)
          .classed('transition', true)
          .classed('in', true);
      }
    }

    return this._node;
  }
}
