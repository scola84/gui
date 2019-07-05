import { select } from 'd3';
import { Axis } from './axis';
import { Node } from '../node';

export class Grid extends Node {
  resolveAfter() {
    const axes = this._builder.selector((snippet) => {
      return snippet instanceof Axis;
    }).resolve();

    let distance = null;
    let line = null;
    let orientation = null;
    let position = null;
    let property = null;
    let scale = null;
    let ticks = null;

    for (let i = 0; i < axes.length; i += 1) {
      scale = axes[i].getScale();
      orientation = scale.mapOrientation();
      position = scale.getPosition();
      property = scale.mapPosition();
      ticks = scale.calculateTicks();

      for (let j = 0; j < ticks.length; j += 1) {
        [, distance] = ticks[j];

        line = this._node
          .append('div')
          .classed('line', true)
          .classed('transition', true)
          .classed(orientation, true)
          .classed(position, true)
          .style(property, Math.floor(distance) + 'px');

        line.style('width');
        line.classed('in', true);
      }
    }

    return this._node;
  }

  resolveBefore(box, data) {
    this._node
      .selectAll('.line')
      .classed('transition', true)
      .classed('out', true)
      .on('transitionend.scola-grid', (datum, index, nodes) => {
        select(nodes[index])
          .on('.scola-grid', null)
          .remove();
      });

    this.resolveOuter(box, data);
  }
}
