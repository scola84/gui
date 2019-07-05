import { select } from 'd3';
import { Plot } from './plot';

export class Path extends Plot {
  constructor(options = {}) {
    super(options);

    this._fill = null;
    this.setFill(options.fill);

    this
      .name('g')
      .class('plot');
  }

  getFill() {
    return this._fill;
  }

  setFill(value = false) {
    this._fill = value;
    return this;
  }

  fill() {
    return this.setFill(true);
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

    const fill = [];
    const stroke = [];

    let endogenousDistance = null;
    let exogenousDistance = null;

    let min = null;
    let value = null;

    data = this.prepare(data);

    for (let i = 0; i < data.keys.length; i += 1) {
      key = data.keys[i];
      set = data.data[key];

      for (let j = 0; j < set.length; j += 1) {
        [, to] = set[j];

        fill[j] = fill[j] || '';
        stroke[j] = stroke[j] || '';

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
          fill[j] += 'M ' + min;
          stroke[j] += 'M ' + value;
        }

        fill[j] += ' L ' + value;
        stroke[j] += ' L ' + value;

        if (i === data.keys.length - 1) {
          fill[j] += ' L ' + min;
        }
      }
    }

    let node = null;

    for (let i = stroke.length - 1; i >= 0; i -= 1) {
      if (this._fill) {
        node = this._node
          .append('path')
          .attr('d', fill[i])
          .classed('fill', true)
          .classed('transition', true);

        node.style('width');
        node.classed('in', true);
      }

      node = this._node
        .append('path')
        .attr('d', stroke[i])
        .classed('stroke', true)
        .classed('transition', true);

      node.style('width');
      node.classed('in', true);
    }

    return this._node;
  }

  resolveBefore(box, data) {
    this._node
      .selectAll('path')
      .classed('transition', true)
      .classed('out', true)
      .on('transitionend.scola-path', (datum, index, nodes) => {
        select(nodes[index])
          .on('.scola-path', null)
          .remove();
      });

    this.resolveOuter(box, data);
  }
}
