import { select } from 'd3';
import { Node } from '../node';

export class Tip extends Node {
  removeOuter() {
    this._node
      .classed('transition', true)
      .classed('out', true)
      .on('transitionend.scola-tip', () => {
        this._node.on('transitionend.scola-tip', null);
        this.removeNode();
        this.removeInner();
      });
  }

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
      .classed('transition', true)
      .style('top', top + 'px')
      .style('left', left + 'px')
      .style('width', tipRect.width + 'px')
      .style('height', tipRect.height + 'px');

    this._node.classed('in', true);
  }
}
