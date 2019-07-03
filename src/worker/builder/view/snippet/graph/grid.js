import { Axis } from './axis';
import { Node } from '../node';

export class Grid extends Node {
  constructor(options) {
    super(options);

    this
      .name('g')
      .class('grid');
  }

  mapOpposite(orientation) {
    return {
      x: 'y',
      y: 'x'
    } [orientation];
  }

  resolveAfter() {
    const axes = this._builder.selector((snippet) => {
      return snippet instanceof Axis;
    }).resolve();

    let distance = null;
    let orientation = null;
    let position = null;
    let scale = null;
    let ticks = null;

    for (let i = 0; i < axes.length; i += 1) {
      scale = axes[i].getScale();
      orientation = scale.mapOrientation();
      position = scale.getPosition();
      ticks = scale.calculateTicks();

      for (let j = 0; j < ticks.length; j += 1) {
        [, distance] = ticks[j];

        this._node
          .append('line')
          .classed('line', true)
          .classed(orientation, true)
          .classed(position, true)
          .attr(orientation + '1', distance)
          .attr(orientation + '2', distance)
          .attr(this.mapOpposite(orientation) + '1', 0)
          .attr(this.mapOpposite(orientation) + '2', '100%');
      }
    }

    return this._node;
  }
}
