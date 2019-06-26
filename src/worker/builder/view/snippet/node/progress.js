import { Node } from '../node';

export class Progress extends Node {
  resolveAfter(box, data) {
    if (data.lengthComputable !== true) {
      return this._node;
    }

    const fraction = data.loaded / data.total;

    this._node
      .classed('transition', true)
      .on('transitionend', () => {
        if (fraction === 1) {
          this._node
            .classed('transition', false)
            .style('width', null);
        }
      });

    this._node
      .style('width', (fraction * 100) + '%');

    return this._node;
  }
}
