import { select } from 'd3';
import { Node } from '../node';

export class List extends Node {
  appendItems(box, data, item = null) {
    if (item === null) {
      return;
    }

    let node = null;

    for (let i = 0; i < data.length; i += 1) {
      node = item
        .clone()
        .resolve(box, data[i]);

      node = Array.isArray(node) ? node[0] : node;

      node.style('width');
      node.classed('in', true);
    }
  }

  removeInner() {
    this.removeItems();
    this.removeAfter();
  }

  removeItems() {
    const items = this._node
      .selectAll('.item')
      .classed('out', true)
      .on('transitionend.scola-list', (datum, index, nodes) => {
        select(nodes[index]).on('.scola-list', null);
        nodes[index].snippet.remove();
      });

    const duration = parseFloat(items.style('transition-duration'));

    if (duration === 0) {
      items.dispatch('transitionend');
    }
  }

  resolveInner(box, data) {
    const hasData = Array.isArray(data.data);
    const listData = data.data || [];

    const [
      item,
      empty
    ] = this._list;

    if (box.busy === true) {
      delete box.busy;
    }

    if (box.list) {
      this.resolveItems(box, listData);
    }

    this.appendItems(box, listData, item);

    const size = this._node
      .select('.item:not(.out)')
      .size();

    if (hasData === true && size === 0) {
      this.appendItems(box, [{}], empty);
    }

    return this.resolveAfter(box, data);
  }

  resolveItems(box, data) {
    if (box.list.clear) {
      delete box.list.clear;

      box.list.offset = 0;
      box.list.total = 0;

      this.removeItems();
    }

    if (box.list.offset === 0 && box.list.count > 0) {
      this._node.node().parentNode.scrollTop = 0;
    }

    box.list.total += data.length;
  }
}
