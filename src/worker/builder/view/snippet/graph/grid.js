import { Axis } from './axis';
import { Node } from '../node';

export class Grid extends Node {
  resolveAfter() {
    const axes = this._builder.selector((snippet) => {
      return snippet instanceof Axis;
    }).resolve();

    let distance = null;
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

        this._node
          .append('div')
          .classed('line', true)
          .classed(orientation, true)
          .classed(position, true)
          .style(property, Math.floor(distance) + 'px');
      }
    }

    return this._node;
  }
}
