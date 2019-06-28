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
      xaxis,
      yaxis
    ] = this._builder
      .selector(`.axis.${this._xtype}, .axis.${this._ytype}`)
      .resolve();

    const xcalc = xaxis.getCalculator();
    const ycalc = yaxis.getCalculator();

    const ymin = ycalc.getRange().min;

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

        if (this._area) {
          area[j] = area[j] || '';
        }

        line[j] = line[j] || '';

        if (i === 0) {
          if (this._area) {
            area[j] += area[j] + 'M ' +
              xcalc.calculate(key) + ' ' +
              ycalc.height - ycalc.calculate(ymin);
          }

          line[j] = line[j] + 'M ' +
            xcalc.calculate(key) + ' ' +
            ycalc.height - ycalc.calculate(to);
        }

        if (this._area) {
          area[j] = area[j] + ' L ' +
            xcalc.calculate(key) + ' ' +
            ycalc.height - ycalc.calculate(to);
        }

        line[j] = line[j] + ' L ' +
          xcalc.calculate(key) + ' ' +
          ycalc.height - ycalc.calculate(to);

        if (i === data.keys.length - 1) {
          if (this._area) {
            area[j] = area[j] + ' L ' +
              xcalc.calculate(key) + ' ' +
              ycalc.height - ycalc.calculate(ymin);
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
