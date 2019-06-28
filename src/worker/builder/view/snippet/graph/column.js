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

    const mmx = xaxis.getMaxMin(box, data);
    const mmy = yaxis.getMaxMin(box, data);

    const svg = this._parent.node().node();
    const dim = svg.getBoundingClientRect();

    const dist = {
      x: dim.width / (mmx.maxX - mmx.minX + 1),
      y: dim.height / (mmy.maxY - mmy.minY)
    };

    const zeroY = dist.y * mmy.maxY;

    let key = null;
    let set = null;

    let from = null;
    let to = null;

    let baseY = null;
    let baseWidth = null;
    let height = null;
    let width = null;

    let x = null;
    let y = null;

    let rect = null;
    let stack = null;

    data = this.resolveData(box, data);

    for (let i = 0; i < data.keys.length; i += 1) {
      key = data.keys[i];
      set = data.data[key];

      stack = set.reduce((result, item) => {
        return item[0] !== 0;
      }, true);

      baseWidth = stack ? dist.x : dist.x / set.length;
      baseWidth = baseWidth - (baseWidth * this._padding);

      for (let j = 0; j < set.length; j += 1) {
        [from, to] = set[j];

        baseY = Math.abs(from) * dist.y;
        height = Math.abs(to - from) * dist.y;
        width = baseWidth - (baseWidth * this._padding);

        x = (i * dist.x);
        x = stack ? x : x + (j * baseWidth);
        x = x + (baseWidth * this._padding);
        x = stack && set.length > 1 ? x : x + (baseWidth * this._padding);

        y = zeroY;
        y = to < 0 ? y + baseY : zeroY - baseY - height;

        rect = this._node
          .append('rect')
          .attr('height', height)
          .attr('width', width)
          .attr('x', x)
          .attr('y', y);

        rect.style('left');

        rect
          .classed('negative', to < 0)
          .classed('transition', true)
          .classed('in', true);
      }
    }

    return this._node;
  }
}
