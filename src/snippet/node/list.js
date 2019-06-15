import Node from '../node';

export default class List extends Node {
  constructor(options) {
    super(options);
    this._items = [];
  }

  removeInner() {
    for (let i = 0; i < this._items.length; i += 1) {
      this._items[i].remove();
    }

    this._items = [];
    this.removeAfter();
  }

  resolveInner(box, data) {
    const [item] = this._list;

    const items = this._node
      .selectAll('.item');

    items
      .data(data.data || [], (datum) => JSON.stringify(datum))
      .enter()
      .append((datum) => {
        return this.append(box, datum, item);
      });

    if (box.scroll) {
      box.scroll.busy = false;
      box.scroll.total += data.data.length;
    }

    return this.resolveAfter(box, data);
  }

  append(box, datum, item) {
    const clone = item.clone();
    const node = clone.resolve(box, datum);

    this._items[this._items.length] = clone;

    return Array.isArray(node) ? node[0].node() : node.node();
  }
}
