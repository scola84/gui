import { select, selectAll } from 'd3';
import { Node } from './node';

export class Generator extends Node {
  appendChild(box, data, snippet = null) {
    if (snippet === null) {
      return null;
    }

    let node = snippet
      .clone()
      .resolve(box, data);

    node = Array.isArray(node) ? node[0] : node;

    const transition = select(node.node().parentNode)
      .classed('transition');

    node.classed('transition', transition);
    node.style('width');
    node.classed('in', true);

    return node;
  }

  removeChildren() {
    let children = Array.from(this._node.node().childNodes);

    if (children.length === 0) {
      return;
    }

    children = selectAll(children)
      .classed('out', true)
      .on('transitionend.scola-generator', (datum, index, nodes) => {
        select(nodes[index]).on('.scola-generator', null);
        nodes[index].snippet.remove();
      });

    const duration = parseFloat(
      children.style('transition-duration')
    );

    if (duration === 0) {
      children.dispatch('transitionend');
    }
  }
}
