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

  resolveAfter(box, data) {
    const [
      yaxis,
      xaxis,
    ] = this._builder
      .selector(this._type.map((type) => `.axis.${type}`))
      .resolve();

    const xcalc = xaxis.getCalculator();
    const ycalc = yaxis.getCalculator();

    const ymin = ycalc.getDomain().min;

    let key = null;
    let set = null;

    let to = null;

    const area = [];
    const line = [];

    data = this.resolveData(data);

    for (let i = 0; i < data.keys.length; i += 1) {
      key = data.keys[i];
      set = data.data[key];

      for (let j = 0; j < set.length; j += 1) {
        [, to] = set[j];

        line[j] = line[j] || '';

        if (this._area) {
          area[j] = area[j] || '';
        }

        if (i === 0) {
          line[j] += this.resolveMove(key, to, xcalc, ycalc);

          if (this._area) {
            area[j] += this.resolveMove(key, ymin, xcalc, ycalc);
          }
        }

        line[j] += this.resolveLine(key, to, xcalc, ycalc);

        if (this._area) {
          area[j] += this.resolveLine(key, to, xcalc, ycalc);
        }

        if (i === data.keys.length - 1) {
          if (this._area) {
            area[j] += this.resolveMove(key, ymin, xcalc, ycalc);
          }
        }
      }
    }

    for (let i = line.length - 1; i >= 0; i -= 1) {
      this.resolvePath(line[i], 'line');

      if (this._area) {
        this.resolvePath(area[i], 'area');
      }
    }

    return this._node;
  }

  resolveLine(key, to, xcalc, ycalc) {
    return ' L ' +
      xcalc.calculateValue(key) + ' ' +
      (ycalc.getRange().height - ycalc.calculateValue(to));
  }

  resolveMove(key, to, xcalc, ycalc) {
    return 'M ' +
      xcalc.calculateValue(key) + ' ' +
      (ycalc.getRange().height - ycalc.calculateValue(to));
  }

  resolvePath(d, classed) {
    this._node
      .append('path')
      .classed(classed, true)
      .attr('d', d);
  }
}
