import { select } from 'd3';
import { Node } from '../node';

export class Tip extends Node {
  resolveAfter(box, data) {
    select('body').insert(() => this._node.node());

    const targetRect = data.target.getBoundingClientRect();
    const tipRect = this._node.node().getBoundingClientRect();

    const left = targetRect.left +
      (targetRect.width / 2) -
      (tipRect.width / 2);

    const top = targetRect.top -
      tipRect.height;

    this._node
      .style('top', top + 'px')
      .style('left', left + 'px')
      .style('width', tipRect.width + 'px')
      .style('height', tipRect.height + 'px');
  }
}
