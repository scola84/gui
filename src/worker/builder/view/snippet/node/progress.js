import { Node } from '../node';

export class Progress extends Node {
  resolveAfter(box, data) {
    if (data.lengthComputable !== true) {
      return this._node;
    }

    const fraction = data.loaded / data.total;

    this._node
      .classed('transition', true)
      .style('width', (fraction * 100) + '%')
      .on('transitionend.scola-progress', () => {
        if (fraction === 1) {
          this._node
            .classed('transition', false)
            .style('width', null)
            .on('transitionend.scola-progress', null);
        }
      });

    return this._node;
  }
}
