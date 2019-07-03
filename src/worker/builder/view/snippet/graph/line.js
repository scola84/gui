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

  createValue(index1, value1, index2, value2) {
    const value = [];

    value[index1] = value1;
    value[index2] = value2;

    return value.join(' ');
  }

  mapIndex(orientation) {
    return {
      x: 0,
      y: 1
    } [orientation];
  }

  resolveAfter(box, data) {
    const endogenous = this.findScale('endogenous');
    const exogenous = this.findScale('exogenous');

    const endogenousOrientation = endogenous.mapOrientation();
    const endogenousIndex = this.mapIndex(endogenousOrientation);

    const exogenousOrientation = exogenous.mapOrientation();
    const exogenousIndex = this.mapIndex(exogenousOrientation);

    const endogenousMin = endogenous.calculateDistance(
      endogenous.getDomain().min
    );

    let key = null;
    let set = null;

    let to = null;

    const area = [];
    const line = [];

    let endogenousDistance = null;
    let exogenousDistance = null;

    let min = null;
    let value = null;

    data = this.prepareData(data);

    for (let i = 0; i < data.keys.length; i += 1) {
      key = data.keys[i];
      set = data.data[key];

      for (let j = 0; j < set.length; j += 1) {
        [, to] = set[j];

        line[j] = line[j] || '';
        area[j] = area[j] || '';

        endogenousDistance = endogenous.calculateDistance(to);
        exogenousDistance = exogenous.calculateDistance(key);

        value = this.createValue(
          endogenousIndex,
          endogenousDistance,
          exogenousIndex,
          exogenousDistance
        );

        min = this.createValue(
          endogenousIndex,
          endogenousMin,
          exogenousIndex,
          exogenousDistance
        );

        if (i === 0) {
          line[j] += 'M ' + value;
          area[j] += 'M ' + min;
        }

        line[j] += ' L ' + value;
        area[j] += ' L ' + value;

        if (i === data.keys.length - 1) {
          area[j] += ' L ' + min;
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
        .classed('line', true)
        .attr('d', line[i]);
    }

    return this._node;
  }
}
