import { Plot } from './plot';

export class Line extends Plot {
  constructor(options = {}) {
    super(options);

    this._area = null;
    this.setArea(options.area);

    this
      .name('g')
      .class('plot');
  }

  getArea() {
    return this._area;
  }

  setArea(value = false) {
    this._area = value;
    return this;
  }

  area() {
    return this.setArea(true);
  }

  calculate(mmx, mmy, dim, dist, x, y) {
    return [
      (x - mmx.minX) * dist.x,
      dim.height - ((y - mmy.minY) * dist.y)
    ].join(' ');
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
      x: dim.width / (mmx.maxX - mmx.minX),
      y: dim.height / (mmy.maxY - mmy.minY)
    };

    let key = null;
    let set = null;

    let to = null;

    const area = [];
    const line = [];

    data = this.resolveData(box, data);

    for (let i = 0; i < data.keys.length; i += 1) {
      key = data.keys[i];
      set = data.data[key];

      for (let j = 0; j < set.length; j += 1) {
        [, to] = set[j];

        if (this._area) {
          area[j] = area[j] || '';
        }

        line[j] = line[j] || '';

        if (i === 0) {
          if (this._area) {
            area[j] += area[j] + 'M ' +
              this.calculate(mmx, mmy, dim, dist, key, mmy.minY);
          }

          line[j] = line[j] + 'M ' +
            this.calculate(mmx, mmy, dim, dist, key, to);
        }

        if (this._area) {
          area[j] = area[j] + ' L ' +
            this.calculate(mmx, mmy, dim, dist, key, to);
        }

        line[j] = line[j] + ' L ' +
          this.calculate(mmx, mmy, dim, dist, key, to);

        if (i === data.keys.length - 1) {
          if (this._area) {
            area[j] = area[j] + ' L ' +
              this.calculate(mmx, mmy, dim, dist, key, mmy.minY);
          }
        }
      }
    }

    for (let i = line.length - 1; i >= 0; i -= 1) {
      if (this._area) {
        this._node
          .append('path')
          .classed('area', true)
          .attr('d', area[i]);
      }

      this._node
        .append('path')
        .attr('d', line[i]);
    }

    return this._node;
  }
}
