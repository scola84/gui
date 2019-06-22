import { Node } from '../node';

export class List extends Node {
  constructor(options) {
    super(options);
    this._items = [];
  }

  appendItems(box, data, items, item) {
    return items
      .data(data, (datum) => JSON.stringify(datum))
      .enter()
      .append((datum) => {
        const clone = item.clone();

        let node = clone.resolve(box, datum);
        node = Array.isArray(node) ? node[0] : node;

        if (node === null) {
          return document.createDocumentFragment();
        }

        this._items[this._items.length] = clone;

        return node.node();
      });
  }

  removeInner() {
    for (let i = 0; i < this._items.length; i += 1) {
      this._items[i].remove();
    }

    this._items = [];
    this.removeAfter();
  }

  resolveInner(box, data) {
    const hasData = Array.isArray(data.data);
    const listData = data.data || [];

    const [
      item,
      empty
    ] = this._list;

    let items = this._node
      .selectAll('.item');

    if (box.busy === true) {
      delete box.busy;
    }

    if (box.list) {
      items = this.resolveItems(box, listData, items);
    }

    items = this.appendItems(box, listData, items, item);

    if (hasData === true && items.size() === 0) {
      this.appendItems(box, [{}], items, empty);
    }

    return this.resolveAfter(box, data);
  }

  resolveItems(box, data, items) {
    if (box.list.clear) {
      delete box.list.clear;

      box.list.offset = 0;
      box.list.total = 0;

      items.remove();
      items = this._node.selectAll('.item');
    }

    if (box.list.offset === 0 && box.list.count > 0) {
      this._node.node().parentNode.scrollTop = 0;
    }

    box.list.total += data.length;

    return items;
  }
}
