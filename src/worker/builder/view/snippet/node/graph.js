import { Node } from '../node';

export class Graph extends Node {
  resolveBefore(box, data) {
    const node = this._node.node();
    const dim = node.getBoundingClientRect();

    this._node.style('height', (dim.width / 2) + 'px');

    return this.resolveOuter(box, data);
  }
}
